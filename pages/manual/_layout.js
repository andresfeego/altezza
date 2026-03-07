import React from 'react'
import Link from 'next/link'

export default function ManualLayout({ title, nav, children }) {
  const [navOpen, setNavOpen] = React.useState(false)
  return (
    <div className="manualRoot">
      <aside className={"manualAside" + (navOpen ? " isOpen" : "")}>
        <div className="manualBrand">
          <div className="manualTitle">Manual de producto v1</div>
          <div className="manualSub">Altezza (LAB)</div>
        </div>

        <nav className="manualNav">
          {nav.map((g) => (
            <div key={g.title} className="manualGroup">
              <div className="manualGroupTitle">{g.title}</div>
              <div className="manualLinks">
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href} className="manualLink" onClick={() => setNavOpen(false)}>
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

        :root{
          --m-bg: #f6f7fb;
          --m-card: rgba(255,255,255,.92);
          --m-border: rgba(15, 23, 42, .10);
          --m-text: rgba(15, 23, 42, .92);
          --m-muted: rgba(15, 23, 42, .55);
          --m-hover: rgba(15, 23, 42, .04);
          --m-accent: #16a34a;
        }

        .manualRoot{
          display:grid;
          grid-template-columns: 320px minmax(0,1fr);
          min-height: 100vh;
          background: var(--m-bg);
          color: var(--m-text);
        }

        .manualAside{
          border-right: 1px solid var(--m-border);
          background: var(--m-card);
          padding: 14px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: auto;
        }

        .manualBrand{
          padding: 12px;
          border: 1px solid var(--m-border);
          border-radius: 14px;
          background: #fff;
        }
        .manualTitle{ font-weight: 900; font-size: 14px; }
        .manualSub{ font-size: 12px; color: var(--m-muted); margin-top: 2px; }

        .manualNav{ margin-top: 12px; display:flex; flex-direction:column; gap: 10px; }
        .manualGroup{ padding: 10px; border:1px solid var(--m-border); border-radius:14px; background:#fff; }
        .manualGroupTitle{ font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--m-muted); margin-bottom: 8px; }
        .manualLinks{ display:flex; flex-direction:column; gap: 6px; }
        .manualLink{ font-size: 13px; color: var(--m-text); text-decoration:none; padding: 8px 10px; border-radius: 10px; border: 1px solid transparent; }
        .manualLink:hover{ background: var(--m-hover); border-color: var(--m-border); }

        .manualMain{ padding: 16px; }
        .manualHeader{ padding: 14px 16px; border:1px solid var(--m-border); border-radius:14px; background:#fff; }
        .manualH1{ margin:0; font-size: 18px; font-weight: 950; }
        .manualContent{ margin-top: 12px; padding: 16px; border:1px solid var(--m-border); border-radius:14px; background:#fff; }

        /* Markdown */
        .manualContent h1{ display:none; }
        .manualContent h2{ margin: 18px 0 10px; font-size: 14px; }
        .manualContent h3{ margin: 14px 0 8px; font-size: 13px; color: var(--m-text); }
        .manualContent p, .manualContent li{ font-size: 13px; line-height: 1.6; color: var(--m-text); }
        .manualContent ul{ padding-left: 18px; }
        .manualContent code{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; background: rgba(15,23,42,.04); padding: 1px 5px; border-radius: 6px; }
        .manualContent a{ color: var(--m-accent); text-decoration: none; }
        .manualContent a:hover{ text-decoration: underline; }

        /* Mobile: top bar + drawer */
        @media (max-width: 980px){
          .manualRoot{ grid-template-columns: 1fr; }
          .manualAside{ position: fixed; left: 0; top: 0; bottom: 0; width: 86vw; max-width: 360px; transform: translateX(-105%); transition: transform .22s ease; z-index: 50; }
          .manualAside.isOpen{ transform: translateX(0); }
          .manualMain{ padding: 12px; }
          .manualHeader{ position: sticky; top: 0; z-index: 10; }
          .manualTopbar{ display:flex; align-items:center; gap:10px; }
          .manualBurger{ border:1px solid var(--m-border); background:#fff; border-radius: 12px; padding: 10px 12px; font-size: 12px; }
          .manualBackdrop{ position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 40; }
        }

      `}</style>
    </div>
  )
}
