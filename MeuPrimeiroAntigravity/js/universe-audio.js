/**
 * ===================================================================
 * UNIVERSE AUDIO ENGINE - Procedural Space Flight Synthesizer
 * Engine Drone | Hyperdrive Warp | Arrival Chime | Black Hole Siren
 * ===================================================================
 */

class UniverseAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('universe_audio_muted') === 'true';
        this.engineOsc = null;
        this.engineGain = null;
        this.engineFilter = null;
        this.blackHoleGain = null;
        this.blackHoleOsc = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0001 : 0.65, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.startEngineDrone();
            this.initialized = true;
        } catch (e) {
            console.warn('Audio initialization waiting for user interaction');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('universe_audio_muted', this.isMuted);
        if (this.masterGain && this.ctx) {
            const target = this.isMuted ? 0.0001 : 0.65;
            this.masterGain.gain.exponentialRampToValueAtTime(target, this.ctx.currentTime + 0.1);
        }
        return this.isMuted;
    }

    // 1. Zumbido Contínuo dos Motores da Nave (Sub-grave modulado pela velocidade)
    startEngineDrone() {
        if (this.engineOsc || !this.ctx) return;

        const now = this.ctx.currentTime;
        this.engineOsc = this.ctx.createOscillator();
        this.engineOsc.type = 'sawtooth';
        this.engineOsc.frequency.setValueAtTime(55.0, now); // A1 note

        this.engineFilter = this.ctx.createBiquadFilter();
        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(90, now);
        this.engineFilter.Q.setValueAtTime(3.0, now);

        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.setValueAtTime(0.08, now);

        this.engineOsc.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.masterGain);

        this.engineOsc.start();
    }

    // Modula o som do motor de acordo com a aceleração
    setEngineThrust(thrustRatio = 0.0) {
        if (!this.engineFilter || !this.engineOsc || !this.ctx) return;
        const now = this.ctx.currentTime;
        const targetFreq = 90 + Math.min(thrustRatio * 280, 450);
        const targetPitch = 55.0 + Math.min(thrustRatio * 40.0, 110.0);

        this.engineFilter.frequency.setTargetAtTime(targetFreq, now, 0.1);
        this.engineOsc.frequency.setTargetAtTime(targetPitch, now, 0.1);
    }

    // 2. Viagem de Dobra Hiperespacial (Warp Jump)
    playWarpJump() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
        osc.frequency.exponentialRampToValueAtTime(70, now + 3.0);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3800, now + 1.0);
        filter.frequency.exponentialRampToValueAtTime(180, now + 3.0);
        filter.Q.setValueAtTime(4.0, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.3);
    }

    // 3. Chegada em Órbita ("ARRIVAL COMPLETE")
    playArrivalChime() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const chord = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5

        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.001, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.08 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 1.3);
        });
    }

    // 4. Fanfarra de Nova Descoberta ("NEW WORLD DISCOVERED")
    playDiscoveryFanfare() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const melody = [
            { f: 523.25, t: 0.00 }, // C5
            { f: 659.25, t: 0.12 }, // E5
            { f: 783.99, t: 0.24 }, // G5
            { f: 1046.50, t: 0.38 } // C6
        ];

        melody.forEach((note) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now + note.t);

            gain.gain.setValueAtTime(0.001, now + note.t);
            gain.gain.linearRampToValueAtTime(0.2, now + note.t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + 0.9);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + note.t);
            osc.stop(now + note.t + 1.0);
        });
    }

    // 5. Alarme Gravitacional do Buraco Negro
    setBlackHoleProximity(proximityRatio = 0.0) {
        if (!this.ctx) return;

        if (proximityRatio <= 0.05) {
            if (this.blackHoleGain) {
                this.blackHoleGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.2);
            }
            return;
        }

        if (!this.blackHoleOsc) {
            const now = this.ctx.currentTime;
            this.blackHoleOsc = this.ctx.createOscillator();
            this.blackHoleOsc.type = 'sawtooth';
            this.blackHoleOsc.frequency.setValueAtTime(45.0, now);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, now);

            this.blackHoleGain = this.ctx.createGain();
            this.blackHoleGain.gain.setValueAtTime(0.0001, now);

            this.blackHoleOsc.connect(filter);
            filter.connect(this.blackHoleGain);
            this.blackHoleGain.connect(this.masterGain);

            this.blackHoleOsc.start();
        }

        const now = this.ctx.currentTime;
        const targetVol = Math.min(proximityRatio * 0.35, 0.35);
        const targetPitch = 45.0 + proximityRatio * 35.0;

        this.blackHoleGain.gain.setTargetAtTime(targetVol, now, 0.1);
        this.blackHoleOsc.frequency.setTargetAtTime(targetPitch, now, 0.1);
    }

    // 6. UI Beeps e Cliques Cibernéticos
    playUIBeep(freq = 1200) {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
    }
}

window.UniverseAudio = new UniverseAudioEngine();

