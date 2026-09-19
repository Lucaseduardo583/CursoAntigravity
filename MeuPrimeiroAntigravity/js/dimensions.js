/**
 * ===================================================================
 * NEXUS DIMENSIONS CONTROLLER - 8 Immersive Real-Time Environments
 * Camera Choreography | Dimensional Waypoints | Telemetry Shifts
 * ===================================================================
 */

class NexusDimensions {
    constructor() {
        this.currentDimension = 'core';
        this.isTransitioning = false;

        this.dimensions = {
            core: {
                id: 'core',
                title: '01 // QUANTUM CORE',
                subtitle: 'Singularidade Quântica & Confinamento Magnético',
                camPos: { x: 0, y: 0, z: 42 },
                lookAt: { x: 0, y: 0, z: 0 },
                ambientIntensity: 1.0,
                colorAccent: '#00f2fe'
            },
            lab: {
                id: 'lab',
                title: '02 // QUANTUM LAB',
                subtitle: 'Poço Gravitacional Interativo & Manipulação de Partículas',
                camPos: { x: -26, y: 14, z: 34 },
                lookAt: { x: -5, y: 0, z: 0 },
                ambientIntensity: 1.5,
                colorAccent: '#f72585'
            },
            ai: {
                id: 'ai',
                title: '03 // AI CORE NEXUS-9',
                subtitle: 'Interface Neural Holográfica & Matriz de Sinapses',
                camPos: { x: 28, y: 8, z: 30 },
                lookAt: { x: 5, y: 0, z: 0 },
                ambientIntensity: 1.3,
                colorAccent: '#7209b7'
            },
            archive: {
                id: 'archive',
                title: '04 // CLASSIFIED ARCHIVE',
                subtitle: 'Dossiês Digitais & Blueprints de Megaprojetos',
                camPos: { x: 0, y: 26, z: 32 },
                lookAt: { x: 0, y: 2, z: 0 },
                ambientIntensity: 0.9,
                colorAccent: '#4cc9f0'
            },
            matrix: {
                id: 'matrix',
                title: '05 // GLOBAL MATRIX',
                subtitle: 'Telemetria de Redes Planetárias & Tráfego em Tempo Real',
                camPos: { x: -32, y: -12, z: 38 },
                lookAt: { x: 0, y: -5, z: 0 },
                ambientIntensity: 1.8,
                colorAccent: '#00ff66'
            },
            gallery: {
                id: 'gallery',
                title: '06 // SHADER GALLERY',
                subtitle: 'Arte Algorítmica, Fracais & Campos de Fluxo Matemáticos',
                camPos: { x: 30, y: -14, z: 35 },
                lookAt: { x: 5, y: -4, z: 0 },
                ambientIntensity: 1.4,
                colorAccent: '#ff007f'
            },
            terminal: {
                id: 'terminal',
                title: '07 // CYBER TERMINAL',
                subtitle: 'Linha de Comando Kernel & Acesso aos Registros Secretos',
                camPos: { x: 0, y: -8, z: 28 },
                lookAt: { x: 0, y: 0, z: 0 },
                ambientIntensity: 0.8,
                colorAccent: '#00f2fe'
            },
            world: {
                id: 'world',
                title: '08 // COSMIC FREE-FLIGHT',
                subtitle: 'Exploração Espacial Livre (Controles WASD + Mouse)',
                camPos: { x: 0, y: 5, z: 70 },
                lookAt: { x: 0, y: 0, z: -100 },
                ambientIntensity: 2.0,
                colorAccent: '#ffe600'
            }
        };
    }

    init() {
        this.bindNavEvents();
        this.bindLabInteraction();
        this.bindWorldFlightControls();
        this.updateHUD(this.dimensions.core);
    }

