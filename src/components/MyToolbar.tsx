import {IonBackButton, IonHeader, IonItem, IonMenuButton, IonProgressBar, IonToolbar} from "@ionic/react";
import {ReactNode} from "react";

interface Props {
    children: ReactNode | ReactNode[]
    toolbarColor?: string,
    backButton?: boolean,
    menuButton?: boolean,
    progressPercentage?: number
}

export const MyToolbar = (props: Props) => {
    const {
        children,
        toolbarColor = 'primary',
        backButton = false,
        menuButton = true,
        progressPercentage = undefined
    } = props

    return (
        <IonHeader>
            <IonToolbar color={toolbarColor} className={'relative'}>

                {progressPercentage != undefined && <IonProgressBar
                    value={progressPercentage} color={'danger'}></IonProgressBar>}

                {backButton && <IonItem slot={'start'} color={toolbarColor}>
                    <IonBackButton defaultHref={'/'}/>
                </IonItem>}

                {menuButton && <IonMenuButton slot={'start'}></IonMenuButton>}

                {children}
            </IonToolbar>
        </IonHeader>
    );
};