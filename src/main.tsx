import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserHistory} from 'history'

import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-regular-svg-icons'
import '@fortawesome/free-solid-svg-icons'

import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import {IonApp, IonRouterOutlet, setupIonicReact} from '@ionic/react';
import {Route} from "react-router-dom";
import {IonReactRouter} from "@ionic/react-router";
import App from "./App";

setupIonicReact()

const history = createBrowserHistory()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
        <IonApp>
            <IonReactRouter {...{history}}>
                <IonRouterOutlet>
                    <Route path={'/*'} component={App}/>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    // </React.StrictMode>,
)
