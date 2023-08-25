import {IonContent, IonPage, IonTitle} from "@ionic/react";
import {MyToolbar} from "../components/MyToolbar";

const Home = () => {
    return <IonPage>
        <MyToolbar>
            <IonTitle className={'ion-text-center'}>Home Page</IonTitle>
        </MyToolbar>


        <IonContent fullscreen className={'ion-padding'}>
            <div className="flex flex-col justify-center items-center">
                <h1>This is home page</h1>
                <h3>
                    have fun!!
                </h3>
            </div>
        </IonContent>
    </IonPage>
};
export default Home