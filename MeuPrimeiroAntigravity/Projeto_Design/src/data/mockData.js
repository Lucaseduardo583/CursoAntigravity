// Dados e Regras de Negócio do Horta-na-Mão

export const PLANS = [
  {
    id: 'pequeno',
    name: 'Cesta Essencial',
    tier: 'Plano Pequeno',
    price: 50,
    period: 'semanal',
    tag: 'Individual ou Casal',
    weight: '3 a 4 kg de orgânicos',
    description: 'A seleção perfeita para 1 a 2 pessoas. Legumes essenciais e verduras frescas colhidas na madrugada do dia da entrega.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: 'border-emerald-500',
    highlight: false,
    items: [
      { id: 'p1', name: 'Alface Crespa Orgânica', qty: '1 pé', category: 'Folhagem' },
      { id: 'p2', name: 'Rúcula Selvagem Fresca', qty: '1 maço', category: 'Folhagem' },
      { id: 'p3', name: 'Cenoura Baby da Terra', qty: '500g', category: 'Raízes' },
      { id: 'p4', name: 'Tomate Italiano Orgânico', qty: '600g', category: 'Fruto' },
      { id: 'p5', name: 'Cheiro Verde & Cebolinha', qty: '1 maço', category: 'Temperos' }
    ],
    swappableOptions: [
      { id: 's1', name: 'Espinafre Orgânico', qty: '1 maço', category: 'Folhagem' },
      { id: 's2', name: 'Beterraba Orgânica', qty: '500g', category: 'Raízes' },
      { id: 's3', name: 'Abobrinha Italiana Orgânica', qty: '500g', category: 'Legume' }
    ]
  },
  {
    id: 'medio',
    name: 'Cesta Família Viva',
    tier: 'Plano Médio',
    price: 80,
    period: 'semanal',
    tag: 'Mais Popular ⭐',
    weight: '6 a 7 kg de orgânicos',
    description: 'Ideal para 2 a 4 pessoas. Alta diversidade com verduras da estação, legumes variados, raízes e frutas selecionadas.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    accentColor: 'border-amber-600',
    highlight: true,
    items: [
      { id: 'm1', name: 'Alface Roxa & Crespa Orgânica', qty: '2 un', category: 'Folhagem' },
      { id: 'm2', name: 'Rúcula Selvagem', qty: '1 maço', category: 'Folhagem' },
      { id: 'm3', name: 'Cenouras Orgânicas Selecionadas', qty: '800g', category: 'Raízes' },
      { id: 'm4', name: 'Tomate Italiano Orgânico', qty: '800g', category: 'Fruto' },
      { id: 'm5', name: 'Brócolis Ninja Fresco', qty: '1 un grande', category: 'Inflorescência' },
      { id: 'm6', name: 'Batata Doce Roxa Orgânica', qty: '1 kg', category: 'Tubérculos' },
      { id: 'm7', name: 'Banana Prata Orgânica', qty: '1 dúzia', category: 'Frutas' },
      { id: 'm8', name: 'Manjericão & Hortelã da Horta', qty: '1 maço', category: 'Ervas' }
    ],
    swappableOptions: [
      { id: 'sm1', name: 'Couve Manteiga Fresca', qty: '1 maço', category: 'Folhagem' },
      { id: 'sm2', name: 'Mandioca Orgânica Descascada', qty: '1 kg', category: 'Tubérculos' },
      { id: 'sm3', name: 'Mamão Papaia Orgânico', qty: '2 un', category: 'Frutas' },
      { id: 'sm4', name: 'Berinjela Orgânica', qty: '600g', category: 'Legume' }
    ]
  },
  {
    id: 'grande',
    name: 'Cesta Banquete da Terra',
    tier: 'Plano Grande',
    price: 120,
    period: 'semanal',
    tag: 'Famílias & Entusiastas',
    weight: '9 a 11 kg de orgânicos',
    description: 'Experiência orgânica completa para famílias ou adeptos de alimentação 100% natural. Inclui ovos caipiras e frutas nobres.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: 'border-emerald-600',
    highlight: false,
    items: [
      { id: 'g1', name: 'Mix de Folhas Nobres (3 tipos)', qty: '3 maços', category: 'Folhagem' },
      { id: 'g2', name: 'Cenouras & Beterrabas Orgânicas', qty: '1.5 kg', category: 'Raízes' },
      { id: 'g3', name: 'Tomate Italiano & Sweet Grape', qty: '1.2 kg', category: 'Frutos' },
      { id: 'g4', name: 'Brócolis Ninja & Couve-Flor', qty: '2 un', category: 'Inflorescência' },
      { id: 'g5', name: 'Mandioquinha / Batata Baroa', qty: '1 kg', category: 'Raízes Nobres' },
      { id: 'g6', name: 'Frutas da Estação (Laranja & Banana)', qty: '2.5 kg', category: 'Frutas' },
      { id: 'g7', name: 'Ovos Caipiras de Galinhas Livres', qty: '12 un (1 dúzia)', category: 'Proteína Caipira' },
      { id: 'g8', name: 'Alecrim, Tomilho & Sálvia Frescos', qty: '2 maços', category: 'Ervas Finas' }
    ],
    swappableOptions: [
      { id: 'sg1', name: 'Cogumelos Shimeji Orgânicos', qty: '200g', category: 'Cogumelos' },
      { id: 'sg2', name: 'Abacate Orgânico Mantiqueira', qty: '2 un', category: 'Frutas' },
      { id: 'sg3', name: 'Inhame Orgânico Selecionado', qty: '1 kg', category: 'Tubérculos' },
      { id: 'sg4', name: 'Alho-Poró Orgânico', qty: '2 talos', category: 'Especiais' }
    ]
  }
];

