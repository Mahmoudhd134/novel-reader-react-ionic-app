import {useEffect, useMemo, useRef, useState} from "react";
import {Volume} from "./Volume";
import {
    IonButton,
    IonContent,
    IonItem,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    isPlatform,
    useIonAlert,
    useIonLoading, useIonViewWillEnter, useIonViewWillLeave
} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {Encoding, FileInfo, Filesystem} from "@capacitor/filesystem";
import {NOVEL_DIR_PATH, ROOT_DIRECTORY} from "../../env";
import {NovelModelWithVolumes} from "../../Models/NovelModelWithVolumes";
import {VolumeModel} from "../../Models/VolumeModel";
import {isNovelModelWithNoVolumes, NovelModelWithNoVolumes} from "../../Models/NovelModelWithNoVolumes";
import {ChapterModel} from "../../Models/ChapterModel";

export const Novel = () => {
    const CUSTOM_VOLUME_LIMIT = 100

    const [bookmarks, setBookmarks] = useState<string[][]>([[]])

    const [novels, setNovels] = useState<FileInfo[]>();
    const [selectedNovelInfo, setSelectedNovelInfo] = useState<FileInfo>();
    const [selectedNovelWithVolumes, setSelectedNovelWithVolumes] = useState<NovelModelWithVolumes>();
    const [volume, setVolume] = useState<VolumeModel>();
    const ionContentRef = useRef<HTMLIonContentElement>(null);

    const [makeLoading, dismissLoading] = useIonLoading()
    const [makeAlert] = useIonAlert()

    const volumesName = useMemo(() => selectedNovelWithVolumes?.Volumes?.map(v => v.Title),
        [selectedNovelWithVolumes?.Volumes])

    const [chapter, setChapter] = useState<ChapterModel>();
    const chaptersName = useMemo(() => volume?.Chapters.map(c => c.Title), [volume?.Chapters]);
    const chapterIndex = useMemo(() => volume?.Chapters.findIndex(c => c.Title === chapter?.Title)
        , [volume?.Chapters, chapter?.Title]);

    useIonViewWillEnter(() => {
        const oldBookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]')
        setBookmarks(oldBookmarks)
    })

    useEffect(() => {
        (async () => {
            setNovels(await getNovels())
        })()
        const oldBookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]')
        setBookmarks(oldBookmarks)
    }, []);


    useEffect(() => {
        if (!selectedNovelInfo)
            return

        setNovelByUri(selectedNovelInfo.uri)
    }, [selectedNovelInfo]);

    useEffect(() => {
        setVolume(undefined)
        setChapter(undefined)
    }, [selectedNovelWithVolumes]);

    useEffect(() => {
        setChapter(undefined)
    }, [volume]);

    useEffect(() => {
        if (!selectedNovelWithVolumes)
            return

        if (!volume)
            return

        if (!chapter)
            return

        const newBookmarks = [...bookmarks.filter(b => b[0] !== selectedNovelWithVolumes.Name ||
            b[1] !== volume.Title), [selectedNovelWithVolumes.Name, volume.Title, chapter.Title]]

        setBookmarks(newBookmarks)
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
    }, [chapter]);

    const getNovels = async () => {
        const {files} = await Filesystem.readdir({
            path: NOVEL_DIR_PATH.slice(0, -1),
            directory: ROOT_DIRECTORY
        })
        return files.filter(f => f.name.endsWith('.json'))
    }

    const setNovelByUri = (uri: string) => {
        if (!uri || uri.length == 0)
            return

        makeLoading({
            message: 'جارى التحميل...',
            spinner: 'bubbles'
        })
        Filesystem.readFile({
            path: uri,
            encoding: Encoding.UTF8
        })
            .then(r => {
                let novel = JSON.parse(isPlatform('desktop') ?
                    atob(r.data as string) :
                    r.data as string)

                if (isNovelModelWithNoVolumes(novel))
                    novel = convertNovelWithNoVolumesToNovelWithVolumes(novel)

                setSelectedNovelWithVolumes(novel)
                if (bookmarks?.some(b => b[0] === novel.Name))
                    makeAlert({
                        header: `Bookmark/s Found For Novel '${novel.Name}'`,
                        subHeader: 'Are You Want To Go To One Of Them ?',
                        message: bookmarks?.filter(b => b[0] === novel.Name)
                            .map(b => b[2] + '-'.repeat(50))
                            .flat().toString(),
                        buttons: ['Ok', 'Return Back']
                    })

            })
            .catch(e => makeAlert({
                header: 'Error',
                message: JSON.stringify(e, null, '\n'),
                buttons: ['Return Back']
            }))
            .finally(dismissLoading)


    }

    const setVolumeByName = (name: string) => setVolume(selectedNovelWithVolumes?.Volumes.find(x => x.Title == name))
    const convertNovelWithNoVolumesToNovelWithVolumes = (n: NovelModelWithNoVolumes) => {
        const novelWithVolumes: NovelModelWithVolumes = {
            Name: n.Name,
            Volumes: []
        }

        n.Chapters.forEach((c, i) => {
            if (i % CUSTOM_VOLUME_LIMIT == 0) {
                novelWithVolumes.Volumes.push({
                    Title: `From '${i + 1}' To '${(i + CUSTOM_VOLUME_LIMIT) <= n.Chapters.length ? i + CUSTOM_VOLUME_LIMIT : n.Chapters.length}'`,
                    Chapters: []
                })
            }
            novelWithVolumes.Volumes[novelWithVolumes.Volumes.length - 1].Chapters.push(c)
        })

        return novelWithVolumes
    }

    return (
        <IonPage>
            <MyToolbar backButton>
                <IonTitle className={'ion-text-center'}>Read Novel</IonTitle>
            </MyToolbar>

            <IonContent className={'ion-padding'} ref={ionContentRef}>
                <div className={'container mx-auto'} style={{direction: 'rtl'}}>
                    <IonItem>
                        <IonSelect
                            onIonChange={e => {
                                setBookmarks(p => p.filter(b => b.toString() !== e.detail.value))
                            }}
                            label="Remove Bookmarks"
                            placeholder="Bookmarks">
                            {bookmarks.map(b => <IonSelectOption
                                key={b.toString()}
                                value={b}>
                                {b.toString()}
                            </IonSelectOption>)}
                        </IonSelect>
                    </IonItem>

                    <div className={'flex justify-center mb-5'}>
                        <IonButton
                            routerLink={'/novels/bookmarks'}
                        >Manage Your Bookmarks</IonButton>
                    </div>

                    <IonItem>
                        <IonSelect
                            onIonChange={e => {
                                setSelectedNovelInfo(e.detail.value)
                                setSelectedNovelWithVolumes(undefined)
                                setVolume(undefined)
                            }}
                            label="اختر رواية"
                            placeholder="رواية">
                            {novels?.map(n => <IonSelectOption
                                key={n.name}
                                value={n}>
                                {n.name.slice(0, -5)}
                            </IonSelectOption>)}
                        </IonSelect>
                    </IonItem>

                    <div className="text-center text-2xl sm:text-xl">
                        <span>{selectedNovelWithVolumes?.Name}</span>
                    </div>

                    {selectedNovelWithVolumes && <>
                        <IonItem>
                            <IonSelect
                                onIonChange={e => setVolumeByName(e.detail.value)}
                                label="اختر مجلد"
                                placeholder="مجلد">
                                {volumesName?.map(v => <IonSelectOption
                                    key={v}
                                    value={v}>
                                    {v}
                                </IonSelectOption>)}
                            </IonSelect>
                        </IonItem>

                        {volume &&
                            <Volume key={volume.Title} {...{volume, chapter, setChapter, chapterIndex, chaptersName}}/>}
                    </>}

                    <IonButton onClick={_ => ionContentRef.current?.scrollToTop(1500)}>Up</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Novel