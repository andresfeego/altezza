import React, { Component } from 'react';
import './MenuHeader.scss'
import MenuIcon from '@mui/icons-material/Menu';
import { nuevoMensaje, tiposAlertas } from '../inicialized/Toast';

class MenuHeader extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menuOpen: false
        }
    }
    render() {
        var menuOpen = '-100vw'
        if (this.state.menuOpen) {
            menuOpen = 0
        }
        return (
            <div className='containerMenuHeader'>

                {this.state.menuOpen ?
                    <span className='menuIcon' onClick={() => this.setState({ menuOpen: false })}>X</span>
                    :
                    <MenuIcon className='menuIcon' onClick={() => this.setState({ menuOpen: true })}/>
                }

                <div className='contentMenuHeader' style={{ right: menuOpen }}>
                    <div className="links">
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Calendario</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Datos Evento</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Paleta de colores</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Inspiración</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Pendientes</span>
                        <span className="linkMenuHeader" onClick={()=> this.props.parent.cambiarMenu(1)}>Lista de invitados</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Menú</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Timing</span>
                        <span className="linkMenuHeader" onClick={()=> {this.setState({ menuOpen: false });nuevoMensaje(tiposAlertas.info, 'En construcción')}}>Decoración</span>
                        <span className="linkMenuHeader linkMenuHeaderFin" onClick={()=> this.props.parent.cambiarMenu(1)}>Recordatorios Planner</span>
                    </div>
                </div>

            </div>
        );
    }
}

export default MenuHeader;
