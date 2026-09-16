import background from '../templates/wedding-terracota/assets/images/fondo_hero.webp';
import HeroImage2Module from './HeroImage2Module';

export default function HeroImage2TerracotaModule(payload) {
  const config = payload.module?.config || {};
  return HeroImage2Module({
    ...payload,
    module: { ...payload.module, config: {
      ...config,
      backgroundImage: Object.prototype.hasOwnProperty.call(config, 'backgroundImage')
        ? config.backgroundImage
        : (typeof background === 'string' ? background : background?.src),
    } },
  });
}
