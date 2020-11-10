import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Register  from './Screens/Register';
import 'react-toastify/dist/ReactToastify.css';
import Activate from './Screens/Activate';
import Login from './Screens/Login';
import ForgotPassword from './Screens/ForgotPassword';
import ResetPassword from './Screens/ResetPassword';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Switch>
        <Route path='/' exact render={props => <App {...props} />} />
        <Route path='/register' exact render={props => <Register {...props} />} />
        <Route path='/login' exact render={props => <Login {...props} />} />
        <Route path='/users/password/forgot' exact render={props => <ForgotPassword {...props} />} />
        <Route path='/users/password/reset' exact render={props => <ResetPassword {...props} />} />
        <Route path='/users/activate/:token' exact render={props => <Activate {...props} />} />
    </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
