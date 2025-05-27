import React from 'react';

// Imports de editores personalizados
import EditorMatrimonio from './editor_tipos/EditorMatrimonio';
import EditorBautizo from './editor_tipos/EditorBautizo';
import EditorQuince from './editor_tipos/EditorQuince';
import EditorPrimeraComunion from './editor_tipos/EditorPrimeraComunion';
import EditorCumpleanios from './editor_tipos/EditorCumpleanios';
import EditorEmpresarial from './editor_tipos/EditorEmpresarial';

export default function EditorPersonalizado({ tipo, idEvento }) {
  switch (parseInt(tipo)) {
    case 1:
      return <EditorQuince idEvento={idEvento} />;
    case 2:
      return <EditorMatrimonio idEvento={idEvento} />;
    case 3:
      return <EditorBautizo idEvento={idEvento} />;
    case 4:
      return <EditorPrimeraComunion idEvento={idEvento} />;
    case 5:
      return <EditorCumpleanios idEvento={idEvento} />;
    case 6:
      return <EditorEmpresarial idEvento={idEvento} />;
    default:
      return <p>Este tipo de evento aún no tiene edición personalizada.</p>;
  }
}
