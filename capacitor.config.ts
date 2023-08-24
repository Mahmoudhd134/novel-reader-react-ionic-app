import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.novel-reader.app',
    appName: 'novel reader',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        url: 'https://8ac7-154-182-95-29.ngrok-free.app'
    }
};
export default config;
