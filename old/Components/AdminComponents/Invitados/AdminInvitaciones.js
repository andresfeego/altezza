import React, { Component } from 'react';
import FondoActions from '../../FondoActions';
import './AdminInvitados.scss'
import request from 'superagent';
import { tiposAlertas, nuevoMensaje } from '../../../inicialized/Toast'
import VisibilityIcon from '@mui/icons-material/Visibility';
import TarjetaInvitacion from './TarjetaInvitacion';
import AddIcon from '@mui/icons-material/Add';

class AdminInvitaciones extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: 0,
            listaInvitaciones: [],
            listaParentescos: null,
            listaGruposEdad: null,
        }
    }

    componentDidMount() {
        this.getListaParentescos()
        this.getListaGruposEdad()
        this.getInvitaciones()
    }

    getInvitaciones() {

        request
            .get(process.env.REACT_APP_API_URL + 'responseAltezza/invitacionesXevento/'+this.props.idEvento)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    var respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaInvitaciones: respuestaLogin,
                    })
                }
            });


    }

    
    getListaParentescos() {

        request
            .get(process.env.REACT_APP_API_URL + 'responseAltezza/parentescos')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);

                    this.setState({
                        listaParentescos: respuestaLogin,
                    })
                }
            });


    }

    getListaGruposEdad() {

        request
            .get(process.env.REACT_APP_API_URL + 'responseAltezza/gruposEdad')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaGruposEdad: respuestaLogin,
                    })
                }
            });


    }


    action(action) {
        this.setState({
            action
        })

    }

    addInvitacion() {
        nuevoMensaje(tiposAlertas.cargando, "Agregando invitación")
        request
            .post(process.env.REACT_APP_API_URL + 'responseAltezza/addInvitacion')
            .send({ idEvento: this.props.idEvento }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al agregar invitación, intenta guardar de nuevo en unos minutos por favor: " + err);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Invitación creada");
                    this.setState({
                        action: 0,
                    })
                    this.getInvitaciones();
                }


            });
    }

    


    renderAction() {
        switch (this.state.action) {
            case 1:
                return ([
                    <FondoActions />,
                    <div className="addMesa">
                        <span>{'Deseas agregar una nueva invitación '}</span>
                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cancelar</div>
                            <div className="botonTipoUno" onClick={() => this.addInvitacion()}>Agregar</div>
                        </div>
                    </div>
                ])

                break;

            default:
                break;
        }
    }

    renderContent() {
        const listaInvitaciones = this.state.listaInvitaciones
        switch (this.props.open) {
            case true:
                return (
                    <div className='contentContainer'>
                        <span onClick={() => this.props.parent.setSelected(0)}>{'< Volver a la lista'}</span>
                        <div className="addInvitacionIcon" onClick={() => this.addInvitacion()}>
                            <span>Nueva invitación</span>
                        <AddIcon className="icon"  />
                        </div>
                        <div className="listaItems">
                            {this.state.listaInvitaciones.length >0 ?
                                this.state.listaInvitaciones.map((item, index ) => <TarjetaInvitacion Plist = {this.state.listaParentescos} GElist={this.state.listaGruposEdad} key={'idInv'+index+1} parent={this} invitacion={item} index={index +1 }/>)
                            :
                                <span>Sin invitaciones aun</span>
                            }
                        </div>


                    </div>
                )
                break;

            default:
                return (
                    <div className='contentContainer'>
                        {this.renderAction()}
                        <div className="tarjetaEvento">
                            <div className="title">
                                <h5>Invitaciones</h5>
                                <div className="icons">
                                    <VisibilityIcon className="icon" onClick={() => this.props.parent.setSelected(2)} />
                                    <div className="icon" onClick={() => this.action(1)}>+</div>
                                </div>

                            </div>
                            <div className="info">
                                {listaInvitaciones.length > 0 ?
                                    <span>{"Invitaciones: " + listaInvitaciones.length}</span>
                                    :
                                    <span>{"Sin invitaciones creadas"}</span>
                                }
                            </div>
                        </div>
                    </div>
                )
                break;
        }
    }

    render() {
        return (
            this.renderContent()
        )
    }

}

export default AdminInvitaciones;
