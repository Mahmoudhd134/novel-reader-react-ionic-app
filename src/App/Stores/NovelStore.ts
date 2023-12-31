import {makeAutoObservable, runInAction} from 'mobx'
import {Bookmark} from "../../Models/Bookmark";
import {Encoding, FileInfo, Filesystem} from "@capacitor/filesystem";
import {NovelModelWithVolumes} from "../../Models/NovelModelWithVolumes";
import {VolumeModel} from "../../Models/VolumeModel";
import {ChapterModel} from "../../Models/ChapterModel";
import {NOVEL_DIR_PATH, ROOT_DIRECTORY} from "../../env";
import {isNovelModelWithNoVolumes, NovelModelWithNoVolumes} from "../../Models/NovelModelWithNoVolumes";

export class NovelStore {
    CUSTOM_VOLUME_LIMIT = 100

    novels: FileInfo[] | undefined
    selectedNovelInfo: FileInfo | undefined
    selectedNovelWithVolumes: NovelModelWithVolumes | undefined
    volumesName: string[] | undefined
    volume: VolumeModel | undefined
    chaptersName: string[] | undefined
    chapter: ChapterModel | undefined
    chapterIndex: number | undefined

    constructor() {
        makeAutoObservable(this)
    }

    private setVolume = (volume: VolumeModel | undefined) => {
        this.volume = volume
        if (!volume)
            return

        volume.Title = this.refactorNovelChangeSentence(volume.Title)
        volume.Chapters = volume.Chapters.map(c => ({
            ...c,
            Title: this.refactorNovelChangeSentence(c.Title)
        }))

        this.chaptersName = volume.Chapters.map(c => c.Title)
    }
    private setChapter = (chapter: ChapterModel | undefined) => {
        this.chapter = chapter
        if (!chapter)
            return

        chapter.Title = this.refactorNovelChangeSentence(chapter.Title)
        chapter.Body = chapter.Body.map(s => this.refactorNovelChangeSentence(s))
    }


    setNovelsFromDeviceStorage = async () => {
        const result = await this.getNovelsFromDeviceStorage()
        runInAction(() => {
            this.novels = result
        })
    }

    setSelectNovelInfo = async (fileInfo: FileInfo) => {
        this.selectedNovelInfo = fileInfo
        await this.setNovelUsingUri(fileInfo.uri)
        this.unselectVolume()
        this.unselectChapter()
    }

    unselectSelectedNovelInfo = () => {
        this.selectedNovelInfo = undefined
    }
    unselectSelectedNovelWithVolumes = () => {
        this.selectedNovelWithVolumes = undefined
    }
    unselectVolume = () => {
        this.volume = undefined
    }
    unselectChapter = () => {
        this.setChapter(undefined)
        this.chapterIndex = undefined
    }


    setNovelUsingUri = (uri: string) => {
        return Filesystem.readFile({
            path: uri,
            encoding: Encoding.UTF8
        })
            .then(r => {
                let novel = JSON.parse(r.data as string) as NovelModelWithVolumes

                if (isNovelModelWithNoVolumes(novel))
                    novel = this.convertNovelWithNoVolumesToNovelWithVolumes(novel as any)

                novel.Name = this.refactorNovelChangeSentence(novel.Name)
                novel.Volumes = novel.Volumes.map(v => ({
                    ...v,
                    Title: this.refactorNovelChangeSentence(v.Title)
                }))

                this.setSelectedNovelWithVolumes(novel)
            })
    }

    private setSelectedNovelWithVolumes = (novel: NovelModelWithVolumes) => {
        this.selectedNovelWithVolumes = novel
        this.volumesName = (this.selectedNovelWithVolumes)?.Volumes.map(v => v.Title)
    }


    setVolumeByName = (name: string) =>
        this.setVolume(this.selectedNovelWithVolumes?.Volumes.find(x => x.Title == name))

    setChapterByName = (name: string) => {
        // const index = this.volume?.Chapters.findIndex(x => x.Title === name)
        const index = this.chaptersName?.findIndex(x => x === name)
        if (index == undefined || index == -1)
            return

        this.chapterIndex = index
        this.setChapter(this.volume?.Chapters[index])
    }
    getNovelsFromDeviceStorage = async () => {
        const {files} = await Filesystem.readdir({
            path: NOVEL_DIR_PATH.slice(0, -1),
            directory: ROOT_DIRECTORY
        })
        return files.filter(f => f.name.endsWith('.json'))
    }


