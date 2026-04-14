import { useMemo, useRef, useState } from 'react';
import { FiDownload, FiFileText, FiUpload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import Button from '@/components/ui/actions/Button';
import ModalShell from '@/components/ui/layout/ModalShell';
import styles from './invitaciones.module.scss';

const TEMPLATE_HEADERS = [
  'label',
  'mensaje_personalizado',
  'nombre_invitado',
  'telefono',
  'whatsapp',
  'parentesco',
  'grupo_edad',
  'principal',
];

function buildWorkbookTemplate(parentescos = [], gruposEdad = []) {
  const cargaRows = [
    TEMPLATE_HEADERS,
    ['Familia Perez', 'Mesa familia novia', 'Ana Perez', '3001234567', 'SI', parentescos[0]?.parentesco || '', gruposEdad[0]?.grupo || '', 'SI'],
    ['Familia Perez', 'Mesa familia novia', 'Carlos Perez', '3007654321', 'SI', parentescos[1]?.parentesco || parentescos[0]?.parentesco || '', gruposEdad[0]?.grupo || '', 'NO'],
    ['Amigos oficina', '', 'Luisa Romero', '', 'NO', parentescos[2]?.parentesco || parentescos[0]?.parentesco || '', gruposEdad[0]?.grupo || '', 'SI'],
  ];
  const catalogosRows = [
    ['parentescos_validos', 'grupos_edad_validos'],
    ...Array.from({ length: Math.max(parentescos.length, gruposEdad.length) }, (_, index) => [
      parentescos[index]?.parentesco || '',
      gruposEdad[index]?.grupo || '',
    ]),
  ];

  const instruccionesRows = [
    ['campo', 'descripcion'],
    ['label', 'Agrupa filas que pertenecen a la misma invitacion.'],
    ['mensaje_personalizado', 'Texto interno opcional para identificar la invitacion.'],
    ['nombre_invitado', 'Nombre completo del integrante.'],
    ['telefono', 'Telefono del invitado. Puede quedar vacio.'],
    ['whatsapp', 'Usa SI o NO.'],
    ['parentesco', 'Usa uno de los valores de Catalogos.'],
    ['grupo_edad', 'Usa uno de los valores de Catalogos.'],
    ['principal', 'Usa SI para el integrante principal y NO para los demas.'],
  ];

  const workbook = XLSX.utils.book_new();
  const cargaSheet = XLSX.utils.aoa_to_sheet(cargaRows);
  const catalogosSheet = XLSX.utils.aoa_to_sheet(catalogosRows);
  const instruccionesSheet = XLSX.utils.aoa_to_sheet(instruccionesRows);

  cargaSheet['!cols'] = [
    { wch: 28 },
    { wch: 32 },
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 24 },
    { wch: 18 },
    { wch: 14 },
  ];

  catalogosSheet['!cols'] = [{ wch: 28 }, { wch: 20 }];
  instruccionesSheet['!cols'] = [{ wch: 24 }, { wch: 64 }];

  XLSX.utils.book_append_sheet(workbook, cargaSheet, 'Carga');
  XLSX.utils.book_append_sheet(workbook, catalogosSheet, 'Catalogos');
  XLSX.utils.book_append_sheet(workbook, instruccionesSheet, 'Instrucciones');

  return workbook;
}

function parseCsv(text) {
  const normalizedText = String(text || '').replace(/^\uFEFF/, '');
  const lines = normalizedText.split(/\r\n|\n|\r/).filter((line) => line.length > 0);
  const firstLine = lines.find((line) => !line.trim().startsWith('#')) || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semicolonCount >= commaCount ? ';' : ',';

  const rows = [];
  let currentRow = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let index = 0; index < normalizedText.length; index += 1) {
    const char = normalizedText[index];
    const nextChar = normalizedText[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === delimiter && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1;
      }
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length || currentRow.length) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}

