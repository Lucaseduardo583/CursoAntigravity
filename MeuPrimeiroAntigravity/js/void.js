/**
 * ===================================================================
 * NEXUS VOID - The Ultimate Cinematic AAA Ending Sequence
 * "YOU WERE NEVER JUST VISITING THE WEBSITE."
 * Reality Breakdown | Event Horizon Singularity | Cosmic Epilogue
 * ===================================================================
 */

class NexusVoid {
    constructor() {
        this.isActive = false;
        this.overlay = null;
    }

    init() {
        this.overlay = document.getElementById('void-cinematic-overlay');
    }

    triggerCollapse() {
        if (this.isActive) return;
        this.isActive = true;

        // 1. Audio dive
        window.NexusAudio?.playVoidCollapse();

        // 2. Flicker & Glitch HUD
        document.body.classList.add('reality-glitch-active');

        // 3. Deconstruct Text
        const titleElements = document.querySelectorAll('.dim-header h1, .hud-card, .top-telemetry');
        titleElements.forEach((el) => {
            gsap.to(el, {
                opacity: 0,
                scale: 0.8,
                y: 100,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power2.in'
            });
        });

        // 4. Black Hole camera rush in 3D scene
        const engine = window.Nexus3D;
        if (engine) {
            engine.mode = 'void';
            gsap.to(engine.camera.position, {
                x: 0, y: 0, z: 8,
                duration: 3.5,
                ease: 'power4.in'
            });

            // Turn Core into pure dark Singularity
            if (engine.coreUniforms) {
                gsap.to(engine.coreUniforms.uColorA.value, { r: 0, g: 0, b: 0, duration: 2.0 });
                gsap.to(engine.coreUniforms.uColorB.value, { r: 0.05, g: 0, b: 0.1, duration: 2.0 });
                gsap.to(engine.coreUniforms.uDistort, { value: 4.0, duration: 2.5 });
            }
        }

        // 5. Reveal Void Overlay & Message
        setTimeout(() => {
            this.showVoidCinematic();
        }, 3000);
    }

    showVoidCinematic() {
        if (!this.overlay) return;
        this.overlay.classList.remove('hidden');

        // Reveal the monumental message slowly
        const msgEl = document.getElementById('void-main-message');
        const subMsgEl = document.getElementById('void-sub-message');
        const creditsEl = document.getElementById('void-credits-roll');
        const rebootBtn = document.getElementById('void-reboot-btn');

        gsap.to(this.overlay, { opacity: 1, duration: 1.5 });

        // Typewriter message
        const messageText = "YOU WERE NEVER JUST VISITING THE WEBSITE.";
        msgEl.textContent = '';
        let i = 0;

        const interval = setInterval(() => {
            if (i < messageText.length) {
                msgEl.textContent += messageText.charAt(i);
                window.NexusAudio?.playNeuralBlip(320);
                i++;
            } else {
                clearInterval(interval);

                // Reveal sub-message and credits
                setTimeout(() => {
                    gsap.to(subMsgEl, { opacity: 1, y: 0, duration: 1.0 });
                    gsap.to(creditsEl, { opacity: 1, y: 0, duration: 1.5, delay: 0.6 });
                    gsap.to(rebootBtn, { opacity: 1, duration: 1.0, delay: 1.8 });
                }, 800);
            }
        }, 65);

        // Bind Reboot
        rebootBtn?.addEventListener('click', () => {
            this.rebootUniverse();
        });
    }

    rebootUniverse() {
        window.NexusAudio?.playWarp();
        gsap.to(this.overlay, {
            opacity: 0,
            duration: 1.0,
            onComplete: () => {
                location.reload(); // Clean restore of timeline
            }
        });
    }
}

// Global Singleton
window.NexusVoid = new NexusVoid();

