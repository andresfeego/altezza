import background from '../templates/wedding-terracota/assets/images/fondo_hero.webp';
import HeroImage1Module from './HeroImage1Module';

export default function HeroImage1TerracotaModule(payload) {
  const config = payload.module?.config || {};
  return HeroImage1Module({
    ...payload,
    module: { ...payload.module, config: {
      ...config,
      backgroundImage: Object.prototype.hasOwnProperty.call(config, 'backgroundImage')
        ? config.backgroundImage
        : (typeof background === 'string' ? background : background?.src),
    } },
  });
}
