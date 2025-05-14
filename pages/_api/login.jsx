import styles from './login.module.scss';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.overlay}>
                <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaIzquierda}`} />

                <div className={styles.card}>
                    <Image
                        src="/images/logo_altezza_negro.png"
                        width={130}
                        height={80}
                        layout="intrinsic"    
                        alt="Altezza Logo"
                        className={styles.logo}
                    />
                    <div className={styles.form}>
                        <label>Usuario</label>
                        <input type="text" />
                        <label>Contraseña</label>
                        <input type="password" />
                        <button>Iniciar sesión</button>
                    </div>
                </div>
                <img src="/images/curva1.svg" className={`${styles.curva} ${styles.curvaDerecha}`} />

            </div>
        </div>
    );
}
