import React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import ManualLayout from './_layout'

function stripBackLinks(md) {
  return String(md || '').split(/\n/).filter((l) => !l.startsWith('← Volver al índice:')).join('\n')
}

function buildNav() {
  // Keep in sync with index
  return [
    {
      title: 'Admin',
      items: [
        { label: 'Admin Home', href: '/manual/modules/admin-home' },
        { label: 'Admin Eventos', href: '/manual/modules/admin-eventos' },
        { label: 'Decoración', href: '/manual/modules/admin-decoracion' },
        { label: 'Admin Mobiliario', href: '/manual/modules/admin-mobiliario' },
        { label: 'Admin Alquiler', href: '/manual/modules/admin-alquiler' },
        { label: 'Admin Cotizador', href: '/manual/modules/admin-cotizador' },
        { label: 'Admin Proveedores', href: '/manual/modules/admin-proveedores' },
        { label: 'Admin Frases', href: '/manual/modules/admin-frases' },
        { label: 'Admin Usuarios', href: '/manual/modules/admin-usuarios' },
      ],
    },
    {
      title: 'Cliente',
      items: [
        { label: 'Feed Evento', href: '/manual/modules/cliente-feed-evento' },
        { label: 'Datos Evento', href: '/manual/modules/cliente-datos-evento' },
        { label: 'Calculador Trago', href: '/manual/modules/cliente-calculador-trago' },
        { label: 'Fotos Compartidas', href: '/manual/modules/cliente-fotos-compartidas' },
        { label: 'Inspiración', href: '/manual/modules/cliente-inspiracion' },
        { label: 'Invitados', href: '/manual/modules/cliente-invitados' },
        { label: 'Invitaciones', href: '/manual/modules/cliente-invitaciones' },
        { label: 'Acomodación', href: '/manual/modules/cliente-acomodacion' },
        { label: 'Paletas Colores', href: '/manual/modules/cliente-paletas-colores' },
        { label: 'Pastel', href: '/manual/modules/cliente-pastel' },
        { label: 'Pendientes', href: '/manual/modules/cliente-pendientes' },
        { label: 'Timming', href: '/manual/modules/cliente-timming' },
        { label: 'Tips Boda', href: '/manual/modules/cliente-tips-boda' },
        { label: 'Wedding Day', href: '/manual/modules/cliente-wedding-day' },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Comportamientos', href: '/manual/system/comportamientos' },
        { label: 'Event Mode', href: '/manual/system/event-mode' },
      ],
    },
  ]
}

function titleFromSlug(slugArr) {
  return (slugArr || []).join(' / ')
}

export async function getStaticPaths() {
  const base = path.join(process.cwd(), 'docs/product')
  const files = []

  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name)
      const st = fs.statSync(full)
      if (st.isDirectory()) walk(full)
      else if (st.isFile() && name.endsWith('.md') && !full.endsWith('README.md')) files.push(full)
    }
  }

  walk(base)

  const paths = files.map((f) => {
    const rel = path.relative(base, f).replace(/\\/g, '/')
    const noExt = rel.replace(/\.md$/, '')
    return { params: { slug: noExt.split('/') } }
  })

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const slug = params.slug || []
  const p = path.join(process.cwd(), 'docs/product', ...slug) + '.md'
  const md = fs.readFileSync(p, 'utf8')
  return { props: { slug, md } }
}

export default function ManualPage({ slug, md }) {
  const nav = buildNav()
  return (
    <ManualLayout title={titleFromSlug(slug)} nav={nav}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{stripBackLinks(md)}</ReactMarkdown>
    </ManualLayout>
  )
}
