import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AdminEventos.scss'
class AdminEventos extends Component {
    render() {
        return (
            <div className="containerEventos">
                <div className="header">
                    <img className="logoAltezza" loading="lazy" src={require("../images/logo_altezza_eventos_inolvidables.png")} alt="Altezza Eventos inolvidables Boyacá" />
                    <div className="agregarEvento">
                        <span >+</span>
                    </div>
                </div>
                <div className="content">
                    <Link to="/evento/ooooo" className="evento" style={{ backgroundImage: 'https://cdn0.matrimonio.com.co/article-real-wedding/368/3_2/960/jpg/293774.jpeg' }}>
                        <h5>Boda Fernanda y Viviana</h5>
                        <span>16 Diciembre 2023</span>
                    </Link>

                    <div className="evento">
                        <h6>Evento1</h6>
                        <span>16 Diciembre 2023</span>
                    </div>

                    <div className="evento">
                        <h6>Evento1</h6>
                        <span>16 Diciembre 2023</span>
                    </div>

                    <div className="evento">
                        <h6>Evento1</h6>
                        <span>16 Diciembre 2023</span>
                    </div>

                    <div className="evento">
                        <h6>Evento1</h6>
                        <span>16 Diciembre 2023</span>
                    </div>

                    <div className="evento">
                        <h6>Evento1</h6>
                        <span>16 Diciembre 2023</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminEventos;
