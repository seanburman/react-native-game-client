import { SafeAreaView, StyleSheet } from 'react-native'; 
import { Provider } from 'react-redux';
import { store } from './src/redux/store'
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container} >
         {/* TODO: Navigation tabs */}
        </SafeAreaView>
      </NavigationContainer>
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
