import React, { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { CameraView, Camera } from "expo-camera";

const enum permissionStates {
    PENDING,
    DENIED,
    GRANTED,
}

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(permissionStates.PENDING);
    const [scanned, setScanned] = useState(false);
    const debounceTimer = useRef(setTimeout(() => {}, 0));

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted" ? permissionStates.GRANTED : permissionStates.DENIED);
        };

        getCameraPermissions().then(r => (console.log("Got permissions")));
    }, []);

    const handleBarcodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        }, 500); // Adjust debounce time as needed
    };

    if (hasPermission === permissionStates.PENDING) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === permissionStates.DENIED) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Camera screen</Text>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['aztec','ean13','ean8','qr','pdf417','upc_e','datamatrix','code39','code93','itf14','codabar','code128','upc_a'],
                }}
                autofocus={"on"}
                videoQuality={"2160p"}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
    camera: {
        flex: 1,
        width: 1000
    }
});
