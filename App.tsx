import { SafeAreaView, StyleSheet} from 'react-native';
import Game from './src/views/game';
import { Provider } from 'react-redux';
import {store} from './src/redux/store'

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Game/>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
