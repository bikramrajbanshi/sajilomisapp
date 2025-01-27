import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const APIKit = axios.create({
    baseURL: 'https://livepromethy.sajilomis.com/',
    timeout: 10000,
});

APIKit.interceptors.request.use(
    async (config) => {
        // Check network connectivity
        const netInfoState = await NetInfo.fetch();
        if (!netInfoState.isConnected) {
            // Show alert and reject the request to stop the API call
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No Internet Connection'
            });
            return Promise.reject(new Error('No Internet Connection'));
        }

        // If connected, proceed with the request
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);


export const setClientToken = (token) => {
    APIKit.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const setClientId = (clientId) => {
    APIKit.defaults.headers.common['clientId'] = clientId;
}

export const loadToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    // console.log('token from APIKit', token);
    if (token) {
        setClientToken(token);
    }
}

export default APIKit;