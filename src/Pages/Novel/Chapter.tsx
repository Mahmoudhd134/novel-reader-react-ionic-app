import {useEffect, useState} from "react";
import {IonItem, IonItemGroup, IonSelect, IonSelectOption, useIonLoading} from "@ionic/react";
import {useMobxStore} from "../../App/Stores/Store";
import {observer} from "mobx-react";
import {Language} from "@capacitor-mlkit/translation";
import {ChapterModel} from "../../Models/ChapterModel";

const Chapter = () => {
    const {novelStore: {chapter}, languageStore} = useMobxStore()
    const {getAllLanguages, setDownloadedModels, downloadedModels, translate} = languageStore

    const [fontSize, setFontSize] = useState(17);
    const [lineHeight, setLineHeight] = useState(35);
    const [whiteLines, setWhiteLines] = useState(1);
    const [translationOptions, setTranslationOptions] = useState<{ from: Language, to: Language } | undefined>();
    const [fromDir, setFromDir] = useState<'rtl' | 'ltr'>('rtl');
    const [toDir, setToDir] = useState<'rtl' | 'ltr'>('rtl');
    const [translatedChapter, setTranslatedChapter] = useState<ChapterModel>();
    const [displayMode, setDisplayMode] = useState<'LineByLine' | 'AllUnderAll'>('AllUnderAll');

    const [makeLoading, dismiss] = useIonLoading()

    useEffect(() => {
        if (!downloadedModels)
            (async () => await setDownloadedModels())()
    }, []);

    useEffect(() => {
        if (!translationOptions || !translationOptions.to || !translationOptions.from || !chapter)
            return
        (async () => await handleTranslateChapter())()
    }, [translationOptions?.from, translationOptions?.to, chapter]);

    const handleTranslateChapter = async () => {
        if (!translationOptions || !translationOptions.to || !translationOptions.from || !chapter)
            return

        await makeLoading({
            message: 'جارى الترجمة',
            spinner: 'lines-sharp'
        })
        const Body: string[] = []
        for (const c of chapter.Body) {
            Body.push(await translate(c, translationOptions.from, translationOptions.to))
        }
        setTranslatedChapter({
            Title: chapter.Title,
            Body
        })
        await dismiss()
    }

    if (!chapter)
        return <>
            <h3>There is no chapter!!!</h3>
            <p>This is error</p>
        </>

    return (
        <>
            <div className="text-center text-xl sm:text-lg border-b pb-1">
                <span>{chapter.Title}</span>
            </div>

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

                <IonItem>
                    <IonSelect
                        value={translationOptions?.from}
                        onIonChange={x => setTranslationOptions(p => ({...p!, from: x.detail.value as Language}))}
                        label="ترجمة من">
                        {downloadedModels?.map(l => {
                            const languageName = getAllLanguages()?.find(la => la.value === l)?.key
                            return <IonSelectOption
                                key={l}
                                value={l}>
                                {languageName}
                            </IonSelectOption>
                        })}
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonSelect
                        value={translationOptions?.to}
                        onIonChange={async x => setTranslationOptions(p => ({...p!, to: x.detail.value as Language}))}
                        label="ترجمة الى">
                        {downloadedModels?.map(l => {
                            const languageName = getAllLanguages()?.find(la => la.value === l)?.key
                            return <IonSelectOption
                                key={l}
                                value={l}>
                                {languageName}
                            </IonSelectOption>
                        })}
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonSelect
                        value={fromDir}
                        onIonChange={x => setFromDir(x.detail.value)}
                        label="اتجاه النص الاصلى">
                        <IonSelectOption value={'rtl'}>من اليمين الى اليسار</IonSelectOption>
                        <IonSelectOption value={'ltr'}>من اليسار الى اليمسن</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonSelect
                        value={toDir}
                        onIonChange={x => setToDir(x.detail.value)}
                        label="اتجاه النص المترجم">
                        <IonSelectOption value={'rtl'}>من اليمين الى اليسار</IonSelectOption>
                        <IonSelectOption value={'ltr'}>من اليسار الى اليمسن</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonSelect
                        value={displayMode}
                        onIonChange={x => setDisplayMode(x.detail.value)}
                        label="كيفية عرض الفصل المترجم">
                        <IonSelectOption value={'LineByLine'}>فقرة غير مترجمة تليها فقرة مترجمة</IonSelectOption>
                        <IonSelectOption value={'AllUnderAll'}>الفصل كامل غير مترجم يليه الفصل مترجم</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonItemGroup>

            {displayMode === 'AllUnderAll' ? <>
                <div style={{fontSize: fontSize + 'px', lineHeight: lineHeight + 'px', direction: fromDir}}>
                    {chapter.Body.map((c, i) => <span key={c + i}>
                        <p>
                        {(c.startsWith('http://') || c.startsWith('https://')) ? <img src={c} alt="image"/> : c}
                        </p>
                        {Array.from(Array(whiteLines).keys()).map(x => <br key={x}/>)}
                    </span>)}
                </div>

                {translationOptions && translationOptions.to && translationOptions.from &&
                    <div style={{fontSize: fontSize + 'px', lineHeight: lineHeight + 'px', direction: toDir}}>
                        {translatedChapter?.Body.map((c, i) => <span key={c + i}>
                        <p>
                        {(c.startsWith('http://') || c.startsWith('https://')) ?
                            <img src={c} alt="image"/> : c}
                        </p>
                            {Array.from(Array(whiteLines).keys()).map(x => <br key={x}/>)}
                    </span>)}
                    </div>}
            </> : displayMode === 'LineByLine' ?
                chapter.Body.map((notTranslated, i) => <div key={notTranslated + i}>
                    <div style={{fontSize: fontSize + 'px', lineHeight: lineHeight + 'px', direction: fromDir}}>
                        <p>
                            {(notTranslated.startsWith('http://') || notTranslated.startsWith('https://')) ?
                                <img src={notTranslated} alt="image"/> : notTranslated}
                        </p>
                    </div>

                    {translationOptions && translationOptions.to && translationOptions.from &&
                        <div style={{fontSize: fontSize + 'px', lineHeight: lineHeight + 'px', direction: toDir}}>
                            <p>
                                {(translatedChapter?.Body[i].startsWith('http://') || translatedChapter?.Body[i].startsWith('https://')) ?
                                    <img src={translatedChapter?.Body[i]}
                                         alt="image"/> : translatedChapter?.Body[i]}
                            </p>
                        </div>}
                    {Array.from(Array(whiteLines).keys()).map(x => <br key={x}/>)}
                </div>) : <div>No Mode Chosen</div>

            }

        </>
    );
};

export default observer(Chapter)
