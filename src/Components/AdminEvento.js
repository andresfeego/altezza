import React, { Component } from 'react';
import AdminListaInvitados from './AdminComponents/Invitados/AdminListaInvitados';
import './AdminEvento.scss'
import MenuHeader from './MenuHeader';
import ResumenListaInvitados from './Resumen/ResumenListaInvitados';
import request from 'superagent';


class AdminEvento extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menu: 0,
            evento: []
        }
    }

    componentDidMount() {
        this.getEvento()
    }

    getEvento() {

        request
            .get('/responseAltezza/eventoXid/' + this.props.idEvento)
            .set('accept', 'json')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {

                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        evento: respuestaLogin[0],
                    })
                }
            });


    }


    cambiarMenu(menu) {

        this.setState({
            menu: menu
        })

    }




    renderContent() {
        switch (this.state.menu) {
            case 1:
                return <AdminListaInvitados idEvento={this.props.idEvento} parent={this} />
                break;

            default:
                return (
                    <div className="contentContainer">


                        {/* <div className="tarjetaEvento countDownAdmin">
                        </div>

                        <div className="tarjetaEvento  datosEvento">

                        </div>

                        <div className="tarjetaEvento paletaColores">
                            <div className="title">
                                <h5>Paleta de colores</h5>
                            </div>
                        </div> */}

                        <ResumenListaInvitados parent={this} idEvento={this.props.idEvento} />

                    </div>
                )
                break;
        }
    }

    render() {
        const color = '#000'
        return (
            <div className='containerAdminEvento'>
                <div className="header" style={{ backgroundColor: color }}>
                    <img className="logoAltezza" loading="lazy" src={require("../images/anillosdorado.png")} alt="Altezza Eventos inolvidables Boyacá" />
                    <h3 className="nombreEvento">{this.state.evento.nombre}</h3>
                    <div className="menuEvento">
                        {this.state.menu != 0 ?
                            null
                            :
                            <MenuHeader parent={this} />
                        }
                    </div>
                </div>

                {this.renderContent()}
            </div>
        );
    }
}

export default AdminEvento;
