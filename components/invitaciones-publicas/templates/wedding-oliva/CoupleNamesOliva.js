import CoupleNamesView from '../../module-views/CoupleNamesView';
import styles from './CoupleNamesOliva.module.scss';

export default function CoupleNamesOliva({ data }) {
  return (
    <CoupleNamesView
      data={data}
      styles={styles}
    />
  );
}
