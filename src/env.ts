import {Directory} from "@capacitor/filesystem";
import {home} from 'ionicons/icons'

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const ROOT_DIRECTORY = Directory.Documents
export const ROOT_PATH = development ? 'read-novel-development/' : 'read-novel/'
export const NOVEL_DIR_PATH = ROOT_PATH + 'novels/'

export const PATHS: Path[] = [
    {
        name: 'Home',
        url: '/home',
        icon: home
    },
    {
        name: 'Novels Dashboard',
        url: '/novels',
        icon: home
    },
    {
        name: 'Read Novels',
        url: '/novels/read',
        icon: home
    },
    {
        name: 'Manage Novels',
        url: '/novels/manage',
        icon: home
    },
    {
        name: 'Novel Bookmarks',
        url: '/novels/bookmarks',
        icon: home
    },
]

type Path = {
    url: string,
    name: string,
    icon: string

}