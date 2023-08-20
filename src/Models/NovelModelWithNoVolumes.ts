import {ChapterModel} from "./ChapterModel";

export interface NovelModelWithNoVolumes {
    Name: string,
    Chapters: ChapterModel[]
}

export const isNovelModelWithNoVolumes = (o: object) => {
    if (!('Name' in o))
        return false

    if (!('Chapters' in o))
        return false

    if ('Volumes' in o)
        return false

    return true
}
