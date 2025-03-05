import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value); 
        await AsyncStorage.setItem(key, jsonValue);
        console.log(`Data saved successfully for key: ${key}`);
    } catch (e) {
        console.error(`Error saving data for key: ${key}`, e);
    }
};

export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null; 
    } catch (e) {
        console.error(`Error retrieving data for key: ${key}`, e);
    }
};

export const deleteData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`Data deleted successfully for key: ${key}`);
    } catch (e) {
        console.error(`Error deleting data for key: ${key}`, e);
    }
};

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        console.log('All data cleared successfully');
    } catch (e) {
        console.error('Error clearing all data', e);
    }
};