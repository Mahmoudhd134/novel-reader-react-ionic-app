import {IonBackButton, IonButtons, IonHeader, IonToolbar} from "@ionic/react";
import {ReactNode} from "react";

interface Props {
    children: ReactNode | ReactNode[]
    toolbarColor?: string,
    backButton?: boolean
}

export const MyToolbar = ({children, toolbarColor = 'primary', backButton = false}: Props) => {
    return (
        <IonHeader>
            <IonToolbar color={toolbarColor}>
                {backButton && <IonButtons className={'absolute top-0 left-0 translate-y-1'}>
                    <IonBackButton defaultHref={'/'}/>
                </IonButtons>}
                {children}
            </IonToolbar>
        </IonHeader>
    );
};