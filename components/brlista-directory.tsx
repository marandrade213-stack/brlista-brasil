'use client'

import { useMemo, useRef, useState } from 'react'
import { MapPin, MessageCircle, Phone, Search, Wrench, Plus } from 'lucide-react'

const categories = ['Todas', 'Borracharia', 'Mecânica', 'Auto Elétrica', 'Mecânica Pesada', 'Guincho / Socorro', 'Lavador de Carreta'] as const
type CategoryFilter = typeof categories[number]
type Place = { name: string; category: string; city: string; road?: string; phone: string; service?: string }

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
  { name: 'Borracharia Waviva', category: 'Borracharia', city: 'Porto Velho, RO', phone: '(69) 99218-0715', service: 'Porto Velho e Região' },
  { name: 'Borracharia Marechal', category: 'Borracharia', city: 'Porto Velho, RO', phone: '(69) 99987-0725', service: 'Porto Velho e Região' },
  { name: 'Borracharia Pau Ferro', category: 'Borracharia', city: 'Porto Velho, RO', phone: '(69) 99209-7461', service: 'Porto Velho e Região' },
  { name: 'Borracharia do Baixinho', category: 'Borracharia', city: 'Porto Velho, RO', phone: '(69) 99245-1288', service: 'Porto Velho e Região' },
  { name: 'Lácio - Pneus & Borracharia', category: 'Borracharia', city: 'Ariquemes, RO', phone: '(69) 99277-6184' },
  { name: 'Borracharia Móvel Ariquemes', category: 'Borracharia', city: 'Ariquemes, RO', phone: '(69) 99274-0169' },
  { name: 'Borracharia do Goiano', category: 'Borracharia', city: 'Ariquemes, RO', phone: '(69) 98402-9931' },
  { name: 'Borracharia 24 Horas BR-364', category: 'Borracharia', city: 'Ariquemes, RO', road: 'BR-364', phone: '(69) 99314-5582' },
  { name: 'Borracharia Savana (BR-364)', category: 'Borracharia', city: 'Ouro Preto do Oeste, RO', road: 'BR-364', phone: '(69) 99249-8722' },
  { name: 'Borracharia Avenida', category: 'Borracharia', city: 'Ouro Preto do Oeste, RO', phone: '(69) 99283-0274' },
  { name: 'Jiscap OPO (Truck Center)', category: 'Borracharia', city: 'Ouro Preto do Oeste, RO', phone: '(69) 3461-2025', service: 'Truck Center' },
  { name: 'Borracharia do Negão', category: 'Borracharia', city: 'Jaru, RO', phone: '(69) 99285-4120' },
  { name: 'Borracharia Central Jaru', category: 'Borracharia', city: 'Jaru, RO', phone: '(69) 98436-7714' },
  { name: 'Borracharia Santiago', category: 'Borracharia', city: 'Ji-Paraná, RO', phone: '(69) 99255-3489' },
  { name: 'Borracharia Águia', category: 'Borracharia', city: 'Ji-Paraná, RO', phone: '(69) 99351-0208' },
  { name: 'Borracharia Rondônia Pesados', category: 'Borracharia', city: 'Ji-Paraná, RO', phone: '(69) 99911-3040', service: 'Linha Pesada' },
  { name: 'Borracharia Pai e Filha', category: 'Borracharia', city: 'Cacoal, RO', phone: '(69) 99906-3160' },
  { name: 'Borracharia e Auto Center Cacoal', category: 'Borracharia', city: 'Cacoal, RO', phone: '(69) 98418-5022' },
  { name: 'Borracharia Modelo', category: 'Borracharia', city: 'Rolim de Moura, RO', phone: '(69) 98433-6207' },
  { name: 'Borracharia Roda Bem', category: 'Borracharia', city: 'Rolim de Moura, RO', phone: '(69) 99399-9575' },
  { name: 'Rolim Rodas (Pneus Pesados)', category: 'Borracharia', city: 'Rolim de Moura, RO', phone: '(69) 98484-0511', service: 'Pneus Pesados' },
  { name: 'Borracharia Trevo Pesados', category: 'Borracharia', city: 'Pimenta Bueno, RO', phone: '(69) 99201-8843', service: 'Linha Pesada' },
  { name: 'Borracharia do Mineiro', category: 'Borracharia', city: 'Pimenta Bueno, RO', phone: '(69) 98466-1090' },
  { name: 'Borracharia Móvel 24h Belutz', category: 'Borracharia', city: 'Vilhena, RO', phone: '(69) 99256-4762', service: '24h Móvel' },
  { name: 'Borracharia Catarinense', category: 'Borracharia', city: 'Vilhena, RO', phone: '(69) 98455-9243' },
  { name: 'Borracharia A J 24 horas', category: 'Borracharia', city: 'Vilhena, RO', phone: '(69) 99270-5458' },
  { name: 'Borracharia do Pekeno (24h)', category: 'Borracharia', city: 'Guajará-Mirim, RO', phone: '(69) 99345-6731', service: '24h' },
  { name: 'Borracharia Jardim (24h)', category: 'Borracharia', city: 'Guajará-Mirim, RO', phone: '(69) 98458-9809', service: '24h' },
  { name: 'Milla Diesel', category: 'Mecânica Pesada', city: 'Porto Velho, RO', phone: '(69) 98405-4011' },
  { name: 'MaQ & Truck Peças e Serviços', category: 'Mecânica Pesada', city: 'Porto Velho, RO', phone: '(69) 99944-5001' },
  { name: 'Amaral Truck Center', category: 'Mecânica Pesada', city: 'Porto Velho, RO', phone: '(69) 3213-3685' },
  { name: 'Central Diesel Oficina', category: 'Mecânica Pesada', city: 'Porto Velho, RO', phone: '(69) 99926-8925' },
  { name: '364 Mecânica Pesada', category: 'Mecânica Pesada', city: 'Porto Velho, RO', phone: '(69) 99264-7874' },
  { name: 'Mecânica Vargas (Socorro e Pesados)', category: 'Mecânica Pesada', city: 'Ariquemes, RO', phone: '(69) 99282-3551', service: 'Socorro e Pesados' },
  { name: 'Ariquemes Diesel', category: 'Mecânica Pesada', city: 'Ariquemes, RO', phone: '(69) 3535-3022' },
  { name: 'Oficina Mecânica Central Pesados', category: 'Mecânica Pesada', city: 'Ariquemes, RO', phone: '(69) 99311-4045' },
  { name: 'Mecânica Diesel Ouro Preto', category: 'Mecânica Pesada', city: 'Ouro Preto do Oeste, RO', phone: '(69) 99214-7744' },
  { name: 'Vanzin Diesel (Pesados)', category: 'Mecânica Pesada', city: 'Ouro Preto do Oeste, RO', phone: '(69) 3461-3010' },
  { name: 'Mecânica do Baiano (Diesel)', category: 'Mecânica Pesada', city: 'Jaru, RO', phone: '(69) 99341-8012' },
  { name: 'Jaru Eletrodiesel', category: 'Mecânica Pesada', city: 'Jaru, RO', phone: '(69) 3521-2555' },
  { name: 'Central Diesel Truck', category: 'Mecânica Pesada', city: 'Ji-Paraná, RO', phone: '(69) 99235-8594' },
  { name: 'Mecânica JS Diesel', category: 'Mecânica Pesada', city: 'Ji-Paraná, RO', phone: '(69) 99961-4120' },
  { name: 'Rondônia Caminhões', category: 'Mecânica Pesada', city: 'Ji-Paraná, RO', phone: '(69) 3416-9000' },
  { name: 'Cacoal Diesel Pesados', category: 'Mecânica Pesada', city: 'Cacoal, RO', phone: '(69) 3441-4512' },
  { name: 'Mecânica Trevo Caminhões', category: 'Mecânica Pesada', city: 'Cacoal, RO', phone: '(69) 99288-1155' },
  { name: 'Rolim Diesel Mecânica', category: 'Mecânica Pesada', city: 'Rolim de Moura, RO', phone: '(69) 3442-1822' },
  { name: 'Mecânica do Gaúcho (Pesados)', category: 'Mecânica Pesada', city: 'Rolim de Moura, RO', phone: '(69) 99345-5022' },
  { name: 'Pimenta Bueno Diesel', category: 'Mecânica Pesada', city: 'Pimenta Bueno, RO', phone: '(69) 3451-2299' },
  { name: 'Mecânica Rondônia Cargas', category: 'Mecânica Pesada', city: 'Pimenta Bueno, RO', phone: '(69) 99211-6380' },
  { name: 'Tecnodiesel Brasil', category: 'Mecânica Pesada', city: 'Vilhena, RO', phone: '(69) 99230-5429' },
  { name: 'Euro Diesel Especializada', category: 'Mecânica Pesada', city: 'Vilhena, RO', phone: '(69) 98112-8233' },
  { name: 'Rossano Diesel Performance', category: 'Mecânica Pesada', city: 'Vilhena, RO', phone: '(69) 3321-8081' },
  { name: 'Vilhediesel', category: 'Mecânica Pesada', city: 'Vilhena, RO', phone: '(69) 99968-1256' },
  { name: 'Mecânica Diesel Fronteira', category: 'Mecânica Pesada', city: 'Guajará-Mirim, RO', phone: '(69) 98411-9031' },
  { name: 'Oficina do Bigode (Pesados)', category: 'Mecânica Pesada', city: 'Guajará-Mirim, RO', phone: '(69) 99355-1478' },
  { name: 'Borracharia Marechal', category: 'Borracharia', city: 'Porto Velho, RO', phone: '(69) 99987-0725' },
  { name: 'Borracharia Pau Ferro', category: 'Borracharia', city: 'Porto Velho, RO', phone: '(69) 99209-7461' },
  { name: 'Borracharia AJ', category: 'Borracharia', city: 'Vilhena, RO', phone: '(69) 99270-5458' },
  { name: 'Borracharia Belutz', category: 'Borracharia', city: 'Vilhena, RO', phone: '(69) 99256-4762' },
  { name: 'Borracharia Lukinhas', category: 'Borracharia', city: 'Ariquemes, RO', phone: '(69) 99365-2781' },
  { name: 'Borracharia Lukinhas', category: 'Borracharia', city: 'Ariquemes, RO', phone: '(69) 98402-1935' },
  { name: 'Elite Borracharia', category: 'Borracharia', city: 'Betim, MG', phone: '(31) 99850-5946' },
  { name: 'Borracharia M & C', category: 'Borracharia', city: 'Betim, MG', phone: '(31) 97176-3983' },
  { name: 'Borracharia L Castro', category: 'Borracharia', city: 'Betim, MG', phone: '(31) 97583-5479' },
  { name: 'Borracharia Lkb', category: 'Borracharia', city: 'Betim, MG', phone: '(31) 99574-8943' },
  { name: 'Multitrucks', category: 'Mecânica', city: 'Betim, MG', phone: '(31) 99464-7715' },
  { name: 'Multitrucks', category: 'Mecânica', city: 'Betim, MG', phone: '(31) 97574-3409' },
  { name: 'Borracharia Lopes', category: 'Borracharia', city: 'Betim, MG', phone: '(31) 98379-9191' },
  { name: 'GW Pneus Truck Center', category: 'Mecânica', city: 'Betim, MG', phone: '(31) 3593-0885' },
  { name: 'Auto Elétrica do Didi', category: 'Auto Elétrica', city: 'Betim, MG', phone: '(31) 99641-7994' },
  { name: 'RM Mecânica Diesel', category: 'Mecânica', city: 'Betim, MG', phone: '(31) 99245-8025' },
  { name: 'Somar Mecânica Diesel', category: 'Mecânica', city: 'Betim, MG', phone: '(31) 3390-8100' },
  { name: 'Só Iveco Oficina Especializada', category: 'Mecânica', city: 'Betim, MG', phone: '(31) 3532-4444' },
  { name: 'Borracharia Norte Sul', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 99946-6253' },
  { name: 'Borracharia BH', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 99785-8878' },
  { name: 'Borracharia Água Branca', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 98919-6665' },
  { name: 'Borracharia do Balinhas', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 98430-6006' },
  { name: 'Borracharia Pit Stop', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 99799-3026' },
  { name: 'Borracharia', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 97175-0646' },
  { name: 'Borracharia', category: 'Borracharia', city: 'Contagem, MG', phone: '(31) 98725-0490' },
  { name: 'Minasmáquinas Oficina', category: 'Mecânica', city: 'Contagem, MG', phone: '(31) 3514-1160' },
  { name: 'Contagem Diesel Mecânica', category: 'Mecânica', city: 'Contagem, MG', phone: '(31) 3361-2666' },
  { name: 'JVS Mecânica Diesel', category: 'Mecânica', city: 'Contagem, MG', phone: '(31) 99793-1126' },
  { name: '040 Freios', category: 'Mecânica', city: 'Contagem, MG', phone: '(31) 98923-2889' },
  { name: 'Borracharia do Grande', category: 'Borracharia', city: 'Igarapé, MG', phone: '(31) 99834-3048' },
  { name: 'Borracharia Oliveira', category: 'Borracharia', city: 'Juatuba, MG', phone: '(31) 99197-9541' },
  { name: 'Compneus e Borracharia', category: 'Borracharia', city: 'Juatuba, MG', phone: '(31) 97505-0080' },
  { name: 'Borracharia do Leleco', category: 'Borracharia', city: 'Juatuba, MG', phone: '(38) 99975-5279' },
  { name: 'Borracharia Posto Juatuba', category: 'Borracharia', city: 'Juatuba, MG', phone: '(31) 99700-4063' },
  { name: 'Borracharia Manu Pneus', category: 'Borracharia', city: 'São Joaquim de Bicas, MG', phone: '(31) 99613-6928' },
  { name: 'Delo Mecânica e Peças Diesel', category: 'Mecânica', city: 'João Monlevade, MG', phone: '(31) 3852-5022' },
  { name: 'Plantão Diesel', category: 'Mecânica', city: 'João Monlevade, MG', phone: '(31) 99845-6670' },
  { name: 'Mecânica e Borracharia Amigos da 381', category: 'Mecânica', city: 'São Gonçalo do Sapucaí, MG', phone: '(35) 99745-1828' },
  { name: 'Borracharia Martins Pneus', category: 'Borracharia', city: 'Oliveira, MG', phone: '(37) 99813-2313' },
  { name: 'Borracharia do Nado', category: 'Borracharia', city: 'Oliveira, MG', phone: '(37) 99905-5197' },
  { name: 'Borracharia do Adilson', category: 'Borracharia', city: 'Pouso Alegre, MG', phone: '(35) 99872-1813' },
  { name: 'Socorro St. Expedito', category: 'Mecânica', city: 'Pouso Alegre, MG', phone: '(35) 99940-1623' },
  { name: 'Borracharia Pai e Filho', category: 'Borracharia', city: 'Pouso Alegre, MG', phone: '(35) 99849-5591' },
  { name: 'Alvorada Pneus', category: 'Borracharia', city: 'Pouso Alegre, MG', phone: '(35) 3026-4422' },
  { name: 'Borracharia do Cabelo', category: 'Borracharia', city: 'Pouso Alegre, MG', phone: '(35) 99926-4347' },
  { name: 'Borracharia Pais e Filhos', category: 'Borracharia', city: 'Sete Lagoas, MG', phone: '(31) 99829-2543' },
  { name: 'Borracharia Roda7', category: 'Borracharia', city: 'Sete Lagoas, MG', phone: '(31) 99526-3416' },
  { name: 'RJ Borracharia', category: 'Borracharia', city: 'Sete Lagoas, MG', phone: '(31) 99717-8935' },
  { name: 'Borracharia dos Balaios', category: 'Borracharia', city: 'Caetanópolis, MG', phone: '(31) 99986-7502' },
  { name: 'Posto Décio', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 3238-9015' },
  { name: 'Borracharia do Edilson', category: 'Borracharia', city: 'Uberlândia, MG', phone: '(34) 99642-3510' },
  { name: 'Mecânica Uberaba Diesel', category: 'Mecânica', city: 'Uberaba, MG', phone: '(34) 3319-3300' },
  { name: 'Triângulo Diesel', category: 'Mecânica', city: 'Uberaba, MG', phone: '(34) 3311-5060' },
  { name: 'Borracharia do Baiano', category: 'Borracharia', city: 'Uberaba, MG', phone: '(34) 99671-5509' },
  { name: 'Auto Borracharia Triângulo', category: 'Borracharia', city: 'Delta, MG', phone: '(34) 99105-1560' },
  { name: 'Nova Geração Borracharia', category: 'Borracharia', city: 'Barbacena, MG', phone: '(32) 99981-5154' },
  { name: 'Borracharia Pontilhão', category: 'Borracharia', city: 'Barbacena, MG', phone: '(32) 99103-8195' },
  { name: 'Pescoço Pneus e Rodas', category: 'Borracharia', city: 'Barbacena, MG', phone: '(32) 98852-4997' },
  { name: 'Truck Center JF', category: 'Mecânica', city: 'Juiz de Fora, MG', phone: '(32) 3083-6732' },
  { name: 'A Borracharia', category: 'Borracharia', city: 'Juiz de Fora, MG', phone: '(32) 99134-0223' },
  { name: 'Borracharia R6 Zona Norte', category: 'Borracharia', city: 'Juiz de Fora, MG', phone: '(32) 8853-8549' },
  { name: 'Borracharia AJ CAR Vivendas', category: 'Borracharia', city: 'Juiz de Fora, MG', phone: '(32) 98817-3679' },
  { name: 'Borracharia Realeza', category: 'Borracharia', city: 'Manhuaçu, MG', phone: '(33) 99123-5393' },
  { name: 'Borracharia do Neguim', category: 'Borracharia', city: 'Manhuaçu, MG', phone: '(33) 99900-6111' },
  { name: 'Borracharia do Felipe', category: 'Borracharia', city: 'Manhuaçu, MG', phone: '(33) 98415-6185' },
  { name: 'Borracharia São Jorge', category: 'Borracharia', city: 'Manhuaçu, MG', phone: '(33) 99937-3581' },
  { name: 'Mecânica Machado', category: 'Mecânica', city: 'Manhuaçu, MG', phone: '(33) 3331-4090' },
  { name: 'Mecanicar Oficina Diesel', category: 'Mecânica', city: 'Manhuaçu, MG', phone: '(33) 98451-2204' },
  { name: 'Auto Mecânica Diesel Realeza', category: 'Mecânica', city: 'Manhuaçu, MG', phone: '(33) 99195-2015' },
  { name: 'Auto Elétrica Truck Leste', category: 'Auto Elétrica', city: 'Manhuaçu, MG', phone: '(33) 99981-4221' },
  { name: 'Borracharia do Zico', category: 'Borracharia', city: 'Caratinga, MG', phone: '(33) 99947-8761' },
  { name: 'Guinchocar e Socorro', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 3321-8161' },
  { name: 'Guinchocar', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 99913-3322' },
  { name: 'Pneucar Truck Center', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 3329-5555' },
  { name: 'Truck Diesel Mecânica', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 99964-5416' },
  { name: 'Caratinga Auto Diesel', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 3321-2134' },
  { name: 'Mecânica TL Diesel', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 99974-2627' },
  { name: 'Oficina Moreira Diesel', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 99731-9630' },
  { name: 'Mecânica Diesel Fernando Pascoal', category: 'Mecânica', city: 'Caratinga, MG', phone: '(33) 99945-8843' },
  { name: 'Matos Diesel Assistência', category: 'Mecânica', city: 'Unaí, MG', phone: '(38) 99997-5637' },
  { name: 'Bap Diesel Motores e Câmbio', category: 'Mecânica', city: 'Unaí, MG', phone: '(38) 3676-2072' },
  { name: 'Borracharia Planalto', category: 'Borracharia', city: 'Unaí, MG', phone: '(38) 3676-1882' },
  { name: 'Mecânica BR Diesel', category: 'Mecânica', city: 'Paracatu, MG', phone: '(38) 3671-5637' },
  { name: 'Borracharia PneuExpress', category: 'Borracharia', city: 'Paracatu, MG', phone: '(38) 99847-5778' },
  { name: 'Borracharia Do Valci', category: 'Borracharia', city: 'Paracatu, MG', phone: '(38) 99977-8252' },
  { name: 'Borracharia do Tavinho', category: 'Borracharia', city: 'Paracatu, MG', phone: '(38) 99955-7178' },
  { name: 'Auto Elétrica e Tacógrafos Paracatu', category: 'Auto Elétrica', city: 'Paracatu, MG', phone: '(38) 3671-3312' },
  { name: 'Montes Claros Diesel', category: 'Mecânica', city: 'Montes Claros, MG', phone: '(38) 2101-7200' },
  { name: 'Mecânica Diesel Norte Sul', category: 'Mecânica', city: 'Montes Claros, MG', phone: '(38) 99912-4022' },
  { name: 'Borracharia Central do Caminhoneiro', category: 'Borracharia', city: 'Montes Claros, MG', phone: '(38) 99144-8899' },
  { name: 'Borracharia do Goiano', category: 'Borracharia', city: 'Bocaiúva, MG', phone: '(38) 99822-1405' },
  { name: 'Borracharia Trevo do Alucinante', category: 'Borracharia', city: 'Engenheiro Navarro, MG', phone: '(38) 99951-6453' },
  { name: 'Posto JK', category: 'Borracharia', city: 'Cristalina, GO', phone: '(61) 3612-1299' },
  { name: 'Borracharia e Truck Center Viana', category: 'Borracharia', city: 'Viana, ES', phone: '(27) 99757-1049' },
  { name: 'Borracharia e Socorro Estrela do Norte', category: 'Borracharia', city: 'Cariacica, ES', phone: '(27) 99849-5591' },
  { name: 'Borracharia do Baiano', category: 'Borracharia', city: 'Cariacica, ES', phone: '(27) 99925-1801' },
  { name: 'Diesel Sul Oficina Mecânica', category: 'Mecânica', city: 'Cariacica, ES', phone: '(27) 3343-1560' },
  { name: 'Borracharia Dois Irmãos', category: 'Borracharia', city: 'Espírito Santo, ES', phone: '(27) 99977-4909' },
  { name: 'Mecânica Valadares', category: 'Mecânica', city: 'Santo Estêvão, BA', phone: '(75) 3245-3273' },
  { name: 'Mecânica Diesel Multimarcas', category: 'Mecânica', city: 'Feira de Santana, BA', phone: '(75) 2101-8400' },
  { name: 'Borracharia Galo Cego', category: 'Borracharia', city: 'Macururé, BA', phone: '(75) 99889-0672' },
  { name: 'Ramon Truck Center & Borracharia', category: 'Borracharia', city: 'Itatim, BA', phone: '(75) 98121-1739' },
  { name: 'Nóbrega Mecânica', category: 'Mecânica', city: 'Guarulhos, SP', phone: '(11) 91334-5378' },
  { name: 'Garage Truck Center', category: 'Mecânica', city: 'São Paulo, SP', phone: '(11) 94772-4954' },
  { name: 'FS Diesel', category: 'Mecânica', city: 'São Paulo, SP', phone: '(11) 94182-3593' },
  { name: 'Borracharia Bahia', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 96854-7941' },
  { name: 'Conserta Carros', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 4172-0984' },
  { name: 'Borracharia Juracar', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 98423-5612' },
  { name: 'Borracharia', category: 'Borracharia', city: 'São Paulo, SP', phone: '(11) 96835-8169' },
  { name: 'Borracharia JK 3 Barras', category: 'Borracharia', city: 'Cristalina, GO', phone: '+55 61 98662-0652' },
  { name: 'Borracharia Triângulo Ipameri', category: 'Borracharia', city: 'Ipameri, GO', phone: '+55 64 99299-2140' },
  { name: 'LIHAN Borracharia Móvel', category: 'Borracharia', city: 'Catalão, GO', phone: '+55 64 98154-8109' },
  { name: 'Borracharia do Baiano', category: 'Borracharia', city: 'Catalão, GO', phone: '+55 64 99961-3430' },
  { name: 'Borracharia e Auto Elétrica do Tião', category: 'Borracharia', city: 'Campo Alegre de Goiás, GO', phone: '+55 64 99654-1102' },
  { name: 'Netinho Pneus Móvel', category: 'Borracharia', city: 'Araguari, MG', phone: '+55 34 98817-5365' },
  { name: 'Borracharia São Cristóvão', category: 'Borracharia', city: 'Uberlândia, MG', phone: '+55 34 3211-1055' },
  { name: 'Borracharia do Geraldo BR-365', category: 'Borracharia', city: 'Uberlândia, MG', phone: '+55 34 98818-5971' },
  { name: 'CT Borracharia Móvel', category: 'Borracharia', city: 'Monte Alegre de Minas, MG', phone: '+55 34 99141-3317' },
  { name: 'Posto Parati Borracharia', category: 'Borracharia', city: 'Patos de Minas, MG', phone: '+55 34 99812-9235' },
  { name: 'Borracharia do Carlão', category: 'Borracharia', city: 'Ibiá, MG', phone: '+55 34 99195-2342' },
  { name: 'Borracharia Móvel Tiãozinho', category: 'Borracharia', city: 'Araxá, MG', phone: '+55 34 98835-1811' },
  { name: 'Borracharia Móvel Juninho Frutal', category: 'Borracharia', city: 'Frutal, MG', phone: '+55 34 99664-1288' },
  { name: 'Borracharia Trevo BR-153', category: 'Borracharia', city: 'Prata, MG', phone: '+55 34 99975-4010' },
  { name: 'Borracharia Chimarrão', category: 'Borracharia', city: 'São José dos Pinhais, PR', phone: '+55 41 99948-0531' },
  { name: 'Borracharia do Polaco', category: 'Borracharia', city: 'Curitiba, PR', phone: '+55 41 98457-7858' },
  { name: 'Borracharia Nogueira', category: 'Borracharia', city: 'Mandirituba, PR', phone: '+55 41 99890-2651' },
  { name: 'Borracharia Móvel Londrina', category: 'Borracharia', city: 'Londrina, PR', phone: '+55 43 98824-6782' },
  { name: 'Borracharia Móvel Socorro', category: 'Borracharia', city: 'Curitiba, PR', phone: '+55 41 99682-7353' },
  { name: 'Guga Borracharia 24h Móvel', category: 'Borracharia', city: 'Criciúma, SC', phone: '+55 48 99108-1696' },
  { name: 'Borracharia Móvel Help Car', category: 'Borracharia', city: 'Itajaí, SC', phone: '+55 47 99134-9471' },
  { name: 'Borracharia Móvel BC', category: 'Borracharia', city: 'Balneário Camboriú, SC', phone: '+55 47 99271-9469' },
  { name: 'JR Porto Borracharia', category: 'Borracharia', city: 'Itajaí, SC', phone: '+55 47 99778-6445' },
  { name: 'Borracharia Palhoça', category: 'Borracharia', city: 'Palhoça, SC', phone: '+55 48 99933-2708' },
  { name: 'Mg Truck Center Linha Pesada', category: 'Mecânica Pesada', city: 'Porto Alegre, RS', phone: '+55 51 3386-6949' },
  { name: 'Lava Jato Truck Car', category: 'Lavador de Carreta', city: 'Catalão, GO', phone: '+55 64 3411-2425' },
  { name: 'DL Lava Jato', category: 'Lavador de Carreta', city: 'Catalão, GO', phone: '+55 64 99222-6529' },
  { name: 'Lava Jato Rota 330', category: 'Lavador de Carreta', city: 'Catalão, GO', phone: '+55 64 99228-7040' },
  { name: 'Lava Jato Mesquita', category: 'Lavador de Carreta', city: 'Catalão, GO', phone: '+55 64 98119-7738' },
  { name: 'Posto de Molas e Lavagem Araguari', category: 'Lavador de Carreta', city: 'Araguari, MG', phone: '+55 34 3242-4509' },
  { name: 'Lava Jato D\'Car Pesados', category: 'Lavador de Carreta', city: 'Rio Grande, RS', phone: '+55 53 3231-5182' },
  { name: 'Auto Elétrica Baterias e Ar Carretão', category: 'Auto Elétrica', city: 'Catalão, GO', phone: '+55 64 3442-6543' },
  { name: 'Auto Elétrica Marajó Pesados', category: 'Auto Elétrica', city: 'Catalão, GO', phone: '+55 64 3441-3022' },
  { name: 'Auto Elétrica Cristal Caminhões', category: 'Auto Elétrica', city: 'Cristalina, GO', phone: '+55 61 3612-5088' },
  { name: 'Auto Elétrica Ipameri Pesados', category: 'Auto Elétrica', city: 'Ipameri, GO', phone: '+55 64 3491-2190' },
  { name: 'Auto Elétrica Triângulo Caminhões', category: 'Auto Elétrica', city: 'Uberlândia, MG', phone: '+55 34 3212-8890' },
  { name: 'Auto Elétrica São Cristóvão Pesados', category: 'Auto Elétrica', city: 'Uberlândia, MG', phone: '+55 34 3231-4055' },
  { name: 'Auto Elétrica e Tacógrafos Uberaba', category: 'Auto Elétrica', city: 'Uberaba, MG', phone: '+55 34 3313-2211' },
  { name: 'Eletrodiesel Zebu Pesados', category: 'Auto Elétrica', city: 'Uberaba, MG', phone: '+55 34 3322-1099' },
  { name: 'Auto Elétrica e Mecânica Pesada Carretão', category: 'Auto Elétrica', city: 'Rio Grande, RS', phone: '+55 53 99122-3040' },
  { name: 'Auto Elétrica Junção Pesados', category: 'Auto Elétrica', city: 'Rio Grande, RS', phone: '+55 53 3232-6022' },
  { name: 'Auto Elétrica do Porto', category: 'Auto Elétrica', city: 'Rio Grande, RS', phone: '+55 53 3235-7711' },
  { name: 'Elétrica Diesel Pelotas', category: 'Auto Elétrica', city: 'Pelotas, RS', phone: '+55 53 3223-9088' },
  { name: 'Clevin Auto Truck Service Elétrica', category: 'Auto Elétrica', city: 'Araguari, MG', phone: '+55 34 99714-8795' },
  { name: 'Ecovias Minas Goiás Guincho', category: 'Guincho / Socorro', city: 'Cristalina, GO', phone: '0800 940 0700' },
  { name: 'Triunfo Concebra Guincho BR-060', category: 'Guincho / Socorro', city: 'Catalão, GO', phone: '0800 060 6000' },
  { name: 'EPR Triângulo Guincho BR-365', category: 'Guincho / Socorro', city: 'Uberlândia, MG', phone: '0800 452 0036' },
  { name: 'Arteris Litoral Sul Guincho Pesado', category: 'Guincho / Socorro', city: 'Curitiba, PR', phone: '0800 725 1771' },
  { name: 'Arteris Planalto Sul Guincho', category: 'Guincho / Socorro', city: 'Curitiba, PR', phone: '0800 717 116' },
  { name: 'CCR ViaCosteira Guincho', category: 'Guincho / Socorro', city: 'Criciúma, SC', phone: '0800 255 5550' },
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
        <h1 className="mt-6 text-[44px] font-black leading-[0.9]">A estrada não<br/>espera.<br/><span className="text-[#facc15]">Encontre ajuda.</span></h1>
        <p className="mt-4 max-w-[360px] text-[14px] leading-relaxed text-white/60">Encontre borracharias, mecânicos, guinchos e socorro rodoviário 24h nas principais rodovias e cidades do Brasil.</p>
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#facc15]" size={18}/>
          <input ref={searchInputRef} value={query} onChange={e=>{setQuery(e.target.value); setCurrentPage(1)}} placeholder="Buscar: rondonia, porto velho, vilhena, ariquemes..." className="w-full rounded-full border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm outline-none focus:border-[#facc15]/40" />
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
