'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Clock3,
  HeartPulse,
  LocateFixed,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  Star,
  Truck,
  Wrench,
} from 'lucide-react'

type Category = 'Guincho' | 'Borracharia' | 'Mecânica Pesada' | 'Lava Jato'
type FeatureFilter = 'all' | 'sos' | 'vida'

type Listing = {
  name: string
  category: Category
  city: string
  state: string
  highway: string
  phone: string
  phoneLink: string
  whatsapp: string
  rating: string
  reviews: number
  hours: string
  description: string
  open: boolean
  sos: boolean
  vida: boolean
  icon: 'truck' | 'wrench'
}

const listings: Listing[] = [
  {
    name: 'Auto Socorro Ipanema',
    category: 'Guincho',
    city: 'Catalão',
    state: 'GO',
    highway: 'BR-050 · km 278',
    phone: '(64) 3442-1919',
    phoneLink: '+556434421919',
    whatsapp: '5564991234567',
    rating: '4,9',
    reviews: 128,
    hours: 'Atendimento 24 horas',
    description: 'Guincho leve e pesado, com atendimento em toda a região.',
    open: true,
    sos: true,
    vida: false,
    icon: 'truck',
  },
  {
    name: 'Borracharia do Trevo',
    category: 'Borracharia',
    city: 'Araguari',
    state: 'MG',
    highway: 'BR-050 · km 37',
    phone: '(34) 3242-8080',
    phoneLink: '+553432428080',
    whatsapp: '5534998765432',
    rating: '4,8',
    reviews: 86,
    hours: 'Aberto até 22h',
    description: 'Pneus, consertos e socorro para carros e caminhões.',
    open: true,
    sos: true,
    vida: true,
    icon: 'wrench',
  },
  {
    name: 'Diesel Forte Serviços',
    category: 'Mecânica Pesada',
    city: 'Uberlândia',
    state: 'MG',
    highway: 'BR-365 · km 612',
    phone: '(34) 3233-4567',
    phoneLink: '+553432334567',
    whatsapp: '5534991122334',
    rating: '4,7',
    reviews: 64,
    hours: 'Aberto até 18h',
    description: 'Mecânica diesel, elétrica e revisão de veículos pesados.',
    open: true,
    sos: false,
    vida: true,
    icon: 'wrench',
  },
  {
    name: 'Lava Jato Estradão',
    category: 'Lava Jato',
    city: 'Ribeirão Preto',
    state: 'SP',
    highway: 'BR-050 · km 1205',
    phone: '(16) 3625-7070',
    phoneLink: '+551636257070',
    whatsapp: '5516991234567',
    rating: '4,6',
    reviews: 52,
    hours: 'Aberto até 20h',
    description: 'Lavagem completa e espaço de descanso para sua parada.',
    open: true,
    sos: false,
    vida: true,
    icon: 'wrench',
  },
]

const categories = ['Todas', 'Guincho', 'Borracharia', 'Mecânica Pesada', 'Lava Jato'] as const

type CategoryFilter = (typeof categories)[number]

