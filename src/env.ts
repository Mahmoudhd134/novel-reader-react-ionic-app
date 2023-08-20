import {Directory} from "@capacitor/filesystem";

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const ROOT_DIRECTORY = Directory.Documents
export const ROOT_PATH = development ? 'read-novel-development/' : 'read-novel/'
export const NOVEL_DIR_PATH = ROOT_PATH + 'novels/'
