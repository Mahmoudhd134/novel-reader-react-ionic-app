import React, {useEffect, useRef} from "react";
import {Volume} from "./Volume";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonItem,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    useIonAlert,
    useIonLoading
} from "@ionic/react";
import {arrowUpCircleOutline, arrowUpCircleSharp} from 'ionicons/icons'
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
        hasNextChapter,
        hasPrevChapter,
        setChapterToPreviousOne,
        setChapterToNextOne,
        chapterIndex,
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

    const nextAndPrevButtons = chapterIndex != undefined && <IonButtons className="flex justify-between">
        <IonButton
            disabled={!hasNextChapter()}
            onClick={_ => {
                setChapterToNextOne()
                ionContentRef.current?.scrollToTop(1500)
            }}
        >Next</IonButton>

        <IonButton
            disabled={!hasPrevChapter()}
            onClick={_ => {
                setChapterToPreviousOne()
                ionContentRef.current?.scrollToTop(1500)
            }}
        >Prev</IonButton>
    </IonButtons>

    return (
        <IonPage>
            <MyToolbar backButton menuButton={false}>
                <IonTitle className={'ion-text-center'}>Read Novel</IonTitle>
            </MyToolbar>

            <IonContent className={'ion-padding'} ref={ionContentRef}>
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

                    {nextAndPrevButtons}
                    {volume && <Volume key={volume.Title}/>}
                    {nextAndPrevButtons}
                </>}

                <div
                    className="rounded-full h-12 w-12 flex justify-center items-center fixed bottom-2 right-6 hover:-translate-y-2 transition-all hover:cursor-pointer"
                    style={{zIndex:123}}
                >
                    <IonIcon
                        className={'h-full w-full'}
                        onClick={_ => ionContentRef.current?.scrollToTop(1500)}
                        ios={arrowUpCircleOutline} md={arrowUpCircleSharp}/>
                </div>
            </IonContent>
        </IonPage>
    );
};
export default observer(Novel)