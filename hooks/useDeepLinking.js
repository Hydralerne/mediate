import { useEffect } from 'react';
// import * as Linking from 'expo-linking';

export const useDeepLinking = () => {
    // useEffect(() => {
    //     const handleDeepLink = (event) => {
    //         const url = Linking.parse(event.url);
    //         console.log('Deep link URL:', url);
    //     };

    //     const initializeDeepLinking = async () => {
    //         try {
    //             const initialUrl = await Linking.getInitialURL();
    //             if (initialUrl) {
    //                 const parsedUrl = Linking.parse(initialUrl);
    //                 console.log('App opened with deep link:', parsedUrl);
    //             }
    //         } catch (error) {
    //             console.error('Error handling initial deep link:', error);
    //         }
    //     };

    //     Linking.addEventListener('url', handleDeepLink);
    //     initializeDeepLinking();

    //     return () => {
    //         if(Linking){
    //             Linking.removeEventListener('url', handleDeepLink);
    //         }
    //     };
    // }, []);
};
