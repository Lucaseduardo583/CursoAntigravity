/**
 * ===================================================================
 * NEXUS SOUND ENGINE - Procedural Web Audio API Synthesizer
 * 100% Procedural | Zero External Audio Files | 3D Spatial Effects
 * ===================================================================
 */

class NexusAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.ambientDrone = null;
        this.droneGain = null;
        this.filterNode = null;
        this.initialized = false;
        this.activeNodes = new Set();
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.startAmbientDrone();
            this.initialized = true;
        } catch (e) {
            console.warn('Audio Context init deferred until user interaction');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            const targetGain = this.isMuted ? 0 : 0.7;
            this.masterGain.gain.exponentialRampToValueAtTime(Math.max(targetGain, 0.0001), this.ctx.currentTime + 0.1);
        }
        return this.isMuted;
    }

    // 1. Ambient Deep Space / Reactor Drone (Generative Sub-Bass + Harmonics)
    startAmbientDrone() {
        if (this.ambientDrone || !this.ctx) return;

        const now = this.ctx.currentTime;

        // Sub osc (40 Hz)
        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(43.65, now); // F1 note

        // LFO for subtle pulse modulation
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.2, now); // 0.2 Hz breathing pulse

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(15, now);

        // Lowpass filter
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(120, now);
        this.filterNode.Q.setValueAtTime(4.0, now);

        lfo.connect(lfoGain);
        lfoGain.connect(this.filterNode.frequency);

        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.setValueAtTime(0.08, now);

        subOsc.connect(this.filterNode);
        this.filterNode.connect(this.droneGain);
        this.droneGain.connect(this.masterGain);

        subOsc.start();
        lfo.start();
        this.ambientDrone = { subOsc, lfo };
    }

    // Modulate ambient filter based on dimension / speed
    modulateAmbient(intensity = 1.0) {
        if (!this.filterNode || !this.ctx) return;
        const targetFreq = 120 + Math.min(intensity * 300, 800);
        this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.4);
    }

    // 2. High-Tech Cyber UI Click
    playClick(freq = 1200) {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.04);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // 3. UI Hover Chime
    playHover() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // 4. Warp / Dimension Shift Sound
    playWarp() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        
        // Sweeping noise oscillator simulation
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.6);
        osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(200, now + 1.2);
        filter.Q.setValueAtTime(5.0, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.25);
    }

    // 5. Quantum Core Pulse / Energy Discharge
    playQuantumPulse() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(150, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.8);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(300, now);
        osc2.frequency.exponentialRampToValueAtTime(75, now + 0.8);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.9);
        osc2.stop(now + 0.9);
    }

    // 6. Neural Synthesizer Voice Blip (for AI response typing)
    playNeuralBlip(pitch = 500) {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const variedPitch = pitch + (Math.random() * 80 - 40);
        osc.frequency.setValueAtTime(variedPitch, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // 7. Gravity Well / Physics Distortion
    playGravityDistortion(distortLevel = 1.0) {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const baseFreq = Math.max(60, 280 - distortLevel * 140);
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.1);
        osc.frequency.linearRampToValueAtTime(baseFreq, now + 0.2);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    // 8. Error / Access Denied Alarm
    playAccessDenied() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // 9. Retro 8-bit Konami Chime
    play8BitArpeggio() {
        if (this.isMuted || !this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;
        const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.08, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.1);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.12);
        });
    }

    // 10. Singularity / The Void Collapse Drone
    playVoidCollapse() {
        if (!this.ctx) return;
        this.resume();

        const now = this.ctx.currentTime;

        // Giant pitch dive
        const osc = this.ctx.createOscillator();
        const sub = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 4.5);

        sub.type = 'sine';
        sub.frequency.setValueAtTime(200, now);
        sub.frequency.exponentialRampToValueAtTime(18, now + 5.0);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 4.0);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(filter);
        sub.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination); // Direct bypass mute for cinematic ending

        osc.start(now);
        sub.start(now);
        osc.stop(now + 6.0);
        sub.stop(now + 6.0);
    }
}

// Export singleton instance
window.NexusAudio = new NexusAudioEngine();

