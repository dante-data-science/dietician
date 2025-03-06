import { Text, View, StyleSheet } from "react-native";
import { Image } from 'expo-image';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Dietitian</Text>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../../assets/images/react-logo.png')} />
      </View>
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
    text: {
        color: 'white',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
})
