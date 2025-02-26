import React, { Component } from 'react';
import FondoActions from '../../FondoActions';
import './AdminInvitados.scss'
import request from 'superagent';
import { tiposAlertas, nuevoMensaje } from '../../../inicialized/Toast'
import VisibilityIcon from '@mui/icons-material/Visibility';

class AdminInvitados extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: 0,
            listaInvitados: []

        }
    }

    componentDidMount() {
        this.getInvitados()
    }

    getInvitados() {

        request
            .get(process.env.REACT_APP_API_URL + 'responseAltezza/invitadosXevento/1')
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaInvitados: respuestaLogin,
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
                    this.getInvitados();
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
        const listaInvitaciones = this.state.listaInvitados
        switch (this.props.open) {
            case true:
                return (
                    <div>
                        <span onClick={()=> this.props.parent.setSelected(0)}>{'< Volver a la lista'}</span>
                        <span>invitaciones abiertas</span>
                    </div>
                )
                break;

            default:
                return (
                    <div className='contentContainer'>
                        {this.renderAction()}
                        <div className="tarjetaEvento">
                            <div className="title">
                                <h5>Invitados</h5>
                            </div>
                            <div className="info">
                                {listaInvitaciones.length > 0 ?
                                    <span>{"Invitaciones: " + listaInvitaciones.length}</span>
                                    :
                                    <span>{"Sin invitados aún"}</span>
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

export default AdminInvitados;
