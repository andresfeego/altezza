import './App.scss';
import { BrowserRouter, Routes , Switch} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import React, { Component, Text } from 'react';
import Evento from './Components/Evento';
import Invitacion from './Components/Invitacion/Invitacion';
import InvitacionJorgeYCata from './Components/Invitacion/InvitacionJorgeYCata';

function irAweb() {
  window.open("https://altezzaeventos.in/web", "_self")
}
export default class App extends Component {
  render() {

    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {irAweb}
          </Route>
        </Switch>
        <Route exact path="/evento" component={Evento} />
        <Route path="/evento/:id" component={Evento} />
        <Route path="/invitacion/:id/:idInvitado" component={Invitacion} />
        <Route path="/invitacionjorgeycata/:id/:idInvitado" component={InvitacionJorgeYCata} />
      </BrowserRouter>
    );
  }
}

