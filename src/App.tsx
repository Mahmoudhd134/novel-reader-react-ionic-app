import {IonContent, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonTitle} from "@ionic/react";
import {Redirect, Route} from "react-router-dom";
import NovelDashBoard from "./Pages/Novel/NovelDashBoard";
import Home from "./Pages/Home";
import Novel from "./Pages/Novel/Novel";
import ManageNovels from "./Pages/Novel/ManageNovels";
import {useEffect} from "react";
import NovelsBookmarks from "./Pages/Novel/NovelsBookmarks";
import {useMobxStore} from "./App/Stores/Store";
import {MyToolbar} from "./components/MyToolbar";
import {PATHS} from "./env";
import {App as CapacitorApp, BackButtonListenerEvent} from '@capacitor/app'

function App() {
    const {
        novelStore: {novels, setNovelsFromDeviceStorage},
        bookmarkStore: {bookmarks, setBookmarksFromLocalStorage}
    } = useMobxStore()

    useEffect(() => {
        (async () => {
            if (!novels)
                await setNovelsFromDeviceStorage()
        })()
        if (!bookmarks)
            setBookmarksFromLocalStorage()
        const handleBackButtonPress = async ({canGoBack}: BackButtonListenerEvent) => {
            console.log('here')
            if (canGoBack)
                window.history.back()
            else {
                await CapacitorApp.removeAllListeners()
                await CapacitorApp.exitApp();
            }
        }

        CapacitorApp.addListener('backButton', handleBackButtonPress)
    }, []);

    return <IonPage>
        {/*<IonSplitPane contentId={'main'}>*/}
        <IonMenu contentId={'main'}>
            <MyToolbar>
                <IonTitle>Menu</IonTitle>
            </MyToolbar>

            <IonContent>
                {PATHS.map(p => <IonMenuToggle key={p.url}>
                    <IonItem routerLink={p.url} routerDirection={'forward'}>
                        {p.name}
                    </IonItem>
                </IonMenuToggle>)}
            </IonContent>
        </IonMenu>

        <IonRouterOutlet id={'main'}>
            <Route exact path={'/home'} component={Home}/>
            <Route exact path={'/novels'} component={NovelDashBoard}/>
            <Route exact path={'/novels/read'} component={Novel}/>
            <Route exact path={'/novels/manage'} component={ManageNovels}/>
            <Route exact path={'/novels/bookmarks'} component={NovelsBookmarks}/>

            <Route exact path={'/'}>
                <Redirect to={'/home'}/>
            </Route>
        </IonRouterOutlet>
        {/*</IonSplitPane>*/}
    </IonPage>
}


export default App
