import {IonButton, IonContent, IonIcon, IonItem, IonItemGroup, IonPage, IonText, IonTitle} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {useEffect, useState} from "react";
import {trashOutline, trashSharp} from "ionicons/icons";
import {Bookmark} from "../../Models/Bookmark";

export const NovelsBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

    useEffect(() => {
        const oldBookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]')
        setBookmarks(oldBookmarks)
    }, []);

    const deleteBookmark = (bookmark: Bookmark) => () => {
        //This is reference equality.
        //I pass the ref of the bookmark to this func.(I hope)
        const newBookmarks = bookmarks.filter(b => b !== bookmark)
        setBookmarks(newBookmarks)
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
    }

    return <IonPage>
        <MyToolbar backButton>
            <IonTitle className={'ion-text-center'}>Novels Bookmarks</IonTitle>
        </MyToolbar>

        <IonContent className={'ion-padding'}>
            <IonItemGroup>
                {bookmarks.length == 0 && <IonItem>
                    <IonText className={'my-3'}>
                        <div className="text-center my-3 text-lg text-blue-900">
                            There are no bookmark to manage!!
                        </div>

                        <div className={'text-md'}>
                            Open a novel then open a volume, after that when you open a chapter a new bookmark will be
                            added automatically.(note that there just one bookmark per volume)
                        </div>
                    </IonText>
                </IonItem>}
                {bookmarks.map(b => <div key={b.novelFileName + b.novelName + b.volumeName + b.chapterName}
                                         className={'my-5 flex flex-col border rounded-xl p-4 text-end'}>
                    <div>الرواية: {b.novelName}</div>
                    <div>المجلد: {b.volumeName}</div>
                    <div>الفصل: {b.chapterName}</div>
                    <IonButton color={'danger'} className={'mt-8'} onClick={deleteBookmark(b)}>
                        <IonIcon ios={trashOutline} md={trashSharp}/>
                    </IonButton>
                </div>)}
            </IonItemGroup>
        </IonContent>
    </IonPage>
};