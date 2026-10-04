'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, MessageCircle, Phone, Search, Wrench, Plus } from 'lucide-react'

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada', 'Guincho / Socorro', 'Lavador de Carreta'] as const
type CategoryFilter = typeof categories[number]
type Category = Exclude<CategoryFilter, 'Todas'> | 'Guincho' | 'Lava Jato'
type Place = { name: string; category: Category; city: string; road?: string; phone: string; service?: string }

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

export function BrlistaDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const normalize = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filteredPlaces = useMemo(() => {
    const q = normalize(query.trim())
    return places.filter((p) => {
      const ok = category === 'Todas' || p.category === category
      if (!q) return ok
      const txt = normalize(`${p.name} ${p.category} ${p.city} ${p.road?? ''} ${p.service?? ''}`)
      return ok && txt.includes(q)
    })
  }, [category, query])

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage)
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const whatsappCadastro = `https://wa.me/5534988171945?text=${encodeURIComponent('Olá, quero cadastrar minha empresa/serviço no BRLista Brasil')}`

  return (
    <main className="min-h-screen bg-[#11110f] text-[#f6f4ed]">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#11110f]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#facc15] text-black"><Wrench size={22}/></div>
            <div className="leading-none">
              <p className="text-[18px] font-black leading-none">BRLISTA</p>
              <p className="text-[18px] font-black leading-none text-[#facc15]">BRASIL</p>
              <p className="mt-1 text-[9px] tracking-[0.2em] text-white/50">SEU APOIO NA ESTRADA</p>
            </div>
          </div>
          <a href={whatsappCadastro} target="_blank" className="flex items-center gap-2 rounded-full bg-[#facc15] px-5 py-3 text-[11px] font-black leading-none text-black">
            <Plus size={14} /> Cadastrar<br/>Empresa
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#facc15]/30 px-4 py-1.5 text-[10px] tracking-[0.2em] text-[#facc15]">
          <span className="h-2 w-2 rounded-full bg-[#facc15]"></span> GUIA DE SERVIÇOS RODOVIÁRIOS
        </div>

        <h1 className="mt-6 text-[44px] font-black leading-[0.9]">
          A estrada não<br/>espera.<br/>
          <span className="text-[#facc15]">Encontre ajuda.</span>
        </h1>

        <p className="mt-4 max-w-[360px] text-[14px] leading-relaxed text-white/60">
          Encontre borracharias, mecânicos, guinchos e socorro rodoviário 24h nas principais rodovias e cidades do Brasil.
        </p>

        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#facc15]" size={18}/>
          <input
            ref={searchInputRef}
            value={query}
            onChange={e=>{setQuery(e.target.value); setCurrentPage(1)}}
            onKeyDown={e=>{ if(e.key==='Enter'){ searchInputRef.current?.blur() } }}
            placeholder="Buscar: catalao, araxa, goiania, sao paulo, santos..."
            className="w-full rounded-full border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm outline-none focus:border-[#facc15]/40"
          />
        </div>

        <p className="mt-10 text-[10px] tracking-[0.35em] text-[#facc15]">DIRETÓRIO DE APOIO • {filteredPlaces.length} LOCAIS</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(c=>(
            <button key={c} onClick={()=>{setCategory(c); setCurrentPage(1)}} className={`rounded-full px-4 py-2 text-xs font-bold border ${category===c?'bg-[#facc15] text-black border-[#facc15]':'bg-white/5 text-white/60 border-white/10'}`}>{c}</button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 pb-10">
          {paginatedPlaces.map((p,i)=>(
            <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="flex items-center gap-1 text-sm opacity-70"><MapPin size={12}/> {p.city} {p.road?`- ${p.road}`:''}</p>
                  <p className="mt-1 text-xs opacity-60">{p.category} {p.service?`- ${p.service}`:''}</p>
                </div>
                <a href={`https://wa.me/${formatPhoneForUrl(p.phone)}`} target="_blank" className="rounded-full bg-green-500 p-2"><MessageCircle size={18}/></a>
              </div>
              <div className="mt-3 flex gap-2">
                <a href={`tel:${formatPhoneForUrl(p.phone)}`} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black"><Phone size={14}/> {formatPhoneForDisplay(p.phone)}</a>
              </div>
            </div>
          ))}
          {filteredPlaces.length===0 && <p className="py-10 text-center opacity-60">Nada encontrado pra "{query}"</p>}
        </div>

        {totalPages>1 && (
          <div className="mt-6 flex items-center justify-center gap-2 pb-10">
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(c=>c-1)} className="rounded-full bg-white/[0.08] px-4 py-2 disabled:opacity-30">Anterior</button>
            <span className="text-sm opacity-60">{currentPage} / {totalPages}</span>
            <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(c=>c+1)} className="rounded-full bg-white/[0.08] px-4 py-2 disabled:opacity-30">Próximo</button>
          </div>
        )}
      </div>
    </main>
  )
}
