import {IonButton, IonContent, IonItem, IonItemGroup, IonPage, IonTitle} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {useMobxStore} from "../../App/Stores/Store";
import {observer} from "mobx-react";
import {useEffect} from "react";

const TranslationDashboard = () => {
    const {languageStore} = useMobxStore()
    const {downloadedModels, setDownloadedModels,getAllLanguages} = languageStore

    useEffect(() => {
        if (!downloadedModels)
            (async () => setDownloadedModels())()
    }, []);

    return <IonPage>
        <MyToolbar>
            <IonTitle>Translations</IonTitle>
        </MyToolbar>

        <IonContent>
            <div className="flex justify-center">
                <IonButton routerLink={'/translations/all'}>All Languages</IonButton>
            </div>
            <h3 className={'text-center text-2xl sm:text-xl'}>Current Downloaded Languages</h3>
            <IonItemGroup>
                {downloadedModels?.map(dm => <IonItem key={dm}>
                    {getAllLanguages()?.find(x => x.value === dm)?.key}
                </IonItem>)}
            </IonItemGroup>
        </IonContent>
    </IonPage>
};
export default observer(TranslationDashboard)