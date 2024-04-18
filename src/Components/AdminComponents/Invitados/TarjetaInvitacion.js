import React, { Component } from 'react';
import request from 'superagent';
import './TarjetaInvitacion.scss'
import FondoActions from '../../FondoActions';

import { tiposAlertas, nuevoMensaje } from '../../../inicialized/Toast'

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CheckIcon from '@mui/icons-material/Check';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArticleIcon from '@mui/icons-material/Article';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

class TarjetaInvitacion extends Component {

    constructor(props) {
        super(props)

        this.state = {
            action: 0,
            listaInvitados: [],
            listaParentescos: this.props.Plist,
            listaGruposEdad: this.props.GElist,
            data: '',
            mensaje: this.props.invitacion.mensaje,

            nombre: '',
            principal: 0,
            telefono: '',
            wp: 1,
            parentesco: 0,
            grupoEdad: 1,
            evento: null,


        }
    }

    componentDidMount() {
       
        this.getEvento()
        this.getListaInvitados()
    }

    getEvento() {
        request
            .post('/responseAltezza/eventoXinvitacion')
            .send({ idInvitacion: this.props.invitacion.id }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al cargar invitación, intenta de nuevo en unos minutos por favor: " + err);
                } else {
                    const respuestaLogin = JSON.parse(res.text);
                    this.setState({
                        evento: respuestaLogin,
                    })
                }


            });
    }

    action(action, data) {
        this.setState({
            action,
            data
        })

    }


    getListaInvitados() {

        request
            .get('/responseAltezza/invitadosXinvitacion/' + this.props.invitacion.id)
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



    addInvitado() {
        nuevoMensaje(tiposAlertas.cargando, "Agregando invitado ")
        request
            .post('/responseAltezza/addInvitado')
            .send({ idInvitacion: this.props.invitacion.id, nombre: this.state.nombre, principal: this.state.principal, telefono: this.state.telefono, wp: this.state.wp, parentesco: this.state.parentesco, grupoEdad: this.state.grupoEdad })
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al agregar invitado, intenta guardar de nuevo en unos minutos por favor: " + err);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Invitado creado");
                    this.setState({
                        action: 0,

                        nombre: '',
                        principal: 0,
                        telefono: '',
                        wp: 1,
                        parentesco: 0,
                        grupoEdad: 0,


                    })
                    this.getListaInvitados();
                }


            });
    }


    delInvitacion() {
        nuevoMensaje(tiposAlertas.cargando, "Eliminando invitación")
        request
            .post('/responseAltezza/delInvitacion')
            .send({ idInvitacion: this.state.data }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al elminar invitación, intenta guardar de nuevo en unos minutos por favor: " + err);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Invitación eliminada");
                    this.setState({
                        action: 0,
                    })
                    this.getListaInvitados();
                    this.props.parent.getInvitaciones();
                }


            });
    }

    updateConfirmado(idInvitado, estado) {
        request
            .post('/responseAltezza/updConfirmado')
            .send({ idInvitado: idInvitado, confirmado: estado }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                } else {
                    this.getListaInvitados();;
                }


            });
    }

    updateMensaje() {
        nuevoMensaje(tiposAlertas.cargando, "Actualizando mensaje")
        request
            .post('/responseAltezza/updMensajeInvitacion')
            .send({ idInvitacion: this.props.invitacion.id, mensaje: this.state.mensaje }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al actualizar mensaje, intenta guardar de nuevo en unos minutos por favor: " + err);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Mensaje actualizado");
                    this.setState({
                        action: 0,
                    })
                    this.getListaInvitados();
                }


            });
    }

    delInvitado(idInvitado) {
        nuevoMensaje(tiposAlertas.cargando, "Eliminando invitado")
        request
            .post('/responseAltezza/delInvitado')
            .send({ idInvitacion: this.props.invitacion.id, idInvitado: idInvitado }) // sends a JSON post body
            .set('accept', 'json')
            .end((err, res) => {

                if (err) {
                    nuevoMensaje(tiposAlertas.cargadoError, "Error al elminar invitado, intenta guardar de nuevo en unos minutos por favor: " + err);
                } else {
                    nuevoMensaje(tiposAlertas.cargadoSuccess, "Invitado eliminada");
                    this.setState({
                        action: 0,
                    })
                    this.getListaInvitados();
                }


            });


    }

    renderAction() {
        switch (this.state.action) {
            case 1:
                return ([
                    <FondoActions />,
                    <div className="addUsuario">
                        <h3>{'Agregando invitado'}</h3>
                        <div className="formulario">

                            <TextField id="outlined-basic" label="Nombres y apellidos" value={this.state.nombre} variant="outlined" onChange={(e) => this.setState({ nombre: e.target.value })} />

                            <FormControl className="confAsis">
                                <FormLabel id="demo-row-radio-buttons-group-label" className="">Invitado principal de la invitación ?</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    className="radioGroupAsis"
                                    onChange={(e) => this.setState({ principal: e.target.value })}
                                    value={this.state.principal}
                                >
                                    <FormControlLabel className="FormControlLabel" value={1} control={<Radio />} label="Si" />
                                    <FormControlLabel className="FormControlLabel" value={0} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                            <TextField id="outlined-basic" label="Telefono" value={this.state.telefono} variant="outlined" onChange={(e) => this.setState({ telefono: e.target.value })} />
                            <FormControl className="confAsis">
                                <FormLabel id="demo-row-radio-buttons-group-label" className="">Tiene Whatsapp ?</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    className="radioGroupAsis"
                                    onChange={(e) => this.setState({ wp: e.target.value })}
                                    value={this.state.wp}
                                >
                                    <FormControlLabel className="FormControlLabel" value={1} control={<Radio />} label="Si" />
                                    <FormControlLabel className="FormControlLabel" value={0} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Parentesco</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.parentesco}
                                    label="Parentesco"
                                    onChange={(e) => this.setState({ parentesco: e.target.value })}
                                >

                                    {this.state.listaParentescos.length > 0 ?
                                        this.state.listaParentescos.map((item) =>
                                            <MenuItem key={'idsel-'+item.id} value={item.id} >{item.parentesco}</MenuItem>
                                        )
                                        :
                                        <span>Cargando parentescos..</span>
                                    }
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Grupo de edad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.grupoEdad}
                                    label="Grupo de edad"
                                    onChange={(e) => this.setState({ grupoEdad: e.target.value })}
                                >

                                    {this.state.listaGruposEdad.length > 0 ?
                                        this.state.listaGruposEdad.map((item) =>
                                            <MenuItem  key={'idselD-'+item.id} value={item.id} >{item.grupo}</MenuItem>
                                        )
                                        :
                                        <span>Cargando grupos de edad..</span>
                                    }
                                </Select>
                            </FormControl>


                        </div>


                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cancelar</div>
                            <div className="botonTipoUno" onClick={() => this.addInvitado()}>Agregar</div>
                        </div>
                    </div>
                ])

                break;

            case 3:
                return ([
                    <FondoActions />,
                    <div className="addMesa">
                        <span>{'Deseas eliminar este invitado ?'}</span>
                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cancelar</div>
                            <div className="botonTipoUno" onClick={() => this.delInvitado(this.state.data)}>Eliminar</div>
                        </div>
                    </div>
                ])

                break;

            case 2:
                return ([
                    <FondoActions />,
                    <div className="addMesa">
                        <span>{'Deseas Eliminar esta invitación ?'}</span>
                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cancelar</div>
                            <div className="botonTipoUno" onClick={() => this.delInvitacion(this.state.data)}>Eliminar</div>
                        </div>
                    </div>
                ])

                break;

            case 4:
                const invitado = this.state.data
                return ([
                    <FondoActions />,
                    <div className="infoUsuario">
                        <h3>{'Información invitado'}</h3>
                        <div className="formulario">
                            <span><strong>Nombre: </strong><span>{invitado.nombre}</span></span>
                            <span><strong>Invitado Principal: </strong>{invitado.principal == 1 ? <span>Si</span> : <span>No</span>}</span>
                            {invitado.telefono != '' ?
                                [
                                    <span><strong>Telefono:</strong><span>{invitado.telefono}</span></span>,
                                    <span><strong>Tiene Whatsapp: </strong>{invitado.wp == 1 ? <span>Si</span> : <span>No</span>}</span>
                                ]
                                : null
                            }
                            <span><strong>Confirmado: </strong><span>{this.renderConfirmado(invitado.confirmado)}</span></span>
                            
                            {this.state.listaParentescos  ? <span><strong>Parentesco: </strong><span>{this.state.listaParentescos[invitado.parentesco].parentesco}</span></span> : <span><strong>Parentesco: </strong><span> Cargando..  </span></span>}
                            {this.state.listaGruposEdad  ? <span><strong>Grupo de edad: </strong><span>{this.state.listaGruposEdad[invitado.grupoEdad].grupo}</span></span>: <span><strong>Grupo de edad: </strong><span> Cargando..  </span></span>}
                        </div>


                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cerrar</div>
                        </div>
                    </div>
                ])

                break;

            case 5:
                return ([
                    <FondoActions />,
                    <div className="addUsuario">
                        <h3>{'Mensaje'}</h3>
                        <div className="formulario">

                            <TextField
                                id="outlined-multiline-flexible"
                                label="Mensaje para esta invitación:"
                                multiline
                                maxRows={8}
                                value={this.state.mensaje}
                                onChange={(e) => this.setState({ mensaje: e.target.value })}

                            />


                        </div>


                        <div className="botonera">
                            <div className="botonTipoUno" onClick={() => this.action(0)}>Cancelar</div>
                            <div className="botonTipoUno" onClick={() => this.updateMensaje()}>Guardar</div>
                        </div>
                    </div>
                ])

                break;

            default:
                break;
        }
    }

    renderConfirmado(confirmado) {

        switch (confirmado) {
            case 0:
                return <MarkEmailReadIcon style={{ color: "#b388eb" }} />
                break;

            case 1:
                return <CheckIcon style={{ color: "#8ac926" }} />
                break;

            case 2:
                return <PsychologyAltIcon style={{ color: "#ffca3a" }} />
                break;

            case 3:
                return <CloseIcon style={{ color: "#ff8fa3" }} />
                break;

            default:
                return <QuestionMarkIcon style={{ color: "#1982c4" }} />
                break;
        }

    }

    renderLinkWp(invitado,fecha,hora) {
        var telefono = invitado.telefono
        if (telefono[0] == '+') {
            return <a target={'_blank'} href={`https://wa.me/` + invitado.telefono + `?text=NOS CASAMOS ! 💐💐💐%0AHola ` + invitado.nombre + `, queremos celebrar contigo este momento inolvidable. %0AEstas invitado a nuestra boda este ` + fecha + ` a las ` + hora + `, para nosotros es muy importante contar contigo. %0APodrás confirmar tu asistencia en el siguiente link:%0A https://www.altezzaeventos.in/invitacion/` + this.props.invitacion.id + `/` + invitado.id + `%0ATe esperamos. `}><MarkEmailReadIcon onClick={() => { this.updateConfirmado(invitado.id, 0); this.getListaInvitados(); }} className="iconView" /></a>
        } else {
            return <a target={'_blank'} href={`https://wa.me/+57` + invitado.telefono + `?text=NOS CASAMOS ! 💐💐💐%0AHola ` + invitado.nombre + `, queremos celebrar contigo este momento inolvidable. %0AEstas invitado a nuestra boda este ` + fecha + ` a las ` + hora + `, para nosotros es muy importante contar contigo. %0APodrás confirmar tu asistencia en el siguiente link:%0A https://www.altezzaeventos.in/invitacion/` + this.props.invitacion.id + `/` + invitado.id + `%0ATe esperamos. `}><MarkEmailReadIcon onClick={() => { this.updateConfirmado(invitado.id, 0); this.getListaInvitados(); }} className="iconView" /></a>
        }
    }


    renderInvitados() {
        var fecha = ''
        var hora = ''
        if (this.state.evento) {
            const evento = this.state.evento
            fecha = new Date(evento.fechaHoraCeremonia).toLocaleDateString('es-es', { weekday: "long", year: "numeric", month: "short", day: "numeric" })
            hora = new Date(evento.fechaHoraCeremonia).toLocaleString('es-es', { hour: 'numeric', minute: 'numeric', hour12: true })
        }



        return (
            this.state.listaInvitados.map((invitado) =>

                <div className='invitado' key={'id:' + invitado.id}>
                    <div className="principal" >

                        {invitado.principal == 1 ?
                            <StarBorderIcon className="icon" sx={{ fontSize: 15 }} onClick={() => this.props.parent.setSelected(1)} />
                            :
                            <div className='icon' />
                        }
                    </div>

                    <span className='nombre'>{invitado.nombre}</span>
                    {invitado.telefono != '0' ?
                        this.renderLinkWp(invitado,fecha,hora)
                        :
                        null
                    }

                    <ContentCopyIcon className="iconView" onClick={() => { navigator.clipboard.writeText("NOS CASAMOS ! 💐💐💐\nHola " + invitado.nombre + ", queremos celebrar contigo este momento inolvidable. \nEstas invitado a nuestra boda este " + fecha + " a las " + hora + ", para nosotros es muy importante contar contigo. \nPodrás confirmar tu asistencia en el siguiente link:\n https://www.altezzaeventos.in/invitacion/" + this.props.invitacion.id + "/" + invitado.id + "\nTe esperamos. "); nuevoMensaje(tiposAlertas.success, 'Se ha copiado la invitación al porta papeles') }} />
                    <VisibilityIcon className="iconView" onClick={() => { this.action(4, invitado) }} />
                    <DeleteOutline className="iconDelete" onClick={() => { this.action(3, invitado.id) }} />
                    <div className="iconConfim" >

                        {
                            this.renderConfirmado(invitado.confirmado)
                        }
                    </div>

                </div>
            )
        )
    }

    render() {
        const { invitacion, index, key } = this.props
        return (
            <div key={key} className="contentContainer">
                {this.renderAction()}
                <div className="tarjetaEvento">
                    <div className="title">
                        <h5>{'Invitación ' + index}</h5>
                        <div className="icons">
                            <ArticleIcon className="icon" onClick={() => this.action(5)} />
                            <AddIcon className="icon" onClick={() => this.action(1, invitacion.id)} />
                            <DeleteOutline className="icon" onClick={() => this.action(2, invitacion.id)} />

                        </div>

                    </div>

                    <div className="info">
                        <div className="listaInvitados">

                            {this.state.listaInvitados.length > 0 ?
                                this.renderInvitados()
                                :
                                <span>{"Sin invitados"}</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TarjetaInvitacion;
