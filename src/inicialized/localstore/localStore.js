import {createStore, combineReducers} from 'redux'
const auxiusuario = {"id":1,"nombres":"Cindy","apellidos":"Huertas","user":"cindyhu","rol":1,"telefono":"123456"}
const auxiusuariod = {"id":2,"nombres":"Catalina","apellidos":"Benitez","user":"catbeni","rol":2,"telefono":"123456"}


function usuarioReducer(state=[],action){
    switch (action.type) {
        case 'SET_USUARIO':  
        console.log(action.usuario)
            return action.usuario;
        
        case 'CLEAR_USUARIO': 
            return [];
    

        default:
            return state;
    }
}


let rootReducer = combineReducers({
    usuario: usuarioReducer
});

export default createStore(rootReducer);