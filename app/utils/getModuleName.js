import AsyncStorage from "@react-native-async-storage/async-storage"


export const getModuleName = async () => {
    try {
        const value = await AsyncStorage.getItem('moduleName');
        if (value != null) {
            return  value;
        }
        return null;
    } catch (e) {
        console.error('Error retrieving module name:', e);
        return null;
    }
};