import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Separator } from '../components/Separator';

export default function TabTwoScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Tab Two</Text>
      <Separator />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
	screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