function normalizeBoolean(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return ['1', 'si', 'sí', 's', 'true', 'x', 'yes'].includes(normalized);
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function buildCatalogMaps(parentescos = [], gruposEdad = []) {
  return {
    parentescos: new Map(
      parentescos.map((item) => [slugify(item?.parentesco), Number(item?.id)])
    ),
    gruposEdad: new Map(
      gruposEdad.map((item) => [slugify(item?.grupo), Number(item?.id)])
    ),
  };
}

function buildImportPreview(rows, parentescos = [], gruposEdad = []) {
  if (!rows.length) {
    return {
      errors: ['La plantilla esta vacia.'],
      invitations: [],
      invitesCount: 0,
      membersCount: 0,
    };
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((item) => slugify(item));
  const requiredHeaders = TEMPLATE_HEADERS.map((item) => slugify(item));
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

  if (missingHeaders.length) {
    return {
      errors: [`Faltan columnas requeridas: ${missingHeaders.join(', ')}`],
      invitations: [],
      invitesCount: 0,
      membersCount: 0,
    };
  }

  const maps = buildCatalogMaps(parentescos, gruposEdad);
  const groups = new Map();
  const errors = [];

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowData = Object.fromEntries(headers.map((header, headerIndex) => [header, String(row[headerIndex] || '').trim()]));

    if (!Object.values(rowData).some(Boolean)) return;
    if (String(rowData.label || '').startsWith('#')) return;

    const label = rowData.label;
    const nombre = rowData.nombre_invitado;

    if (!label) {
      errors.push(`Fila ${rowNumber}: falta label.`);
      return;
    }

    if (!nombre) {
      errors.push(`Fila ${rowNumber}: falta nombre_invitado.`);
      return;
    }

    const parentescoId = rowData.parentesco ? maps.parentescos.get(slugify(rowData.parentesco)) : null;
    const grupoEdadId = rowData.grupo_edad ? maps.gruposEdad.get(slugify(rowData.grupo_edad)) : null;

    if (rowData.parentesco && !parentescoId) {
      errors.push(`Fila ${rowNumber}: parentesco no reconocido (${rowData.parentesco}).`);
      return;
    }

    if (rowData.grupo_edad && !grupoEdadId) {
      errors.push(`Fila ${rowNumber}: grupo_edad no reconocido (${rowData.grupo_edad}).`);
      return;
    }

    const current = groups.get(label) || {
      label,
      mensajePersonalizado: rowData.mensaje_personalizado || '',
      integrantes: [],
    };

    current.integrantes.push({
      nombre,
      telefono: rowData.telefono || '',
      whatsapp: normalizeBoolean(rowData.whatsapp),
      parentescoId: parentescoId || null,
      grupoEdadId: grupoEdadId || null,
      principal: normalizeBoolean(rowData.principal),
    });

    if (!current.mensajePersonalizado && rowData.mensaje_personalizado) {
      current.mensajePersonalizado = rowData.mensaje_personalizado;
    }

    groups.set(label, current);
  });

  const invitations = Array.from(groups.values()).map((group) => {
    if (!group.integrantes.some((item) => item.principal) && group.integrantes.length) {
      group.integrantes[0].principal = true;
    }

    return group;
  });

  return {
    errors,
    invitations,
    invitesCount: invitations.length,
    membersCount: invitations.reduce((acc, item) => acc + item.integrantes.length, 0),
  };
}

export default function InvitacionesImportModal({
  open,
  parentescos = [],
  gruposEdad = [],
  importing = false,
  onClose,
  onImport,
}) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState({
    errors: [],
    invitations: [],
    invitesCount: 0,
    membersCount: 0,
  });

  const summaryItems = useMemo(
    () => [
      { label: 'Invitaciones', value: preview.invitesCount },
      { label: 'Integrantes', value: preview.membersCount },
      { label: 'Errores', value: preview.errors.length },
    ],
    [preview]
  );

  if (!open) return null;

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const extension = String(file.name.split('.').pop() || '').toLowerCase();

    if (extension === 'xlsx' || extension === 'xls') {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, blankrows: false, defval: '' });
      setPreview(buildImportPreview(rows, parentescos, gruposEdad));
      return;
    }

    const text = await file.text();
    setPreview(buildImportPreview(parseCsv(text), parentescos, gruposEdad));
  }

  function handleDownloadTemplate() {
    const workbook = buildWorkbookTemplate(parentescos, gruposEdad);
    const arrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_invitaciones_altezza.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <ModalShell
      title="Importar desde excel"
      description="Descarga la plantilla Excel, completa la hoja de carga apoyandote en catalogos y subela para crear invitaciones e integrantes de forma masiva."
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={importing}>
            Cerrar
          </Button>
          <Button
            onClick={() => onImport(preview.invitations)}
            disabled={!preview.invitations.length || preview.errors.length > 0 || importing}
          >
            {importing ? 'Importando...' : 'Importar'}
          </Button>
        </>
      )}
    >
      <div className={styles.importModalGrid}>
        <div className={styles.importActionsRow}>
          <Button variant="secondary" onClick={handleDownloadTemplate} iconLeading={<FiDownload />} disabled={importing}>
            Descargar plantilla
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,text/csv"
            className={styles.hiddenFileInput}
            onChange={handleFileChange}
            disabled={importing}
          />

          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} iconLeading={<FiUpload />} disabled={importing}>
            Seleccionar archivo
          </Button>
        </div>

        <div className={styles.importMetaRow}>
          <span className={styles.detailLabel}>Archivo</span>
          <strong>{fileName || 'Sin archivo seleccionado'}</strong>
        </div>

        <section className={styles.summaryCard}>
          {summaryItems.map((item) => (
            <div key={item.label} className={styles.summaryMetric}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        {preview.errors.length ? (
          <section className={styles.importFeedbackBlock}>
            <span className={styles.detailLabel}>Errores detectados</span>
            <div className={styles.importScrollableList}>
              {preview.errors.map((error) => (
                <p key={error} className={styles.supportMuted}>{error}</p>
              ))}
            </div>
          </section>
        ) : null}

        {preview.invitations.length ? (
          <section className={styles.importFeedbackBlock}>
            <span className={styles.detailLabel}>Preview de importacion</span>
            <div className={styles.importScrollableList}>
              {preview.invitations.map((item) => (
                <div key={item.label} className={styles.importPreviewRow}>
                  <div>
                    <strong>{item.label}</strong>
                    <p className={styles.supportMuted}>
                      {item.integrantes.length} integrante{item.integrantes.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <span className={styles.metaPill}>
                    {item.mensajePersonalizado ? 'Con mensaje' : 'Sin mensaje'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className={styles.importHintBlock}>
          <FiFileText aria-hidden="true" />
          <p className={styles.supportMuted}>
            Completa la hoja Carga y consulta Catalogos para usar los valores exactos de parentesco y grupo de edad.
          </p>
        </div>
      </div>
    </ModalShell>
  );
}
