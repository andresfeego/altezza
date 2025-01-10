import React, { Component } from 'react';
import FondoActions from '../../FondoActions';
import './AdminInvitados.scss'
import request from 'superagent';
import { tiposAlertas, nuevoMensaje } from '../../../inicialized/Toast'
import VisibilityIcon from '@mui/icons-material/Visibility';

class AdminMesas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: 0,
            listaMesas: []

        }
    }

    componentDidMount() {
        this.getMesas()
    }

    getMesas() {

        request
            .get(process.env.REACT_APP_API_URL + 'responseAltezza/mesasXevento/'+this.props.idEvento)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        listaMesas: respuestaLogin,
                    })
                }
            });


    }


    action(action) {
        this.setState({
            action
        })

    }

    addMesa() {
        nuevoMensaje(tiposAlertas.cargando, "Agregando mesa")
        request
            .post(process.env.REACT_APP_API_URL + 'responseAltezza/addMesa')
            .send({ idEvento: this.props.idEvento, numMesa: this.state.listaMesas.length + 1 }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al agregar mesa, intenta guardar de nuevo en unos minutos por favor");
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Mesa creada");
                    this.setState({
                        action: 0,
                    })
                    this.getMesas();
                }


            });
    }

    renderAction() {
        switch (this.state.action) {
            case 1:
                return ([
                    <FondoActions />,
                    <div className="addMesa">
                        <span>{'Deseas agregar la mesa número ' + (this.state.listaMesas.length + 1) + ' ?'}</span>
                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cancelar</div>
                            <div className="botonTipoUno" onClick={() => this.addMesa()}>Agregar</div>
                        </div>
                    </div>
                ])

                break;

            default:
                break;
        }
    }

    renderContent() {
        const listaMesas = this.state.listaMesas
        switch (this.props.open) {
            case true:
                return (
                    <div>
                        <span onClick={()=> this.props.parent.setSelected(0)}>{'< Volver a la lista'}</span>
                        <span>Abrietas mesas</span>
                    </div>
                )
                break;

            default:
                return (
                    <div className='contentContainer'>
                        {this.renderAction()}
                        <div className="tarjetaEvento">
                            <div className="title">
                                <h5>Mesas</h5>
                                <div className="icons">
                                    <VisibilityIcon className="icon" onClick={() => nuevoMensaje(tiposAlertas.info, 'En construcción')} />
                                    <div className="icon" onClick={() => this.action(1)}>+</div>
                                </div>

                            </div>
                            <div className="info">
                                {listaMesas.length > 0 ?
                                    <span>{"Mesas: " + listaMesas.length}</span>
                                    :
                                    <span>{"Sin mesas creadas"}</span>
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

export default AdminMesas;
