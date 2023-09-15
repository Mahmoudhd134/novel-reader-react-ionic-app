import {createContext, useContext} from "react";
import {NovelStore} from "./NovelStore";
import {BookmarkStore} from "./BookmarkStore";


interface Store {
    novelStore: NovelStore,
    bookmarkStore: BookmarkStore,
}

export const store: Store = {
    novelStore: new NovelStore(),
    bookmarkStore: new BookmarkStore(),
}

export const storeContext = createContext<Store>(store)

export const useMobxStore = () => useContext(storeContext)