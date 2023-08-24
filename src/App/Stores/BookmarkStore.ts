import {makeAutoObservable} from "mobx";
import {Bookmark} from "../../Models/Bookmark";

export class BookmarkStore {
    private Bookmarks_LocalStorage_Key = 'bookmarks'

    bookmarks: Bookmark[] | undefined

    constructor() {
        makeAutoObservable(this)
    }


    setBookmarksFromLocalStorage = () => {
        this.bookmarks = JSON.parse(localStorage.getItem(this.Bookmarks_LocalStorage_Key) ?? '[]')
    }
    saveToLocalStorage = () => localStorage.setItem(this.Bookmarks_LocalStorage_Key, JSON.stringify(this.bookmarks))
    addNewBookmark = (bookmark: Bookmark) => {
        this.bookmarks = [
            ...this.bookmarks?.filter(b =>
                b.novelName !== bookmark.novelName || b.volumeName !== bookmark.volumeName) ?? [],
            bookmark
        ]
        this.saveToLocalStorage()
    }

    deleteBookmark = (bookmark: Bookmark) => {
        this.bookmarks = this.bookmarks?.filter(b => JSON.stringify(b) !== JSON.stringify(bookmark))
        this.saveToLocalStorage()
    }

    changeNovelNameForBookmarks = (oldName: string, newName: string) => {
        this.bookmarks = this.bookmarks?.map(b => b.novelFileName !== oldName ? b :
            {
                ...b,
                novelFileName: newName
            })
        this.saveToLocalStorage()
    }

    deleteBookmarksForNovelFileName = (name: string) => {
        this.bookmarks = this.bookmarks?.filter(b => b.novelFileName !== name)
        this.saveToLocalStorage()
    }
}