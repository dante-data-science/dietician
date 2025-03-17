import {Text, View, StyleSheet} from "react-native";
import {Image} from 'expo-image';

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Dietitian</Text>
            <Image style={styles.image} source={require('../../assets/images/icon.png')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 30,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 18,
    },
})
