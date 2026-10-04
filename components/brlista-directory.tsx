'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  ArrowUpRight,
  Download,
  HeartPulse,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Search,
  Smartphone,
  X,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada', 'Guincho / Socorro', 'Lavador de Carreta'] as const
type CategoryFilter = typeof categories[number]
type Category = Exclude<CategoryFilter, 'Todas'> | 'Guincho' | 'Lava Jato'

type Place = {
  name: string
  category: Category
  city: string
  road?: string
  phone: string
  service?: string
  icon?: typeof Wrench
}

const places: Place[] = [
  { name: 'GF Mecânica', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99265-6094', service: 'Serviços mecânicos em geral' },
  { name: 'MR Auto Elétrica', category: 'Auto Elétrica', city: 'Araguari', phone: '+55 34 99796-9161', service: 'Socorro elétrico' },
  { name: 'Auto Mecânica Magayver', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99186-6883', service: 'Mecânica geral' },
  { name: 'Auto Mecânica Juninho', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99208-1333', service: 'Manutenção e consertos' },
  { name: 'Mauá Guinchos', category: 'Guincho / Socorro', city: 'Araguari', phone: '+55 34 98810-6577', service: 'Serviço de guincho e reboque' },
  { name: 'Guincho Auto Socorro Baixinho', category: 'Guincho / Socorro', city: 'Araguari', phone: '+55 34 99185-0890', service: 'Auto socorro e reboque' },
  { name: 'Independência Serviço de Guincho', category: 'Guincho / Socorro', city: 'Araguari', phone: '+55 34 98845-0049', service: 'Serviço de guincho 24h' },
  { name: 'Borracharia Móvel Clevin', category: 'Borracharia', city: 'Araguari', phone: '+55 34 99714-8795', service: 'Atendimento móvel de borracharia' },
  { name: 'Borracharia Móvel Araguari Original', category: 'Borracharia', city: 'Araguari', phone: '+55 34 99709-0090', service: 'Socorro de pneus móvel' },
  { name: 'Borracharia do Bryan', category: 'Borracharia', city: 'Araguari', phone: '+55 34 99733-3410', service: 'Conserto de pneus e socorro' },
  { name: 'Borracharia do Ceará', category: 'Borracharia', city: 'Araguari', phone: '+55 34 98825-3999', service: 'Serviços de borracharia' },
  { name: 'Lava Jato de Caminhões BR-050', category: 'Lavador de Carreta', city: 'Araguari', road: 'BR-050', phone: '+55 34 3246-0709', service: 'Lavagem de carretas e caminhões' },
  { name: 'Lava Jato Carrerinha', category: 'Lavador de Carreta', city: 'Araguari', phone: '+55 34 99197-2181', service: 'Lavagem técnica de veículos pesados' },
  { name: 'Machado Lavajato', category: 'Lavador de Carreta', city: 'Araguari', phone: '+55 34 3242-0131', service: 'Lava jato especializado' },
  { name: 'Nunes Borracharia Móvel', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99630-7576', service: 'Borracharia móvel socorro' },
  { name: 'Borracharia Móvel do Flavim', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99680-4931', service: 'Atendimento móvel 24h' },
  { name: 'Borracharia Móvel Irmãos Silva', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99272-5190', service: 'Socorro de pneus para veículos' },
  { name: 'Borracharia do Gil', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 98819-5286', service: 'Conserto e troca de pneus' },
  { name: 'Chaveiro e Borracharia PRIME', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99637-0669', service: 'Serviço de chaveiro e borracharia' },
  { name: 'Auto Mecânica Chumbrega', category: 'Mecânica', city: 'Uberaba', phone: '+55 34 99105-0053', service: 'Oficina mecânica' },
  { name: 'Auto Elétrica Robinho', category: 'Auto Elétrica', city: 'Uberaba', phone: '+55 34 99196-1502', service: 'Serviços elétricos automotivos' },
  { name: 'M Tec Mecatrônica', category: 'Mecânica', city: 'Uberaba', phone: '+55 34 99912-3020', service: 'Mecatrônica e injeção' },
  { name: 'Mecânica Diesel Ribeiro', category: 'Mecânica Pesada', city: 'Uberaba', phone: '+55 34 99636-8153', service: 'Mecânica diesel pesada' },
  { name: 'JK Auto Socorro', category: 'Guincho / Socorro', city: 'Uberaba', phone: '+55 34 99952-2007', service: 'Guincho e resgate' },
  { name: 'Auto Socorro Danilo', category: 'Guincho / Socorro', city: 'Uberaba', phone: '+55 34 99723-9633', service: 'Socorro e reboque' },
  { name: 'Guincho Equipe Auto Socorro', category: 'Guincho / Socorro', city: 'Uberaba', phone: '+55 34 99888-1746', service: 'Equipe de guincho e suporte' },
  { name: 'Borracharia São João', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99627-2006' },
  { name: 'Borracharia Móvel Pit Stop', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99934-9057' },
  { name: 'Borracharia Araguaia', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99972-5734' },
  { name: 'Borracharia Móvel 050', category: 'Borracharia', city: 'Catalão, GO', road: 'BR-050', phone: '(64) 99286-7163' },
  { name: 'Borracharia do Juninho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99225-3950' },
  { name: 'Borracharia Móvel Odilon', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99607-4577' },
  { name: 'Borracharia Móvel do Paulo 24 Horas', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98114-0934' },
  { name: 'Borracharia Skinão Loja 01', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98409-7360' },
  { name: 'Borracharia do Jairinho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98124-5270' },
  { name: 'Borracharia do Elsinho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99964-8809' },
  { name: 'Borracharia J&S', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99986-8444' },
  { name: 'Pit Stop Borrachas e Ferramentas', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99922-5835' },
  { name: 'Borracharia e Soldas JK', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99695-1006' },
  { name: 'Seu Borracha | Borracharia Móvel Uberlândia', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99646-8666' },
  { name: 'Borracharia Móvel do Wesley (Veículos em geral)', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99791-3031' },
  { name: 'Borracharia Móvel 24 Horas GM', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99245-8786' },
  { name: 'Borracharia Móvel Martins 24 Hrs', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99140-8254' },
  { name: 'Borracharia Móvel Rapidão (Unidade 1)', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99874-9766' },
  { name: 'Borracharia Móvel 24h JR', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99885-1986' },
  { name: 'Borracharia Móvel 24H Sammuel', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99724-1320' },
  { name: 'Borracharia Móvel Magrão', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99637-1380' },
  { name: 'Borracharia Móvel do RAFFA', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99316-4535' },
  { name: 'Borracharia Kometa Móvel', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 98837-4438' },
  { name: 'Euro Car Jardim Guanabara', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98635-9905' },
  { name: 'Curinga dos Pneus', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3291-7090' },
  { name: 'Borracharia do Boca 24 Horas', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3274-2323' },
  { name: 'Borracharia 24 Horas Móvel Dia e Noite', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 99331-1571' },
  { name: 'Borracharia J.A. V', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98234-3162' },
  { name: 'Borracharia Pitstop 24HR', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 99294-5939' },
  { name: 'Borracharia J.A. III', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98234-3162' },
  { name: '2 Irmãos Auto Elétrica e Mecânica', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 99820-8546' },
  { name: 'Mecânica e Elétrica Índio (Socorro 24h Goiânia)', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 99863-0815' },
  { name: 'Gel Mecânico 24hs', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 98141-4277' },
  { name: 'Auto Mecânica 24 Horas Divair', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 98574-2567' },
  { name: 'Auto Elétrica Móvel 24hs (Carro e Caminhões)', category: 'Auto Elétrica', city: 'Goiânia, GO', phone: '(62) 99904-9641' },
  { name: 'Mecânico de Caminhão 24 Horas', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99929-1447' },
  { name: 'Socorro Mecânico de Embreagem de Caminhão 24 Horas', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99969-8702' },
  { name: 'Mecânico de Automóveis e Caminhões (Assistência na Estrada 24h)', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99316-3637' },
  { name: 'Auto Elétrica Porto de Santos', category: 'Auto Elétrica', city: 'Santos - SP', road: 'Av. Conselheiro Nébias, 120', phone: '(13) 3221-1001' },
  { name: 'Borracharia do Valongo', category: 'Borracharia', city: 'Santos - SP', road: 'Rua do Terceiro, 45', phone: '(13) 99712-3456' },
  { name: 'Santos Truck Repair', category: 'Mecânica Pesada', city: 'Santos - SP', road: 'Av. Engenheiro Augusto Barata, s/n', phone: '(13) 3232-4000' },
  { name: 'Lava Rápido e Ducha Carretas Alemoa', category: 'Lavador de Carreta', city: 'Santos - SP', road: 'Marginal da Anchieta, Km 64', phone: '(13) 3296-1500' },
  { name: 'Guincho Litoral 24 Horas', category: 'Guincho / Socorro', city: 'Santos - SP', road: 'Atendimento Anchieta/Imigrantes', phone: '(13) 99123-8899' },
  { name: 'Mecânica Diesel Margem Direita', category: 'Mecânica Pesada', city: 'Santos - SP', road: 'Av. Bandeirantes, 800', phone: '(13) 3219-5500' },
  { name: 'Auto Elétrica e Baterias Alemoa', category: 'Auto Elétrica', city: 'Santos - SP', road: 'Rua Amador Bueno, 310', phone: '(13) 3223-9090' },
  { name: 'Borracharia Ponta da Praia', category: 'Borracharia', city: 'Santos - SP', road: 'Av. Mário Covas, 1500', phone: '(13) 98844-1122' },
  { name: 'Wash Truck Porto', category: 'Lavador de Carreta', city: 'Santos - SP', road: 'Av. Ismael Coelho Souza, s/n', phone: '(13) 3299-7070' },
  { name: 'Socorro de Pesados Anchieta', category: 'Guincho / Socorro', city: 'Santos - SP', road: 'Rod. Anchieta, Km 60', phone: '(13) 99655-4321' },
  { name: 'Centro Automotivo Cais do Porto', category: 'Mecânica Pesada', city: 'Santos - SP', road: 'Rua Xavier da Silveira, 88', phone: '(13) 3234-1122' },
  { name: 'Elétrica e Eletrônica Diesel Santos', category: 'Auto Elétrica', city: 'Santos - SP', road: 'Av. Martins Fontes, 1020', phone: '(13) 3291-3344' },
  { name: 'Borracharia 24h Saboó', category: 'Borracharia', city: 'Santos - SP', road: 'Av. Marginal Direita, 250', phone: '(13) 99788-6655' },
  { name: 'Borracharia Bahia (Móvel e Fixa - Socorro de Caminhão)', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 96854-7941', service: 'Socorro de caminhão / Móvel e Fixa' },
  { name: 'Borracharia Móvel 24h (Socorro de Caminhão)', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 98035-7540', service: 'Atendimento 24h / Socorro móvel' },
  { name: 'G2S Borracharia Móvel', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 93200-6357', service: 'Borracharia móvel' },
  { name: 'Borracharia Móvel Alyson', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 95219-7977', service: 'Atendimento 24h / Móvel' },
  { name: 'Borracharia Móvel Du Gui', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 94147-9003', service: 'Socorro 24 Horas' },
  { name: 'Borracharia Negrão Azevedo', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99103-5393', service: 'Borracharia' },
  { name: 'Borracharia 24 Horas', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99155-8692', service: 'Atendimento 24h' },
  { name: 'Borracharia do Bruninho', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99400-1329', service: 'Borracharia' },
  { name: 'IMPAR Borracharia Móvel', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 98199-5756', service: 'Socorro móvel' },
  { name: 'Borracharia Ponto do Pneu', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99422-7029', service: 'Borracharia' },
  { name: 'JP Borracharia Móvel 24 Horas', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99828-6914', service: '24h / Móvel' },
  { name: 'BORRACHARIA MÓVEL EXPRESS', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99812-1032', service: 'Móvel' },
  { name: 'Borracharia Móvel e Fixa do Tiago', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99817-3240', service: 'Móvel' },
  { name: 'Tiãozinho Borracharia Móvel', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99878-2758', service: 'Móvel' },
  { name: 'Borracharia móvel 2 irmãos', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99872-6635', service: 'Móvel' },
  { name: 'Borracharia Barreiro', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99985-5652' },
  { name: 'Mecânico Araxá MG', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 99254-1478' },
  { name: 'S.O.S CAMINHONEIRO OFICINA MOVEL', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 98422-9597', service: 'Móvel / Linha Pesada' },
  { name: 'Tecno Diesel RP Auto Mecânica', category: 'Mecânica Pesada', city: 'Araxá, MG', phone: '(34) 98843-5441', service: 'Linha Pesada' },
  { name: 'Flavio Mecanica Diesel', category: 'Mecânica Pesada', city: 'Araxá, MG', phone: '(34) 98810-5079', service: 'Linha Pesada' },
  { name: 'Sandal Diesel Araxá', category: 'Mecânica Pesada', city: 'Araxá, MG', phone: '(34) 3662-6620', service: 'Linha Pesada' },
  { name: 'PHDiesel araxa', category: 'Mecânica Pesada', city: 'Araxá, MG', phone: '(34) 99231-6669', service: 'Linha Pesada' },
  { name: 'T - Car Diesel', category: 'Mecânica Pesada', city: 'Araxá, MG', phone: '(34) 99773-9133', service: 'Linha Pesada' },
]

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const [showTravelTip, setShowTravelTip] = useState(false)
  const [submissionState, setSubmissionState] = useState<'idle' | 'opened'>('idle')
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installHelpPlatform, setInstallHelpPlatform] = useState<'ios' | 'android' | 'browser' | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const submissionDialogRef = useRef<HTMLDialogElement>(null)
  const installInstructionsDialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const standaloneMedia = window.matchMedia('(display-mode: standalone)')
    const navigatorStandalone = 'standalone' in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
    setIsInstalled(standaloneMedia.matches || navigatorStandalone)

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  function formatPhoneForUrl(phone: string) {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('55')? digits : `55${digits}`
  }

  function formatPhoneForDisplay(phone: string) {
    const d = phone.replace(/\D/g, '').replace(/^55/, '')
    if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
    if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
    return phone
  }

  function safeShowModal(ref: React.RefObject<HTMLDialogElement | null>) {
    if (ref.current &&!ref.current.open) {
      ref.current.showModal()
    }
  }

  function handleInstallClick() {
    const userAgent = window.navigator.userAgent
    const isAppleMobileDevice = /iPhone|iPad|iPod/i.test(userAgent)
      || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

    if (isAppleMobileDevice) {
      setInstallHelpPlatform('ios')
      safeShowModal(installInstructionsDialogRef)
      return
    }

    if (!installPrompt) {
      setInstallHelpPlatform(/Android/i.test(userAgent)? 'android' : 'browser')
      safeShowModal(installInstructionsDialogRef)
      return
    }

    const promptEvent = installPrompt
    setInstallPrompt(null)
    void promptEvent.prompt().then(() => promptEvent.userChoice).then((choice) => {
      if (choice.outcome === 'accepted') {
        setIsInstalled(true)
      }
    }).catch(() => {
      setInstallHelpPlatform(/Android/i.test(userAgent)? 'android' : 'browser')
      safeShowModal(installInstructionsDialogRef)
    })
  }

  function handleSearchChange(value: string) {
    setQuery(value)
    setCurrentPage(1)
  }

  function handleCategoryChange(value: CategoryFilter) {
    setCategory(value)
    setCurrentPage(1)
  }

  function handleClearFilters() {
    setQuery('')
    setCategory('Todas')
    setCurrentPage(1)
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    searchInputRef.current?.blur()
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key!== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    searchInputRef.current?.blur()
  }

  function handleServiceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const getValue = (field: string) => String(formData.get(field)?? '').trim()
    const message = [
      'Olá! Gostaria de cadastrar meu negócio no BRLista Brasil:',
      `• Nome do Negócio: ${getValue('name')}`,
      `• Categoria: ${getValue('category')}`,
      `• Cidade: ${getValue('city')}`,
      `• Telefone/WhatsApp: ${getValue('phone')}`,
      `• Descrição: ${getValue('description')}`,
    ].join('\n')
    const whatsappUrl = `https://wa.me/5534988171945?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setSubmissionState('opened')
  }

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
    return places.filter((place) => {
      const matchesCategory = category === 'Todas' || place.category === category
      if (!normalizedQuery) return matchesCategory
      const searchableText = `${place.name} ${place.category} ${place.city} ${place.road?? ''}`.toLocaleLowerCase('pt-BR')
      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [category, query])

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage)
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <main className="min-h-screen bg-[#10110f] text-[#f6f4ed]">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="BRLista Brasil, início">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#ffd43b] text-[#171711]">
              <Navigation className="size-5" strokeWidth={2.7} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-black tracking-[-0.06em]">BRLISTA <span className="text-[#ffd43b]">BRASIL</span></span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Seu apoio na estrada</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setSubmissionState('idle'); safeShowModal(submissionDialogRef) }}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#ffd43b] px-3.5 text-xs font-bold text-[#171711] transition hover:bg-[#ffe06a] sm:px-4"
            >
              <Plus className="size-4" /> Cadastrar Empresa/Serviço
            </button>
            <a href="#estabelecimentos" className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-[#ffd43b]/50 hover:text-[#ffd43b] sm:flex">
              Explorar serviços <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden border-b border-white/[0.07]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#ffd43b]/[0.07] blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 pb-9 pt-11 sm:px-8 sm:pb-12 sm:pt-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffd43b]/20 bg-[#ffd43b]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#ffd43b]">
            <span className="size-1.5 rounded-full bg-[#ffd43b]" /> Guia de serviços rodoviários
          </div>
          <h1 className="max-w-2xl text-[2.5rem] font-black leading-[0.98] tracking-[-0.065em] sm:text-6xl">
            A estrada não espera.<br /> <span className="text-[#ffd43b]">Encontre ajuda.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
            Encontre borracharias, mecânicos, guinchos e socorro rodoviário 24h nas principais rodovias e cidades do Brasil.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-7 max-w-xl">
            <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-[#191a17] px-4 transition focus-within:border-[#ffd43b]/60">
              <Search className="size-5 shrink-0 text-[#ffd43b]" aria-hidden="true" />
              <span className="sr-only">Buscar por cidade, rodovia ou serviço</span>
              <input
                ref={searchInputRef}
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(event) => handleSearchChange(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Cidade, rodovia ou serviço..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </label>
          </form>

          {!isInstalled && (
            <aside aria-label="Instale o app do BRLista na sua tela inicial" className="mt-4 max-w-xl rounded-2xl border border-[#ffd43b]/15 bg-[#171815] p-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd43b]/10 text-[#ffd43b]">
                  <Smartphone className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">Instale o app do BRLista na sua tela inicial</p>
                  <p className="mt-1 text-[10px] text-white/45">Acesso rápido ao diretório, onde estiver.</p>
                </div>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  aria-haspopup="dialog"
                  aria-controls="install-instructions"
                  className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#ffd43b]/30 px-3 text-[11px] font-bold text-[#ffd43b] transition hover:border-[#ffd43b]/60 hover:bg-[#ffd43b]/[0.08]"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  {installPrompt? 'Instalar Agora' : 'Baixar App'}
                </button>
              </div>
            </aside>
          )}

          <div className="mt-5 grid max-w-3xl grid-cols-2 gap-3">
            <a
              href="#estabelecimentos"
              className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-[#ffcc00]/20 bg-[#121212] px-4 text-left transition hover:border-[#ffcc00]/40 hover:bg-[#121212]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffcc00]/10 text-[#ffcc00]"><Wrench className="size-5" /></span>
              <span className="min-w-0"><span className="block text-xs font-black tracking-wide text-[#ffcc00] sm:text-sm">SERVIÇOS NA ESTRADA</span><span className="mt-1 block text-[10px] text-white/45 sm:text-xs">Catalão, Uberlândia, Goiânia e Santos</span></span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-[#ffcc00]/55 transition group-hover:text-[#ffcc00]" />
            </a>
            <button
              type="button"
              onClick={() => setShowTravelTip((show) =>!show)}
              aria-expanded={showTravelTip}
              className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 text-left transition ${showTravelTip? 'border-[#ffd43b]/50 bg-[#ffd43b]/[0.12]' : 'border-[#ffd43b]/20 bg-[#ffd43b]/[0.05] hover:bg-[#ffd43b]/[0.1]'}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd43b]/10 text-[#ffd43b]"><HeartPulse className="size-5" /></span>
              <span className="min-w-0"><span className="block text-xs font-black tracking-wide text-[#ffd43b] sm:text-sm">VIDA NA BR</span><span className="mt-1 block text-[10px] text-white/45 sm:text-xs">Dicas para uma viagem segura</span></span>
              <ArrowUpRight className="ml-auto size-4 shrink-0 text-white/35 transition group-hover:text-[#ffd43b]" />
            </button>
          </div>
          {showTravelTip && (
            <aside className="mt-3 flex max-w-3xl gap-3 rounded-2xl border border-[#ffd43b]/15 bg-[#ffd43b]/[0.06] p-4 text-sm leading-6 text-white/70" aria-live="polite">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#ffd43b]" />
              <p><strong className="text-white">Antes de pegar a estrada:</strong> confira pneus, combustível e documentação; programe pausas e compartilhe seu trajeto com alguém de confiança.</p>
            </aside>
          )}
        </div>
      </section>

      <section id="estabelecimentos" className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd43b]/75">Diretório de apoio</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.045em] sm:text-3xl">Encontre o que precisa</h2>
            <p className="mt-1.5 text-xs text-white/45">{filteredPlaces.length} {filteredPlaces.length === 1? 'estabelecimento encontrado' : 'estabelecimentos encontrados'}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleCategoryChange(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${category === item? 'border-[#ffd43b] bg-[#ffd43b] text-[#191a17]' : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white'}`}
              >{item}</button>
            ))}
          </div>
        </div>

        {filteredPlaces.length > 0? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {paginatedPlaces.map((place, index) => {
                const IconComponent = place.icon?? Wrench
                const phoneDigits = formatPhoneForUrl(place.phone)
                return (
                  <article key={`${place.name}-${place.phone}-${index}`} className="rounded-[20px] border border-white/[0.09] bg-[#171815] p-4 transition hover:border-white/[0.16] sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-[#ffd43b]/15 bg-[#ffd43b]/[0.07] text-[#ffd43b]"><IconComponent className="size-5" /></span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold tracking-[-0.02em] text-white sm:text-base">{place.name}</h3>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffd43b]/80">{place.category}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] pt-3 text-xs text-white/50">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-white/35" />{place.city}</span>
                      {place.road && <span>{place.road}</span>}
                      {place.service && <span>{place.service}</span>}
                    </div>
                    <a href={`tel:+${phoneDigits}`} className="mt-4 block rounded-xl bg-[#20211d] px-3 py-3 text-center text-lg font-black tracking-wide text-[#ffd43b] transition hover:bg-[#272821]">{formatPhoneForDisplay(place.phone)}</a>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <a href={`tel:+${phoneDigits}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffd43b] px-3 text-[10px] font-black tracking-[0.07em] text-[#191a17] transition hover:bg-[#ffe06a]"><Phone className="size-4" /> LIGAR AGORA</a>
                      <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ffd43b]/35 bg-[#ffd43b]/[0.07] px-3 text-[10px] font-black tracking-[0.07em] text-[#ffd43b] transition hover:bg-[#ffd43b]/[0.14]"><MessageCircle className="size-4" /> WHATSAPP</a>
                    </div>
                  </article>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white transition hover:border-[#ffd43b]/50 disabled:opacity-40">Anterior</button>
                <span className="text-xs text-white/50">Página {currentPage} de {totalPages}</span>
                <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white transition hover:border-[#ffd43b]/50 disabled:opacity-40">Próxima</button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#171815] p-8 text-center">
            <p className="text-base font-bold text-white">Nenhum resultado encontrado</p>
            <p className="mt-1 text-xs text-white/50">Tente buscar por termos diferentes ou limpar os filtros aplicados.</p>
            <button type="button" onClick={handleClearFilters} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#ffd43b] px-4 text-xs font-bold text-[#171711] transition hover:bg-[#ffe06a]">Limpar Filtros</button>
          </div>
        )}
      </section>

      <dialog ref={submissionDialogRef} className="rounded-2xl border border-white/10 bg-[#171815] p-6 text-[#f6f4ed] backdrop:bg-black/75 max-w-lg w-full">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold">Cadastrar Empresa ou Serviço</h3>
          <button type="button" onClick={() => submissionDialogRef.current?.close()} className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"><X className="size-5" /></button>
        </div>
        {submissionState === 'opened'? (
          <div className="py-6 text-center">
            <p className="text-sm text-white/80">O seu pedido foi aberto no WhatsApp!</p>
            <p className="mt-2 text-xs text-white/50">Envie a mensagem gerada para concluirmos o seu cadastro.</p>
            <button type="button" onClick={() => submissionDialogRef.current?.close()} className="mt-6 w-full rounded-xl bg-[#ffd43b] py-2.5 text-xs font-bold text-[#171711]">Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleServiceSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Nome do Negócio</label>
              <input required name="name" type="text" className="w-full rounded-xl border border-white/10 bg-[#10110f] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd43b]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Categoria</label>
              <select required name="category" className="w-full rounded-xl border border-white/10 bg-[#10110f] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd43b]">
                {categories.filter((c) => c!== 'Todas').map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Cidade / Estado</label>
              <input required name="city" type="text" placeholder="Ex: Araguari, MG" className="w-full rounded-xl border border-white/10 bg-[#10110f] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd43b]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Telefone / WhatsApp</label>
              <input required name="phone" type="tel" placeholder="(00) 00000-0000" className="w-full rounded-xl border border-white/10 bg-[#10110f] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd43b]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Descrição (opcional)</label>
              <textarea name="description" rows={3} className="w-full rounded-xl border border-white/10 bg-[#10110f] px-3 py-2 text-sm text-white outline-none focus:border-[#ffd43b]" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-[#ffd43b] py-3 text-xs font-bold text-[#171711] transition hover:bg-[#ffe06a]">Enviar via WhatsApp</button>
          </form>
        )}
      </dialog>

      <dialog id="install-instructions" ref={installInstructionsDialogRef} className="rounded-2xl border border-white/10 bg-[#171815] p-6 text-[#f6f4ed] backdrop:bg-black/75 max-w-md w-full">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-lg font-bold">Como Instalar o App</h3>
          <button type="button" onClick={() => installInstructionsDialogRef.current?.close()} className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"><X className="size-5" /></button>
        </div>
        <div className="mt-4 space-y-3 text-sm text-white/80">
          {installHelpPlatform === 'ios'? (
            <ol className="list-decimal list-inside space-y-2">
              <li>Toque no botão de <strong>Compartilhar</strong> no Safari.</li>
              <li>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</li>
              <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
            </ol>
          ) : (
            <ol className="list-decimal list-inside space-y-2">
              <li>Toque no menu do navegador (três pontos no canto superior).</li>
              <li>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</li>
              <li>Confirme para adicionar o atalho.</li>
            </ol>
          )}
        </div>
        <button type="button" onClick={() => installInstructionsDialogRef.current?.close()} className="mt-6 w-full rounded-xl bg-[#ffd43b] py-2.5 text-xs font-bold text-[#171711]">Entendido</button>
      </dialog>
    </main>
  )
}