function ListingCard({ listing }: { listing: Listing }) {
  const Icon = listing.icon === 'truck' ? Truck : Wrench

  return (
    <article className="listing-card">
      <div className="listing-card-top">
        <div className="listing-icon" aria-hidden="true">
          <Icon size={21} strokeWidth={1.8} />
        </div>
        <div className="listing-category">{listing.category}</div>
        <div className="listing-rating" aria-label={`Nota ${listing.rating} de 5, ${listing.reviews} avaliações`}>
          <Star size={14} fill="currentColor" strokeWidth={0} />
          <span>{listing.rating}</span>
          <span className="rating-count">({listing.reviews})</span>
        </div>
      </div>

      <div className="listing-main">
        <div className="listing-heading-row">
          <h3>{listing.name}</h3>
          <ArrowUpRight className="listing-arrow" size={18} aria-hidden="true" />
        </div>
        <p className="listing-description">{listing.description}</p>
        <div className="listing-meta">
          <span><MapPin size={14} aria-hidden="true" />{listing.city}, {listing.state}</span>
          <span><span className="meta-dot" aria-hidden="true" />{listing.highway}</span>
        </div>
        <div className="listing-hours">
          <span className={`open-indicator${listing.open ? '' : ' closed'}`} aria-hidden="true" />
          <Clock3 size={14} aria-hidden="true" />
          {listing.hours}
        </div>
      </div>

      <div className="listing-contact">
        <a className="listing-phone" href={`tel:${listing.phoneLink}`} aria-label={`Ligar para ${listing.name}: ${listing.phone}`}>
          {listing.phone}
        </a>
        <div className="listing-actions">
          <a className="action-call" href={`tel:${listing.phoneLink}`}>
            <Phone size={15} aria-hidden="true" />
            Ligar agora
          </a>
          <a className="action-whatsapp" href={`https://wa.me/${listing.whatsapp}`} target="_blank" rel="noreferrer" aria-label={`Conversar com ${listing.name} pelo WhatsApp`}>
            <MessageCircle size={15} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [feature, setFeature] = useState<FeatureFilter>('all')
  const [locationMessage, setLocationMessage] = useState('')
  const [locationActive, setLocationActive] = useState(false)

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')

    return listings.filter((listing) => {
      const matchesCategory = category === 'Todas' || listing.category === category
      const matchesFeature = feature === 'all' || listing[feature]
      const searchableText = `${listing.name} ${listing.category} ${listing.city} ${listing.state} ${listing.highway}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && matchesFeature && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [category, feature, query])

  function locateMe() {
    if (!navigator.geolocation) {
      setLocationMessage('A localização não está disponível neste navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationActive(true)
        setLocationMessage('Localização ativada para esta sessão.')
      },
      () => setLocationMessage('Não foi possível acessar sua localização. Confira a permissão do navegador.'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
  }

  function toggleFeature(nextFeature: Exclude<FeatureFilter, 'all'>) {
    setFeature((current) => current === nextFeature ? 'all' : nextFeature)
    setCategory('Todas')
  }

  return (
    <main className="brlista-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="BRLista Brasil, início">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">BR<span>LISTA</span><small>BRASIL</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a className="nav-link active" href="#servicos">Encontrar serviços</a>
          <a className="nav-link" href="#como-funciona">Como funciona</a>
        </nav>
        <a className="header-cta" href="#servicos">Explorar diretório <ArrowUpRight size={15} aria-hidden="true" /></a>
      </header>

      <section className="hero-section" id="inicio" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> GUIA DE SERVIÇOS NA ESTRADA</div>
          <h1 id="hero-title">Na estrada,<br />ninguém precisa <span>parar sozinho.</span></h1>
          <p className="hero-description">Encontre ajuda confiável para seguir viagem com mais tranquilidade pelas rodovias do Brasil.</p>
          <div className="search-panel" role="search">
            <Search size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="directory-search">Buscar por cidade, rodovia ou serviço</label>
            <input
              id="directory-search"
              type="search"
              placeholder="Cidade, rodovia ou serviço..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className={`nearby-button${locationActive ? ' is-active' : ''}`} type="button" onClick={locateMe}>
              {locationActive ? <Check size={15} aria-hidden="true" /> : <LocateFixed size={15} aria-hidden="true" />}
              <span>{locationActive ? 'Localização ativa' : 'Perto de mim'}</span>
            </button>
          </div>
          <div className="search-footnote">
            <span className="privacy-dot" /> Busca simples, contato direto. Sem complicação.
          </div>
          {locationMessage && <p className="location-message" role="status">{locationMessage}</p>}
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-grid" />
          <div className="route-marker marker-one"><MapPin size={17} fill="currentColor" /><span>BR-050</span></div>
          <div className="route-marker marker-two"><MapPin size={17} fill="currentColor" /><span>BR-365</span></div>
          <div className="route-line"><span className="route-node node-a" /><span className="route-node node-b" /><span className="route-node node-c" /></div>
          <div className="route-sign"><span className="sign-shield">BR</span><span><strong>Seu próximo destino</strong><small>mais perto do que parece</small></span><ArrowDownRight size={19} /></div>
          <div className="art-caption"><span>16°39' S</span><span>RODOVIAS DO BRASIL</span></div>
        </div>
        <div className="hero-bottomline"><span>01 / 04</span><span>INFORMAÇÃO QUE ACOMPANHA SUA VIAGEM</span><span className="bottomline-rule" /></div>
      </section>

      <section className="quick-actions" aria-label="Atalhos de serviços">
        <button className={`quick-card quick-sos${feature === 'sos' ? ' selected' : ''}`} type="button" onClick={() => toggleFeature('sos')} aria-pressed={feature === 'sos'}>
          <span className="quick-icon"><ShieldAlert size={22} aria-hidden="true" /></span>
          <span className="quick-text"><small>PRECISA DE AJUDA?</small><strong>SOS ESTRADA</strong><span>Guincho e socorro rápido</span></span>
          <ArrowUpRight className="quick-arrow" size={19} aria-hidden="true" />
        </button>
        <button className={`quick-card quick-vida${feature === 'vida' ? ' selected' : ''}`} type="button" onClick={() => toggleFeature('vida')} aria-pressed={feature === 'vida'}>
          <span className="quick-icon"><HeartPulse size={22} aria-hidden="true" /></span>
          <span className="quick-text"><small>PARA SEGUIR BEM</small><strong>VIDA NA BR</strong><span>Serviços para a sua jornada</span></span>
          <ArrowUpRight className="quick-arrow" size={19} aria-hidden="true" />
        </button>
      </section>

      <section className="directory-section" id="servicos" aria-labelledby="directory-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> DIRETÓRIO DE SERVIÇOS</div>
            <h2 id="directory-title">Sua viagem, <span>mais segura.</span></h2>
          </div>
          <p>Gente pronta para ajudar<br />quando você mais precisa.</p>
        </div>
        <div className="directory-controls">
          <div className="category-list" role="group" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                className={`category-chip${category === item && feature === 'all' ? ' active' : ''}`}
                key={item}
                type="button"
                onClick={() => { setCategory(item); setFeature('all') }}
                aria-pressed={category === item && feature === 'all'}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="results-count"><strong>{filteredListings.length.toString().padStart(2, '0')}</strong> resultados</span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="listing-grid">
            {filteredListings.map((listing) => <ListingCard key={listing.name} listing={listing} />)}
          </div>
        ) : (
          <div className="empty-results">
            <Search size={22} aria-hidden="true" />
            <strong>Nenhum serviço encontrado</strong>
            <span>Tente outra cidade, rodovia ou categoria.</span>
            <button type="button" onClick={() => { setQuery(''); setCategory('Todas'); setFeature('all') }}>Limpar filtros</button>
          </div>
        )}
        <p className="demo-note">Demonstração: estabelecimentos e contatos são ilustrativos.</p>
      </section>

      <section className="roadside-banner" id="como-funciona">
        <div className="banner-icon"><HeartPulse size={22} aria-hidden="true" /></div>
        <div><span>VAI PEGAR A ESTRADA?</span><h2>Salve este guia. Viaje mais tranquilo.</h2></div>
        <a href="#servicos">Encontrar serviços <ArrowUpRight size={16} aria-hidden="true" /></a>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio" aria-label="BRLista Brasil, voltar ao início">
          <span className="brand-mark"><span /></span>
          <span className="brand-name">BR<span>LISTA</span><small>BRASIL</small></span>
        </a>
        <span>Feito para quem vive a estrada.</span>
        <span className="footer-copyright">© 2026 BRLista Brasil</span>
      </footer>
    </main>
  )
}

export default BrlistaDirectory
