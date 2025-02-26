import "./SlideHeaderInvitacion.scss"
import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';

const slides = [
    {
        "idSlide": 1,
        "orden": 1,
        "img": '004.jpg',
        "idCat": 205,
        "titulo": "",
        "tipoLink": 1,
        "descUno": "5",
        "descDos": "",
        "colorGradiente": "rgb(0,0,0)",
        "colorTexto": "rgb(255,255,255)",
        "lblCat": ""
    },
    {
        "idSlide": 6,
        "orden": 2,
        "img": '012.jpg',
        "idCat": 284,
        "titulo": "",
        "tipoLink": 2,
        "descUno": "B5DAS39R",
        "descDos": "altezza_decoraciones",
        "colorGradiente": "rgb(0,0,0)",
        "colorTexto": "rgb(255,255,255)",
        "lblCat": ""
    },
    {
        "idSlide": 6,
        "orden": 2,
        "img": '019.jpg',
        "idCat": 284,
        "titulo": "",
        "tipoLink": 2,
        "descUno": "B5DAS39R",
        "descDos": "altezza_decoraciones",
        "colorGradiente": "rgb(0,0,0)",
        "colorTexto": "rgb(255,255,255)",
        "lblCat": ""
    }

    ,
    {
        "idSlide": 6,
        "orden": 2,
        "img": '027.jpg',
        "idCat": 284,
        "titulo": "",
        "tipoLink": 2,
        "descUno": "B5DAS39R",
        "descDos": "altezza_decoraciones",
        "colorGradiente": "rgb(0,0,0)",
        "colorTexto": "rgb(255,255,255)",
        "lblCat": ""
    }

    ,
    {
        "idSlide": 6,
        "orden": 2,
        "img": '058.jpg',
        "idCat": 284,
        "titulo": "",
        "tipoLink": 2,
        "descUno": "B5DAS39R",
        "descDos": "altezza_decoraciones",
        "colorGradiente": "rgb(0,0,0)",
        "colorTexto": "rgb(255,255,255)",
        "lblCat": ""
    }
]


const { Element } = BannerAnim;
const BgElement = Element.BgElement;

function Item(props) {
    var urlFondo = `url(http://www.feegosystem.com/srcAltezza/images/resized_1920x1080/${props.img})`
    if (props.tipoLink == 2) {

    }
    return (
        <Element prefixCls="banner-user-elem" key={props.idSlide}>

                        
            <BgElement key={"bg1" + props.idSlide} className="bg" style={{ backgroundImage: urlFondo, backgroundSize: 'cover', backgroundPosition: 'center', }} />
            <div className="textoSlide">
                <QueueAnim name="QueueAnim">
                    <h3 key={"h1" + props.idSlide}>{props.titulo}</h3>
                </QueueAnim>
                <TweenOne  name="TweenOne" id="TweenOne">
                    {props.lblCat}
                </TweenOne>
            </div>
        </Element>
    )
}

function createSlides() {
    var aleatorio = Math.round(Math.random() * 1000);
    return (
        <BannerAnim autoPlay autoPlaySpeed={4000} type="across" id={"rand" + aleatorio} className="contenido">

            {slides.length > 0 ?
                slides.map((item) => Item(item))
                :
                null
            }

        </BannerAnim>
    )
}


const SlideHeaderInvitacion = ({ slides }) => {


    return (
        <div className="slide">
            {createSlides()}
        </div>
    )
}


export default SlideHeaderInvitacion