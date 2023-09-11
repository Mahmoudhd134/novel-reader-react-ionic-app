import {Directory} from "@capacitor/filesystem";

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const ROOT_DIRECTORY = Directory.Documents
export const ROOT_PATH = development ? 'read-novel-development/' : 'read-novel/'
export const NOVEL_DIR_PATH = ROOT_PATH + 'novels/'

export const PATHS: Path[] = [
    {
        name: 'Home',
        url: '/home',
    },
    {
        name: 'Novels Dashboard',
        url: '/novels',
    },
    {
        name: 'Translations Dashboard',
        url: '/translations',
    },
]

type Path = {
    url: string,
    name: string,

}