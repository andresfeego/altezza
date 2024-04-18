import Completionist from "react-countdown";
import Countdown from "react-countdown";
import React, { Component } from 'react'
import './Invitacion.scss'
import { ReactSVG } from 'react-svg'
import svgRosa from "./src/icons/Rosa.svg";
import svgAro from "./src/icons/aro.svg";
import svgAnillos from "./src/icons/anillos.svg";
import svgFlorDos from "./src/icons/florDos.svg";
import SlideHeaderInvitacion from './SlideHeaderInvitacion';
import photos from './photos'
import ImageGallery from 'react-image-gallery';
import PropagateLoader from "react-spinners/PropagateLoader";
import Helmet from 'react-helmet'
import InvitacionFernandayCristian from "./InvitacionFernandayCristian";
import InvitacionJorgeYCata from "./InvitacionJorgeYCata";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import request from "superagent";
import { nuevoMensaje, tiposAlertas } from "../../inicialized/Toast";
import FondoActions from "../FondoActions";



const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


export default class Invitacion extends Component {

  constructor(props) {
    super(props)

    this.state = {
      evento: null,
    }
  }

  componentDidMount() {
    this.getInvitacion()
  }

  getInvitacion() {
    request
      .post('/responseAltezza/ideventoXinvitacion')
      .send({ idInvitacion: this.props.match.params.id }) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {

        if (err) {
          nuevoMensaje(tiposAlertas.cargadoError, "Error al cargar invitación, intenta de nuevo en unos minutos por favor: " + err);
        } else {
          const respuestaLogin = JSON.parse(res.text);
          this.setState({
            evento: respuestaLogin,
          })
        }


      });
  }

  
  rendercontent(){
    switch (this.state.evento.id) {
      case 'cyf34drfg':
        return <InvitacionFernandayCristian idInvitado={this.props.match.params.idInvitado} idInvitacion={this.props.match.params.id}/>
        break;

      case 'jyc1042023':
        console.log('okokok')
        return <InvitacionJorgeYCata idInvitado={this.props.match.params.idInvitado} idInvitacion={this.props.match.params.id}/>
        break;
        
        default:
          return console.log(this.state.evento.id)
          break;
    }
  }

  render() {


    return (
      <div className="contentContainer">
        <Helmet>
          <title>Altezza - eventos inolvidables</title>
        </Helmet>
        {this.state.evento ?
          this.rendercontent()
        :
          null
        }
      </div>
    )
  }
}
