import React from "react";
import Chapter from './Chapter'
import {IonButton, IonButtons, IonItem, IonSelect, IonSelectOption} from "@ionic/react";
import {useMobxStore} from "../../App/Stores/Store";
import {observer} from "mobx-react";


export const Volume = () => {
    const {novelStore} = useMobxStore()
    const {
        chapterIndex,
        volume,
        setChapterByName,
        chaptersName,
        chapter,
        hasNextChapter,
        hasPrevChapter,
        setChapterToPreviousOne,
        setChapterToNextOne
    } = novelStore

    if (!volume)
        return <>
            <h3>There is no volume!!</h3>
            <p>This Is Error !!!</p>
        </>


    const nextAndPrevButtons = chapterIndex != undefined && <IonButtons className="flex justify-between">
        <IonButton
            disabled={!hasNextChapter()}
            onClick={_ => setChapterToNextOne()}
        >Next</IonButton>

        <IonButton
            disabled={!hasPrevChapter()}
            onClick={_ => setChapterToPreviousOne()}
        >Prev</IonButton>
    </IonButtons>

    return (
        <>
            <div className="text-center text-2xl sm:text-xl">
                <span>{volume.Title}</span>
            </div>

            <IonItem>
                <IonSelect
                    onIonChange={e => setChapterByName(e.detail.value)}
                    value={chaptersName && chapterIndex != undefined && chaptersName[chapterIndex]}
                    label="اختر فصل"
                    placeholder="فصل">
                    {chaptersName?.map((c, i) => <IonSelectOption
                        key={c + i}
                        value={c}>
                        {c}
                    </IonSelectOption>)}
                </IonSelect>
            </IonItem>

            {chapter && <>
                {nextAndPrevButtons}
                <Chapter/>
                {nextAndPrevButtons}
            </>}
        </>
    );
};

export default observer(Volume)