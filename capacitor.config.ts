import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.novel-reader.app',
    appName: 'novel reader',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        // url: 'https://db67-154-182-82-95.ngrok-free.app'
    }
};
export default config;
