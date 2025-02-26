import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import localStore from './inicialized/localstore/localStore'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#A8CF45',
      main: '#dc9d8b',
      dark: '#A8CF45',
      contrastText: '#A8CF45',
    },
    secondary: {
      light: '#A8CF45',
      main: '#A8CF45',
      dark: '#A8CF45',
      contrastText: '#A8CF45',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={localStore}>
        <App />
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          transition={Flip}
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
          style={{display: 'block', width: '100svw'}}
           />

      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
