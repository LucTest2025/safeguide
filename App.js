import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; // Chemin vers votre store
import AppNavigator from './routes/AppNavigator'; // Chemin vers vos routes

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;