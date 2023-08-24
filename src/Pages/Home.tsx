import {IonButton, IonContent, IonPage, IonTitle} from "@ionic/react";
import {MyToolbar} from "../components/MyToolbar";

const Home = () => {
    return <IonPage>
        <MyToolbar>
            <IonTitle className={'ion-text-center'}>Home Page</IonTitle>
        </MyToolbar>


        <IonContent fullscreen className={'ion-padding'}>
            <div>This is home page</div>
            <IonButton routerLink={'/novels'}>Go To Novels Right Now!!!</IonButton>
        </IonContent>
    </IonPage>
};
export default Home