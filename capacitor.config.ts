import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.novel-reader.app',
    appName: 'novel reader',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        // url: 'https://6f78-154-182-71-237.ngrok-free.app'
    },
    android: {
        loggingBehavior: 'none'
    },
    ios: {
        loggingBehavior: 'none',
    }
};
export default config;
