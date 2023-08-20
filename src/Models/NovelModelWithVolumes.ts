import {VolumeModel} from "./VolumeModel";

export interface NovelModelWithVolumes {
    Name: string,
    Volumes: VolumeModel[]
}

export const isNovelModelWithVolumes = (o: object) => {
    if (!('Name' in o))
        return false

    if (!('Volumes' in o))
        return false

    if ('Chapters' in o)
        return false

    return true
}
