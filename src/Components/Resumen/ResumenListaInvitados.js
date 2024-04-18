import React, { Component } from 'react';
import request from 'superagent';
import './ResumenListaInvitados.scss'
import VisibilityIcon from '@mui/icons-material/Visibility';

class ResumenListaInvitados extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mesas: -1,
            invitados: null,
            invitaciones: null,
            invitacionesEnviadas: -1,
            invitacionesNoEnviadas: null,
            invitacionesSinInvitados: -1,
            invitadosConfirmados: -1,
            invitadosPendientes: -1,
            invitadosNoAsist: -1,

            listaInvitaciones: []
        }
    }

    componentDidMount() {
        this.getMesas()
        this.getInvitaciones()
    }

    getMesas() {

        request
            .get('/responseAltezza/mesasXevento/' + this.props.idEvento)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        mesas: respuestaLogin.length,
                    })
                }
            });


    }


    getListaInvitados(idInvitacion) {

        return new Promise((resolve, reject) => {
            request
                .get('/responseAltezza/invitadosXinvitacion/' + idInvitacion)
                .set('accept', 'json')
                .end((err, res) => {
                    if (err) {
                        reject(err)
                    } else {

                        const respuestaLogin = JSON.parse(res.text);
                        resolve(respuestaLogin)
                    }
                });
        })


    }

    getInvitaciones() {

        request
            .get('/responseAltezza/invitacionesXevento/' + this.props.idEvento)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaInvitaciones: respuestaLogin,
                    }, async () => {
                        const info = {
                            invitados: 0,
                            invitaciones: 0,
                            invitacionesEnviadas: 0,
                            invitacionesNoEnviadas: 0,
                            invitadosConfirmados: 0,
                            invitadosPendientes: 0,
                            invitadosNoAsist: 0,
                        }
                        if (this.state.listaInvitaciones.length > 0) {
                            info.invitaciones = this.state.listaInvitaciones.length
                            var invSin = 0
                            var invitados = await Promise.all(
                                this.state.listaInvitaciones.map(async (invitacion) => {
                                    const listaInvitados = await this.getListaInvitados(invitacion.id)

                                    if (listaInvitados.length > 0) {
                                        info.invitados = info.invitados + listaInvitados.length
                                        var invEnv = 0

                                        var inv = await Promise.all(
                                            listaInvitados.map((invitado) => {
                                                switch (invitado.confirmado) {
                                                    case 0:
                                                        invEnv = invEnv + 1
                                                        break;
                                                    case 1:
                                                        info.invitadosConfirmados = info.invitadosConfirmados + 1
                                                        break;
                                                    case 3:
                                                        info.invitadosNoAsist = info.invitadosNoAsist + 1
                                                        break;
                                                    case 2:
                                                        info.invitadosPendientes = info.invitadosPendientes + 1
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            })
                                        )

                                        if (invEnv > 0) {
                                            info.invitacionesEnviadas = info.invitacionesEnviadas + 1
                                        }


                                    } else {
                                        invSin = invSin + 1
                                    }
                                })

                            )
                                console.log('invit: ' + info.invitaciones)
                            this.setState({
                                invitados: info.invitados,
                                invitaciones: info.invitaciones,
                                invitacionesEnviadas: info.invitacionesEnviadas,
                                invitacionesNoEnviadas: info.invitaciones - info.invitacionesEnviadas ,
                                invitacionesSinInvitados: invSin,
                                invitadosConfirmados: info.invitadosConfirmados,
                                invitadosPendientes: info.invitadosPendientes,
                                invitadosNoAsist: info.invitadosNoAsist,
                            })


                        }
                    }
                    )
                }
            });


    }

    render() {
        return (
            <div className="tarjetaEvento listaInvitados" onClick={() => this.props.parent.cambiarMenu(1)}>
                <div className="title">
                    <h5>Lista de invitados</h5>
                    <div className="icons">
                        <VisibilityIcon className="icon" onClick={() => this.props.parent.cambiarMenu(1)} />

                    </div>

                </div>

                {this.state.listaInvitaciones.length > 0 ?
                    <div className="info">
                        <span><strong>Mesas: </strong> {this.state.mesas != -1 ? <span>{this.state.mesas}</span> : <span>Cargando...</span>}</span>
                        <span><strong>Invitados: </strong> {this.state.invitados =! null ? <span>{this.state.invitados}</span> : <span>Cargando...</span>}</span>
                        <span><strong>Invitaciones: </strong> {this.state.invitaciones ? <span>{this.state.invitaciones}</span> : <span>Cargando...</span>}</span>
                        <span><strong>Invitaciones enviadas: </strong> {this.state.invitacionesEnviadas != -1 ? <span>{this.state.invitacionesEnviadas}</span> : <span>Cargando...</span>}</span>
                        <span><strong>invitaciones no Enviadas: </strong> {this.state.invitacionesNoEnviadas != null ? <span>{this.state.invitacionesNoEnviadas}</span> : <span>Cargando...</span>}</span>
                        <span><strong>invitaciones sin invitados: </strong> {this.state.invitacionesSinInvitados != -1 ? <span>{this.state.invitacionesSinInvitados}</span> : <span>Cargando...</span>}</span>
                        <span><strong>invitados confirmados: </strong> {this.state.invitadosConfirmados != -1 ? <span>{this.state.invitadosConfirmados}</span> : <span>Cargando...</span>}</span>
                        <span><strong>invitados quizá asistirán: </strong> {this.state.invitadosPendientes != -1 ? <span>{this.state.invitadosPendientes}</span> : <span>Cargando...</span>}</span>
                        <span><strong>invitados no asistirán: </strong> {this.state.invitadosNoAsist != -1 ? <span>{this.state.invitadosNoAsist}</span> : <span>Cargando...</span>}</span>

                    </div>
                    :
                    <span>sin información</span>

                }

            </div>
        );
    }
}

export default ResumenListaInvitados;
