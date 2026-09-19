/**
 * ===================================================================
 * UNIVERSE ENGINE - Three.js WebGL Cosmic Hierarchy & Custom Shaders
 * 5 Continuous Scales | Sol System | 10 Exotic Worlds | Black Hole
 * ===================================================================
 */

class UniverseEngine {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Grupos Hierárquicos das 5 Escalas
        this.systemGroup = new THREE.Group();     // Nível 1 & 2: Sistema Solar e Mundos
        this.deepSpaceGroup = new THREE.Group();  // Nível 3: Estrelas locais e nebulosas
        this.galaxyGroup = new THREE.Group();     // Nível 4: Braços espirais da Via Láctea
        this.cosmicWebGroup = new THREE.Group();  // Nível 5: Filamentos do Universo Observável

        // Objetos Interativos
        this.celestialMeshes = new Map(); // id -> THREE.Object3D
        this.orbitLines = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Shaders & Materiais Especiais
        this.sunUniforms = null;
        this.blackHoleUniforms = null;
        this.warpParticles = null;
        this.warpUniforms = null;

        // Estado do Alvo e Câmera
        this.focusedBody = null;
        this.currentScaleLevel = UniverseData.SCALES.PLANET;
    }

    init(containerId = 'universe-canvas-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // 1. Cena e Câmera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            250000
        );
        // Inicia próximo à Terra
        this.camera.position.set(54, 8, 68);

        // 2. Renderizador WebGL
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.3;
        this.container.appendChild(this.renderer.domElement);

        // 3. Montagem dos Níveis Cósmicos
        this.setupCosmicLighting();
        this.buildSolSystem();
        this.buildExoticWorlds();
        this.buildBlackHoleVortex();
        this.buildDeepSpaceStars();
        this.buildMilkyWayGalaxy();
        this.buildObservableUniverseWeb();
        this.buildHyperspaceWarpSystem();

        // 4. Listeners e Raycasting
        window.addEventListener('resize', () => this.onResize());
        this.container.addEventListener('click', (e) => this.onCanvasClick(e));

        // Inicia na Terra
        this.focusOnBody('earth', false);

        // 5. Início do Loop de Renderização
        this.animate();
    }

    setupCosmicLighting() {
        // Luz ambiente estelar suave
        const ambient = new THREE.AmbientLight(0x1e293b, 0.9);
        this.scene.add(ambient);

        // Luz pontual emitida pelo Sol
        this.sunLight = new THREE.PointLight(0xfff7ed, 3.2, 1200);
        this.sunLight.position.set(0, 0, 0);
        this.scene.add(this.sunLight);
    }

    // =========================================================
    // NÍVEL 1 & 2: SISTEMA SOLAR COM ÓRBITAS E LUAS
    // =========================================================
    buildSolSystem() {
        UniverseData.celestialBodies.forEach((data) => {
            if (data.system !== 'Sistema Solar') return;

            let mesh;
            if (data.id === 'sun') {
                mesh = this.createSunMesh(data);
            } else if (data.id === 'earth') {
                mesh = this.createEarthMesh(data);
            } else {
                mesh = this.createStandardPlanetMesh(data);
            }

            mesh.position.set(data.distanceFromCenter, 0, 0);
            mesh.userData = data;

            // Anéis Planetários (Saturno, Urano)
            if (data.hasRings) {
                this.addRingsToMesh(mesh, data);
            }

            // Luas (Lua da Terra)
            if (data.moons) {
                this.addMoonsToMesh(mesh, data);
            }

            // Órbitas Visíveis
            if (data.distanceFromCenter > 0) {
                const orbit = this.createOrbitLine(data.distanceFromCenter, data.color);
                this.systemGroup.add(orbit);
                this.orbitLines.push(orbit);
            }

            this.systemGroup.add(mesh);
            this.celestialMeshes.set(data.id, mesh);
        });

        // Cinturão de Asteroides entre Marte e Júpiter
        this.createAsteroidBelt(82, 96, 1200);

        this.scene.add(this.systemGroup);
    }

    createSunMesh(data) {
        const geo = new THREE.SphereGeometry(data.radius, 48, 48);

        // Shader da Corona Solar com turbulência
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vNormal;

            void main() {
                float pulse = sin(vUv.x * 20.0 + uTime * 2.0) * cos(vUv.y * 20.0 + uTime * 2.0) * 0.15;
                vec3 baseColor = vec3(1.0, 0.65, 0.1);
                vec3 hotColor = vec3(1.0, 0.95, 0.7);

                vec3 viewDir = vec3(0.0, 0.0, 1.0);
                float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);

                vec3 finalColor = mix(baseColor, hotColor, pulse + 0.3) + (fresnel * 0.5);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        this.sunUniforms = { uTime: { value: 0 } };
        const mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.sunUniforms
        });

        const sun = new THREE.Mesh(geo, mat);

        // Brilho exterior da Corona Solar
        const glowGeo = new THREE.SphereGeometry(data.radius * 1.35, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.25,
            side: THREE.BackSide
        });
        sun.add(new THREE.Mesh(glowGeo, glowMat));

        return sun;
    }

    createEarthMesh(data) {
        const earthGroup = new THREE.Group();

        // 1. Superfície Terrestre
        const surfaceGeo = new THREE.SphereGeometry(data.radius, 48, 48);
        const surfaceMat = new THREE.MeshStandardMaterial({
            color: 0x1d4ed8,
            roughness: 0.6,
            metalness: 0.1
        });
        const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
        earthGroup.add(surface);

        // 2. Camada de Nuvens Animadas
        const cloudGeo = new THREE.SphereGeometry(data.radius * 1.02, 36, 36);
        const cloudMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
        });
        this.earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
        earthGroup.add(this.earthClouds);

        // 3. Brilho Atmosférico (Fresnel Glow)
        const atmosGeo = new THREE.SphereGeometry(data.radius * 1.15, 32, 32);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        earthGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

        return earthGroup;
    }

    createStandardPlanetMesh(data) {
        const geo = new THREE.SphereGeometry(data.radius, 36, 36);
        const mat = new THREE.MeshStandardMaterial({
            color: data.color,
            roughness: 0.7,
            metalness: 0.15
        });
        const mesh = new THREE.Mesh(geo, mat);

        if (data.hasAtmosphere) {
            const atmosGeo = new THREE.SphereGeometry(data.radius * 1.12, 24, 24);
            const atmosMat = new THREE.MeshBasicMaterial({
                color: data.atmosphereColor || data.color,
                transparent: true,
                opacity: 0.25,
                side: THREE.BackSide
            });
            mesh.add(new THREE.Mesh(atmosGeo, atmosMat));
        }

        return mesh;
    }

    addRingsToMesh(mesh, data) {
        const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: data.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.2;
        mesh.add(ring);
    }

    addMoonsToMesh(mesh, data) {
        data.moons.forEach((m) => {
            const moonGeo = new THREE.SphereGeometry(m.radius, 16, 16);
            const moonMat = new THREE.MeshStandardMaterial({ color: m.color });
            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
            moonMesh.position.set(m.dist, 0, 0);
            moonMesh.userData = m;
            mesh.add(moonMesh);
        });
    }

    createOrbitLine(radius, color) {
        const points = [];
        for (let i = 0; i <= 128; i++) {
            const theta = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color: color || 0x334155,
            transparent: true,
            opacity: 0.22
        });
        return new THREE.Line(geom, mat);
    }

    createAsteroidBelt(inner, outer, count) {
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = inner + Math.random() * (outer - inner);
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 3.5;

            positions[i3] = Math.cos(theta) * r;
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(theta) * r;

            const shade = 0.4 + Math.random() * 0.4;
            colors[i3] = shade;
            colors[i3 + 1] = shade * 0.9;
            colors[i3 + 2] = shade * 0.8;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.7,
            vertexColors: true,
            transparent: true,
            opacity: 0.75
        });

        this.asteroidBelt = new THREE.Points(geom, mat);
        this.systemGroup.add(this.asteroidBelt);
    }

    // =========================================================
    // NÍVEL 3: 10 MUNDOS EXÓTICOS E SETORES GALÁCTICOS
    // =========================================================
    buildExoticWorlds() {
        UniverseData.celestialBodies.forEach((data) => {
            if (data.system === 'Sistema Solar' || data.isBlackHole) return;

            const mesh = this.createStandardPlanetMesh(data);
            mesh.position.set(data.position.x, data.position.y, data.position.z);
            mesh.userData = data;

            if (data.hasRings) {
                this.addRingsToMesh(mesh, data);
            }

            // Baliza estelar marcadora
            const beaconGeo = new THREE.SphereGeometry(0.6, 8, 8);
            const beaconMat = new THREE.MeshBasicMaterial({ color: data.color });
            const beacon = new THREE.Mesh(beaconGeo, beaconMat);
            beacon.position.y = data.radius + 3;
            mesh.add(beacon);

            this.deepSpaceGroup.add(mesh);
            this.celestialMeshes.set(data.id, mesh);
        });

        this.scene.add(this.deepSpaceGroup);
    }

    // =========================================================
    // BURACO NEGRO SUPERMASSIVO: VORTEX-X (LENTE GRAVITACIONAL)
    // =========================================================
    buildBlackHoleVortex() {
        const data = UniverseData.celestialBodies.find(b => b.id === 'vortex-x');
        if (!data) return;

        const bhGroup = new THREE.Group();
        bhGroup.position.set(data.position.x, data.position.y, data.position.z);
        bhGroup.userData = data;

        // 1. Horizonte de Eventos (Esfera Negra Absoluta)
        const eventHorizonGeo = new THREE.SphereGeometry(data.radius, 48, 48);
        const eventHorizonMat = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const eventHorizon = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
        bhGroup.add(eventHorizon);

        // 2. Disco de Acreção Relativístico com Shader
        const diskGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 3.8, 96);
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vPos;
            void main() {
                vUv = uv;
                vPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uTime;
            varying vec2 vUv;
            varying vec3 vPos;

            void main() {
                float dist = length(vPos);
                float angle = atan(vPos.y, vPos.x);

                // Relativistic swirling beams
                float swirl = sin(angle * 8.0 - dist * 0.8 + uTime * 4.0);
                float doppler = (vPos.x / dist) * 0.4 + 0.6; // Beaming effect

                vec3 coreOrange = vec3(1.0, 0.45, 0.05);
                vec3 edgeCyan = vec3(0.1, 0.8, 1.0);

                vec3 color = mix(coreOrange, edgeCyan, (dist - 12.0) / 20.0);
                color *= (swirl * 0.3 + 0.7) * doppler;

                float alpha = clamp(1.0 - (dist / 32.0), 0.0, 0.95);
                gl_FragColor = vec4(color, alpha);
            }
        `;

        this.blackHoleUniforms = { uTime: { value: 0 } };
        const diskMat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.blackHoleUniforms,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const disk = new THREE.Mesh(diskGeo, diskMat);
        disk.rotation.x = Math.PI / 2.3;
        bhGroup.add(disk);

        // 3. Anel de Einstein (Lente Gravitacional Óptica)
        const einsteinGeo = new THREE.RingGeometry(data.radius * 1.02, data.radius * 1.25, 64);
        const einsteinMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85
        });
        const einstein = new THREE.Mesh(einsteinGeo, einsteinMat);
        einstein.rotation.x = Math.PI / 2.3;
        bhGroup.add(einstein);

        this.deepSpaceGroup.add(bhGroup);
        this.celestialMeshes.set('vortex-x', bhGroup);
    }

    // =========================================================
    // NÍVEL 3: ESTRELAS DO ESPAÇO PROFUNDO E NEBULOSAS
    // =========================================================
    buildDeepSpaceStars() {
        const count = 12000;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const starColors = [
            new THREE.Color(0x93c5fd), // Estrela Azul Tipo-O
            new THREE.Color(0xffffff), // Estrela Branca Tipo-A
            new THREE.Color(0xfef08a), // Estrela Amarela Tipo-G
            new THREE.Color(0xfba260), // Estrela Laranja Tipo-K
            new THREE.Color(0xf87171)  // Anã Vermelha Tipo-M
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Distribuição esférica gigantesca
            const radius = 250 + Math.random() * 2500;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;

            positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i3 + 1] = radius * Math.sin(phi);
            positions[i3 + 2] = radius * Math.cos(theta) * Math.cos(phi);

            const c = starColors[Math.floor(Math.random() * starColors.length)];
            colors[i3] = c.r;
            colors[i3 + 1] = c.g;
            colors[i3 + 2] = c.b;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        this.starsMesh = new THREE.Points(geom, mat);
        this.scene.add(this.starsMesh);
    }

    // =========================================================
    // NÍVEL 4: VIA LÁCTEA (BRAÇOS ESPIRAIS LOGARÍTMICOS)
    // =========================================================
    buildMilkyWayGalaxy() {
        const particleCount = 28000;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const arms = 4;
        const spin = 3.2;
        const galaxyRadius = 4500;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const r = Math.pow(Math.random(), 1.8) * galaxyRadius;
            const armIndex = i % arms;
            const armAngle = (armIndex / arms) * Math.PI * 2;
            const spinAngle = (r / galaxyRadius) * spin;

            // Dispersão ao redor dos braços
            const randomSpreadX = (Math.random() - 0.5) * (r * 0.2 + 20);
            const randomSpreadY = (Math.random() - 0.5) * (r * 0.08 + 10);
            const randomSpreadZ = (Math.random() - 0.5) * (r * 0.2 + 20);

            positions[i3] = Math.cos(armAngle + spinAngle) * r + randomSpreadX;
            positions[i3 + 1] = randomSpreadY;
            positions[i3 + 2] = Math.sin(armAngle + spinAngle) * r + randomSpreadZ;

            // Gradiente cromático: Núcleo dourado -> Braços azul-violeta
            const distRatio = r / galaxyRadius;
            const coreColor = new THREE.Color(0xfef08a);
            const armColor = new THREE.Color(0x38bdf8);
            const finalC = coreColor.clone().lerp(armColor, distRatio);

            colors[i3] = finalC.r;
            colors[i3 + 1] = finalC.g;
            colors[i3 + 2] = finalC.b;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 2.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.galaxyMesh = new THREE.Points(geom, mat);
        this.galaxyGroup.add(this.galaxyMesh);
        this.scene.add(this.galaxyGroup);
    }

    // =========================================================
    // NÍVEL 5: UNIVERSO OBSERVÁVEL (FILAMENTOS CÓSMICOS)
    // =========================================================
    buildObservableUniverseWeb() {
        const clusterCount = 3500;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(clusterCount * 3);
        const colors = new Float32Array(clusterCount * 3);

        const universeRadius = 45000;

        for (let i = 0; i < clusterCount; i++) {
            const i3 = i * 3;
            // Distribuição de filamentos em grande escala
            const r = 8000 + Math.random() * universeRadius;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;

            positions[i3] = r * Math.sin(theta) * Math.cos(phi);
            positions[i3 + 1] = r * Math.sin(phi);
            positions[i3 + 2] = r * Math.cos(theta) * Math.cos(phi);

            // Cores das galáxias distantes
            colors[i3] = 0.5 + Math.random() * 0.5;
            colors[i3 + 1] = 0.6 + Math.random() * 0.4;
            colors[i3 + 2] = 1.0;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 14.0,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.cosmicWebMesh = new THREE.Points(geom, mat);
        this.cosmicWebGroup.add(this.cosmicWebMesh);
        this.scene.add(this.cosmicWebGroup);
    }

    // =========================================================
    // SISTEMA DE DOBRA HIPERESPACIAL (WARP STREAKS)
    // =========================================================
    buildHyperspaceWarpSystem() {
        const count = 3000;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 80;
            positions[i3 + 1] = (Math.random() - 0.5) * 80;
            positions[i3 + 2] = (Math.random() - 0.5) * 120;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const vertexShader = `
            uniform float uWarp;
            void main() {
                vec3 pos = position;
                if (uWarp > 0.0) {
                    pos.z *= (1.0 + uWarp * 3.5);
                }
                vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = (1.5 + uWarp * 3.0) * (60.0 / -mv.z);
                gl_Position = projectionMatrix * mv;
            }
        `;

        const fragmentShader = `
            uniform float uWarp;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                vec3 warpColor = mix(vec3(1.0), vec3(0.0, 0.95, 1.0), uWarp);
                gl_FragColor = vec4(warpColor, clamp(uWarp * 0.9, 0.0, 0.9));
            }
        `;

        this.warpUniforms = { uWarp: { value: 0.0 } };
        const mat = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.warpUniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.warpParticles = new THREE.Points(geom, mat);
        this.scene.add(this.warpParticles);
    }

    // =========================================================
    // SELEÇÃO & INTERAÇÃO COM CORPOS CELESTES
    // =========================================================
    focusOnBody(bodyId, animate = true) {
        const mesh = this.celestialMeshes.get(bodyId);
        if (!mesh) return;

        const data = mesh.userData;
        this.focusedBody = data;

        // Determina a posição alvo de órbita da câmera
        const targetWorldPos = new THREE.Vector3();
        mesh.getWorldPosition(targetWorldPos);

        const radius = data.radius || 3.0;
        const offsetDist = Math.max(radius * 3.2, 7.5);
        const camTarget = new THREE.Vector3(
            targetWorldPos.x,
            targetWorldPos.y + offsetDist * 0.25,
            targetWorldPos.z + offsetDist
        );

        if (animate && typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, {
                x: camTarget.x,
                y: camTarget.y,
                z: camTarget.z,
                duration: 2.2,
                ease: 'power3.inOut'
            });
        } else {
            this.camera.position.copy(camTarget);
        }

        // Notifica a interface
        window.UniverseUI?.updateSelectedPlanet(data);
    }

    onCanvasClick(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const targets = Array.from(this.celestialMeshes.values());
        const intersects = this.raycaster.intersectObjects(targets, true);

        if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && !hit.userData?.name) {
                hit = hit.parent;
            }
            if (hit.userData && hit.userData.id) {
                window.UniverseAudio?.playUIBeep(1400);
                this.focusOnBody(hit.userData.id, true);
            }
        }
    }

    // =========================================================
    // CÁLCULO CONTÍNUO DO NÍVEL DE ESCALA CÓSMICA
    // =========================================================
    updateCosmicScaleLevel() {
        const dist = this.camera.position.length();

        let newScale;
        if (dist < 120) {
            newScale = UniverseData.SCALES.PLANET;
        } else if (dist < 500) {
            newScale = UniverseData.SCALES.SOLAR_SYSTEM;
        } else if (dist < 1600) {
            newScale = UniverseData.SCALES.DEEP_SPACE;
        } else if (dist < 4200) {
            newScale = UniverseData.SCALES.MILKY_WAY;
        } else {
            newScale = UniverseData.SCALES.OBSERVABLE;
        }

        if (newScale !== this.currentScaleLevel) {
            this.currentScaleLevel = newScale;
            window.UniverseUI?.updateScaleIndicator(newScale);
        }

        // Alerta de Proximidade do Buraco Negro
        const bhMesh = this.celestialMeshes.get('vortex-x');
        if (bhMesh) {
            const bhDist = this.camera.position.distanceTo(bhMesh.position);
            const proximity = Math.max(0, 1.0 - (bhDist / 180.0));
            window.UniverseAudio?.setBlackHoleProximity(proximity);
            window.UniverseUI?.updateBlackHoleAlert(proximity > 0.35);
        }
    }

    // =========================================================
    // LOOP DE ANIMAÇÃO & FÍSICA ORBITAL
    // =========================================================
    animate() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // 1. Shaders de Tempo
        if (this.sunUniforms) this.sunUniforms.uTime.value = time;
        if (this.blackHoleUniforms) this.blackHoleUniforms.uTime.value = time;

        // 2. Órbita e Rotação Planetária do Sistema Solar
        UniverseData.celestialBodies.forEach((data) => {
            const mesh = this.celestialMeshes.get(data.id);
            if (!mesh) return;

            // Rotação própria no eixo
            if (data.rotationSpeed) {
                mesh.rotation.y += data.rotationSpeed;
            }

            // Translação orbital
            if (data.orbitSpeed && data.distanceFromCenter > 0) {
                const angle = time * data.orbitSpeed;
                mesh.position.x = Math.cos(angle) * data.distanceFromCenter;
                mesh.position.z = Math.sin(angle) * data.distanceFromCenter;
            }
        });

        // 3. Rotação das Nuvens da Terra
        if (this.earthClouds) {
            this.earthClouds.rotation.y += 0.003;
        }

        // 4. Rotação Lenta da Via Láctea e Asteroides
        if (this.galaxyMesh) this.galaxyMesh.rotation.y = time * 0.004;
        if (this.asteroidBelt) this.asteroidBelt.rotation.y = time * 0.008;

        // 5. Atualiza o sistema de partículas Warp acompanhando a câmera
        if (this.warpParticles) {
            this.warpParticles.position.copy(this.camera.position);
            this.warpParticles.rotation.copy(this.camera.rotation);
        }

        // 6. Atualiza Escalas e LOD
        this.updateCosmicScaleLevel();

        // 7. Render da Cena
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}

window.UniverseEngine = new UniverseEngine();

