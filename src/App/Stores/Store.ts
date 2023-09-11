import {createContext, useContext} from "react";
import {NovelStore} from "./NovelStore";
import {BookmarkStore} from "./BookmarkStore";
import {LanguageStore} from "./LanguageStore";


interface Store {
    novelStore: NovelStore,
    bookmarkStore: BookmarkStore,
    languageStore: LanguageStore
}

export const store: Store = {
    novelStore: new NovelStore(),
    bookmarkStore: new BookmarkStore(),
    languageStore: new LanguageStore()
}

export const storeContext = createContext<Store>(store)

export const useMobxStore = () => useContext(storeContext)