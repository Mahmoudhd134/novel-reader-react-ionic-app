import {IonRouterLink, IonRouterOutlet, useIonAlert} from "@ionic/react";
import {Route} from "react-router-dom";
import NovelDashBoard from "./Pages/Novel/NovelDashBoard";
import {Home} from "./Pages/Home";
import {Novel} from "./Pages/Novel/Novel";
import {ManageNovels} from "./Pages/Novel/ManageNovels";
import {useEffect} from "react";
import {NovelsBookmarks} from "./Pages/Novel/NovelsBookmarks";

function App() {
    useEffect(() => {
        const goBack = (ev: any) => {
            ev.detail.register(10, (processNextHandler: any) => {
                console.log('Handler A was called!');

                processNextHandler();
            });
        }
        document.addEventListener('ionBackButton', goBack)

        return () => document.removeEventListener('ionBackButton', goBack)
    }, []);

    return <IonRouterOutlet>
        <Route exact path={'/'} component={Home}/>
        <Route exact path={'/novels'} component={NovelDashBoard}/>
        <Route exact path={'/novels/read'} component={Novel}/>
        <Route exact path={'/novels/manage'} component={ManageNovels}/>
        <Route exact path={'/novels/bookmarks'} component={NovelsBookmarks}/>

        <Route exact render={() => <h1>
            No Page!!!
            <div><IonRouterLink routerLink={'/'}>Home</IonRouterLink></div>
        </h1>}/>
    </IonRouterOutlet>
}


export default App