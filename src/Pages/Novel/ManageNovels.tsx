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
import {FileInfo, Filesystem} from "@capacitor/filesystem";
import {useEffect, useRef, useState} from "react";
import {NOVEL_DIR_PATH, ROOT_DIRECTORY} from "../../env";
import {addCircleOutline, addCircleSharp, saveOutline, saveSharp, trashOutline, trashSharp} from 'ionicons/icons'
import {Bookmark} from "../../Models/Bookmark";

export const ManageNovels = () => {
        const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

        const [novels, setNovels] = useState<FileInfo[]>([]);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [makeAlert] = useIonAlert()
        const [makeLoading, dismissLoading] = useIonLoading()

        const inputsRef = useRef<HTMLIonInputElement[]>([]);

        useEffect(() => {
            (async () => await setNovelsFromDirectory())()
            setBookmarks(JSON.parse(localStorage.getItem('bookmarks') ?? '[]'))
        }, []);

        useEffect(() => {
            inputsRef.current = inputsRef.current.slice(0, novels.length)
        }, [novels]);

        const setNovelsFromDirectory = async () => {
            await Filesystem.readdir({
                path: NOVEL_DIR_PATH,
                directory: ROOT_DIRECTORY
            })
                .then(r => setNovels(r.files.filter(f => f.name.endsWith('.json'))))
                .catch(async e => await makeAlert({
                    message: JSON.stringify(e, null, '\n'),
                    header: 'Error',
                    buttons: ['ok']
                }))
        }

        const handleFileUpload = async () => {
            const files = fileInputRef.current?.files
            if (!files)
                return

            files.length > 0 && await makeLoading({
                message: 'Uploading File...',
                spinner: 'lines'
            })

            //For upload files to track last file.(to update the state and others like close loading spinner and make alert)
            //It must be outside the func and in a scope that not destroy (ex. parent func).
            //I made a lexical scope with IIFC.
            //this is for the future version of my (__).
            const onLoad = (() => {
                let currentNumber = 0
                return (reader: FileReader, file: File) => async () => {
                    await Filesystem.writeFile(
                        {
                            path: NOVEL_DIR_PATH + file.name,
                            data: reader.result as string,
                            directory: ROOT_DIRECTORY,
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
                        .finally(async () => {
                            console.log(`file No. ${currentNumber + 1},its name '${file.name}'`)
                            if (currentNumber++ < files.length - 1)
                                return
                            console.log(`last file No. ${currentNumber},its name '${file.name}'`)

                            await dismissLoading()
                            await makeAlert({
                                message: 'تم رفع الملف بنجاح',
                                header: 'Success',
                                buttons: ['Ok']
                            })
                            await setNovelsFromDirectory()
                        })

                }
            })()
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i)
                if (!file)
                    return

                // console.log(await file.text())

                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = onLoad(reader, file)
            }
        }

        const deleteHandler = (file: FileInfo) => async () => {
            await makeAlert({
                message: `You are going to delete '${file.name.slice(0, -5)}'\nAre You Sure ?`,
                header: 'Confirm Deletion',
                buttons: [{
                    text: 'Delete',
                    handler: () => {
                        makeLoading({
                            message: `Deleting '${file.name}'`,
                            spinner: 'bubbles'
                        })
                        Filesystem.deleteFile({path: file.uri})
                            .then(() => setNovels(p => p?.filter(n => n.uri !== file.uri)))
                            .catch(async e => await makeAlert({
                                header: 'Error Deleting The File',
                                message: JSON.stringify(e ?? 'NO_ERROR'),
                                buttons: ['Return Back']
                            }))
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

            Filesystem.rename({
                from: file.uri,
                to: newPath
            })
                .then(r => {
                    const newBookmarks: Bookmark[] = bookmarks.map(b => b.novelFileName !== file.name ? b :
                        {
                            ...b,
                            novelFileName: newName
                        })
                    setBookmarks(newBookmarks)
                    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
                    makeAlert({
                        header: 'Success',
                        message: `name changed successfully from '${file.name}' to '${newName}'.`,
                        buttons: ['Ok']
                    })
                })
                .then(setNovelsFromDirectory)
                .catch(async e => await makeAlert({
                    header: 'Error Deleting The File',
                    message: JSON.stringify(e ?? 'NO_ERROR'),
                    buttons: ['Return Back']
                }))
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

export default ManageNovels