export default function BiblicalQuoteModule({ module }) {
  const passageText = String(module?.config?.passageText || '').trim();
  const passageReference = String(module?.config?.passageReference || '').trim();

  if (!passageText && !passageReference) {
    return null;
  }

  return {
    passageText,
    passageReference,
  };
}
