/**
 * ===================================================================
 * NEXUS 3D ENGINE - WebGL / Three.js Universe & Custom Shaders
 * Core Reactor | 25k Particle Nebula | Gravitational Physics | Hyperspace
 * ===================================================================
 */

class Nexus3DEngine {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Object Groups
        this.coreGroup = new THREE.Group();
        this.ringsGroup = new THREE.Group();
        this.particleSystem = null;
        this.gridPlane = null;
        this.worldObjects = new THREE.Group();

        // Shader Uniforms
        this.coreUniforms = null;
        this.particleUniforms = null;

        // Interaction state
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.isWarping = false;
        this.gravityWell = null; // { x, y, z, strength }
        this.mode = 'orbit'; // 'orbit' | 'freeflight' | 'void'
        this.flight = {
            forward: 0, right: 0, up: 0,
            pitch: 0, yaw: 0,
            velocity: new THREE.Vector3(),
            speed: 1.2
        };

        // Waypoints for dimensions
        this.cameraTarget = new THREE.Vector3(0, 0, 42);
        this.lookAtTarget = new THREE.Vector3(0, 0, 0);

        // Performance & LOD
        this.fps = 60;
        this.frameCount = 0;
        this.lastFpsTime = performance.now();
        this.particleCount = 18000;
        this.isOverclocked = false;
    }

    init(containerId = 'webgl-canvas-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x05070f, 0.012);

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 0, 42);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);

        // 4. Lighting
        this.setupLights();

        // 5. Construct 3D Universe
        this.createQuantumCore();
        this.createGyroscopicRings();
        this.createParticleNebula();
        this.createInfiniteCyberGrid();
        this.createWorldMegastructures();

        // 6. Listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // 7. Start render loop
        this.animate();
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(0x0c122b, 1.8);
        this.scene.add(ambient);

        // Core Point Lights (Cyan + Magenta energy)
        this.coreLightCyan = new THREE.PointLight(0x00f2fe, 3.5, 80);
        this.coreLightCyan.position.set(0, 0, 0);
        this.scene.add(this.coreLightCyan);

        this.coreLightMagenta = new THREE.PointLight(0xf72585, 2.8, 70);
        this.coreLightMagenta.position.set(5, 5, 5);
        this.scene.add(this.coreLightMagenta);

        this.dirLight = new THREE.DirectionalLight(0x4361ee, 1.5);
        this.dirLight.position.set(20, 40, 20);
        this.scene.add(this.dirLight);
    }

    // =========================================================
    // QUANTUM SINGULARITY CORE (Custom GLSL Shaders)
    // =========================================================
    createQuantumCore() {
        const geometry = new THREE.IcosahedronGeometry(4.5, 30);

        this.coreUniforms = {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(0x00f2fe) },
            uColorB: { value: new THREE.Color(0xf72585) },
            uColorCore: { value: new THREE.Color(0xffffff) },
            uPulse: { value: 1.0 },
            uNoiseScale: { value: 1.4 },
            uDistort: { value: 0.8 }
        };

        const vertexShader = `
            uniform float uTime;
            uniform float uNoiseScale;
            uniform float uDistort;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vNoise;

            // Simplex Noise 3D Implementation
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

            float snoise(vec3 v){
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + 1.0 * C.xxx;
                vec3 x2 = x0 - i2 + 2.0 * C.xxx;
                vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
                i = mod(i, 289.0 );
                vec4 p = permute( permute( permute(
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + D.yyyy;
                vec4 y = y_ *ns.x + D.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                // Pulsing displacement noise
                float noise = snoise(position * uNoiseScale + vec3(uTime * 0.4));
                vNoise = noise;
                vec3 newPosition = position + normal * (noise * uDistort);
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uTime;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            uniform vec3 uColorCore;
            uniform float uPulse;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vNoise;

            void main() {
                // Fresnel view angle intensity
                vec3 viewDir = normalize(-vPosition);
                float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);

                // Chromatic mixing based on noise
                vec3 color = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
                color = mix(color, uColorCore, pow(fresnel, 2.5) * uPulse);

                // Emissive energy glow
                float alpha = clamp(0.75 + fresnel * 0.4, 0.0, 1.0);

                gl_FragColor = vec4(color + vec3(fresnel * 0.5), alpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.coreUniforms,
            transparent: true,
            blending: THREE.AdditiveBlending,
            wireframe: false
        });

        this.coreMesh = new THREE.Mesh(geometry, material);
        this.coreGroup.add(this.coreMesh);

        // Inner crystalline wireframe core
        const innerGeo = new THREE.OctahedronGeometry(2.4, 2);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });
        this.innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
        this.coreGroup.add(this.innerCoreMesh);

        this.scene.add(this.coreGroup);
    }

    // =========================================================
    // CONCENTRIC GYROSCOPIC RINGS
    // =========================================================
    createGyroscopicRings() {
        const ringConfigs = [
            { radius: 6.8, tube: 0.08, color: 0x00f2fe, speedX: 0.4, speedY: 0.6 },
            { radius: 8.5, tube: 0.09, color: 0xf72585, speedX: -0.5, speedY: 0.3 },
            { radius: 10.4, tube: 0.07, color: 0x7209b7, speedX: 0.3, speedY: -0.4 },
            { radius: 12.8, tube: 0.06, color: 0x4cc9f0, speedX: -0.2, speedY: -0.5 }
        ];

        this.rings = [];

        ringConfigs.forEach((cfg) => {
            const geom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
            const mat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                emissive: cfg.color,
                emissiveIntensity: 0.8,
                metalness: 0.9,
                roughness: 0.2,
                wireframe: false
            });

            const ring = new THREE.Mesh(geom, mat);
            ring.userData = cfg;

            // Small glowing node cubes on the ring
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const nodeGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
                const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
                nodeMesh.position.set(
                    Math.cos(angle) * cfg.radius,
                    Math.sin(angle) * cfg.radius,
                    0
                );
                ring.add(nodeMesh);
            }

            this.ringsGroup.add(ring);
            this.rings.push(ring);
        });

        this.scene.add(this.ringsGroup);
    }

    // =========================================================
    // 25K PARTICLES NEBULA WITH GRAVITATIONAL PHYSICS
    // =========================================================
    createParticleNebula() {
        const count = this.particleCount;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const originalPos = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const scales = new Float32Array(count);

        const palette = [
            new THREE.Color(0x00f2fe),
            new THREE.Color(0xf72585),
            new THREE.Color(0x7209b7),
            new THREE.Color(0x4cc9f0),
            new THREE.Color(0xffffff)
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Spherical distribution around core with long galaxy arms
            const radius = 8 + Math.pow(Math.random(), 1.5) * 80;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = (radius * Math.sin(phi)) * 0.45; // flatten disc
            const z = radius * Math.cos(theta) * Math.cos(phi);

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            originalPos[i3] = x;
            originalPos[i3 + 1] = y;
            originalPos[i3 + 2] = z;

            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            scales[i] = Math.random() * 2.5 + 0.8;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        geometry.userData = { originalPos, velocities };

        // Shaders for circular glowing particles
        const vertexShader = `
            attribute float aScale;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uWarp;

            void main() {
                vColor = color;
                vec3 pos = position;
                
                // Warp stretch
                if (uWarp > 0.0) {
                    pos.z += sin(pos.x + uTime * 10.0) * (uWarp * 8.0);
                }

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = aScale * (180.0 / -mvPosition.z) * (1.0 + uWarp * 1.5);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying vec3 vColor;

            void main() {
                // Circular gradient point
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                float alpha = pow(1.0 - (dist * 2.0), 1.8);
                gl_FragColor = vec4(vColor, alpha * 0.85);
            }
        `;

        this.particleUniforms = {
            uTime: { value: 0 },
            uWarp: { value: 0.0 }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: this.particleUniforms,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    // =========================================================
    // INFINITE CYBER HORIZON GRID
    // =========================================================
    createInfiniteCyberGrid() {
        const size = 300;
        const divisions = 60;
        const gridHelper = new THREE.GridHelper(size, divisions, 0x00f2fe, 0x111c38);
        gridHelper.position.y = -22;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.35;
        this.gridPlane = gridHelper;
        this.scene.add(gridHelper);
    }

    // =========================================================
    // WORLD MEGASTRUCTURES (For 3D Free Exploration)
    // =========================================================
    createWorldMegastructures() {
        // Floating monoliths / Quantum orbital obelisks
        const obeliskGeo = new THREE.BoxGeometry(3, 24, 3);
        const obeliskMat = new THREE.MeshStandardMaterial({
            color: 0x090d1a,
            metalness: 0.95,
            roughness: 0.1,
            wireframe: false
        });

        for (let i = 0; i < 18; i++) {
            const mesh = new THREE.Mesh(obeliskGeo, obeliskMat);
            const angle = (i / 18) * Math.PI * 2;
            const dist = 60 + Math.sin(i * 1.5) * 20;

            mesh.position.set(
                Math.cos(angle) * dist,
                Math.sin(i * 3.0) * 15,
                Math.sin(angle) * dist
            );
            mesh.rotation.y = angle;
            mesh.rotation.z = Math.sin(i) * 0.2;

            // Glowing edge line
            const edges = new THREE.EdgesGeometry(obeliskGeo);
            const lineMat = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0x00f2fe : 0xf72585,
                transparent: true,
                opacity: 0.7
            });
            const wireframe = new THREE.LineSegments(edges, lineMat);
            mesh.add(wireframe);

            this.worldObjects.add(mesh);
        }

        this.scene.add(this.worldObjects);
    }

    // =========================================================
    // INTERACTIVE GRAVITY WELL (LAB DIMENSION)
    // =========================================================
    setGravityWell(x, y, z, strength = 1.0) {
        this.gravityWell = { x, y, z, strength };
        window.NexusAudio?.playGravityDistortion(strength);
    }

    clearGravityWell() {
        this.gravityWell = null;
    }

    // Trigger Hyperspace Jump Effect
    triggerHyperspace(duration = 2.0) {
        this.isWarping = true;
        window.NexusAudio?.playWarp();

        gsap.to(this.particleUniforms.uWarp, {
            value: 2.5,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => {
                gsap.to(this.particleUniforms.uWarp, {
                    value: 0.0,
                    duration: duration,
                    ease: 'power3.out',
                    onComplete: () => {
                        this.isWarping = false;
                    }
                });
            }
        });
    }

    // Overclock Easter Egg: Increases particle count / aurora colors
    overclockCore() {
        this.isOverclocked = true;
        this.coreUniforms.uPulse.value = 2.5;
        this.coreUniforms.uDistort.value = 1.8;
        this.coreUniforms.uColorA.value = new THREE.Color(0xff0055);
        this.coreUniforms.uColorB.value = new THREE.Color(0x00ffcc);
        window.NexusAudio?.playQuantumPulse();
    }

    // Triple Click Core Overload
    coreOverloadShockwave() {
        window.NexusAudio?.playQuantumPulse();

        // Screen shake + expanding blast ring
        const blastGeo = new THREE.RingGeometry(0.1, 1.2, 64);
        const blastMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1.0
        });
        const blast = new THREE.Mesh(blastGeo, blastMat);
        blast.rotation.x = Math.PI / 2;
        this.scene.add(blast);

        gsap.to(blast.scale, {
            x: 80, y: 80, z: 80,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => {
                this.scene.remove(blast);
                blast.geometry.dispose();
                blast.material.dispose();
            }
        });

        gsap.to(blastMat, {
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
        });
    }

    // =========================================================
    // UPDATE & RENDER LOOP
    // =========================================================
    animate() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // 1. Update Core Shaders & Rotation
        if (this.coreUniforms) {
            this.coreUniforms.uTime.value = time;
        }
        if (this.innerCoreMesh) {
            this.innerCoreMesh.rotation.x = time * 0.4;
            this.innerCoreMesh.rotation.y = -time * 0.6;
        }

        // 2. Rotate Gyro Rings
        this.rings.forEach((ring) => {
            ring.rotation.x += ring.userData.speedX * dt;
            ring.rotation.y += ring.userData.speedY * dt;
        });

        // 3. Update Particle System & Gravity Well
        if (this.particleSystem) {
            this.particleUniforms.uTime.value = time;

            const posAttr = this.particleSystem.geometry.attributes.position;
            const positions = posAttr.array;
            const { originalPos, velocities } = this.particleSystem.geometry.userData;
            const count = posAttr.count;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Gravitational Well effect
                if (this.gravityWell) {
                    const dx = this.gravityWell.x - positions[i3];
                    const dy = this.gravityWell.y - positions[i3 + 1];
                    const dz = this.gravityWell.z - positions[i3 + 2];
                    const distSq = dx * dx + dy * dy + dz * dz + 10.0;
                    const force = (this.gravityWell.strength * 40.0) / distSq;

                    velocities[i3] += dx * force * dt;
                    velocities[i3 + 1] += dy * force * dt;
                    velocities[i3 + 2] += dz * force * dt;
                } else {
                    // Return spring towards original orbit
                    const ox = originalPos[i3];
                    const oy = originalPos[i3 + 1];
                    const oz = originalPos[i3 + 2];

                    velocities[i3] += (ox - positions[i3]) * 0.3 * dt;
                    velocities[i3 + 1] += (oy - positions[i3 + 1]) * 0.3 * dt;
                    velocities[i3 + 2] += (oz - positions[i3 + 2]) * 0.3 * dt;

                    // Orbital drift
                    velocities[i3] += -oz * 0.04 * dt;
                    velocities[i3 + 2] += ox * 0.04 * dt;
                }

                // Apply dampening
                velocities[i3] *= 0.98;
                velocities[i3 + 1] *= 0.98;
                velocities[i3 + 2] *= 0.98;

                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];
            }

            posAttr.needsUpdate = true;
        }

        // 4. Update Grid Horizon
        if (this.gridPlane) {
            this.gridPlane.position.z = (time * 6.0) % (300 / 60);
        }

        // 5. Rotate Megastructures
        this.worldObjects.rotation.y = time * 0.02;

        // 6. Camera Motion & Parallax
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

        if (this.mode === 'orbit') {
            // Smooth lerp to dimensional waypoint + mouse parallax
            this.camera.position.x += (this.cameraTarget.x + this.mouse.x * 6 - this.camera.position.x) * 0.05;
            this.camera.position.y += (this.cameraTarget.y + this.mouse.y * 4 - this.camera.position.y) * 0.05;
            this.camera.position.z += (this.cameraTarget.z - this.camera.position.z) * 0.05;
            this.camera.lookAt(this.lookAtTarget);
        } else if (this.mode === 'freeflight') {
            // Free flight WASD controller
            const forward = new THREE.Vector3();
            this.camera.getWorldDirection(forward);
            const right = new THREE.Vector3().crossVectors(this.camera.up, forward).negate();

            this.flight.velocity.addScaledVector(forward, this.flight.forward * this.flight.speed);
            this.flight.velocity.addScaledVector(right, this.flight.right * this.flight.speed);
            this.flight.velocity.y += this.flight.up * this.flight.speed;

            this.camera.position.add(this.flight.velocity);
            this.flight.velocity.multiplyScalar(0.9); // Friction

            this.camera.rotation.y = this.flight.yaw;
            this.camera.rotation.x = this.flight.pitch;
        }

        // 7. Render Scene
        this.renderer.render(this.scene, this.camera);
        this.calculateFPS();
    }

    calculateFPS() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
            this.frameCount = 0;
            this.lastFpsTime = now;

            const fpsBadge = document.getElementById('fps-counter');
            if (fpsBadge) fpsBadge.textContent = `${this.fps} FPS`;
        }
    }

    onMouseMove(e) {
        this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}

// Global Singleton
window.Nexus3D = new Nexus3DEngine();

