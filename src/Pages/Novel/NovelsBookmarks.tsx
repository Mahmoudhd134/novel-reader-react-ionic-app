import {IonButton, IonContent, IonIcon, IonItem, IonItemGroup, IonPage, IonText, IonTitle} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {useEffect, useState} from "react";
import {trashOutline, trashSharp} from "ionicons/icons";

export const NovelsBookmarks = () => {
    const [bookmarks, setBookmarks] = useState<string[][]>([[]])

    useEffect(() => {
        const oldBookmarks = JSON.parse(localStorage.getItem('bookmarks') ?? '[]')
        setBookmarks(oldBookmarks)
    }, []);

    const deleteBookmark = (bookmark: string[]) => () => {
        console.log('here')
        const newBookmarks = bookmarks.filter(b => b.toString() !== bookmark.toString())
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
                {bookmarks.map(b => <IonItem key={b.toString()}
                                             className={'my-5'}>
                    {b.toString()}
                    <IonButton color={'danger'} className={'mx-4'} onClick={deleteBookmark(b)}>
                        <IonIcon ios={trashOutline} md={trashSharp}/>
                    </IonButton>
                </IonItem>)}
            </IonItemGroup>
        </IonContent>
    </IonPage>
};