import React, { Component } from 'react'
import { connect } from 'react-redux'
import { saveUsuario, clearUsuario } from '../../inicialized/localstore/Actions';
import './Login.scss'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import '../../inicialized/formularios.scss'
import request from 'superagent';
import { nuevoMensaje, tiposAlertas } from '../../inicialized/Toast';
class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      usuario: '',
      pass: ''
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }



  onSubmit = () => {
    request
      .post('/responseAltezza/login')
      .send({ pass: this.state.pass, user: this.state.usuario})
      .set('accept', 'json')
      .end((err, res) => {
        if (err) {
          switch (err.status) {
            case 404:
              nuevoMensaje(tiposAlertas.error,'Usuario incorrecto')
              break;
              case 401:
                nuevoMensaje(tiposAlertas.error,'contraseña incorrecta')
                break;
            
            default:
              break;
          }
          console.log('err: ' + err.status);

        } else {
          this.props.saveUsuario(JSON.parse(res.text))
        }
      });
  }

  render() {
    return (
      <div className="containerLogin">

        <div className='login'>
          <Box className="container1col containerDirecColumn" component="form" noValidate autoComplete="off">
            <TextField className="generalInput input1Col80" variant="standard" type="text" placeholder="Usuario" value={this.state.usuario} name="usuario" onChange={this.onChange} />
            <TextField className="generalInput input1Col80" variant="standard" type="password" placeholder="Contraseña" value={this.state.pass} name="pass" onChange={this.onChange} />
            <div className="generalInput buttonUno" onClick={() => this.onSubmit()}>Ingresar</div>
          </Box>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario
  }
}


const mapDispatchToProps = {
  saveUsuario: saveUsuario,
  clearUsuario: clearUsuario
}



export default connect(mapStateToProps,mapDispatchToProps)(Login);