// Lista oficial de bairros aceitos na Zona Sul (Rio de Janeiro e São Paulo para máxima compatibilidade)
export const ZONA_SUL_NEIGHBORHOODS = [
  // Rio de Janeiro - Zona Sul
  'Copacabana',
  'Ipanema',
  'Leblon',
  'Botafogo',
  'Flamengo',
  'Laranjeiras',
  'Catete',
  'Glória',
  'Gávea',
  'Jardim Botânico',
  'Urca',
  'Leme',
  'Humaitá',
  'Cosme Velho',
  'São Conrado',
  'Lagoa',
  // São Paulo - Zona Sul
  'Moema',
  'Vila Mariana',
  'Brooklin',
  'Campo Belo',
  'Santo Amaro',
  'Saúde',
  'Ipiranga',
  'Vila Olímpia',
  'Itaim Bibi',
  'Chácara Santo Antônio',
  'Mirandópolis',
  'Planalto Paulista',
  'Jardim Paulista',
  'Aclimação'
];

// Exemplos de bairros fora da Zona Sul (para teste e demonstração do bloqueio)
export const INVALID_TEST_NEIGHBORHOODS = [
  'Tijuca (Zona Norte)',
  'Barra da Tijuca (Zona Oeste)',
  'Centro',
  'Méier (Zona Norte)',
  'Madureira (Zona Norte)',
  'Pinheiros (Zona Oeste - SP)',
  'Tatuapé (Zona Leste - SP)',
  'Lapa (Zona Oeste - SP)'
];

// Função de validação da Regra de Negócio: Região / Bairro exclusivo Zona Sul
export function validateZonaSulNeighborhood(input) {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      reason: 'Por favor, informe seu bairro.'
    };
  }

  const clean = input.trim().toLowerCase();

  // Se o usuário digitou explicitamente "zona sul"
  if (clean.includes('zona sul') || clean.includes('zonasul') || clean.includes('zs')) {
    return {
      isValid: true,
      matchedNeighborhood: 'Zona Sul (Região Geral)',
      message: 'Região atendida com sucesso! Entregas semanais garantidas na Zona Sul.'
    };
  }

  // Verifica na lista de bairros
  const match = ZONA_SUL_NEIGHBORHOODS.find(bairro => {
    const bairroClean = bairro.toLowerCase();
    return clean === bairroClean || clean.includes(bairroClean) || bairroClean.includes(clean);
  });

  if (match) {
    return {
      isValid: true,
      matchedNeighborhood: match,
      message: `Bairro atendido (${match} - Zona Sul)! Frete grátis com colheita fresca garantida.`
    };
  }

  return {
    isValid: false,
    reason: `Bairro não atendido! No momento, as entregas da Horta-na-Mão são restritas e exclusivas para a Zona Sul para garantir o frescor das hortaliças colhidas no mesmo dia.`
  };
}

// Modelos de fotos simuladas para o entregador
export const SIMULATED_DELIVERY_PHOTOS = [
  {
    id: 'photo-1',
    title: 'Cesta na porta do apartamento (tapete de boas-vindas)',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    type: 'Apartamento',
    note: 'Cesta deixada em segurança na porta 402'
  },
  {
    id: 'photo-2',
    title: 'Cesta na portaria / recepção do condomínio',
    url: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80',
    type: 'Portaria',
    note: 'Entregue ao porteiro Sr. Manoel na portaria'
  },
  {
    id: 'photo-3',
    title: 'Cesta no portão de entrada da residência',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
    type: 'Casa',
    note: 'Deixado sob a varanda coberta'
  }
];

// Entregas iniciais simuladas para o Entregador
export const INITIAL_DELIVERIES = [
  {
    id: 'HNM-7821',
    customerName: 'Mariana Duarte Alencar',
    customerPhone: '(21) 98412-3341',
    address: 'Rua Visconde de Pirajá, 414 - Apto 302',
    neighborhood: 'Ipanema',
    region: 'Zona Sul',
    planId: 'medio',
    planName: 'Cesta Família Viva (Plano Médio - R$ 80/sem)',
    status: 'pending', // pending, in_route, delivered
    recurringBilling: 'Ativo (Débito Recorrente toda Seg)',
    notes: 'Interfone tocar 2x. Deixar na porta se não atender.',
    createdAt: 'Hoje às 07:15',
    proofPhoto: null,
    deliveredAt: null
  },
  {
    id: 'HNM-7822',
    customerName: 'Rodrigo Vasconcelos',
    customerPhone: '(21) 99120-7789',
    address: 'Av. Atlântica, 2800 - Portaria',
    neighborhood: 'Copacabana',
    region: 'Zona Sul',
    planId: 'grande',
    planName: 'Cesta Banquete da Terra (Plano Grande - R$ 120/sem)',
    status: 'in_route',
    recurringBilling: 'Ativo (Débito Recorrente toda Seg)',
    notes: 'Deixar com o porteiro Silva.',
    createdAt: 'Hoje às 07:30',
    proofPhoto: null,
    deliveredAt: null
  }
];
