export const saveUsuario = (usuario)=>{
    return{
        type: 'SET_USUARIO',
        usuario: usuario
    }
}

export const clearUsuario = ()=>{
    return{
        type: 'CLEAR_USUARIO'
    }
}

