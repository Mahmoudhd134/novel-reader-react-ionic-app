import {IonContent, IonIcon, IonItem, IonItemGroup, IonPage, IonTitle, useIonAlert, useIonLoading} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {useMobxStore} from "../../App/Stores/Store";
import {observer} from "mobx-react";
import {downloadOutline, downloadSharp, trashOutline, trashSharp} from "ionicons/icons";
import {Language} from "@capacitor-mlkit/translation";
import {useEffect} from "react";

const AllLanguages = () => {
    const {languageStore} = useMobxStore()
    const {getAllLanguages, setDownloadedModels, downloadedModels, downloadModel, deleteDownloadedModel} = languageStore
    const [makeLoading, dismissLoading] = useIonLoading()
    const [makeAlert] = useIonAlert()

    useEffect(() => {
        if (!downloadedModels)
            (async () => setDownloadedModels())()
    }, []);
    const handleDownloadModel = (language: Language) => () => {
        makeLoading({
            message: `downloading language ${language} ...`,
            spinner: 'circles'
        })
            .then(r => downloadModel(language))
            .finally(dismissLoading)
            .finally(() => makeAlert({
                message: "Finish",
                buttons: ['Ok']
            }))
    }

    const handleDeleteModel = (language: Language) => async () => {
        makeLoading({
            message: `deleting language ${language} ...`,
            spinner: 'circular'
        })
            .then(r => deleteDownloadedModel(language))
            .finally(dismissLoading)
            .finally(() => makeAlert({
                message: "Finish",
                buttons: ['Ok']
            }))
    }

    return (
        <IonPage>
            <MyToolbar backButton menuButton={false}>
                <IonTitle>All Languages</IonTitle>
            </MyToolbar>

            <IonContent>
                <IonItemGroup>
                    {getAllLanguages().map(l => <IonItem key={l.value}>
                        {l.key}
                        {downloadedModels?.some(dl => dl == l.value) ?
                            <IonIcon
                                onClick={handleDeleteModel(l.value as Language)}
                                slot={'end'}
                                color={'danger'}
                                ios={trashOutline}
                                md={trashSharp}/> :

                            <IonIcon
                                onClick={handleDownloadModel(l.value as Language)}
                                slot={'end'}
                                color={'primary'}
                                ios={downloadOutline}
                                md={downloadSharp}/>}
                    </IonItem>)}
                </IonItemGroup>
            </IonContent>
        </IonPage>
    );
};

export default observer(AllLanguages)