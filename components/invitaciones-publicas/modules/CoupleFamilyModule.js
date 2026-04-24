function normalizeFamilyEntry(entry) {
  if (!entry) return null;

  if (typeof entry === 'string') {
    const name = entry.trim();
    return name ? { name, isDeceased: false } : null;
  }

  if (typeof entry === 'object') {
    const name = String(entry.name || entry.label || '').trim();
    if (!name) return null;

    return {
      name,
      isDeceased: Boolean(entry.isDeceased || entry.deceased || entry.fallecido),
    };
  }

  return null;
}

function normalizeFamilyList(value) {
  return Array.isArray(value)
    ? value.map(normalizeFamilyEntry).filter(Boolean)
    : [];
}

export default function CoupleFamilyModule({ module, evento }) {
  return {
    coupleLabel: String(module?.config?.coupleLabel || evento?.nombre || '').trim(),
    parentsBride: normalizeFamilyList(module?.config?.parentsBride),
    parentsGroom: normalizeFamilyList(module?.config?.parentsGroom),
    godparents: normalizeFamilyList(module?.config?.godparents),
  };
}
