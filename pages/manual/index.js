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


function SafeLink(props) {
  const href = String(props?.href || '')
  const isMd = href.endsWith('.md')
  const isRelativeDoc = href && !href.startsWith('/') && !href.startsWith('http')
  const shouldDisable = isMd || isRelativeDoc

  if (shouldDisable) {
    // Render as plain text to avoid 404s from README.md relative links.
    return <span>{props.children}</span>
  }

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
    >
      {props.children}
    </a>
  )
}

export async function getStaticProps() {
  const p = path.join(process.cwd(), 'docs/product/README.md')
  const md = fs.readFileSync(p, 'utf8')
  return { props: { md } }
}

export default function ManualIndex({ md }) {
  const nav = buildNav()
  return (
    <ManualLayout title="Índice" nav={nav}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: SafeLink }}>{stripBackLinks(md)}</ReactMarkdown>
    </ManualLayout>
  )
}
