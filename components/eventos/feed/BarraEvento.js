import { useState } from 'react';
import styles from './BarraEvento.module.scss';
import { MdCake, MdChildCare, MdBusinessCenter, MdEmojiPeople, MdEvent } from 'react-icons/md';
import { GiPartyPopper } from 'react-icons/gi';
import { HiMenu } from 'react-icons/hi';
import  ModalMenuEvento  from '@/components/eventos/feed/ModalMenuEvento';
import { LiaRingSolid } from "react-icons/lia";

export default function BarraEvento({ tipo, nombre }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const iconoPorTipo = {
    '15 Años': <MdCake size={28} />,
    'Boda': <LiaRingSolid size={28} />,
    'Bautizo': <MdChildCare size={28} />,
    'Primera comunión': <MdEmojiPeople size={28} />,
    'Cumpleaños': <GiPartyPopper size={28} />,
    'Empresarial': <MdBusinessCenter size={28} />,
  };

  const icono = iconoPorTipo[tipo] || <MdEvent size={28} />;

  return (
    <>
      <div className={styles.barra}>
        <div className={styles.icono}>{icono}</div>
        <div className={styles.nombre}>{nombre}</div>
        <button className={styles.menu} onClick={() => setMostrarMenu(true)}>
          <HiMenu size={26} />
        </button>
      </div>

      <ModalMenuEvento open={mostrarMenu} onClose={() => setMostrarMenu(false)} />
    </>
  );
}
