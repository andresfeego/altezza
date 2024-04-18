import React, { Component, Image, Text } from 'react'
import { connect } from 'react-redux'
import Login from './Login/Login'
import './Evento.scss'
import AdminEventos from './AdminEventos'
import AdminEvento from './AdminEvento'
import { Helmet } from 'react-helmet'

class Evento extends Component {


    renderViewAdmin(rol) {

        const idEvento = this.props.match.params.id
        console.log(rol)
        switch (rol) {
            case 1:
                if (this.props.match.params.id) {
                    return <AdminEvento idEvento={idEvento} />
                } else {
                    return <AdminEventos />
                }
                break;

            case 2:
            case 3:
                return <AdminEvento idEvento={idEvento} />
                break;

            default:
                break;
        }

    }
    render() {
        const usuario = this.props.usuario
        return (
            <div className='Admin-container-Evento-General'>
                <Helmet>
                    <title>Altezza - eventos inolvidables</title>
                </Helmet>
                {console.log(usuario)}
                {
                    usuario.length != 0 ?
                        this.renderViewAdmin(usuario.rol)
                        :
                        <div className='containerLogin'>
                            <div className="containerImg">
                                <img className="logoAltezza" loading="lazy" src={require("../images/logo_altezza_eventos_inolvidables.png")} alt="Altezza Eventos inolvidables Boyacá" />
                            </div>
                            <Login />
                        </div>

                }
            </div>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        usuario: state.usuario
    }
}




export default connect(mapStateToProps)(Evento);