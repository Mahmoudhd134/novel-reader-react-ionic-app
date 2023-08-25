import {
    IonButton,
    IonContent,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonPage,
    IonText,
    IonTitle,
    useIonRouter
} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {arrowRedoOutline, arrowRedoSharp, trashOutline, trashSharp} from "ionicons/icons";
import {useMobxStore} from "../../App/Stores/Store";
import {observer} from "mobx-react";

const NovelsBookmarks = () => {
    const navigator = useIonRouter()
    const {bookmarkStore, novelStore} = useMobxStore()
    const {bookmarks, deleteBookmark} = bookmarkStore
    const {gotoBookmarkHandler} = novelStore

    return <IonPage>
        <MyToolbar backButton>
            <IonTitle className={'ion-text-center'}>Novels Bookmarks</IonTitle>
        </MyToolbar>

        <IonContent className={'ion-padding'}>
            <IonItemGroup className={'flex flex-wrap gap-3 justify-around'}>
                {bookmarks?.length == 0 && <IonItem>
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
                {bookmarks?.map(b => <div key={b.novelFileName + b.novelName + b.volumeName + b.chapterName}
                                          className={'w-full sm:w-8/12 md:w-5/12 xl:w-4/12 flex flex-col border rounded-xl p-4 text-end'}>
                    <div>الرواية: {b.novelName}</div>
                    <div>المجلد: {b.volumeName}</div>
                    <div>الفصل: {b.chapterName}</div>
                    <div className="flex flex-wrap gap-3 mt-8 justify-around">
                        <IonButton color={'danger'} className={'w-full sm:w-8/12 md:w-5/12 lg:w-3/12'}
                                   onClick={e => deleteBookmark(b)}>
                            <IonIcon ios={trashOutline} md={trashSharp}/>
                        </IonButton>
                        <IonButton color={'primary'} className={'w-full sm:w-8/12 md:w-5/12 lg:w-3/12'}
                                   onClick={async e => {
                                       await gotoBookmarkHandler(b)
                                       navigator.push('/novels/read')
                                   }}>
                            <IonIcon ios={arrowRedoOutline} md={arrowRedoSharp}/>
                        </IonButton>
                    </div>
                </div>)}
            </IonItemGroup>
        </IonContent>
    </IonPage>
};
export default observer(NovelsBookmarks)