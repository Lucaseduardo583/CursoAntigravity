/**
 * ===================================================================
 * NEXUS EASTER EGGS - 20 Hidden Secrets, Glitches & Dimension Unlocks
 * Konami Code | Zero-Gravity | Matrix Rain | Mouse Shake | Lumos
 * ===================================================================
 */

class NexusEasterEggs {
    constructor() {
        this.unlockedCount = 0;
        this.totalEggs = 20;

        // Key sequences tracking
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiIndex = 0;
        this.typedBuffer = '';

        // Mouse velocity tracking
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.shakePoints = 0;
        this.lastShakeTime = 0;

        // Core click tracking
        this.coreClickCount = 0;
        this.coreClickTimer = null;

        // Idle detection
        this.idleTimer = null;
        this.isIdle = false;

        // Reversed nav order tracking
        this.reverseNavSequence = ['world', 'terminal', 'gallery', 'matrix', 'archive', 'ai', 'lab', 'core'];
        this.reverseNavIndex = 0;
    }

    init() {
        this.bindKonamiAndKeys();
        this.bindMouseShake();
        this.bindCoreClicks();
        this.bindIdleDetection();
        this.bindScrollSpeed();
        this.bindConsoleRiddle();
        this.bindCoordinatesClick();
    }

    // [1] Konami Code: Retro Arcade Scanlines & 8-Bit Chimes
    bindKonamiAndKeys() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();

            // Konami code step
            if (e.key === this.konamiCode[this.konamiIndex] || key === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.triggerKonamiArcade();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }

            // [12] Ctrl + Shift + X: Wireframe Mode
            if (e.ctrlKey && e.shiftKey && key === 'x') {
                e.preventDefault();
                this.triggerWireframeMode();
            }

            // Word typing buffers
            this.typedBuffer += key;
            if (this.typedBuffer.length > 20) {
                this.typedBuffer = this.typedBuffer.slice(-20);
            }

            // [11] Type '42'
            if (this.typedBuffer.endsWith('42')) {
                this.triggerDouglasAdams();
            }

