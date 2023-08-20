import {useState} from "react";
import {ChapterModel} from "../../Models/ChapterModel";
import {IonButton, IonButtons, IonItem, IonItemGroup, IonSelect, IonSelectOption} from "@ionic/react";

const Chapter = ({chapter}: { chapter: ChapterModel }) => {
    const [fontSize, setFontSize] = useState(17);
    const [lineHeight, setLineHeight] = useState(35);
    const [whiteLines, setWhiteLines] = useState(1);

    return (
        <>
            <IonItemGroup>
                <IonItem>
                    <IonSelect
                        value={fontSize}
                        onIonChange={e => setFontSize(+e.detail.value)}
                        label="اختر حجم الخط"
                        placeholder={fontSize ? fontSize.toString() : "الحجم"}>
                        {Array.from(Array(100).keys()).map((c, i) => <IonSelectOption
                            key={c + i}
                            value={c}>
                            {c}
                        </IonSelectOption>)}
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonSelect
                        value={lineHeight}
                        onIonChange={e => setLineHeight(+e.detail.value)}
                        label="اختر ارتفاع السطور عن بعضها"
                        placeholder={lineHeight ? lineHeight.toString() : "الارتفاع"}>
                        {Array.from(Array(100).keys()).map((c, i) => <IonSelectOption
                            key={c + i}
                            value={c}>
                            {c}
                        </IonSelectOption>)}
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonSelect
                        value={whiteLines}
                        onIonChange={e => setWhiteLines(+e.detail.value)}
                        label="اختر عدد المسافات الفارغة بين الفقرات"
                        placeholder={whiteLines ? whiteLines.toString() : "العدد"}>
                        {Array.from(Array(10).keys()).map((c, i) => <IonSelectOption
                            key={c + i}
                            value={c}>
                            {c}
                        </IonSelectOption>)}
                    </IonSelect>
                </IonItem>
            </IonItemGroup>

            <div className="text-center text-xl sm:text-lg my-3 border-b pb-1">
                <span>{chapter.Title}</span>
            </div>

            <div style={{fontSize: fontSize + 'px', lineHeight: lineHeight + 'px'}}>
                {chapter.Body.map((c, i) =>
                    <span key={c + i}>
                        <p>{c}</p>
                        {Array.from(Array(whiteLines).keys()).map(x => <br key={x}/>)}
                    </span>)}
            </div>
        </>
    );
};

export default Chapter
