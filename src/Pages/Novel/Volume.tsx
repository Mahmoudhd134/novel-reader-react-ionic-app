import React from "react";
import Chapter from './Chapter'
import {IonItem, IonSelect, IonSelectOption} from "@ionic/react";
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
    } = novelStore

    if (!volume)
        return <>
            <h3>There is no volume!!</h3>
            <p>This Is Error !!!</p>
        </>


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

            {chapter && <Chapter/>}
        </>
    );
};

export default observer(Volume)