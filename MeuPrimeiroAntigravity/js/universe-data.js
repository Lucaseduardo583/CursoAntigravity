/**
 * ===================================================================
 * UNIVERSE EXPLORER - Celestial Database & Discovery Store
 * Sol System | 10 Exotic Worlds | Black Hole | Galactic Waypoints
 * ===================================================================
 */

const UniverseData = {
    // Escalas de zoom (Níveis 1 a 5)
    SCALES: {
        PLANET: 1,       // Nível 1: Vista aproximada de um mundo
        SOLAR_SYSTEM: 2, // Nível 2: Vista orbital do sistema solar
        DEEP_SPACE: 3,   // Nível 3: Aglomerados estelares locais
        MILKY_WAY: 4,    // Nível 4: Estrutura espiral da galáxia
        OBSERVABLE: 5    // Nível 5: Filamentos do universo observável
    },

    // Catálogo Celestial (Sol + 8 Planetas + 10 Mundos Exóticos + Buraco Negro)
    celestialBodies: [
        // --- SISTEMA SOLAR ---
        {
            id: 'sun',
            name: 'Sol',
            system: 'Sistema Solar',
            type: 'Estrela Tipo-G (Anã Amarela)',
            radius: 14.0,
            color: 0xffaa00,
            emissive: true,
            distanceFromCenter: 0,
            orbitSpeed: 0,
            position: { x: 0, y: 0, z: 0 },
            rotationSpeed: 0.002,
            gravity: '274.0 m/s²',
            temperature: '5.778 K (Superfície)',
            atmosphere: 'Hidrogênio (73%), Hélio (25%)',
            description: 'O coração gravitacional e energético do nosso sistema solar, sustentando toda a vida na Terra.',
            curiosity: 'Contém 99,86% de toda a massa do Sistema Solar.',
            pointsOfInterest: ['Corona Solar', 'Manchas Solares', 'Zona de Convecção']
        },
        {
            id: 'mercury',
            name: 'Mercúrio',
            system: 'Sistema Solar',
            type: 'Planeta Rochoso',
            radius: 1.2,
            color: 0x9ca3af,
            distanceFromCenter: 24,
            orbitSpeed: 0.04,
            rotationSpeed: 0.005,
            gravity: '3.7 m/s²',
            temperature: '-180°C a 430°C',
            atmosphere: 'Exosfera rarefeita de Oxigênio e Sódio',
            description: 'O menor e mais interno planeta do Sistema Solar, com crateras profundas e variações extremas de temperatura.',
            curiosity: 'Um dia em Mercúrio dura cerca de 176 dias terrestres.',
            pointsOfInterest: ['Bacia Caloris', 'Crateras de Gelo nos Polos', 'Escarpas Rupes']
        },
        {
            id: 'venus',
            name: 'Vênus',
            system: 'Sistema Solar',
            type: 'Planeta Telúrico',
            radius: 2.2,
            color: 0xeab308,
            distanceFromCenter: 38,
            orbitSpeed: 0.03,
            rotationSpeed: -0.002,
            gravity: '8.87 m/s²',
            temperature: '465°C (Média global)',
            atmosphere: 'Dióxido de Carbono (96.5%), Ácido Sulfúrico',
            description: 'Mundo escaldante com efeito estufa descontrolado e pressão atmosférica esmagadora.',
            curiosity: 'Gira no sentido horário (rotação retrógrada), ao contrário da maioria dos planetas.',
            pointsOfInterest: ['Maxwell Montes', 'Montes Vulcânicos Maat', 'Planícies de Lava']
        },
        {
            id: 'earth',
            name: 'Terra (Earth)',
            system: 'Sistema Solar',
            type: 'Planeta Telúrico Habitável',
            radius: 2.5,
            color: 0x2563eb,
            hasAtmosphere: true,
            hasClouds: true,
            distanceFromCenter: 54,
            orbitSpeed: 0.02,
            rotationSpeed: 0.015,
            gravity: '9.807 m/s²',
            temperature: '15°C (Média global)',
            atmosphere: 'Nitrogênio (78%), Oxigênio (21%), Argônio (0.9%)',
            description: 'O berço da civilização humana, repleto de oceanos de água líquida, biosfera ativa e atmosfera protetora.',
            curiosity: 'O único corpo celeste conhecido até hoje a abrigar vida biológica inteligente.',
            pointsOfInterest: ['Oceanos Profundos', 'Grand Canyon', 'Auroras Polares', 'Fossa das Marianas'],
            moons: [{ name: 'Lua', radius: 0.7, dist: 5.5, speed: 0.06, color: 0xd1d5db }]
        },
        {
            id: 'mars',
            name: 'Marte',
            system: 'Sistema Solar',
            type: 'Planeta Rochoso Desértico',
            radius: 1.6,
            color: 0xef4444,
            distanceFromCenter: 72,
            orbitSpeed: 0.016,
            rotationSpeed: 0.014,
            gravity: '3.72 m/s²',
            temperature: '-63°C (Média)',
            atmosphere: 'Dióxido de Carbono (95%), Nitrogênio, Argônio',
            description: 'O Planeta Vermelho, rico em óxido de ferro, com vales colossais e o maior vulcão do sistema solar.',
            curiosity: 'Abriga o Monte Olimpo, um vulcão com quase 3 vezes a altura do Monte Everest.',
            pointsOfInterest: ['Olympus Mons', 'Valles Marineris', 'Calotas Polares de Gelo']
        },
        {
            id: 'jupiter',
            name: 'Júpiter',
            system: 'Sistema Solar',
            type: 'Gigante Gasoso',
            radius: 6.5,
            color: 0xd97706,
            distanceFromCenter: 105,
            orbitSpeed: 0.01,
            rotationSpeed: 0.03,
            gravity: '24.79 m/s²',
            temperature: '-110°C (Nuvem)',
            atmosphere: 'Hidrogênio (90%), Hélio (10%), Metano',
            description: 'O rei dos planetas, um gigante colossal com ventos furiosos e a lendária Grande Mancha Vermelha.',
            curiosity: 'Possui mais de 90 luas conhecidas e um campo magnético protetor gigante.',
            pointsOfInterest: ['Grande Mancha Vermelha', 'Aurora Joviana', 'Lua Europa (Oceano Subterrâneo)']
        },
        {
            id: 'saturn',
            name: 'Saturno',
            system: 'Sistema Solar',
            type: 'Gigante Gasoso com Anéis',
            radius: 5.2,
            color: 0xfbbf24,
            hasRings: true,
            ringInner: 6.8,
            ringOuter: 11.5,
            distanceFromCenter: 145,
            orbitSpeed: 0.007,
            rotationSpeed: 0.028,
            gravity: '10.44 m/s²',
            temperature: '-140°C',
            atmosphere: 'Hidrogênio (96%), Hélio (3%)',
            description: 'A joia do Sistema Solar, famosa pelo seu espetacular e reluzente sistema de anéis de gelo.',
            curiosity: 'Sua densidade média é menor do que a da água: ele flutuaria em uma banheira cósmica.',
            pointsOfInterest: ['Sistema de Anéis A-F', 'Hexágono Polar Norte', 'Lua Titã']
        },
        {
            id: 'uranus',
            name: 'Urano',
            system: 'Sistema Solar',
            type: 'Gigante de Gelo',
            radius: 3.5,
            color: 0x38bdf8,
            hasRings: true,
            ringInner: 4.2,
            ringOuter: 5.8,
            distanceFromCenter: 185,
            orbitSpeed: 0.005,
            rotationSpeed: 0.018,
            gravity: '8.69 m/s²',
            temperature: '-195°C',
            atmosphere: 'Hidrogênio, Hélio, Metano',
            description: 'Um mundo azul-turquesa misterioso que orbita "deitado" de lado com inclinação de 98 graus.',
            curiosity: 'Seu metano atmosférico absorve a luz vermelha, conferindo sua tonalidade ciano brilhante.',
            pointsOfInterest: ['Nuvens de Metano', 'Anéis Escuros', 'Lua Miranda']
        },
        {
            id: 'neptune',
            name: 'Netuno',
            system: 'Sistema Solar',
            type: 'Gigante de Gelo Exterior',
            radius: 3.4,
            color: 0x1d4ed8,
            distanceFromCenter: 225,
            orbitSpeed: 0.003,
            rotationSpeed: 0.02,
            gravity: '11.15 m/s²',
            temperature: '-200°C',
            atmosphere: 'Hidrogênio, Hélio, Hidrocarbonetos',
            description: 'O guardião mais distante do sistema solar, com ventos supersônicos que ultrapassam 2.100 km/h.',
            curiosity: 'Leva mais de 165 anos terrestres para completar uma única volta ao redor do Sol.',
            pointsOfInterest: ['Grande Mancha Escura', 'Gêiseres de Nitrogênio em Tritão']
        },

        // --- 10 MUNDOS EXÓTICOS E DESCONHECIDOS (Setores Galácticos) ---
        {
            id: 'aether',
            name: 'Mundo 01 // Aether',
            system: 'Setor Lumina Prime',
            type: 'Superoceânico Bioluminescente',
            radius: 4.8,
            color: 0x00f2fe,
            hasAtmosphere: true,
            atmosphereColor: 0x00f2fe,
            position: { x: 380, y: 80, z: -250 },
            gravity: '12.4 m/s²',
            temperature: '22°C (Clima Tropical)',
            atmosphere: 'Oxigênio hiper-ionizado (32%), Nitrogênio, Vapor',
            description: 'Um planeta colossal com oceanos azuis cintilantes e recifes cristalinos que emitem luz própria durante a noite.',
            curiosity: 'Ondas gigantes de até 200 metros circulam o planeta devido à atração de seus anéis de quartzo.',
            pointsOfInterest: ['Fossa dos Cristais Radiantes', 'Abismo de Safira', 'Arquipélago Flutuante']
        },
        {
            id: 'ignis',
            name: 'Mundo 02 // Ignis',
            system: 'Setor Pyroclast',
            type: 'Mundo Magmático Vulcânico',
            radius: 3.8,
            color: 0xff3b00,
            hasAtmosphere: true,
            atmosphereColor: 0xff5500,
            position: { x: -420, y: -60, z: 320 },
            gravity: '14.8 m/s²',
            temperature: '740°C',
            atmosphere: 'Dióxido de Enxofre, Cinzas de Silicato, Vapor Metálico',
            description: 'Um inferno cósmico onde oceanos de rocha derretida fluem entre cadeias vulcânicas hiperativas.',
            curiosity: 'Chove ferro líquido e vidro fundido em suas camadas atmosféricas superiores.',
            pointsOfInterest: ['Caldeira dos Titãs', 'Fenda Magmática Central', 'Pico de Obsidiana']
        },
        {
            id: 'nexus',
            name: 'Mundo 03 // Nexus',
            system: 'Setor Cygnus Cyber',
            type: 'Ecumenópole Cibernética Artificial',
            radius: 4.2,
            color: 0x6366f1,
            hasAtmosphere: true,
            atmosphereColor: 0x8b5cf6,
            position: { x: 260, y: 190, z: 450 },
            gravity: '9.8 m/s² (Gravidade Artificial)',
            temperature: '19°C (Climatizado)',
            atmosphere: 'Mistura sintética purificada com nanorredes',
            description: 'Um mundo completamente envelopado por megacidades e circuitos de energia quântica visíveis da órbita.',
            curiosity: 'Construído por uma civilização Kardashev Tipo II que converteu toda a crosta em processadores quânticos.',
            pointsOfInterest: ['Nó Central de Processamento', 'Estratosfera de Fibra Óptica', 'Torres de Dados Monolíticas']
        },
        {
            id: 'elysium',
            name: 'Mundo 04 // Elysium',
            system: 'Setor Arcadia',
            type: 'Paraíso Exobiológico Florestal',
            radius: 3.2,
            color: 0x10b981,
            hasAtmosphere: true,
            atmosphereColor: 0xa855f7,
            position: { x: -310, y: 140, z: -480 },
            gravity: '8.4 m/s²',
            temperature: '24°C',
            atmosphere: 'Oxigênio rico, esporos bioluminescentes',
            description: 'Planeta coberto por florestas ancestrais em tons púrpura e esmeralda, com rios de néctar e atmosfera iridescente.',
            curiosity: 'Toda a flora do planeta compartilha uma única consciência coletiva conectada pelas raízes.',
            pointsOfInterest: ['Floresta Violeta Ancestral', 'Quedas de Aurora', 'Jardins de Esporos Flutuantes']
        },
        {
            id: 'void',
            name: 'Mundo 05 // Void Prime',
            system: 'Setor Umbra Oculto',
            type: 'Planeta de Sombra Escura',
            radius: 4.5,
            color: 0x11131a,
            hasAtmosphere: true,
            atmosphereColor: 0x312e81,
            position: { x: 520, y: -210, z: -180 },
            gravity: '18.2 m/s²',
            temperature: '-160°C',
            atmosphere: 'Gases pesados e poeira carbonácea opaca',
            description: 'Um planeta enigmático que absorve quase 99% de toda a luz incidente, emitindo apenas um brilho violáceo sutil.',
            curiosity: 'Sua densidade incomum distorce os radares de navegação espacial ao se aproximar.',
            pointsOfInterest: ['Planície da Noite Eterna', 'Monólitos Negros', 'Cratera do Silêncio']
        },
        {
            id: 'cryo',
            name: 'Mundo 06 // Cryo-Prime',
            system: 'Setor Glacialis',
            type: 'Mundo Glacial Cristalino',
            radius: 3.6,
            color: 0x38bdf8,
            hasAtmosphere: true,
            atmosphereColor: 0xbae6fd,
            position: { x: -480, y: 220, z: 120 },
            gravity: '9.2 m/s²',
            temperature: '-195°C',
            atmosphere: 'Nitrogênio, Névoa de Metano, Cristais de Gelo',
            description: 'Uma superterra coberta por glaciares eternos de centenas de quilômetros de espessura e labirintos de fendas azuis.',
            curiosity: 'Abaixo da crosta congelada de 40 km, existe um oceano aquecido por fontes hidrotermais com vida extremófila.',
            pointsOfInterest: ['Garganta de Gelo Eterno', 'Gêiseres Criovulcânicos', 'Catedral de Gelo Polar']
        },
        {
            id: 'aurelia',
            name: 'Mundo 07 // Aurelia',
            system: 'Setor Solaria',
            type: 'Superterra Desértica Dourada',
            radius: 3.9,
            color: 0xf59e0b,
            hasAtmosphere: true,
            atmosphereColor: 0xfde68a,
            position: { x: 190, y: -290, z: 380 },
            gravity: '10.8 m/s²',
            temperature: '52°C',
            atmosphere: 'Dióxido de Carbono, Partículas de Silício em Suspensão',
            description: 'Mundo desértico de areias douradas brilhantes varrido por tempestades monumentais que cobrem hemisférios inteiros.',
            curiosity: 'As areias contêm alta concentração de partículas minerais douradas que refletem a luz estelar.',
            pointsOfInterest: ['O Grande Mar de Dunas', 'Cânion Dourado', 'Templo dos Ventos Cósmicos']
        },
        {
            id: 'zephyrus',
            name: 'Mundo 08 // Zephyrus',
            system: 'Setor Vortex',
            type: 'Gigante Gasoso Tempestuoso',
            radius: 7.2,
            color: 0x06b6d4,
            hasRings: true,
            ringInner: 9.0,
            ringOuter: 14.5,
            position: { x: -240, y: -350, z: -320 },
            gravity: '22.1 m/s²',
            temperature: '-135°C',
            atmosphere: 'Hidrogênio, Metano, Vapor de Amônia',
            description: 'Um gigante gasoso majestoso envolto por faixas turquesa e ciclones elétricos perpétuos, orbitado por 4 luas.',
            curiosity: 'Possui tempestades de relâmpagos contínuos que duram mais de 400 anos terrestres.',
            pointsOfInterest: ['Olho do Tufão Turquesa', 'Anéis de Plasma', 'Lua Boreas']
        },
        {
            id: 'chronos',
            name: 'Mundo 09 // Chronos-X',
            system: 'Setor Relíquia Antiga',
            type: 'Planeta Ruína Primordial',
            radius: 3.1,
            color: 0xa855f7,
            hasAtmosphere: true,
            atmosphereColor: 0xd8b4fe,
            position: { x: 340, y: 310, z: -120 },
            gravity: '7.8 m/s²',
            temperature: '8°C',
            atmosphere: 'Argônio, Oxigênio, Partículas Táquion',
            description: 'Um planeta antigo coberto por megamonólitos gravados com equações matemáticas universais de civilizações extintas.',
            curiosity: 'Campos temporais anômalos fazem o relógio da nave desacelerar em 12% na órbita baixa.',
            pointsOfInterest: ['Vale dos Monólitos do Tempo', 'Obelisco da Criação', 'Lago de Mercúrio Líquido']
        },
        {
            id: 'vortex-x',
            name: 'Mundo 10 // VORTEX-X (Buraco Negro)',
            system: 'Centro Galáctico Gargantua',
            type: 'Buraco Negro Supermassivo (Singularidade)',
            radius: 8.5,
            color: 0x000000,
            isBlackHole: true,
            hasAccretionDisk: true,
            position: { x: 0, y: -80, z: -650 },
            gravity: '∞ (Infinito no Horizonte de Eventos)',
            temperature: 'Milhões de Graus (Disco de Acreção)',
            atmosphere: 'Vácuo Quântico / Plasma Relativístico',
            description: 'Uma singularidade gravitacional colossal. A luz se curva em torno do horizonte de eventos e matéria colapsa a velocidades relativísticas.',
            curiosity: 'O tempo para completamente no horizonte de eventos sob a perspectiva de um observador externo.',
            pointsOfInterest: ['Horizonte de Eventos', 'Anel de Einstein (Lente Gravitacional)', 'Jato Relativístico Polar']
        }
    ],

    // Gerenciador de Descobertas e Exploração com LocalStorage
    DiscoveryStore: {
        STORAGE_KEY: 'universe_explorer_discoveries_v1',

        getDiscoveredIds() {
            try {
                const data = localStorage.getItem(this.STORAGE_KEY);
                return data ? JSON.parse(data) : ['earth']; // Terra inicia como descoberta
            } catch (e) {
                return ['earth'];
            }
        },

        recordDiscovery(id) {
            const list = this.getDiscoveredIds();
            if (!list.includes(id)) {
                list.push(id);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
                return true; // Nova descoberta!
            }
            return false;
        },

        getProgress() {
            const list = this.getDiscoveredIds();
            const total = UniverseData.celestialBodies.length;
            return {
                discovered: list.length,
                total: total,
                percent: Math.round((list.length / total) * 100)
            };
        }
    }
};

window.UniverseData = UniverseData;

