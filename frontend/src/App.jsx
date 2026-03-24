import { useEffect, useMemo, useState } from 'react'

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== 'undefined' && window.location.hostname.endsWith('ct.ws')
    ? 'https://veltrynox.onrender.com'
    : '')

function absoluteApi(path) {
  if (!BACKEND_URL) return path
  return `${BACKEND_URL.replace(/\/$/, '')}${path}`
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const [status, setStatus] = useState('')
  const [showTop, setShowTop] = useState(false)

  const storedTheme = useMemo(() => {
    try {
      return window.localStorage.getItem('veltrynox-theme')
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const isLightTheme = storedTheme === 'light'
    setIsLight(isLightTheme)
    document.body.classList.toggle('theme-light', isLightTheme)
  }, [storedTheme])

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 450)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToId(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleTheme() {
    const nextLight = !isLight
    setIsLight(nextLight)
    document.body.classList.toggle('theme-light', nextLight)
    try {
      window.localStorage.setItem('veltrynox-theme', nextLight ? 'light' : 'dark')
    } catch {
      // ignore
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('Sending your message…')

    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = Object.fromEntries(fd.entries())

    try {
      const res = await fetch(absoluteApi('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus(data.message || 'Thanks for reaching out – we’ll get back to you shortly.')
      form.reset()
    } catch (err) {
      setStatus(err?.message || 'Could not send your message. Please try again.')
    }
  }

  return (
    <>
      <header>
        <div className="page-shell nav">
          <div className="logo-mark" onClick={() => scrollToId('hero')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon" />
            <div>
              <div className="logo-text-main">Veltrynox</div>
              <div className="logo-text-tagline">project delivery</div>
            </div>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <a href="#hero">Home</a>
            <a href="#work">How we work</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-cta">
            <div className="nav-badge">
              <span className="nav-badge-dot" />
              <span>Available for new projects</span>
            </div>
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              {isLight ? '☀' : '☾'}
            </button>
            <button className="btn btn-primary" type="button" onClick={() => scrollToId('contact')}>
              Book demo
            </button>
          </div>

          <button
            className="nav-mobile-toggle"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>
        </div>

        <div className="page-shell nav-mobile-menu" style={{ display: mobileOpen ? 'flex' : 'none' }}>
          <a href="#hero" onClick={() => setMobileOpen(false)}>
            Home
          </a>
          <a href="#work" onClick={() => setMobileOpen(false)}>
            How we work
          </a>
          <a href="#contact" onClick={() => setMobileOpen(false)}>
            Contact
          </a>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
            <button className="btn btn-ghost" type="button" onClick={() => scrollToId('work')}>
              Engagement
            </button>
            <button className="btn btn-primary" type="button" onClick={() => scrollToId('contact')}>
              Book demo
            </button>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-pill">Delivery partner</span>
              <span>From signed deal to go‑live</span>
            </div>

            <h1 id="hero-title" className="hero-heading">
              Ship client projects <span>faster</span> with a senior build team.
            </h1>

            <p className="hero-subtitle">
              Veltrynox is a sales‑friendly software delivery partner. We scope, build, and ship custom products
              end‑to‑end so you can close more projects—without stretching your internal team thin.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" type="button" onClick={() => scrollToId('contact')}>
                Talk to our team →
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => scrollToId('work')}>
                How we work
              </button>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <span className="hero-meta-dot" />
                <span>Clear milestones & acceptance criteria</span>
              </div>
              <div className="hero-meta-item">
                <span>Weekly delivery updates</span>
              </div>
              <div className="hero-meta-item">
                <span>Handover + documentation included</span>
              </div>
            </div>
          </div>

          <div aria-hidden="true" style={{ padding: '1.25rem', borderRadius: '28px', border: '1px solid rgba(148,163,184,0.5)', background: 'rgba(15,23,42,0.92)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-soft)' }}>Delivery snapshot</div>
            <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem' }}>
              <div style={{ padding: '0.7rem', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.45)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Scope</div>
                <div style={{ fontWeight: 600 }}>Defined</div>
              </div>
              <div style={{ padding: '0.7rem', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.45)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Timeline</div>
                <div style={{ fontWeight: 600 }}>Weekly</div>
              </div>
              <div style={{ padding: '0.7rem', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.45)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Quality</div>
                <div style={{ fontWeight: 600 }}>QA + reviews</div>
              </div>
              <div style={{ padding: '0.7rem', borderRadius: '14px', border: '1px solid rgba(148,163,184,0.45)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Go‑live</div>
                <div style={{ fontWeight: 600 }}>Supported</div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" aria-labelledby="work-title">
          <div className="section-header">
            <div className="section-title-block">
              <div className="eyebrow">How we work</div>
              <h2 className="section-title" id="work-title">
                Engagement models for project‑based delivery.
              </h2>
              <p className="section-description">
                Choose the structure that matches your pipeline. Every engagement includes clear scope, delivery
                cadence, and a clean handover.
              </p>
            </div>
            <div>
              <span className="badge-small">Transparent scope · Weekly updates · Delivery ownership</span>
            </div>
          </div>

          <div className="pricing-grid">
            <article className="pricing-card">
              <div className="pricing-name">Project delivery</div>
              <div className="pricing-tag">Fixed‑scope builds</div>
              <p className="pricing-summary">For signed projects that need reliable execution from kickoff to launch.</p>
              <ul className="pricing-list">
                <li>Milestones + acceptance criteria</li>
                <li>Weekly check‑ins with demos</li>
                <li>Fixed price per project (agreed up‑front)</li>
                <li>Handover + docs included</li>
              </ul>
              <button className="btn btn-ghost" type="button" onClick={() => scrollToId('contact')}>
                Discuss a project
              </button>
            </article>

            <article className="pricing-card pricing-featured">
              <div className="pricing-name">Dedicated squad</div>
              <div className="pricing-tag">On‑demand product team</div>
              <p className="pricing-summary">A stable senior team that can deliver multiple projects in parallel.</p>
              <ul className="pricing-list">
                <li>PM + design + engineering</li>
                <li>Shared backlog across accounts</li>
                <li>Rolling scope with outcome targets</li>
                <li>Integrates with sales + account teams</li>
              </ul>
              <button className="btn btn-primary" type="button" onClick={() => scrollToId('contact')}>
                Book a scoping call →
              </button>
            </article>

            <article className="pricing-card">
              <div className="pricing-name">Advisory & audits</div>
              <div className="pricing-tag">For complex opportunities</div>
              <p className="pricing-summary">Pre‑sales discovery, architecture reviews, delivery plans, and risk checks.</p>
              <ul className="pricing-list">
                <li>Technical discovery + proposal support</li>
                <li>Architecture recommendations</li>
                <li>Delivery roadmap + risks</li>
                <li>Can roll into a build project</li>
              </ul>
              <button className="btn btn-ghost" type="button" onClick={() => scrollToId('contact')}>
                Contact sales
              </button>
            </article>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title">
          <div className="section-header">
            <div className="section-title-block">
              <div className="eyebrow">Contact</div>
              <h2 className="section-title" id="contact-title">
                Tell us about the project.
              </h2>
              <p className="section-description">We’ll reply within 1 business day with next steps and a delivery plan.</p>
            </div>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <div style={{ color: 'var(--text-soft)', fontSize: '0.82rem', display: 'grid', gap: '0.6rem' }}>
                <div>
                  <strong style={{ color: 'var(--text)' }}>Email</strong> — hello@veltrynox.com
                </div>
                <div>
                  <strong style={{ color: 'var(--text)' }}>HQ</strong> — Remote‑first (EU, US, APAC)
                </div>
                <div>
                  <strong style={{ color: 'var(--text)' }}>Best for</strong> — Delivery partnerships, agencies, and sales‑led teams.
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} aria-label="Contact form">
              <div className="form-row">
                <div>
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" autoComplete="organization" placeholder="Acme Inc." />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label htmlFor="email">Work email</label>
                  <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
                </div>
                <div>
                  <label htmlFor="role">Your role</label>
                  <input id="role" name="role" type="text" placeholder="Founder, Sales Lead, PM…" />
                </div>
              </div>

              <div>
                <label htmlFor="timeline">Timeline</label>
                <input id="timeline" name="timeline" type="text" placeholder='e.g. “Need delivery in 6–8 weeks”' />
              </div>

              <div>
                <label htmlFor="message">Project summary</label>
                <textarea id="message" name="message" required placeholder="What are you building? What does success look like?" />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit inquiry
              </button>
              <p className="form-footnote" aria-live="polite">
                {status || 'By submitting, you agree to be contacted about Veltrynox services. No spam.'}
              </p>
            </form>
          </div>
        </section>
      </main>

      <button
        className={`back-to-top ${showTop ? 'back-to-top--visible' : ''}`}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  )
}
