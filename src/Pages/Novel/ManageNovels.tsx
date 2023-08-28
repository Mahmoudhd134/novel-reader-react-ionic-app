import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonPage,
    IonTitle,
    useIonAlert,
    useIonLoading
} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {Encoding, FileInfo, Filesystem} from "@capacitor/filesystem";
import {useEffect, useRef} from "react";
import {NOVEL_DIR_PATH, ROOT_DIRECTORY} from "../../env";
import {addCircleOutline, addCircleSharp, saveOutline, saveSharp, trashOutline, trashSharp} from 'ionicons/icons'
import {useMobxStore} from "../../App/Stores/Store";
import {observer} from "mobx-react";

const ManageNovels = () => {
        const {novelStore, bookmarkStore} = useMobxStore()
        const {novels, setNovelsFromDeviceStorage, deleteNovel} = novelStore
        const {
            changeNovelNameForBookmarks,
            deleteBookmarksForNovelFileName
        } = bookmarkStore

        const fileInputRef = useRef<HTMLInputElement>(null);
        const [makeAlert] = useIonAlert()
        const [makeLoading, dismissLoading] = useIonLoading()

        const inputsRef = useRef<HTMLIonInputElement[]>([]);

        useEffect(() => {
            inputsRef.current = inputsRef.current.slice(0, novels?.length)
        }, [novels]);

        const handleFileUpload = async () => {
            const files = fileInputRef.current?.files
            if (!files)
                return

            files.length > 0 && await makeLoading({
                message: 'Uploading File...',
                spinner: 'lines'
            }).then(async _ => {
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i)
                    if (!file)
                        return
                    const text = await file.text()
                    await Filesystem.writeFile(
                        {
                            path: NOVEL_DIR_PATH + file.name,
                            data: text,
                            directory: ROOT_DIRECTORY,
                            encoding: Encoding.UTF8,
                            recursive: true
                        })
                        .catch(async e => {
                            console.error(e)
                            await makeAlert({
                                header: 'Error',
                                message: JSON.stringify(e, null, '\n'),
                                buttons: ['Return Back']
                            })
                        })
                }
            })
                .finally(async () => {
                    await dismissLoading()
                    await makeLoading('updating...')
                        .then(async r => await setNovelsFromDeviceStorage())
                        .finally(dismissLoading)
                        .finally(async () =>
                            await makeAlert({
                                message: 'تم رفع الملف بنجاح',
                                header: 'Success',
                                buttons: ['Ok']
                            }))
                })
        }

        const deleteHandler = (file: FileInfo) => async () => {
            await makeAlert({
                message: `You are going to delete '${file.name.slice(0, -5)}'\nAre You Sure ?`,
                header: 'Confirm Deletion',
                buttons: [{
                    text: 'Delete',
                    handler: async () => {
                        makeLoading({
                            message: `Deleting '${file.name}'`,
                            spinner: 'bubbles'
                        }).then(r =>
                            deleteNovel(file)
                                .then(r => deleteBookmarksForNovelFileName(file.name))
                                .catch(async e => await makeAlert({
                                    header: 'Error Deleting The File',
                                    message: JSON.stringify(e ?? 'NO_ERROR'),
                                    buttons: ['Return Back']
                                })))
                            .finally(dismissLoading)
                    }
                }, 'Return Back']
            })
        }

        const changeHandler = (file: FileInfo, fileIndex: number) => () => {
            const newName = inputsRef.current[fileIndex].value + '.json'
            const newPath = file.uri.split('/').slice(0, -1).join('/') + '/' + newName

            makeLoading({
                message: 'Changing The Name...',
                spinner: 'dots'
            })
                .then(_ =>
                    Filesystem.rename({
                        from: file.uri,
                        to: newPath
                    })
                        .then(async r => {
                            changeNovelNameForBookmarks(file.name, newName)
                            await makeAlert({
                                header: 'Success',
                                message: `name changed successfully from '${file.name}' to '${newName}'.`,
                                buttons: ['Ok']
                            })
                        })
                        .then(setNovelsFromDeviceStorage)
                        .catch(async e => await makeAlert({
                            header: 'Error Deleting The File',
                            message: JSON.stringify(e ?? 'NO_ERROR'),
                            buttons: ['Return Back']
                        }))
                )
                .finally(dismissLoading)
        }

        return (
            <IonPage>
                <MyToolbar backButton>
                    <IonTitle className={'ion-text-center'}>Manage Novel Files</IonTitle>
                </MyToolbar>

                <IonContent className={'ion-padding'}>
                    <div className="ion-text-center">
                        <input
                            type="file"
                            className={'hidden'}
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            accept={'application/JSON'}
                            multiple
                        />
                        <IonButton onClick={_ => fileInputRef.current?.click()}>
                            Upload Json File <IonIcon ios={addCircleOutline} md={addCircleSharp} className={'ml-3'}/>
                        </IonButton>
                    </div>

                    <IonItemGroup className={'flex flex-wrap gap-3 justify-around mx-auto mt-8'}>
                        {novels?.map((n, i) => <IonItemGroup key={n.uri}
                                                             className={'border border-blue-900 rounded-xl w-full sm:w-5/12 md:w-4/12 lg:w-3/12'}>
                            <IonItem className={'rounded-t-xl'}>
                                <IonInput label={'name:'} value={n.name.slice(0, -5)}
                                          ref={el => inputsRef.current[i] = el!}/>
                                <IonLabel slot={'end'}>.json</IonLabel>
                            </IonItem>

                            <IonButtons className="flex justify-around">
                                <IonButton
                                    className={'cursor-pointer w-32 mr-2 text-blue-900'}
                                    onClick={changeHandler(n, i)}
                                >Save Name <IonIcon ios={saveOutline} md={saveSharp} className={'mx-1'}/>
                                </IonButton>
                                <IonButton
                                    className="ml-auto cursor-pointer text-red-900"
                                    onClick={deleteHandler(n)}
                                ><IonIcon ios={trashOutline} md={trashSharp}/>
                                </IonButton>
                            </IonButtons>
                        </IonItemGroup>)}
                    </IonItemGroup>
                </IonContent>
            </IonPage>
        );
    }
;

export default observer(ManageNovels)