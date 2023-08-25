import {IonBackButton, IonHeader, IonItem, IonMenuButton, IonToolbar} from "@ionic/react";
import {ReactNode} from "react";

interface Props {
    children: ReactNode | ReactNode[]
    toolbarColor?: string,
    backButton?: boolean,
    menuButton?: boolean
}

export const MyToolbar = ({children, toolbarColor = 'primary', backButton = false, menuButton = true}: Props) => {
    return (
        <IonHeader>
            <IonToolbar color={toolbarColor}>
                {backButton && <IonItem slot={'start'} color={toolbarColor}>
                    <IonBackButton defaultHref={'/'}/>
                </IonItem>}
                {menuButton && <IonMenuButton slot={'start'}></IonMenuButton>}
                {children}
            </IonToolbar>
        </IonHeader>
    );
};