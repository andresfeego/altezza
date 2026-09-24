import DressCodeView from '../../module-views/DressCodeView';
import { StationerySceneLemoncello } from './DateSceneLemoncello';
import styles from './DressCodeLemoncello.module.scss';
import { describeDressCodeSwatch } from '../../modules/dressCodePalette';

export default function DressCodeLemoncello({ data }) {
  const resources = [...new Set([data.imageSrc, ...data.suggestedColors.map(describeDressCodeSwatch).map(item => item.imageSrc), ...data.avoidedColors.map(describeDressCodeSwatch).map(item => item.imageSrc)].filter(Boolean))];
  return <StationerySceneLemoncello variant="dresscode" className={styles.stationery}>
    <div className={styles.preload} aria-hidden="true">
      {resources.map(src => <img key={src} src={src} alt="" data-invitation-preload />)}
    </div>
    <DressCodeView data={data} styles={styles} />
  </StationerySceneLemoncello>;
}
