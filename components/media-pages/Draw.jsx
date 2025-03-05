import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, Text, Keyboard, Image, Platform, Alert } from 'react-native';
import OnvoDrawingBoardView, { redoAction, toggleToolPickerVisibility, wipeSavedDrawing, isDrawingTooSimple, saveDrawing, undoAction, saveImageToPhotos } from 'onvo-drawing-board'; // Import the component
import createStyles from '../../utils/globalStyle';
import { getToken } from '../../utils/token';
import mediaController from '../../hooks/InboxMediaController';
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import TouchableButton from '../global/ButtonTap';

const BoardModal = ({ route, navigation }) => {
    const isSaved = useRef(false)
    
    useEffect(() => {
        Keyboard.dismiss()
    }, [])

    const saveImage = async () => {
        try {
            const base64String = await saveImageToPhotos();

            if (!base64String) {
                Alert.alert("Error", "Image data is empty.");
                return;
            }

            const fileUri = FileSystem.cacheDirectory + "saved_image.png";
            await FileSystem.writeAsStringAsync(fileUri, base64String, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Required", "Allow access to save images.");
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync("My App", asset, false);
            wipeSavedDrawing()
            Alert.alert("Success", "Image saved to gallery!");
        } catch (e) {
            console.log("Error saving image:", e);
            Alert.alert("Error", "Failed to save image.");
        }
    };

    const closeBoard = () => {
        if (isDrawingTooSimple() || isSaved.current == true) {
            navigation.goBack()
            wipeSavedDrawing()
        } else {
            Alert.alert('Wait!', 'You have unsaved work, want save it to device before close?', [
                {
                    text: 'Save to device',
                    onPress: () => {
                        saveImage()
                        isSaved.current = true
                    }
                },
                {
                    text: 'Keep as draft',
                    onPress: () => {
                        isSaved.current = true
                        navigation.goBack()
                    }
                },
                {
                    text: 'Close without saving',
                    onPress: () => {
                        navigation.goBack()
                        wipeSavedDrawing()
                    }
                }
            ])
        }
    }

    const saveDraw = async () => {
        try {
            if (isDrawingTooSimple()) {
                Alert.alert('Draw more', 'You cannot send empty draw')
                return
            }
            const url = 'https://cdn.onvo.me/api/ios/'
            const token = await getToken()
            const image = await saveDrawing(url, token)
            const json = JSON.parse(image)
            if (json?.status !== 'success') {
                Alert.alert(json.error || 'Error occured', json.message || 'Failed to upload image, but don\'t panic! You can still save it to your library', [
                    {
                        text: 'Save to device',
                        onPress: saveImage
                    },
                    {
                        text: 'Close without saving',
                        onPress: () => {
                            wipeSavedDrawing()
                        }
                    }
                ])
                return
            }
            mediaController.set({ data: json.url, type: 'draw' })
            Alert.alert('Done!', 'The image has been uploaded, want take a high quality copy in your gallary?', [
                {
                    text: 'Save to device',
                    onPress: () => {
                        saveImage()
                        navigation.goBack()
                        wipeSavedDrawing()
                    }
                },
                {
                    text: 'Close',
                    onPress: () => {
                        navigation.goBack()
                        wipeSavedDrawing()
                    }
                }
            ])
            wipeSavedDrawing()
        } catch (e) {
            console.log(e)
        }
    }

    const draftOpen = () => {
        Alert.alert('Coming soon', 'We are preparing drafts for you')
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableButton onPress={closeBoard} style={styles.button}>
                    <Image style={styles.icon} source={require('../../assets/icons/home/close remove-802-1662363936.png')} />
                </TouchableButton>
                <TouchableButton onPress={draftOpen} style={styles.button}>
                    <Image style={styles.icon} source={require('../../assets/icons/board/draft.png')} />
                </TouchableButton>
                <TouchableButton style={styles.button} onPress={undoAction}>
                    <Image style={styles.icon} source={require('../../assets/icons/board/undo.png')} />
                </TouchableButton>
                <TouchableButton style={styles.button} onPress={redoAction}>
                    <Image style={styles.icon} source={require('../../assets/icons/board/redo.png')} />
                </TouchableButton>
                <TouchableButton style={styles.button} onPress={toggleToolPickerVisibility}>
                    <Image style={styles.icon} source={require('../../assets/icons/board/penruller.png')} />
                </TouchableButton>
                <TouchableButton style={styles.button} onPress={saveDraw}>
                    <Image style={styles.icon} source={require('../../assets/icons/board/save.png')} />
                    <Text style={styles.lable}>SAVE</Text>
                </TouchableButton>
            </View>
            <OnvoDrawingBoardView
                style={{ flex: 1 }}
                qualityControl={0.75}
                onDismiss={() => console.log('Drawing view dismissed')}
            />
        </View>
    );
};

const styles = createStyles({
    icon: {
        width: 28,
        height: 28
    },
    lable: {
        fontSize: 14,
        marginLeft: 5,
        fontFamily: 'main'
    },
    button: {
        minWidth: 35,
        height: 35,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Platform.OS == 'android' ? 70 : 10,
        paddingHorizontal: 20,
        paddingBottom: 10

    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    canvas: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

export default BoardModal;
