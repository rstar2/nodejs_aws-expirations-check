import { Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Text, View } from '../components/Themed';

export default function ModalUpdateItemScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
	screen: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
