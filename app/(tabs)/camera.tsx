import React, {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import {CameraView, Camera} from "expo-camera";
import axios from 'axios';

const enum permissionStates {
    PENDING,
    DENIED,
    GRANTED,
}

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(permissionStates.PENDING);
    const [scanned, setScanned] = useState(false);
    const debounceTimer = useRef(setTimeout(() => {
    }, 0));

    useEffect(() => {
        const getCameraPermissions = async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted" ? permissionStates.GRANTED : permissionStates.DENIED);
        };

        getCameraPermissions().then(r => (console.log("Got permissions")));
    }, []);

    const handleBarcodeScanned = ({type, data}: { type: string, data: string }) => {
        setScanned(true);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            axios.get(`https://world.openfoodfacts.org/product/${data}`).then((response) => {
                const html: string = response.data;
                const negScoreMatch = html.match(/<h3 class="panel_title_ evaluation_bad_title">Negative points: (.*?)<\/h3>/m);
                if (negScoreMatch == null || negScoreMatch.length !== 2) {
                    alert(`Product ingredients not found for ${data}`)
                    console.log(negScoreMatch);
                    return;
                }
                const negScore = parseInt(negScoreMatch[1].split('/')[0], 10) / parseInt(negScoreMatch[1].split('/')[1], 10);
                alert(`Food has a score of ${Math.round((1 - negScore) * 10000) / 100}%`);
            });
            axios.get(`https://barcodelookup.com/${data}`).then((response) => {
                const html: string = response.data;
                const ingredientsTag = html.match(/<!-- Ingredients -->[\s\S]*?<span class=\\??"product-text\\??">\s*(.*?)\.? ?\n/m);
                if (ingredientsTag == null || ingredientsTag.length !== 2) {
                    alert(`Product ingredients not found for ${data}`)
                    console.log(ingredientsTag);
                    return;
                }
                let ingredients = ingredientsTag[1].split(", ");
                for (let i = 0; i < ingredients.length; i++) {
                    if (ingredients[i].indexOf('(') !== -1) {
                        ingredients[i] = ingredients[i].split("(")[1];
                    }
                    if (ingredients[i].indexOf(')') !== -1) {
                        ingredients[i] = ingredients[i].split(")")[0];
                    }
                    ingredients[i] = ingredients[i].toLowerCase()
                }
                ingredients = ingredients.filter((ingredient, index) => {
                    return ingredients.indexOf(ingredient) === index;
                })
                alert(`Found ingredients: ${ingredients}`);
            })
        }, 100); // Adjust debounce time as needed
    };

    if (hasPermission === permissionStates.PENDING) {
        return <Text>Requesting camera permission</Text>;
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
                    barcodeTypes: ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'],
                }}
                autofocus={"on"}
                videoQuality={"2160p"}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)}/>
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