    setChapterToNextOne = () => {
        if (this.chapterIndex == undefined || !this.volume)
            return
        if (!this.hasNextChapter())
            return

        this.setChapter(this.volume.Chapters[++this.chapterIndex])
    }

    setChapterToPreviousOne = () => {
        if (this.chapterIndex == undefined || !this.volume)
            return
        if (!this.hasPrevChapter())
            return

        this.setChapter(this.volume.Chapters[--this.chapterIndex])
    }
    hasNextChapter = () => {
        if (this.chapterIndex == undefined || !this.volume)
            return false

        return this.chapterIndex < this.volume.Chapters.length - 1
    }
    hasPrevChapter = () => {
        if (this.chapterIndex == undefined || !this.volume)
            return false

        return this.chapterIndex > 0
    }
    gotoBookmarkHandler = async (bookmark: Bookmark) => {
        const novelInfo = this.novels?.find(n => n.name === bookmark.novelFileName)
        if (!novelInfo)
            return false

        if (novelInfo.name !== this.selectedNovelInfo?.name)
            await this.setSelectNovelInfo(novelInfo)


        const bookmarkVolume = this.selectedNovelWithVolumes?.Volumes.find(v => v.Title === bookmark.volumeName)
        if (!bookmarkVolume)
            return false

        return runInAction(() => {
            this.setVolume(bookmarkVolume)
            this.setChapterByName(bookmark.chapterName)
            return true
        })
    }

    uploadNovel = async (name: string, data: string) => {
        return await Filesystem.writeFile(
            {
                path: NOVEL_DIR_PATH + name,
                data,
                directory: ROOT_DIRECTORY,
                encoding: Encoding.UTF8,
                recursive: true
            })
    }
    deleteNovel = async (novelFile: FileInfo) => {
        await Filesystem.deleteFile({path: novelFile.uri})

        if (this.selectedNovelInfo?.uri === novelFile.uri) {
            runInAction(() => {
                this.selectedNovelInfo = undefined
                this.selectedNovelWithVolumes = undefined
                this.volumesName = undefined
                this.setVolume(undefined)
                this.chapterIndex = undefined
                this.chaptersName = undefined
                this.setChapter(undefined)
            })
        }

        runInAction(() => {
            this.setNovelsFromDeviceStorage()
        })
    }
    renameNovel = async (from: string, to: string) => await Filesystem.rename({from, to})

    private refactorNovelChangeSentence = (sentence: string) => {
        const changeMap = new Map<string, string>()

        changeMap.set('آلهتهم', 'طواغيتهم')

        const theMultiple = ['الالهه', 'الآلهه', 'الألهه', 'الإلهه']
        theMultiple.forEach(word => changeMap.set(word, 'الطواغيت'))

        const multiple = ['الهه', 'آلهه', 'ألهه', 'إلهه']
        multiple.forEach(word => changeMap.set(word, 'طواغيت'))

        // apply the multiple words and it's all derivations
        changeMap.forEach((value, key) => sentence = sentence.replaceAll(key, value))

        // changeMap.clear()

        const theSingle = ['الاله', 'الإله', 'الأله', 'الآله']
        theSingle.forEach(word => changeMap.set(word, 'الطاغوت'))

        const single = ['اله', 'إله', 'أله', 'آله']
        single.forEach(word => changeMap.set(word, 'طاغوت'))

        //apply the single words explicitly
        sentence = sentence.split(' ')
            .map(word => changeMap.has(word) ? changeMap.get(word) : word)
            .join(' ')
        return sentence
    }

    private convertNovelWithNoVolumesToNovelWithVolumes = (n: NovelModelWithNoVolumes) => {
        const novelWithVolumes: NovelModelWithVolumes = {
            Name: n.Name,
            Volumes: []
        }

        n.Chapters.forEach((c, i) => {
            if (i % this.CUSTOM_VOLUME_LIMIT == 0) {
                novelWithVolumes.Volumes.push({
                    Title: `From '${i + 1}' To '${(i + this.CUSTOM_VOLUME_LIMIT) <= n.Chapters.length ?
                        i + this.CUSTOM_VOLUME_LIMIT : n.Chapters.length}'`,
                    Chapters: []
                })
            }
            novelWithVolumes.Volumes[novelWithVolumes.Volumes.length - 1].Chapters.push(c)
        })

        return novelWithVolumes
    }
}