            // [15] Type 'lumos'
            if (this.typedBuffer.endsWith('lumos')) {
                this.triggerLumos();
            }
        });
    }

    triggerKonamiArcade() {
        this.registerUnlock('KONAMI ARCADE RETRO');
        window.NexusAudio?.play8BitArpeggio();

        document.body.classList.toggle('crt-scanlines-active');
        const hud = document.getElementById('hud-overlay');
        if (hud) {
            hud.classList.add('arcade-glitch');
            setTimeout(() => hud.classList.remove('arcade-glitch'), 3500);
        }

        this.showEasterNotification('👾 EASTER EGG [1/20]: KONAMI CODE DESBLOQUEADO! MODO CRT RETRO ATIVO.');
    }

    // [2] Matrix Rain Overlay
    triggerMatrixRain() {
        this.registerUnlock('MATRIX RAIN OVERLAY');
        const canvas = document.getElementById('matrix-rain-canvas');
        if (!canvas) return;

        canvas.classList.remove('hidden');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンNEXUS';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);

        let frames = 0;
        const maxFrames = 380; // Runs for ~6 seconds

        const rainLoop = () => {
            frames++;
            ctx.fillStyle = 'rgba(5, 7, 15, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff66';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            if (frames < maxFrames) {
                requestAnimationFrame(rainLoop);
            } else {
                gsap.to(canvas, { opacity: 0, duration: 1.0, onComplete: () => {
                    canvas.classList.add('hidden');
                    canvas.style.opacity = '1';
                }});
            }
        };

        rainLoop();
        this.showEasterNotification('🟢 EASTER EGG [2/20]: DECODIFICAÇÃO MATRIX EM TEMPO REAL ATIVADA!');
    }

    // [6] Zero Gravity Interface
    triggerZeroGravity() {
        this.registerUnlock('ZERO GRAVITY UI');
        window.NexusAudio?.playQuantumPulse();

        const cards = document.querySelectorAll('.hud-card, .top-telemetry, .dim-nav-bar');
        cards.forEach((card) => {
            const rx = (Math.random() - 0.5) * 40;
            const ry = (Math.random() - 0.5) * 40;
            const tx = (Math.random() - 0.5) * 120;
            const ty = (Math.random() - 0.5) * 120;

            gsap.to(card, {
                x: tx,
                y: ty,
                rotation: rx,
                rotationY: ry,
                duration: 2.5,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
        });

        this.showEasterNotification('🪐 EASTER EGG [6/20]: GRAVIDADE ZERO TEMPORÁRIA DISPARADA!');
    }

    // [7] Triple Click Quantum Core
    bindCoreClicks() {
        const coreCanvas = document.getElementById('webgl-canvas-container');
        if (!coreCanvas) return;

        coreCanvas.addEventListener('click', (e) => {
            // Check if clicking near center in Core dimension
            if (window.NexusDimensions?.currentDimension !== 'core') return;

            this.coreClickCount++;
            clearTimeout(this.coreClickTimer);

            this.coreClickTimer = setTimeout(() => {
                this.coreClickCount = 0;
            }, 600);

            if (this.coreClickCount === 3) {
                this.coreClickCount = 0;
                this.registerUnlock('CORE OVERLOAD RESONANCE');
                window.Nexus3D?.coreOverloadShockwave();
                this.showEasterNotification('💥 EASTER EGG [7/20]: SOBRECARGA QUÂNTICA DISPARADA COM TRIPLO CLIQUE!');
            }
        });
    }

    // [8] Mouse Violent Shake Detection
    bindMouseShake() {
        window.addEventListener('mousemove', (e) => {
            const now = performance.now();
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            const speed = Math.sqrt(dx * dx + dy * dy);

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;

            if (speed > 85) {
                this.shakePoints++;
                if (this.shakePoints > 15 && now - this.lastShakeTime > 5000) {
                    this.lastShakeTime = now;
                    this.shakePoints = 0;
                    this.triggerGlitchDistortion();
                }
            } else {
                this.shakePoints = Math.max(0, this.shakePoints - 0.5);
            }
        });
    }

    triggerGlitchDistortion() {
        this.registerUnlock('TEMPORAL MOUSE GLITCH');
        window.NexusAudio?.playAccessDenied();

        const overlay = document.getElementById('glitch-screen-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('hidden'), 600);
        }

        this.showEasterNotification('⚡ EASTER EGG [8/20]: ANOMALIA DE VELOCIDADE CINÉTICA DETECTADA!');
    }

    // [9] Idle Screen Saver (60 Seconds)
    bindIdleDetection() {
        const resetIdle = () => {
            clearTimeout(this.idleTimer);
            if (this.isIdle) {
                this.isIdle = false;
                document.getElementById('screensaver-overlay')?.classList.add('hidden');
            }
            this.idleTimer = setTimeout(() => {
                this.isIdle = true;
                this.registerUnlock('DEEP IDLE HIBERNATION');
                document.getElementById('screensaver-overlay')?.classList.remove('hidden');
                this.showEasterNotification('🌙 EASTER EGG [9/20]: SISTEMA ENTROU EM HIBERNAÇÃO PROFUNDA (60S INATIVO).');
            }, 60000);
        };

        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('keydown', resetIdle);
        resetIdle();
    }

    // [10] Hyperspace Scroll Speed Burst
    bindScrollSpeed() {
        let lastScroll = performance.now();
        window.addEventListener('wheel', (e) => {
            const now = performance.now();
            const dt = now - lastScroll;
            lastScroll = now;

            if (Math.abs(e.deltaY) > 220 && dt < 40) {
                this.registerUnlock('HYPERSPACE SCROLL BURST');
                window.Nexus3D?.triggerHyperspace(2.5);
                this.showEasterNotification('🌌 EASTER EGG [10/20]: VELOCIDADE DA LUZ ATINGIDA PELO SCROLL!');
            }
        }, { passive: true });
    }

    // [11] Douglas Adams 42
    triggerDouglasAdams() {
        this.registerUnlock('THE ANSWER 42');
        window.NexusAudio?.playQuantumPulse();
        alert('🌌 "A Resposta para a Pergunta Fundamental sobre a Vida, o Universo e Tudo Mais é 42." — Douglas Adams');
    }

    // [12] Wireframe Mode
    triggerWireframeMode() {
        this.registerUnlock('X-RAY WIREFRAME MODE');
        window.NexusAudio?.playClick(1800);

        if (window.Nexus3D?.coreMesh) {
            window.Nexus3D.coreMesh.material.wireframe = !window.Nexus3D.coreMesh.material.wireframe;
            this.showEasterNotification(`👁️ EASTER EGG [12/20]: MODO RAIO-X 3D ${window.Nexus3D.coreMesh.material.wireframe ? 'ATIVADO' : 'DESATIVADO'}.`);
        }
    }

    // [14] Console Greeting Riddle
    bindConsoleRiddle() {
        console.log(`
%c
      .---.
     /     \\
    | () () |   NEXUS KERNEL ARCHIVE // RESTRICTED ACCESS
     \\  ^  /    Easter Egg [14/20] Descoberto pelo DevTools!
      |||||     Dica: Digite /secret no Terminal para ler mais.
      '|||'
`, 'color: #00f2fe; font-family: monospace; font-size: 13px; font-weight: bold;');
    }

    // [15] Lumos Cursor Light Orb
    triggerLumos() {
        this.registerUnlock('LUMOS LIGHT ORB');
        window.NexusAudio?.playClick(2000);

        const orb = document.getElementById('lumos-orb');
        if (orb) {
            orb.classList.remove('hidden');
            this.showEasterNotification('✨ EASTER EGG [15/20]: ESFERA DE LUZ LUMOS ACIONADA AO REDOR DO CURSOR!');
        }
    }

    // [19] Coordinates Clicked
    bindCoordinatesClick() {
        const coordBadge = document.getElementById('telemetry-coordinates');
        if (!coordBadge) return;

        coordBadge.addEventListener('click', () => {
            this.registerUnlock('QUANTUM COORDINATES EXTRACTION');
            window.NexusAudio?.playClick(1600);

            const hash = 'NX-09' + Math.random().toString(36).substring(2, 10).toUpperCase();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(hash);
            }
            this.showEasterNotification(`📡 EASTER EGG [19/20]: HASH COPIADO: [${hash}]. COORDENADA TEMPORAL SINCRONIZADA.`);
        });
    }

    registerUnlock(name) {
        this.unlockedCount++;
        const badge = document.getElementById('easter-egg-counter');
        if (badge) {
            badge.textContent = `ANOMALIAS: ${this.unlockedCount}/${this.totalEggs}`;
        }
    }

    showEasterNotification(msg) {
        const container = document.getElementById('easter-notification');
        if (!container) return;

        container.textContent = msg;
        container.classList.remove('hidden');
        gsap.fromTo(container, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });

        setTimeout(() => {
            gsap.to(container, { y: -30, opacity: 0, duration: 0.4, onComplete: () => {
                container.classList.add('hidden');
            }});
        }, 4500);
    }
}

// Global Singleton
window.NexusEasterEggs = new NexusEasterEggs();

