import React, { Component } from 'react';
import FondoActions from '../../FondoActions';
import './AdminInvitados.scss'
import request from 'superagent';
import { tiposAlertas, nuevoMensaje } from '../../../inicialized/Toast'
import AdminMesas from './AdminMesas';
import AdminInvitaciones from './AdminInvitaciones';
import AdminInvitados from './AdminInvitados'

class AdminListaInvitados extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: 0
        }
    }

    setSelected(selected) {
        this.setState({
            selected
        })
    }

    renderContent() {
        switch (this.state.selected) {
            case 1:
                return <AdminMesas idEvento={this.props.idEvento} parent={this} open={true} />
                break;

            case 2:
                return <AdminInvitaciones idEvento={this.props.idEvento} parent={this} open={true} />
                break;

            case 3:
                return <AdminInvitados idEvento={this.props.idEvento} parent={this} open={true} />
                break;

            default: return (
                <div className="listaItems">
                    <span onClick={() => this.props.parent.cambiarMenu(0)} >{'< Volver a evento'}</span>
                    <AdminMesas idEvento={this.props.idEvento} parent={this} />
                    <AdminInvitaciones idEvento={this.props.idEvento} parent={this} />
                    {/* <AdminInvitados idEvento={this.props.idEvento} parent={this} /> */}

                </div>

            )
                break;
        }
    }
    render() {
        return (
            <div className='contentContainer'>
                {this.renderContent()}
            </div>
        );
    }
}

export default AdminListaInvitados;
