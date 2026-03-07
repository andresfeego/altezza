import React from 'react'
import Link from 'next/link'

export default function ManualLayout({ title, nav, children }) {
  return (
    <div className="manualRoot">
      <aside className="manualAside">
        <div className="manualBrand">
          <div className="manualTitle">Manual de producto</div>
          <div className="manualSub">Altezza (LAB)</div>
        </div>

        <nav className="manualNav">
          {nav.map((g) => (
            <div key={g.title} className="manualGroup">
              <div className="manualGroupTitle">{g.title}</div>
              <div className="manualLinks">
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href} className="manualLink">
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="manualMain">
        <div className="manualHeader">
          <h1 className="manualH1">{title}</h1>
        </div>
        <div className="manualContent">{children}</div>
      </main>

      <style jsx global>{`
        .manualRoot{
          display:grid;
          grid-template-columns: 320px minmax(0,1fr);
          min-height: 100vh;
          background: #0b0e14;
          color: rgba(255,255,255,.92);
        }
        .manualAside{
          border-right: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
          padding: 16px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: auto;
        }
        .manualBrand{ padding: 10px 10px 14px; border:1px solid rgba(255,255,255,.08); border-radius:14px; background: rgba(0,0,0,.25); }
        .manualTitle{ font-weight: 800; font-size: 14px; }
        .manualSub{ font-size: 12px; color: rgba(255,255,255,.55); margin-top: 2px; }
        .manualNav{ margin-top: 14px; display:flex; flex-direction:column; gap: 12px; }
        .manualGroup{ padding: 10px; border:1px solid rgba(255,255,255,.08); border-radius:14px; background: rgba(0,0,0,.18); }
        .manualGroupTitle{ font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.55); margin-bottom: 8px; }
        .manualLinks{ display:flex; flex-direction:column; gap: 6px; }
        .manualLink{ font-size: 13px; color: rgba(255,255,255,.86); text-decoration:none; padding: 7px 8px; border-radius:10px; border:1px solid transparent; }
        .manualLink:hover{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.10); }

        .manualMain{ padding: 18px 22px; }
        .manualHeader{ padding: 14px 16px; border:1px solid rgba(255,255,255,.08); border-radius:14px; background: rgba(0,0,0,.25); }
        .manualH1{ margin:0; font-size: 18px; font-weight: 900; }
        .manualContent{ margin-top: 14px; padding: 16px; border:1px solid rgba(255,255,255,.08); border-radius:14px; background: rgba(0,0,0,.18); }

        /* Markdown */
        .manualContent h1{ display:none; }
        .manualContent h2{ margin: 18px 0 10px; font-size: 14px; }
        .manualContent h3{ margin: 14px 0 8px; font-size: 13px; color: rgba(255,255,255,.85); }
        .manualContent p, .manualContent li{ font-size: 13px; line-height: 1.55; color: rgba(255,255,255,.86); }
        .manualContent ul{ padding-left: 18px; }
        .manualContent code{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; }
        .manualContent a{ color: #a8cf45; text-decoration: none; }
        .manualContent a:hover{ text-decoration: underline; }

        @media (max-width: 980px){
          .manualRoot{ grid-template-columns: 1fr; }
          .manualAside{ position: relative; height: auto; }
        }
      `}</style>
    </div>
  )
}
