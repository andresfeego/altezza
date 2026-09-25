// Presentation stops only: source modules, their order and data remain unchanged.
export const isEventScenePair = (from, to) => from?.type === 'event_details'
  && to?.type === 'event_details' && from.eventGroup === to.eventGroup
  && from.eventStage === 'ceremony' && to.eventStage === 'reception';

export function groupSceneModules(modules) {
  const scenes = [];
  for (const [sourceIndex, module] of modules.entries()) {
    const previous = scenes[scenes.length - 1];
    if (module.type === 'save_the_date_calendar' && previous?.type === 'countdown' && !previous.companions.length) {
      previous.companions.push(module);
    } else if (module.type === 'event_details' && (module.data?.showCeremony || module.data?.showReception)) {
      for (const eventStage of ['ceremony', 'reception']) {
        if (module.data[eventStage === 'ceremony' ? 'showCeremony' : 'showReception']) {
          scenes.push({ ...module, eventStage, eventGroup: sourceIndex, companions: [] });
        }
      }
    } else scenes.push({ ...module, companions: [] });
  }
  return scenes;
}
