import {makeAutoObservable, runInAction} from "mobx";
import {Language, Translation} from "@capacitor-mlkit/translation";

export class LanguageStore {
    downloadedModels: Language[] | undefined
    private languagesNames: { key: string, value: string }[] | undefined

    constructor() {
        makeAutoObservable(this)
    }

    deleteDownloadedModel = async (language: Language) => {
        await Translation.deleteDownloadedModel({language});
        await this.setDownloadedModels()
    };

    downloadModel = async (language: Language) => {
        await Translation.downloadModel({language})
        await this.setDownloadedModels()
    };

    translate = async (text: string, sourceLanguage: Language, targetLanguage: Language) => {
        const {text: result} = await Translation.translate({
            text,
            sourceLanguage,
            targetLanguage,
        });
        return result;
    };

    getAllLanguages = () => {
        if (this.languagesNames)
            return this.languagesNames
        const keys = Object.keys(Language)
        const values = Object.values(Language)
        if (keys.length !== values.length)
            return []
        this.languagesNames = keys.map((value, index) => ({key: value, value: values[index]}))
        return this.languagesNames
    }

    setDownloadedModels = async () => {
        const {languages} = await Translation.getDownloadedModels();
        return runInAction(() => {
            this.downloadedModels = languages;
        })
    };

}