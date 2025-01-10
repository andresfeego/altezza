import Completionist from "react-countdown";
import Countdown from "react-countdown";
import React, { Component } from 'react'
import './InvitacionFernandayCristian.scss'
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
      .post(process.env.REACT_APP_API_URL + 'responseAltezza/eventoXinvitacion')
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
          .post(process.env.REACT_APP_API_URL + 'responseAltezza/updConfirmado')
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
          <h3>Solo faltan </h3>
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
            <SlideHeaderInvitacion />
          </div>

          <div className="sectionInv bienvenida">
            {this.state.invitadoInvitacion ? 
            <h2 style={{ color: '#706e72' }}>{this.state.invitadoInvitacion.nombre}</h2>
            :
            <h2 style={{ color: '#EFD3C5' }}>{invitacion.listaInvitados[0].nombre}</h2>
            }
            <ReactSVG className='rose-logo' src={svgRosa} ></ReactSVG>
            <h2>Queremos celebrar contigo </h2>
            <h4>{fecha}</h4>

          </div>


          <div className="sectionInv frase">
            <span>Movidos por el amor que nos profesamos y con la bendición de nuestros padres, nos complace invitarte a celebrar el comienzo de nuestra vida juntos.</span>
          </div>

          <div className="sectionInv countDown">
            <Countdown date={new Date(invitacion.fechaHoraCeremonia)} renderer={(props) => this.rendererCountDown(props)} />
          </div>

          <div className="sectionInv historia">
            <div className="header">
              <ReactSVG className='rose-logo' src={svgAro} />
              <span>Nuestra historia</span>
            </div>
            <div className="content">

              <div className="separador" />
              <h4>Primera cita</h4>
              <span>Nuestra primera cita fue en Sogamoso luego de varias conversaciones por Facebook  me invitó a encontrarnos en el centro en una heladería</span>

              <div className="separador" />
              <h4>Primer beso</h4>
              <span>Nuestro primer beso, fue después de una cita en el cine , camino a casa de Fernanda</span>

              <div className="separador" />
              <h4>Primer "Te amo"</h4>
              <span>Cristian fue el primero en decir Te amo</span>

              <div className="separador" />
              <h4>Viviendo juntos</h4>
              <span>Es muy bonito tener un compañero de vida con quien disfrutar los mejores momentos, con quien enfrentar la pruebas tanto personales como de pareja,lo más satisfactorio creo que es llegar a casa juntos y saber que nos tenemos el uno al otro pase lo que pase</span>

              <div className="separador" />
              <h4>La propuesta</h4>
              <span>Mi Propuesta de matrimonio la hizo Camilo en Santa Rosa de Viterbo frente a una iglesia en un  Diciembre  la iglesia estaba con luces navideñas,fue muy bonito por que el sabe lo importante que es contar con Dios para todo en mi vida</span>

              <div className="separador" />
              <ReactSVG className='rose-logo' src={svgAnillos} ></ReactSVG>

            </div>

          </div>

          {/* <div className="sectionInv galeria">
            <h2>Nuestros momentos</h2>
            <ReactSVG className='rose-logo' src={svgFlorDos} ></ReactSVG>
            <span>galeria de fotos</span>
            <br></br>
            <br></br>
            <ImageGallery items={photos} loading={'lazy'} />
          </div> */}

          <div className="sectionInv datosEvento">
            <h2>Datos del evento</h2>

            <div className="tarjeta">
              <h4>Ceremonia</h4>
              <img src="https://www.feegosystem.com/srcAltezza/images/fondoCeremonia.jpg" alt="" />
              <div className="info">
                <span><strong>Lugar: </strong> {invitacion.lugarCeremonia}</span>
                <span><strong>Hora: </strong> {horaCeremonia}</span>
                <div className="ubicacion"><a target={"_blank"} href="https://goo.gl/maps/PLnFtsXM75fpKgPH6">Ver ubicación</a></div>
              </div>
            </div>

            <div className="tarjeta">
              <h4>Recepción</h4>
              <img src="https://www.feegosystem.com/srcAltezza/images/fondoCelebracion001.jpg" alt="" />
              <div className="info">
                <span><strong>Lugar: </strong> {invitacion.LugarRecepcion}</span>
                <span><strong>Hora: </strong> {horaCelebracion}</span>
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

            <div className="sectionInv">

              <span>Vas a postear fotos? hazlo con el siguiente hashtag. </span>
              <span className="hashtag">{invitacion.hashtag}</span>
            </div>

            <div className="sectionInv lluviaSobres">
              <span>Lluvia de sobres</span>
              <img src={require('./src/images/lluvia_de_sobres.png')} alt="" />
            </div>

          </div>

          <div className="sectionInv confirmacion">
            <h2>Confirma tu asistencia por favor.</h2>
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
                      <FormControlLabel className="FormControlLabel" value={2} control={<Radio />} label="Quizá" />
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

          <div className="sectionInv teEsperamos">
            <ReactSVG className='svgAroTeEs' src={svgAro} />
            <div className="imgTeEs">
              <img src="http://www.feegosystem.com/srcAltezza/images/resized_1920x1080/058.jpg" alt="" />
            </div>
            <span className="just">Just Married !</span>

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
