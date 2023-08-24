import {ReactNode} from "react";
import {IonButton, IonContent, IonPage, IonTitle} from "@ionic/react";
import {MyToolbar} from "../../components/MyToolbar";

export const NovelDashBoard = () => {

    return (
        <IonPage>
            <MyToolbar backButton>
                <IonTitle className={'ion-text-center'}>Novel Section</IonTitle>
            </MyToolbar>

            <IonContent className={'ion-padding'}>
                <MyBoxLinkContainer>
                    <MyBoxLik
                        routerLink={'/novels/manage'}
                        text={'Manage Novels'}
                        bgImagePath={'images/edit.png'}/>

                    <MyBoxLik
                        routerLink={'/novels/read'}
                        text={'Read Novels'}
                        bgImagePath={'images/book.jpg'}/>

                    <MyBoxLik
                        routerLink={'/novels/bookmarks'}
                        text={'Novels Bookmarks'}
                        bgImagePath={'images/bookmark.png'}/>

                </MyBoxLinkContainer>
            </IonContent>
        </IonPage>
    )
};

const MyBoxLinkContainer = ({children}: { children: ReactNode | ReactNode[] }) =>
    <div className="flex flex-wrap ion-justify-content-around gap-3"> {children} </div>

const MyBoxLik = ({text, bgImagePath, routerLink}: { text: string, bgImagePath: string, routerLink: string }) => {
    return <div className={'w-5/6 sm:w-4/6 md:w-2/6 xl:w-1/6 h-44 relative'}>
        <IonButton color={'none'} className="absolute top-0 left-0 w-full h-full bg-contain"
                   style={{
                       backgroundImage: `url("${bgImagePath}")`,
                   }}
        ></IonButton>
        <IonButton
            routerLink={routerLink}
            className={'w-full h-full opacity-50 text-xl'}
        ><b className={'text-shadow-xl'}>{text}</b></IonButton>
    </div>
}
export default NovelDashBoard