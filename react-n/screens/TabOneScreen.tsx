import { Alert, Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Separator } from '../components/Separator';
import { TabsScreenProps } from '../types';

export default function TabOneScreen({ navigation }: TabsScreenProps<'TabOne'>) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Tab One</Text>
      <Separator />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
	  <Button title="Hi" onPress={() => Alert.prompt("asdSSS", "asd")}/>
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
