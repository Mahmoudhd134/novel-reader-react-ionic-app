import React, {useEffect, useRef} from "react";
import {Volume} from "./Volume";
import {
    IonButton,
    IonContent,
    IonItem,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    useIonAlert,
    useIonLoading
} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";
import {observer} from "mobx-react";
import {useMobxStore} from "../../App/Stores/Store";
import {FileInfo} from "@capacitor/filesystem";

const Novel = () => {
    const {novelStore, bookmarkStore} = useMobxStore()
    const {addNewBookmark, bookmarks} = bookmarkStore
    const {
        chapter,
        novels,
        selectedNovelInfo,
        selectedNovelWithVolumes,
        volume,
        volumesName,
        gotoBookmarkHandler,
        setVolumeByName,
        setSelectNovelInfo,
        unselectChapter,
    } = novelStore

    const ionContentRef = useRef<HTMLIonContentElement>(null);
    const [makeLoading, dismissLoading] = useIonLoading()
    const [makeAlert] = useIonAlert()

    useEffect(() => {
        if (!selectedNovelInfo)
            return

        if (!selectedNovelWithVolumes)
            return

        if (!volume)
            return

        if (!chapter)
            return

        addNewBookmark({
            novelFileName: selectedNovelInfo.name,
            novelName: selectedNovelWithVolumes.Name,
            volumeName: volume.Title,
            chapterName: chapter.Title
        })
    }, [chapter]);


    const setNovel = (novelInfo: FileInfo) => {
        makeLoading({
            message: 'جارى التحميل...',
            spinner: 'bubbles'
        })
            .then(r => setSelectNovelInfo(novelInfo))
            .catch(e => makeAlert({
                header: 'Error',
                message: JSON.stringify(e, null, '\n'),
                buttons: ['Return Back']
            }))
            .finally(dismissLoading)

    }


    return (
        <IonPage>
            <MyToolbar backButton>
                <IonTitle className={'ion-text-center'}>Read Novel</IonTitle>
            </MyToolbar>

            <IonContent className={'ion-padding'} ref={ionContentRef}>
                <div className={'container mx-auto'} style={{direction: 'rtl'}}>
                    <IonItem>
                        <IonSelect
                            onIonChange={e => gotoBookmarkHandler(e.detail.value)}
                            label="Goto Bookmark"
                            placeholder="Bookmarks">
                            {bookmarks?.map(b => <IonSelectOption
                                key={b.novelFileName + b.novelName + b.volumeName + b.chapterName}
                                value={b}
                                className={'my-5 flex flex-col border rounded-xl p-4 text-end'}>
                                <div>الرواية: {b.novelName} </div>
                                <div>المجلد: {b.volumeName} </div>
                                <div>الفصل: {b.chapterName} </div>
                            </IonSelectOption>)}
                        </IonSelect>
                    </IonItem>

                    <IonItem className={'mt-8'}>
                        <IonSelect
                            onIonChange={e => setNovel(e.detail.value)}
                            value={novels?.find(n => n.name === selectedNovelInfo?.name)}
                            label="اختر رواية"
                            placeholder="رواية">
                            {novels?.map(n => <IonSelectOption
                                key={n.name}
                                value={n}>
                                {n.name.slice(0, -5)}
                            </IonSelectOption>)}
                        </IonSelect>
                    </IonItem>

                    <div className="text-center text-2xl sm:text-xl">
                        <span>{selectedNovelWithVolumes?.Name}</span>
                    </div>

                    {selectedNovelWithVolumes && <>
                        <IonItem>
                            <IonSelect
                                onIonChange={e => {
                                    setVolumeByName(e.detail.value)
                                    unselectChapter()
                                }}
                                value={volume?.Title}
                                label="اختر مجلد"
                                placeholder="مجلد">
                                {volumesName?.map(v => <IonSelectOption
                                    key={v}
                                    value={v}>
                                    {v}
                                </IonSelectOption>)}
                            </IonSelect>
                        </IonItem>

                        {volume && <Volume key={volume.Title}/>}
                    </>}

                    <IonButton onClick={_ => ionContentRef.current?.scrollToTop(1500)}>Up</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};
export default observer(Novel)