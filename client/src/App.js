import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import GlobalStyles from '@iso/assets/styles/globalStyle';
import {store, persistor} from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Routes from './router';
import AppProvider from './AppProvider';
import {GlobalModalProvider} from './components/GlobalModal/GlobalModalContext'
const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AppProvider>
                <GlobalModalProvider>
                  <ToastContainer
                      position={'bottom-right'}
                      autoClose={3000}
                      hideProgressBar={true}
                      pauseOnFocusLoss={false}/>
                  <GlobalStyles/>
                  <Routes/>
                </GlobalModalProvider>
            </AppProvider>
        </PersistGate>
    </Provider>
);

export default App;
