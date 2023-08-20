import React, {SetStateAction} from "react";
import {ChapterModel} from "../../Models/ChapterModel";
import Chapter from './Chapter'
import {IonButton, IonButtons, IonItem, IonSelect, IonSelectOption} from "@ionic/react";
import {VolumeModel} from "../../Models/VolumeModel";

interface Props {
    volume: VolumeModel,
    chapter: ChapterModel | undefined,
    setChapter: React.Dispatch<SetStateAction<ChapterModel | undefined>>,
    chaptersName: string[] | undefined,
    chapterIndex: number | undefined
}

export const Volume = ({volume, chaptersName, chapter, setChapter, chapterIndex}: Props) => {
    const setChapterByName = (name: string) => setChapter(volume.Chapters.find(x => x.Title === name))

    const nextAndPrevButtons = chapterIndex != undefined && <IonButtons className="flex justify-between">
        <IonButton
            disabled={chapterIndex >= volume.Chapters.length - 1}
            onClick={_ => {
                setChapter(volume.Chapters[chapterIndex + 1])
            }}
        >Next</IonButton>

        <IonButton
            disabled={chapterIndex == 0}
            onClick={_ => {
                setChapter(volume.Chapters[chapterIndex - 1])
            }}
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
                <Chapter chapter={chapter}/>
                {nextAndPrevButtons}
            </>}
        </>
    );
};

export default Volume