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

type Category = 'Borracharia' | 'Mecânica' | 'Auto Elétrica' | 'Mecânica Pesada' | 'Guincho / Socorro' | 'Lavador de Carreta'
type Place = {
  name: string
  category: Category
  city: string
  road?: string
  phone: string
  service?: string
  icon: typeof Wrench
}

const places: Place[] = [// Araguari MG - Mecânica, Auto Elétrica e Guinchos
  { name: 'GF Mecânica', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99265-6094', service: 'Serviços mecânicos em geral' },
  { name: 'MR Auto Elétrica', category: 'Auto Elétrica', city: 'Araguari', phone: '+55 34 99796-9161', service: 'Socorro elétrico' },
  { name: 'Auto Mecânica Magayver', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99186-6883', service: 'Mecânica geral' },
  { name: 'Auto Mecânica Juninho', category: 'Mecânica', city: 'Araguari', phone: '+55 34 99208-1333', service: 'Manutenção e consertos' },
  { name: 'Mauá Guinchos', category: 'Guincho', city: 'Araguari', phone: '+55 34 98810-6577', service: 'Serviço de guincho e reboque' },
  { name: 'Guincho Auto Socorro Baixinho', category: 'Guincho', city: 'Araguari', phone: '+55 34 99185-0890', service: 'Auto socorro e reboque' },
  { name: 'Independência Serviço de Guincho', category: 'Guincho', city: 'Araguari', phone: '+55 34 98845-0049', service: 'Serviço de guincho 24h' },

  // Araguari MG - Borracharias e Lava Jato
  { name: 'Borracharia Móvel Clevin', category: 'Borracharia', city: 'Araguari', phone: '+55 34 99714-8795', service: 'Atendimento móvel de borracharia' },
  { name: 'Borracharia Móvel Araguari Original', category: 'Borracharia', city: 'Araguari', phone: '+55 34 99709-0090', service: 'Socorro de pneus móvel' },
  { name: 'Borracharia do Bryan', category: 'Borracharia', city: 'Araguari', phone: '+55 34 99733-3410', service: 'Conserto de pneus e socorro' },
  { name: 'Borracharia do Ceará', category: 'Borracharia', city: 'Araguari', phone: '+55 34 98825-3999', service: 'Serviços de borracharia' },
  { name: 'Lava Jato de Caminhões BR-050', category: 'Lava Jato', city: 'Araguari', road: 'BR-050', phone: '+55 34 3246-0709', service: 'Lavagem de carretas e caminhões' },
  { name: 'Lava Jato Carrerinha', category: 'Lava Jato', city: 'Araguari', phone: '+55 34 99197-2181', service: 'Lavagem técnica de veículos pesados' },
  { name: 'Machado\'s Lavajato', category: 'Lava Jato', city: 'Araguari', phone: '+55 34 3242-0131', service: 'Lava jato especializado' },

  // Uberaba MG - Borracharias
  { name: 'Nunes Borracharia Móvel', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99630-7576', service: 'Borracharia móvel socorro' },
  { name: 'Borracharia Móvel do Flavim', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99680-4931', service: 'Atendimento móvel 24h' },
  { name: 'Borracharia Móvel Irmãos Silva', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99272-5190', service: 'Socorro de pneus para veículos' },
  { name: 'Borracharia do Gil', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 98819-5286', service: 'Conserto e troca de pneus' },
  { name: 'Chaveiro e Borracharia PRIME', category: 'Borracharia', city: 'Uberaba', phone: '+55 34 99637-0669', service: 'Serviço de chaveiro e borracharia' },

  // Uberaba MG - Mecânica, Auto Elétrica e Guinchos
  { name: 'Auto Mecânica Chumbrega', category: 'Mecânica', city: 'Uberaba', phone: '+55 34 99105-0053', service: 'Oficina mecânica' },
  { name: 'Auto Elétrica Robinho', category: 'Auto Elétrica', city: 'Uberaba', phone: '+55 34 99196-1502', service: 'Serviços elétricos automotivos' },
  { name: 'M Tec Mecatrônica', category: 'Mecânica', city: 'Uberaba', phone: '+55 34 99912-3020', service: 'Mecatrônica e injeção' },
  { name: 'Mecânica Diesel Ribeiro', category: 'Mecânica', city: 'Uberaba', phone: '+55 34 99636-8153', service: 'Mecânica diesel pesada' },
  { name: 'JK Auto Socorro', category: 'Guincho', city: 'Uberaba', phone: '+55 34 99952-2007', service: 'Guincho e resgate' },
  { name: 'Auto Socorro Danilo', category: 'Guincho', city: 'Uberaba', phone: '+55 34 99723-9633', service: 'Socorro e reboque' },
  { name: 'Guincho Equipe Auto Socorro', category: 'Guincho', city: 'Uberaba', phone: '+55 34 99888-1746', service: 'Equipe de guincho e suporte' },
  { name: 'Borracharia São João', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99627-2006', icon: Wrench },
  { name: 'Borracharia Móvel Pit Stop', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99934-9057', icon: Wrench },
  { name: 'Borracharia Araguaia', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99972-5734', icon: Wrench },
  { name: 'Borracharia Móvel 050', category: 'Borracharia', city: 'Catalão, GO', road: 'BR-050', phone: '(64) 99286-7163', icon: Wrench },
  { name: 'Borracharia do Juninho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99225-3950', icon: Wrench },
  { name: 'Borracharia Móvel Odilon', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99607-4577', icon: Wrench },
  { name: 'Borracharia Móvel do Paulo 24 Horas', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98114-0934', icon: Wrench },
  { name: 'Borracharia Skinão Loja 01', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98409-7360', icon: Wrench },
  { name: 'Borracharia do Jairinho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 98124-5270', icon: Wrench },
  { name: 'Borracharia do Elsinho', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99964-8809', icon: Wrench },
  { name: 'Borracharia J&S', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99986-8444', icon: Wrench },
  { name: 'Pit Stop Borrachas e Ferramentas', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99922-5835', icon: Wrench },
  { name: 'Borracharia e Soldas JK', category: 'Borracharia', city: 'Catalão, GO', phone: '(64) 99695-1006', icon: Wrench },
  { name: 'Seu Borracha | Borracharia Móvel Uberlândia', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99646-8666', icon: Wrench },
  { name: 'Borracharia Móvel do Wesley (Veículos em geral)', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99791-3031', icon: Wrench },
  { name: 'Borracharia Móvel 24 Horas GM', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99245-8786', icon: Wrench },
  { name: 'Borracharia Móvel Martins 24 Hrs', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99140-8254', icon: Wrench },
  { name: 'Borracharia Móvel Rapidão (Unidade 1)', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99874-9766', icon: Wrench },
  { name: 'Borracharia Móvel 24h JR', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99885-1986', icon: Wrench },
  { name: 'Borracharia Móvel 24H Sammuel', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99724-1320', icon: Wrench },
  { name: 'Borracharia Móvel Magrão', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99637-1380', icon: Wrench },
  { name: 'Borracharia Móvel do RAFFA', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99316-4535', icon: Wrench },
  { name: 'Borracharia Kometa Móvel', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 98837-4438', icon: Wrench },
  { name: 'Euro Car Jardim Guanabara', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98635-9905', icon: Wrench },
  { name: 'Curinga dos Pneus', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3291-7090', icon: Wrench },
  { name: 'Borracharia do Boca 24 Horas', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 3274-2323', icon: Wrench },
  { name: 'Borracharia 24 Horas Móvel Dia e Noite', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 99331-1571', icon: Wrench },
  { name: 'Borracharia J.A. V', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98234-3162', icon: Wrench },
  { name: 'Borracharia Pitstop 24HR', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 99294-5939', icon: Wrench },
  { name: 'Borracharia J.A. III', category: 'Borracharia', city: 'Goiânia, GO', phone: '(62) 98234-3162', icon: Wrench },
  { name: '2 Irmãos Auto Elétrica e Mecânica', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 99820-8546', icon: Wrench },
  { name: 'Mecânica e Elétrica Índio (Socorro 24h Goiânia)', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 99863-0815', icon: Wrench },
  { name: 'Gel Mecânico 24hs', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 98141-4277', icon: Wrench },
  { name: 'Auto Mecânica 24 Horas Divair', category: 'Mecânica', city: 'Goiânia, GO', phone: '(62) 98574-2567', icon: Wrench },
  { name: 'Auto Elétrica Móvel 24hs (Carro e Caminhões)', category: 'Auto Elétrica', city: 'Goiânia, GO', phone: '(62) 99904-9641', icon: Wrench },
  { name: 'Mecânico de Caminhão 24 Horas', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99929-1447', icon: Wrench },
  { name: 'Socorro Mecânico de Embreagem de Caminhão 24 Horas', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99969-8702', icon: Wrench },
  { name: 'Mecânico de Automóveis e Caminhões (Assistência na Estrada 24h)', category: 'Mecânica Pesada', city: 'Goiânia, GO', phone: '(62) 99316-3637', icon: Wrench },
  { name: 'Auto Elétrica Porto de Santos', category: 'Auto Elétrica', city: 'Santos - SP', road: 'Av. Conselheiro Nébias, 120', phone: '(13) 3221-1001', icon: Wrench },
  { name: 'Borracharia do Valongo', category: 'Borracharia', city: 'Santos - SP', road: 'Rua do Terceiro, 45', phone: '(13) 99712-3456', icon: Wrench },
  { name: 'Santos Truck Repair', category: 'Mecânica Pesada', city: 'Santos - SP', road: 'Av. Engenheiro Augusto Barata, s/n', phone: '(13) 3232-4000', icon: Wrench },
  { name: 'Lava Rápido e Ducha Carretas Alemoa', category: 'Lavador de Carreta', city: 'Santos - SP', road: 'Marginal da Anchieta, Km 64', phone: '(13) 3296-1500', icon: Wrench },
  { name: 'Guincho Litoral 24 Horas', category: 'Guincho / Socorro', city: 'Santos - SP', road: 'Atendimento Anchieta/Imigrantes', phone: '(13) 99123-8899', icon: Wrench },
  { name: 'Mecânica Diesel Margem Direita', category: 'Mecânica Pesada', city: 'Santos - SP', road: 'Av. Bandeirantes, 800', phone: '(13) 3219-5500', icon: Wrench },
  { name: 'Auto Elétrica e Baterias Alemoa', category: 'Auto Elétrica', city: 'Santos - SP', road: 'Rua Amador Bueno, 310', phone: '(13) 3223-9090', icon: Wrench },
  { name: 'Borracharia Ponta da Praia', category: 'Borracharia', city: 'Santos - SP', road: 'Av. Mário Covas, 1500', phone: '(13) 98844-1122', icon: Wrench },
  { name: 'Wash Truck Porto', category: 'Lavador de Carreta', city: 'Santos - SP', road: 'Av. Ismael Coelho Souza, s/n', phone: '(13) 3299-7070', icon: Wrench },
  { name: 'Socorro de Pesados Anchieta', category: 'Guincho / Socorro', city: 'Santos - SP', road: 'Rod. Anchieta, Km 60', phone: '(13) 99655-4321', icon: Wrench },
  { name: 'Centro Automotivo Cais do Porto', category: 'Mecânica Pesada', city: 'Santos - SP', road: 'Rua Xavier da Silveira, 88', phone: '(13) 3234-1122', icon: Wrench },
  { name: 'Elétrica e Eletrônica Diesel Santos', category: 'Auto Elétrica', city: 'Santos - SP', road: 'Av. Martins Fontes, 1020', phone: '(13) 3291-3344', icon: Wrench },
  { name: 'Borracharia 24h Saboó', category: 'Borracharia', city: 'Santos - SP', road: 'Av. Marginal Direita, 250', phone: '(13) 99788-6655', icon: Wrench },
  { name: 'Borracharia Bahia (Móvel e Fixa - Socorro de Caminhão)', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 96854-7941', service: 'Socorro de caminhão / Móvel e Fixa', icon: Wrench },
  { name: 'Borracharia Móvel 24h (Socorro de Caminhão)', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 98035-7540', service: 'Atendimento 24h / Socorro móvel', icon: Wrench },
  { name: 'G2S Borracharia Móvel', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 93200-6357', service: 'Borracharia móvel', icon: Wrench },
  { name: 'Borracharia Móvel Alyson', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 95219-7977', service: 'Atendimento 24h / Móvel', icon: Wrench },
  { name: 'Borracharia Móvel Du Gui', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 94147-9003', service: 'Socorro 24 Horas', icon: Wrench },
  { name: 'Borracharia Negrão Azevedo', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99103-5393', service: 'Borracharia', icon: Wrench },
  { name: 'Borracharia 24 Horas', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99155-8692', service: 'Atendimento 24h', icon: Wrench },
  { name: 'Borracharia do Bruninho', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99400-1329', service: 'Borracharia', icon: Wrench },
  { name: 'IMPAR Borracharia Móvel', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 98199-5756', service: 'Socorro móvel', icon: Wrench },
  { name: 'Borracharia Ponto do Pneu', category: 'Borracharia', city: 'Ribeirão Preto, SP', phone: '(16) 99422-7029', service: 'Borracharia', icon: Wrench },
  { name: 'JP Borracharia Móvel 24 Horas', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99828-6914', service: '24h / Móvel', icon: Wrench },
  { name: 'BORRACHARIA MÓVEL EXPRESS', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99812-1032', service: 'Móvel', icon: Wrench },
  { name: 'Borracharia Móvel e Fixa do Tiago', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99817-3240', service: 'Móvel', icon: Wrench },
  { name: 'Tiãozinho Borracharia Móvel', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99878-2758', service: 'Móvel', icon: Wrench },
  { name: 'Borracharia móvel 2 irmãos', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99872-6635', service: 'Móvel', icon: Wrench },
  { name: 'Borracharia Barreiro', category: 'Borracharia', city: 'Araxá, MG', phone: '(34) 99985-5652', icon: Wrench },
  { name: 'Mecânico Araxá MG', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 99254-1478', icon: Wrench },
  { name: 'S.O.S CAMINHONEIRO OFICINA MOVEL', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 98422-9597', service: 'Móvel / Linha Pesada', icon: Wrench },
  { name: 'Tecno Diesel RP Auto Mecânica', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 98843-5441', service: 'Linha Pesada', icon: Wrench },
  { name: 'Flavio Mecanica Diesel', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 98810-5079', service: 'Linha Pesada', icon: Wrench },
  { name: 'Sandal Diesel Araxá', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 3662-6620', service: 'Linha Pesada', icon: Wrench },
  { name: 'PHDiesel araxa', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 99231-6669', service: 'Linha Pesada', icon: Wrench },
  { name: 'T - Car Diesel', category: 'Mecânica', city: 'Araxá, MG', phone: '(34) 99773-9133', service: 'Linha Pesada', icon: Wrench },
]

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada', 'Guincho / Socorro', 'Lavador de Carreta'] as const

type CategoryFilter = (typeof categories)[number]
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
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      void navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  function handleInstallClick() {
    const userAgent = window.navigator.userAgent
    const isAppleMobileDevice = /iPhone|iPad|iPod/i.test(userAgent)
      || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

    if (isAppleMobileDevice) {
      setInstallHelpPlatform('ios')
      installInstructionsDialogRef.current?.showModal()
      return
    }

    if (!installPrompt) {
      setInstallHelpPlatform(/Android/i.test(userAgent) ? 'android' : 'browser')
      installInstructionsDialogRef.current?.showModal()
      return
    }

    const promptEvent = installPrompt
    setInstallPrompt(null)
    void promptEvent.prompt().then(() => promptEvent.userChoice).then((choice) => {
      if (choice.outcome === 'accepted') {
        setIsInstalled(true)
      }
    }).catch(() => {
      setInstallHelpPlatform(/Android/i.test(userAgent) ? 'android' : 'browser')
      installInstructionsDialogRef.current?.showModal()
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
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    searchInputRef.current?.blur()
  }

  function handleServiceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const getValue = (field: string) => String(formData.get(field) ?? '').trim()
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
      const searchableText = `${place.name} ${place.category} ${place.city} ${place.road ?? ''}`.toLocaleLowerCase('pt-BR')
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
              onClick={() => { setSubmissionState('idle'); submissionDialogRef.current?.showModal() }}
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
                  {installPrompt ? 'Instalar Agora' : 'Baixar App'}
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
              onClick={() => setShowTravelTip((show) => !show)}
              aria-expanded={showTravelTip}
              className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 text-left transition ${showTravelTip ? 'border-[#ffd43b]/50 bg-[#ffd43b]/[0.12]' : 'border-[#ffd43b]/20 bg-[#ffd43b]/[0.05] hover:bg-[#ffd43b]/[0.1]'}`}
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
            <p className="mt-1.5 text-xs text-white/45">{filteredPlaces.length} {filteredPlaces.length === 1 ? 'estabelecimento encontrado' : 'estabelecimentos encontrados'}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleCategoryChange(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${category === item ? 'border-[#ffd43b] bg-[#ffd43b] text-[#191a17]' : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white'}`}
              >{item}</button>
            ))}
          </div>
        </div>

        {filteredPlaces.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {paginatedPlaces.map((place) => {
              const Icon = place.icon
              return (
                <article key={place.name} className="rounded-[20px] border border-white/[0.09] bg-[#171815] p-4 transition hover:border-white/[0.16] sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-[#ffd43b]/15 bg-[#ffd43b]/[0.07] text-[#ffd43b]"><Icon className="size-5" /></span>
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
                  <a href={`tel:+55${place.phone.replace(/\D/g, '')}`} className="mt-4 block rounded-xl bg-[#20211d] px-3 py-3 text-center text-lg font-black tracking-wide text-[#ffd43b] transition hover:bg-[#272821] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b]">{place.phone}</a>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <a href={`tel:+55${place.phone.replace(/\D/g, '')}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffd43b] px-3 text-[10px] font-black tracking-[0.07em] text-[#191a17] transition hover:bg-[#ffe06a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Phone className="size-4" /> LIGAR AGORA</a>
                    <a href={`https://wa.me/55${place.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#ffd43b]/35 bg-[#ffd43b]/[0.07] px-3 text-[10px] font-black tracking-[0.07em] text-[#ffd43b] transition hover:bg-[#ffd43b]/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><MessageCircle className="size-4" /> WHATSAPP</a>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-[20px] border border-dashed border-white/15 px-5 py-12 text-center">
            <Search className="mx-auto size-7 text-white/25" />
            <h3 className="mt-3 font-bold">Nenhum serviço encontrado</h3>
            <p className="mt-1 text-sm text-white/45">Tente outro termo ou escolha uma categoria diferente.</p>
            <button type="button" onClick={handleClearFilters} className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 hover:border-[#ffd43b]/50 hover:text-[#ffd43b]">Limpar filtros</button>
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Paginação dos estabelecimentos" className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="min-h-10 rounded-full border border-white/10 px-4 text-xs font-semibold text-white/75 transition hover:border-[#ffd43b]/50 hover:text-[#ffd43b] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Anterior
            </button>
            <div className="flex items-center gap-1" aria-label="Páginas">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Página ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`size-10 rounded-full text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd43b] ${currentPage === page ? 'bg-[#ffd43b] text-[#191a17]' : 'border border-white/10 text-white/65 hover:border-[#ffd43b]/50 hover:text-[#ffd43b]'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="min-h-10 rounded-full border border-white/10 px-4 text-xs font-semibold text-white/75 transition hover:border-[#ffd43b]/50 hover:text-[#ffd43b] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Próxima
            </button>
            <span className="sr-only" aria-live="polite">Página {currentPage} de {totalPages}</span>
          </nav>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-[10px] leading-5 text-white/40 sm:text-xs">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" /> Confirme a disponibilidade do atendimento diretamente com o estabelecimento antes de se deslocar.
        </p>
      </section>

      <dialog
        ref={submissionDialogRef}
        aria-labelledby="submission-title"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}
        onClose={() => setSubmissionState('idle')}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#171815] p-0 text-[#f6f4ed] shadow-2xl backdrop:bg-black/80"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd43b]/75">Ajude quem está na estrada</p>
            <h2 id="submission-title" className="mt-1 text-xl font-extrabold tracking-tight">Cadastrar Empresa/Serviço</h2>
            <p className="mt-1 text-xs leading-5 text-white/50">Preencha os dados e envie o cadastro pelo WhatsApp.</p>
          </div>
          <button type="button" onClick={() => submissionDialogRef.current?.close()} aria-label="Fechar formulário" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-white/25 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        {submissionState === 'opened' ? (
          <div className="px-5 py-8 text-center sm:px-6">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#ffd43b]/10 text-[#ffd43b]"><ShieldCheck className="size-6" /></span>
            <h3 className="mt-4 text-lg font-bold">Revise e envie no WhatsApp</h3>
            <p role="status" className="mt-2 text-sm leading-6 text-white/55">A conversa com o BRLista Brasil foi aberta em uma nova aba. Confira a mensagem e toque em enviar para concluir o cadastro.</p>
            <button type="button" onClick={() => submissionDialogRef.current?.close()} className="mt-6 min-h-11 rounded-xl bg-[#ffd43b] px-5 text-sm font-bold text-[#171711] transition hover:bg-[#ffe06a]">Concluir</button>
          </div>
        ) : (
          <form onSubmit={handleServiceSubmit} className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-white/75" htmlFor="service-name">
              Nome do Negócio
              <input id="service-name" name="name" required minLength={2} maxLength={120} autoComplete="organization" placeholder="Ex.: Borracharia da Estrada" className="min-h-11 rounded-xl border border-white/10 bg-[#10110f] px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ffd43b]/60" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-white/75" htmlFor="service-category">
                Categoria
                <select id="service-category" name="category" required defaultValue="Borracharia" className="min-h-11 rounded-xl border border-white/10 bg-[#10110f] px-3 text-sm text-white outline-none focus:border-[#ffd43b]/60">
                  {categories.filter((item) => item !== 'Todas').map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-white/75" htmlFor="service-city">
                Cidade e estado
                <input id="service-city" name="city" required minLength={2} maxLength={100} autoComplete="address-level2" placeholder="Ex.: Santos - SP" className="min-h-11 rounded-xl border border-white/10 bg-[#10110f] px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ffd43b]/60" />
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-white/75" htmlFor="service-description">
              Descrição
              <textarea id="service-description" name="description" required minLength={5} maxLength={500} rows={3} placeholder="Conte um pouco sobre os serviços oferecidos" className="min-h-24 resize-y rounded-xl border border-white/10 bg-[#10110f] px-3 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ffd43b]/60" />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-white/75" htmlFor="service-phone">
              Telefone/WhatsApp
              <input id="service-phone" name="phone" type="tel" inputMode="tel" required maxLength={32} autoComplete="tel" placeholder="(34) 99999-9999" className="min-h-11 rounded-xl border border-white/10 bg-[#10110f] px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ffd43b]/60" />
            </label>
            <p className="text-[11px] leading-5 text-white/40">Ao clicar em enviar, o WhatsApp abrirá com os dados preenchidos. Depois, basta confirmar o envio na conversa.</p>
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffd43b] px-4 text-sm font-black text-[#171711] transition hover:bg-[#ffe06a]">
              <MessageCircle className="size-4" /> Enviar Cadastro
            </button>
          </form>
        )}
      </dialog>

      <dialog
        ref={installInstructionsDialogRef}
        aria-labelledby="install-instructions-title"
        onClick={(event) => {
          if (event.target === installInstructionsDialogRef.current) {
            installInstructionsDialogRef.current?.close()
          }
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-white/10 bg-[#171815] p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd43b]/75">BRLista Brasil</p>
            <h2 id="install-instructions-title" className="mt-1 text-lg font-extrabold tracking-tight">
              {installHelpPlatform === 'ios' ? 'Instale no iPhone ou iPad' : 'Instale o app BRLista'}
            </h2>
          </div>
          <button type="button" onClick={() => installInstructionsDialogRef.current?.close()} aria-label="Fechar instruções" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-white/25 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
        <div id="install-instructions" className="flex flex-col gap-4 px-5 py-5 text-sm leading-6 text-white/70">
          {installHelpPlatform === 'ios' ? (
            <>
              <p>A Apple não permite abrir a instalação diretamente. No Safari:</p>
              <ol className="flex flex-col gap-3">
                <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ffd43b]/10 text-xs font-bold text-[#ffd43b]">1</span><span>Toque em <strong className="text-white">Compartilhar</strong>, na barra do Safari.</span></li>
                <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ffd43b]/10 text-xs font-bold text-[#ffd43b]">2</span><span>Role o menu e escolha <strong className="text-white">Adicionar à Tela de Início</strong>.</span></li>
                <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ffd43b]/10 text-xs font-bold text-[#ffd43b]">3</span><span>Toque em <strong className="text-white">Adicionar</strong> para concluir.</span></li>
              </ol>
            </>
          ) : installHelpPlatform === 'android' ? (
            <p>Abra o menu do Chrome e toque em <strong className="text-white">Instalar app</strong> ou <strong className="text-white">Adicionar à tela inicial</strong>.</p>
          ) : (
            <p>Abra o menu de compartilhamento ou do navegador e procure <strong className="text-white">Instalar app</strong> ou <strong className="text-white">Adicionar à tela inicial</strong>.</p>
          )}
          <button type="button" onClick={() => installInstructionsDialogRef.current?.close()} className="mt-1 min-h-11 rounded-xl bg-[#ffd43b] px-5 text-sm font-bold text-[#171711] transition hover:bg-[#ffe06a]">Entendi</button>
        </div>
      </dialog>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 BRLista Brasil <span className="px-1">·</span> Serviços rodoviários · Catalão/GO, Uberlândia/MG, Goiânia/GO e Santos/SP</span>
          <a href="#inicio" className="inline-flex items-center gap-1 font-semibold text-white/50 hover:text-[#ffd43b]">Voltar ao topo <ArrowUpRight className="size-3" /></a>
        </div>
      </footer>
    </main>
  )
}

export default BrlistaDirectory

