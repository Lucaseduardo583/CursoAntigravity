/**
 * ===================================================================
 * FLIGHT CONTROLLER - Spaceship Navigation & Warp Jump Sequencer
 * 6-DOF Inertia | Hyperspace Travel | Cinematic Arrival | Virtual Joystick
 * ===================================================================
 */

class FlightController {
    constructor() {
        this.engine = null;
        this.camera = null;

        // Física e Vetores de Movimento
        this.velocity = new THREE.Vector3();
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.baseSpeed = 1.6;
        this.friction = 0.94;
        this.speedMultiplier = 1.0;

        // Estado das Teclas
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            boost: false,
            brake: false
        };

        // Estado do Mouse e Olhar
        this.isMouseDown = false;
        this.prevMouse = { x: 0, y: 0 };
        this.lookSpeed = 0.0022;

        // Estado de Viagem Hiperespacial
        this.isWarping = false;

        // Controles Móveis (Touch & Joystick)
        this.touchJoystick = { x: 0, y: 0, active: false };
    }

    init() {
        this.engine = window.UniverseEngine;
        if (!this.engine) return;
        this.camera = this.engine.camera;

        this.bindKeyboardEvents();
        this.bindMouseEvents();
        this.bindScrollZoom();
        this.bindTouchControls();

        // Loop de física
        this.updatePhysics();
    }

    // =========================================================
    // CONTROLES DE TECLADO DESKTOP (WASD, SHIFT, ESPAÇO)
    // =========================================================
    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            if (this.isWarping || e.target.tagName === 'INPUT') return;
            window.UniverseAudio?.init();

            switch (e.code) {
                case 'KeyW': this.keys.forward = true; break;
                case 'KeyS': this.keys.backward = true; break;
                case 'KeyA': this.keys.left = true; break;
                case 'KeyD': this.keys.right = true; break;
                case 'Space': this.keys.brake = true; break;
                case 'ShiftLeft': this.keys.boost = true; break;
                case 'KeyM': 
                    window.UniverseUI?.toggleMiniMap();
                    break;
                case 'KeyE': 
                    if (this.engine.focusedBody) {
                        window.UniverseUI?.openPlanetDossier(this.engine.focusedBody);
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.keys.forward = false; break;
                case 'KeyS': this.keys.backward = false; break;
                case 'KeyA': this.keys.left = false; break;
                case 'KeyD': this.keys.right = false; break;
                case 'Space': this.keys.brake = false; break;
                case 'ShiftLeft': this.keys.boost = false; break;
            }
        });
    }

    // =========================================================
    // CONTROLE DE CÂMERA PELO MOUSE (OLHAR AO REDOR)
    // =========================================================
    bindMouseEvents() {
        window.addEventListener('mousedown', (e) => {
            if (e.target.closest('button, input, .interactive-ui')) return;
            this.isMouseDown = true;
            this.prevMouse.x = e.clientX;
            this.prevMouse.y = e.clientY;
            window.UniverseAudio?.init();
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isMouseDown || this.isWarping) return;

            const dx = e.clientX - this.prevMouse.x;
            const dy = e.clientY - this.prevMouse.y;
            this.prevMouse.x = e.clientX;
            this.prevMouse.y = e.clientY;

            this.euler.setFromQuaternion(this.camera.quaternion);
            this.euler.y -= dx * this.lookSpeed;
            this.euler.x -= dy * this.lookSpeed;

            // Limite de pitch vertical
            this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
            this.camera.quaternion.setFromEuler(this.euler);
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    // =========================================================
    // ZOOM DINÂMICO CONTÍNUO (TRANSIÇÃO ENTRE AS 5 ESCALAS)
    // =========================================================
    bindScrollZoom() {
        window.addEventListener('wheel', (e) => {
            if (this.isWarping || e.target.closest('.scrollable-panel')) return;

            const zoomDelta = e.deltaY * 0.08;
            const forward = new THREE.Vector3();
            this.camera.getWorldDirection(forward);

            // Escala a velocidade do zoom com base na distância atual
            const currentDist = this.camera.position.length();
            const scaleFactor = Math.max(1.0, currentDist * 0.025);

            this.camera.position.addScaledVector(forward, -zoomDelta * scaleFactor);
            window.UniverseAudio?.init();
        }, { passive: true });
    }

    // =========================================================
    // FÍSICA DE NAVEGAÇÃO & INÉRCIA 6-DOF
    // =========================================================
    updatePhysics() {
        const tick = () => {
            requestAnimationFrame(tick);
            if (this.isWarping || !this.camera) return;

            const forward = new THREE.Vector3();
            this.camera.getWorldDirection(forward);
            const right = new THREE.Vector3().crossVectors(this.camera.up, forward).negate();

            // Aceleração e pós-combustor (Boost)
            this.speedMultiplier = this.keys.boost ? 3.8 : 1.0;
            const moveSpeed = this.baseSpeed * this.speedMultiplier;

            let thrustAmount = 0;

            if (this.keys.forward) {
                this.velocity.addScaledVector(forward, moveSpeed);
                thrustAmount = 1.0;
            }
            if (this.keys.backward) {
                this.velocity.addScaledVector(forward, -moveSpeed * 0.7);
                thrustAmount = 0.5;
            }
            if (this.keys.left) {
                this.velocity.addScaledVector(right, -moveSpeed * 0.8);
                thrustAmount = 0.5;
            }
            if (this.keys.right) {
                this.velocity.addScaledVector(right, moveSpeed * 0.8);
                thrustAmount = 0.5;
            }

            // Joystick móvel
            if (this.touchJoystick.active) {
                this.velocity.addScaledVector(forward, -this.touchJoystick.y * moveSpeed);
                this.velocity.addScaledVector(right, this.touchJoystick.x * moveSpeed);
                thrustAmount = Math.max(thrustAmount, 0.8);
            }

            // Frenagem instantânea com Espaço
            if (this.keys.brake) {
                this.velocity.multiplyScalar(0.7);
                thrustAmount = 0.1;
            } else {
                this.velocity.multiplyScalar(this.friction);
            }

            // Aplica translação
            this.camera.position.add(this.velocity);

            // Modula o som do motor espacial
            const speed = this.velocity.length();
            window.UniverseAudio?.setEngineThrust(thrustAmount * (this.keys.boost ? 1.5 : 1.0));

            // Atualiza telemetria no HUD
            window.UniverseUI?.updateFlightTelemetry(speed, this.camera.position);
        };
        tick();
    }

    // =========================================================
    // SEQUÊNCIA CINEMATOGRÁFICA DE VIAGEM WARP ("VIAJAR")
    // =========================================================
    travelToObject(targetId) {
        if (this.isWarping) return;

        const bodyData = UniverseData.celestialBodies.find(b => b.id === targetId);
        const mesh = this.engine?.celestialMeshes.get(targetId);
        if (!bodyData || !mesh) return;

        this.isWarping = true;
        window.UniverseAudio?.playWarpJump();

        // Posição final de órbita
        const targetWorldPos = new THREE.Vector3();
        mesh.getWorldPosition(targetWorldPos);

        const radius = bodyData.radius || 3.0;
        const orbitOffset = Math.max(radius * 3.5, 9.0);
        const finalCamPos = new THREE.Vector3(
            targetWorldPos.x,
            targetWorldPos.y + orbitOffset * 0.25,
            targetWorldPos.z + orbitOffset
        );

        // UI: Banner de Viagem Hiperespacial
        window.UniverseUI?.showWarpTravelBanner(bodyData.name);

        // Animação de FOV e Estiramento de Estrelas (Warp Streaks)
        const warpUniforms = this.engine.warpUniforms;
        if (warpUniforms && typeof gsap !== 'undefined') {
            gsap.to(warpUniforms.uWarp, { value: 2.2, duration: 0.8, ease: 'power2.in' });
            gsap.to(this.camera, { fov: 88, duration: 1.0, onUpdate: () => this.camera.updateProjectionMatrix() });
        }

        // Vôo de aproximação cinematográfica com curva Bézier
        if (typeof gsap !== 'undefined') {
            gsap.to(this.camera.position, {
                x: finalCamPos.x,
                y: finalCamPos.y,
                z: finalCamPos.z,
                duration: 3.2,
                ease: 'power3.inOut',
                onComplete: () => {
                    // Desaceleração e contração de FOV
                    if (warpUniforms) {
                        gsap.to(warpUniforms.uWarp, { value: 0.0, duration: 0.6 });
                        gsap.to(this.camera, { fov: 55, duration: 0.8, onUpdate: () => this.camera.updateProjectionMatrix() });
                    }

                    this.camera.lookAt(targetWorldPos);
                    this.isWarping = false;

                    // Sons e Chegada
                    window.UniverseAudio?.playArrivalChime();
                    window.UniverseUI?.showArrivalCompleteBanner(bodyData);

                    // Registro de Descoberta
                    const isNew = UniverseData.DiscoveryStore.recordDiscovery(targetId);
                    if (isNew) {
                        setTimeout(() => {
                            window.UniverseAudio?.playDiscoveryFanfare();
                            window.UniverseUI?.showNewDiscoveryAlert(bodyData);
                        }, 800);
                    }
                }
            });
        }
    }

    // =========================================================
    // CONTROLES DE TOQUE & JOYSTICK VIRTUAL PARA CELULAR
    // =========================================================
    bindTouchControls() {
        const joyBase = document.getElementById('virtual-joystick-base');
        const joyStick = document.getElementById('virtual-joystick-stick');
        if (!joyBase || !joyStick) return;

        let touchId = null;
        const maxDist = 38;

        joyBase.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            touchId = touch.identifier;
            this.touchJoystick.active = true;
            window.UniverseAudio?.init();
        });

        window.addEventListener('touchmove', (e) => {
            if (!this.touchJoystick.active) return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === touchId) {
                    const rect = joyBase.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    let dx = touch.clientX - centerX;
                    let dy = touch.clientY - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > maxDist) {
                        dx = (dx / dist) * maxDist;
                        dy = (dy / dist) * maxDist;
                    }

                    joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
                    this.touchJoystick.x = dx / maxDist;
                    this.touchJoystick.y = dy / maxDist;
                }
            }
        });

        const resetJoy = () => {
            this.touchJoystick.active = false;
            this.touchJoystick.x = 0;
            this.touchJoystick.y = 0;
            joyStick.style.transform = 'translate(0px, 0px)';
        };

        window.addEventListener('touchend', resetJoy);
        window.addEventListener('touchcancel', resetJoy);
    }
}

window.FlightController = new FlightController();

