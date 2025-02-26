import { toast } from 'react-toastify';
import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import BounceLoader from "react-spinners/BounceLoader";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';





let cargando = null;
export const tiposAlertas = {info: 1, success: 2, warn: 3, error: 4, autoCloseCustom: 5, cargando: 6, cargadoSuccess: 7, cargadoWarn: 8, cargadoError: 9, cerrarTodas: 10};

export const nuevoMensaje = (icono,mensaje,auto) =>{

    const override = `
  display: flex;
  margin-right: 5px;
  border-color: red;
  flex-direction: row;
`;


    switch (icono) {
        case 1:
            toast.info(
                <div>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 2:
            toast.success(
                <div>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;
            
        case 3:
            toast.warn(
                <div>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 4:
            toast.error(
                <div>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 5:
            toast.success(
                <div>
                {mensaje}
                </div>,{
                    autoClose: auto
                }
            );
            break;

        case 6:
            cargando = toast.warn(
                <div>
                {mensaje}
                </div>,{
                    autoClose: false
                }
            );
            break;

        case 7:
            toast.update(cargando, {
                render: 
                    <div>
                        {mensaje}
                    </div>,
                type: toast.TYPE.SUCCESS,
                autoClose: auto
              });
            break;

        case 8:
            toast.update(cargando, {
                render: 
                    <div>
                        {mensaje}
                    </div>,
                type: toast.TYPE.WARNING,
                autoClose: auto
              });
            break;

        case 9:
            toast.update(cargando, {
                render: 
                    <div>
                        {mensaje}
                    </div>,
                type: toast.TYPE.ERROR,
                autoClose: auto
              });
            break;

        case 10:
            toast.success(
                <div>
                {mensaje}
                </div>,{
                    onClose: props => toast.dismiss(),
                    autoClose: auto

                }
            );
            break;

        
    
        default:
            break;
    }
    
}
