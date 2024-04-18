import Completionist from "react-countdown";
import Countdown from "react-countdown";
import React, { Component } from 'react'
import './InvitacionJorgeYCata.scss'
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
      loading: true,
      invitacion: null,
      listaInvitados: null,
      invitadoInvitacion: null
    }
  }

  componentDidMount() {
    this.getInvitacion()
  }

getInvitado(){
    const lista = this.state.listaInvitados
    if (lista.length > 0) {
      lista.map((inv) =>{
        if (inv.id == this.props.idInvitado) {
          this.setState({
            invitadoInvitacion: inv
          }) 
        }
      } )
    }

}

  getInvitacion() {
    request
      .post('/responseAltezza/eventoXinvitacion')
      .send({ idInvitacion: this.props.idInvitacion }) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {

        if (err) {
          nuevoMensaje(tiposAlertas.cargadoError, "Error al cargar invitación, intenta de nuevo en unos minutos por favor: " + err);
        } else {
          const respuestaLogin = JSON.parse(res.text);
          this.setState({
            loading: false,
            invitacion: respuestaLogin,
            listaInvitados: respuestaLogin.listaInvitados
          },()=> {
            this.getInvitado()
          })
        }


      });
  }

  async updateConfirmado() {
    nuevoMensaje(tiposAlertas.cargando, "Confirmando invitaciones");
    const result = await Promise.all(this.state.listaInvitados.map(async (invitado) => {
      return new Promise((resolve, reject) => {
        request
          .post('/responseAltezza/updConfirmado')
          .send({ idInvitado: invitado.id, confirmado: invitado.confirmado }) // sends a JSON post body
          .set('accept', 'json')
          .end((err, res) => {

            if (err) {
              nuevoMensaje(tiposAlertas.cargadoError, "Error al confirmar invitaciones, por favor intenta en unos minutos");
            } else {
              nuevoMensaje(tiposAlertas.cargadoSuccess, "Invitaciones confirmadas, recuerda que siempre podrás confirmar tu asistencia en esta página", 5000);
              resolve(res)
            }
          });
      })
    }))


  }

  rendererCountDown({ days, hours, minutes, seconds, completed }) {
    if (completed) {
      // Render a completed state
      return <span>Es hoy !</span>;
    } else {
      // Render a countdown
      return (
        <div className="content">
          <span><strong>{days}</strong>  Días :  <strong>{hours}</strong> Horas  :  <strong>{minutes}</strong> Minutos  :  <strong>{seconds}</strong>  Seg</span>
        </div>
      );
    }
  };

  renderLoading() {


    if (this.state.loading == true) {
      return ([
        <FondoActions />,
        <div className="cargando">

          <img src={require('../../images/logo_altezza_eventos_inolvidables.png')} alt="" />
          <span>Cargando invitación</span>
          <PropagateLoader
            color={"#EFD3C5"}
            loading={this.state.loading}
            cssOverride={override}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ])

    } else {

      const invitacion = this.state.invitacion
      const fecha = new Date(invitacion.fechaHoraCeremonia).toLocaleDateString('es-es', { weekday: "long", year: "numeric", month: "short", day: "numeric" })
      const horaCeremonia = new Date(invitacion.fechaHoraCeremonia).toLocaleString('es-es', { hour: 'numeric', minute: 'numeric', hour12: true })
      const horaCelebracion = new Date(invitacion.fechaHoraRecepcion).toLocaleString('es-es', { hour: 'numeric', minute: 'numeric', hour12: true })
      return (
        <div className="contentContainer">
          <div className="sectionInv header">
          <img src="https://www.feegosystem.com/srcAltezza/images/invitaciones/jyc1042023/Inicial.jpg" alt="" />
          </div>

          <div className="sectionInv bienvenida">
            {this.state.invitacion.mensaje ? 
            <h2 style={{ color: '#706e72' }}>{this.state.invitacion.mensaje}</h2>
            :
            <h2 style={{ color: '#EFD3C5' }}>{invitacion.listaInvitados[0].nombre}</h2>
            }
            <ReactSVG className='rose-logo' src={svgRosa} ></ReactSVG>
            <h2>Queremos invitarlos a nuestra boda </h2>
            <h2>{invitacion.nombre} </h2>

          </div>


          <div className="sectionInv frase">
            <span>"El amor todo lo vence, rindamonos también nosotros al amor" </span>
            <span>Virgilio</span>
          </div>


          <div className="sectionInv galeria">
            <ReactSVG className='rose-logo' src={svgFlorDos} ></ReactSVG>
            <br></br>
            <br></br>
            <ImageGallery items={photos} loading={'lazy'} />
          </div>

          <div className="sectionInv datosEvento">
            <h2>Datos del evento</h2>

            <div className="tarjeta">
              <h4>Ceremonia y recepción</h4>
              <img src="https://www.feegosystem.com/srcAltezza/images/fondoCeremonia.jpg" alt="" />
              <div className="info">
                <span><strong>Lugar: </strong> {invitacion.lugarCeremonia}</span>
                <span><strong>Hora: </strong> {horaCeremonia}</span>
                <span><strong>Fecha: </strong> {fecha}</span>

                <div className="ubicacion"><a target={"_blank"} href="https://goo.gl/maps/PLnFtsXM75fpKgPH6">Ver ubicación</a></div>
              </div>
            </div>

           

            {invitacion.colorReservadoUno || invitacion.colorReservadoDos ?
              <div className="sectionInv dressCode">

                <span>Nos reservamos el color:</span>
                <div className="colores">
                  {invitacion.colorReservadoUno ? <div className="colorRes" style={{ backgroundColor: invitacion.colorReservadoUno }} /> : null}
                  {invitacion.colorReservadoDos ? <div className="colorRes" style={{ backgroundColor: invitacion.colorReservadoDos }} /> : null}
                </div>
              </div>
              :
              null
            }

              <br/>
            <div className="sectionInv">
              <h3>Hashtag</h3>
              <span>Vas a postear fotos? hazlo con el siguiente hashtag. </span>
              <span className="hashtag">{invitacion.hashtag}</span>
            </div>

            <div className="sectionInv lluviaSobres">
            <h3>Lluvia de sobres</h3>
              <img src={require('./src/images/lluvia_de_sobres.png')} alt="" />
              <span className="hashtag">¡El mejor regalo siempre será poder compartir momentos como este con ustedes! </span>

            </div>

            <div className="sectionInv lluviaSobres">
              <h3>Vestimenta</h3>
              <img src={require('./src/images/dresscode.png')} alt="" />
              <span className="hashtag">Se recomienda vestir con estilo formal. </span>
              <span className="hashtag">Nos reservamos el color blanco y vinotinto</span>
              <div className="dresscodecontainer">
              <div className="dresscodeUno"></div>
              <div className="dresscodeDos"></div>
              </div>

            </div>

          </div>

          {new Date(invitacion.fechaHoraRecepcion) > new Date() ?
          <div className="sectionInv confirmacion">
          
          <h2>Confirma tu asistencia por favor antes de</h2>
          <div className="sectionInv countDown">
          <Countdown date={new Date(invitacion.fechaHoraRecepcion)} renderer={(props) => this.rendererCountDown(props)} />
          </div>

          <div className="formAsis">

            {this.state.listaInvitados.length > 0 ?
              this.state.listaInvitados.map((invitado, index) =>
                <FormControl className="confAsis">
                  <FormLabel id="demo-row-radio-buttons-group-label" className="nombreInvitado">{invitado.nombre}</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    className="radioGroupAsis"
                    value={invitado.confirmado}
                    onChange={(e) => { const lista = this.state.listaInvitados; lista[index].confirmado = e.target.value; this.setState({ listaInvitados: lista }) }}
                  >
                    <FormControlLabel className="FormControlLabel" value={1} control={<Radio />} label="Asistiré" />
                    <FormControlLabel className="FormControlLabel" value={3} control={<Radio />} label="No asistiré" />
                  </RadioGroup>
                </FormControl>
              )
              :
              null
            }
            <div className="confirmar" onClick={() => { this.updateConfirmado() }}>Confirmar</div>
          </div>
        </div>
        
        :
        <div className="sectionInv confirmacion">
          <div className="formAsis">
            <h2>"No se encuenta disponible confirmar por este medio, por favor comunícate con Jorge o Cata"</h2>
          </div>
        </div>
      }

          <div className="sectionInv teEsperamos">
            <ReactSVG className='svgAroTeEs' src={svgAro} />
            <div className="imgTeEs">
              <img src="https://www.feegosystem.com/srcAltezza/images/invitaciones/jyc1042023/Final.jpg" alt="" />
            </div>
            <span className="just">Te esperamos!</span>

          </div>


        </div>
      )
    }
  }

  render() {


    return (
      <div className="contentContainer">
        <Helmet>
          <title>Altezza - eventos inolvidables</title>
        </Helmet>
        {this.renderLoading()}
      </div>
    )
  }
}