    bindNavEvents() {
        const navButtons = document.querySelectorAll('.dim-nav-btn');
        navButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const targetDim = btn.dataset.dim;
                this.switchDimension(targetDim);
            });
        });

        // Scroll to travel between dimensions
        let scrollTimeout = null;
        window.addEventListener('wheel', (e) => {
            if (this.isTransitioning || window.Nexus3D.mode === 'freeflight') return;
            if (Math.abs(e.deltaY) < 40) return;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const dimKeys = Object.keys(this.dimensions);
                const currentIndex = dimKeys.indexOf(this.currentDimension);
                let nextIndex = e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1;

                if (nextIndex >= 0 && nextIndex < dimKeys.length) {
                    this.switchDimension(dimKeys[nextIndex]);
                }
            }, 80);
        }, { passive: true });
    }

    switchDimension(dimId) {
        if (!this.dimensions[dimId] || this.isTransitioning || this.currentDimension === dimId) return;

        const target = this.dimensions[dimId];
        this.isTransitioning = true;
        this.currentDimension = dimId;

        // Audio & Visual Warp
        window.NexusAudio?.playWarp();
        window.NexusAudio?.modulateAmbient(target.ambientIntensity);
        window.Nexus3D?.triggerHyperspace(1.4);

        // Update Nav UI
        document.querySelectorAll('.dim-nav-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.dim === dimId);
        });

        // Camera flight transition with GSAP
        const engine = window.Nexus3D;
        if (engine) {
            // Free flight toggle
            if (dimId === 'world') {
                engine.mode = 'freeflight';
                document.getElementById('flight-hud')?.classList.remove('hidden');
            } else {
                engine.mode = 'orbit';
                document.getElementById('flight-hud')?.classList.add('hidden');
            }

            gsap.to(engine.cameraTarget, {
                x: target.camPos.x,
                y: target.camPos.y,
                z: target.camPos.z,
                duration: 1.8,
                ease: 'power3.inOut'
            });

            gsap.to(engine.lookAtTarget, {
                x: target.lookAt.x,
                y: target.lookAt.y,
                z: target.lookAt.z,
                duration: 1.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    this.isTransitioning = false;
                }
            });
        }

        this.updateHUD(target);
        this.activateDimensionPanels(dimId);
    }

    updateHUD(target) {
        const titleEl = document.getElementById('dim-header-title');
        const subtitleEl = document.getElementById('dim-header-subtitle');
        const badgeEl = document.getElementById('dim-indicator-badge');

        if (titleEl) {
            gsap.fromTo(titleEl, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });
            titleEl.textContent = target.title;
            titleEl.style.textShadow = `0 0 20px ${target.colorAccent}`;
        }
        if (subtitleEl) {
            subtitleEl.textContent = target.subtitle;
        }
        if (badgeEl) {
            badgeEl.textContent = target.id.toUpperCase();
            badgeEl.style.borderColor = target.colorAccent;
            badgeEl.style.boxShadow = `0 0 15px ${target.colorAccent}44`;
        }
    }

    activateDimensionPanels(dimId) {
        document.querySelectorAll('.dimension-panel').forEach((panel) => {
            panel.classList.add('hidden');
        });

        const activePanel = document.getElementById(`panel-${dimId}`);
        if (activePanel) {
            activePanel.classList.remove('hidden');
            gsap.fromTo(activePanel, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 });
        }
    }

    // =========================================================
    // INTERACTIVE LAB: MOUSE GRAVITY WELL
    // =========================================================
    bindLabInteraction() {
        const canvas = document.getElementById('webgl-canvas-container');
        if (!canvas) return;

        let isMouseDown = false;

        canvas.addEventListener('mousedown', (e) => {
            if (this.currentDimension !== 'lab') return;
            isMouseDown = true;
            this.updateGravityFromMouse(e, 3.5);
        });

        window.addEventListener('mousemove', (e) => {
            if (this.currentDimension !== 'lab' || !isMouseDown) return;
            this.updateGravityFromMouse(e, 2.5);
        });

        window.addEventListener('mouseup', () => {
            if (this.currentDimension !== 'lab') return;
            isMouseDown = false;
            window.Nexus3D?.clearGravityWell();
        });
    }

    updateGravityFromMouse(e, strength = 2.0) {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Project mouse vector to 3D space
        const target3D = new THREE.Vector3(mouseX * 35, mouseY * 25, 0);
        window.Nexus3D?.setGravityWell(target3D.x, target3D.y, target3D.z, strength);
    }

    // =========================================================
    // WORLD FREE FLIGHT CONTROLS (WASD + MOUSE LOOK)
    // =========================================================
    bindWorldFlightControls() {
        window.addEventListener('keydown', (e) => {
            if (this.currentDimension !== 'world') return;
            const flight = window.Nexus3D?.flight;
            if (!flight) return;

            switch (e.code) {
                case 'KeyW': flight.forward = 1; break;
                case 'KeyS': flight.forward = -1; break;
                case 'KeyA': flight.right = -1; break;
                case 'KeyD': flight.right = 1; break;
                case 'Space': flight.up = 1; break;
                case 'ShiftLeft': flight.up = -1; break;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.currentDimension !== 'world') return;
            const flight = window.Nexus3D?.flight;
            if (!flight) return;

            switch (e.code) {
                case 'KeyW':
                case 'KeyS': flight.forward = 0; break;
                case 'KeyA':
                case 'KeyD': flight.right = 0; break;
                case 'Space':
                case 'ShiftLeft': flight.up = 0; break;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (this.currentDimension !== 'world') return;
            const flight = window.Nexus3D?.flight;
            if (!flight) return;

            flight.yaw = -(e.clientX / window.innerWidth - 0.5) * Math.PI;
            flight.pitch = -(e.clientY / window.innerHeight - 0.5) * (Math.PI / 2);
        });
    }
}

// Global Singleton
window.NexusDimensions = new NexusDimensions();

