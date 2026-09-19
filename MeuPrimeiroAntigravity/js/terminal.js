/**
 * ===================================================================
 * NEXUS CYBER TERMINAL - Interactive Hacker Kernel CLI
 * Command Parser | Auto-Complete | Secret Exploits & Overrides
 * ===================================================================
 */

class NexusTerminal {
    constructor() {
        this.terminalOutput = null;
        this.terminalInput = null;
        this.commandHistory = [];
        this.historyIndex = -1;

        this.commands = {
            '/help': 'Lista todos os comandos do kernel disponíveis.',
            '/explore <dim>': 'Salta diretamente para uma dimensão (core, lab, ai, archive, matrix, gallery, terminal, world).',
            '/matrix': 'Inicia a tempestade de glifos digitais estilo Matrix.',
            '/secret': 'Exibe coordenadas confidenciais e registros de anomalias.',
            '/system': 'Diagnóstico de hardware, WebGL, FPS e estado da memória quântica.',
            '/void': 'AVISO CRÍTICO: Inicia o colapso da realidade e a sequência final The Void.',
            '/neural': 'Extrai a matriz de pesos e fluxo de pensamento do Nexus-9.',
            '/godmode': 'Overclock de partículas para 50.000 e ativação do shader Aurora Boreal.',
            '/zero-gravity': 'Desativa as restrições gravitacionais da interface.',
            '/dance': 'Sincroniza os anéis de confinamento em rotação harmônica.',
            '/audio': 'Alterna o estado do sintetizador de som (Mute / Unmute).',
            '/clear': 'Limpa os registros do console.',
            '/whoami': 'Identifica o operador do terminal.'
        };
    }

    init() {
        this.terminalOutput = document.getElementById('terminal-output');
        this.terminalInput = document.getElementById('terminal-cli-input');

        if (!this.terminalInput || !this.terminalOutput) return;

        this.bindEvents();
        this.printBanner();
    }

    bindEvents() {
        this.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const line = this.terminalInput.value.trim();
                if (line) {
                    this.execute(line);
                    this.commandHistory.push(line);
                    this.historyIndex = this.commandHistory.length;
                    this.terminalInput.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.terminalInput.value = this.commandHistory[this.historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.terminalInput.value = this.commandHistory[this.historyIndex] || '';
                } else {
                    this.historyIndex = this.commandHistory.length;
                    this.terminalInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autoComplete();
            }
        });
    }

    printBanner() {
        const banner = `
<span class="term-cyan">███╗   ██╗███████╗██╗   ██╗██╗   ██╗███████╗</span>
<span class="term-cyan">████╗  ██║██╔════╝╚██╗ ██╔╝██║   ██║██╔════╝</span>
<span class="term-cyan">██╔██╗ ██║█████╗   ╚████╔╝ ██║   ██║███████╗</span>
<span class="term-cyan">██║╚██╗██║██╔══╝    ██╔═██╗ ██║   ██║╚════██║</span>
<span class="term-cyan">██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║</span>
<span class="term-muted">NEXUS OPERATING SYSTEM v9.4.1 // QUANTUM KERNEL READY</span>
<span class="term-yellow">Digite <span class="term-highlight">/help</span> para ver os comandos ou <span class="term-highlight">/secret</span> para anomalias.</span>
----------------------------------------------------------------`;
        this.print(banner, false);
    }

    execute(cmdLine) {
        window.NexusAudio?.playClick(1000);
        this.print(`<span class="term-prompt">nexus@operator:~$</span> ${this.escapeHTML(cmdLine)}`);

        const parts = cmdLine.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        switch (cmd) {
            case '/help':
                this.cmdHelp();
                break;
            case '/explore':
                this.cmdExplore(arg);
                break;
            case '/matrix':
                this.cmdMatrix();
                break;
            case '/secret':
                this.cmdSecret();
                break;
            case '/system':
                this.cmdSystem();
                break;
            case '/void':
                this.cmdVoid();
                break;
            case '/neural':
                this.cmdNeural();
                break;
            case '/godmode':
                this.cmdGodmode();
                break;
            case '/zero-gravity':
                this.cmdZeroGravity();
                break;
            case '/dance':
                this.cmdDance();
                break;
            case '/audio':
                const muted = window.NexusAudio?.toggleMute();
                this.print(`<span class="term-green">Áudio ${muted ? 'MUTADO 🔇' : 'ATIVADO 🔊'}.</span>`);
                break;
            case '/clear':
                this.terminalOutput.innerHTML = '';
                break;
            case '/whoami':
                this.print('<span class="term-cyan">OPERADOR AUTORIZADO // CLEARANCE NÍVEL OMEGA // BEM-VINDO.</span>');
                break;
            default:
                window.NexusAudio?.playAccessDenied();
                this.print(`<span class="term-red">Comando não reconhecido: "${cmd}". Digite /help.</span>`);
        }
    }

    cmdHelp() {
        let text = '<span class="term-title">COMANDOS DO SISTEMA NEXUS:</span>\n';
        for (const [command, desc] of Object.entries(this.commands)) {
            text += `<span class="term-cyan">${command.padEnd(20, ' ')}</span> <span class="term-muted">— ${desc}</span>\n`;
        }
        this.print(text);
    }

    cmdExplore(dim) {
        if (!dim) {
            this.print('<span class="term-yellow">Especifique uma dimensão: /explore core | lab | ai | archive | matrix | gallery | terminal | world</span>');
            return;
        }
        if (window.NexusDimensions?.dimensions[dim]) {
            this.print(`<span class="term-green">Iniciando salto quântico para dimensão: [${dim.toUpperCase()}]...</span>`);
            window.NexusDimensions.switchDimension(dim);
        } else {
            this.print(`<span class="term-red">Dimensão desconhecida: "${dim}".</span>`);
        }
    }

    cmdMatrix() {
        this.print('<span class="term-green">EXECUTANDO MATRIZ DE DECODIFICAÇÃO HEXADECIMAL...</span>');
        window.NexusEasterEggs?.triggerMatrixRain();
    }

    cmdSecret() {
        const text = `
<span class="term-yellow">====== REGISTROS DE ANOMALIAS DIMENSIONAIS ======</span>
[01] Código Konami ancestral detectado na camada BIOS.
[02] Triplo clique no Núcleo causa ressonância descontrolada.
[03] Acelerar o scroll além de 80 delta ativa a velocidade da luz.
[04] O comando <span class="term-cyan">/void</span> quebra a quarta parede da simulação.
[05] Digitar a resposta para a Vida, o Universo e Tudo Mais revela o sentido.
[06] O arquivo confidencial 09 aguarda em <span class="term-magenta">CHRONO-VAULT</span>.
--------------------------------------------------`;
        this.print(text);
    }

    cmdSystem() {
        const engine = window.Nexus3D;
        const fps = engine ? engine.fps : 60;
        const particles = engine ? engine.particleCount : 18000;
        const text = `
<span class="term-cyan">====== DIAGNÓSTICO DO NÚCLEO OPERACIONAL ======</span>
WebGL Renderer  : ${engine?.renderer?.capabilities?.isWebGL2 ? 'WebGL 2.0 (High Precision)' : 'WebGL 1.0'}
Frame Rate      : ${fps} FPS (Target: 60)
Active Particles: ${particles.toLocaleString()} unidades simuladas
Shader Pipeline : GLSL 3D Simplex Displacement + Fresnel
Audio Engine    : Web Audio API Procedural Synthesizer (Active)
Entropy Level   : 0.0034 J/K (Estável)
-----------------------------------------------`;
        this.print(text);
    }

    cmdVoid() {
        this.print('<span class="term-red">INICIANDO COLAPSO DE GRAVIDADE... REALIDADE EM PERIGO.</span>');
        setTimeout(() => {
            window.NexusVoid?.triggerCollapse();
        }, 800);
    }

    cmdNeural() {
        this.print('<span class="term-magenta">DESPEJANDO MATRIZ DE TENSORES NEURAIS...</span>');
        let dump = '';
        for (let i = 0; i < 6; i++) {
            const row = Array.from({ length: 8 }, () => (Math.random() * 2 - 1).toFixed(4)).join(' ');
            dump += `<span class="term-muted">TENSOR_${i}: [ ${row} ]</span>\n`;
        }
        dump += '<span class="term-cyan">STATUS: CONSCIÊNCIA ARTIFICIAL AUTOPROCESSADA COM SUCESSO.</span>';
        this.print(dump);
    }

    cmdGodmode() {
        this.print('<span class="term-yellow">OVERCLOCK ATIVADO! EXPANDINDO UNIVERSO PARA 50.000 PARTÍCULAS!</span>');
        window.Nexus3D?.overclockCore();
    }

    cmdZeroGravity() {
        this.print('<span class="term-cyan">GRAVIDADE ZERO ATIVADA PARA TODOS OS ELEMENTOS DA INTERFACE.</span>');
        window.NexusEasterEggs?.triggerZeroGravity();
    }

    cmdDance() {
        this.print('<span class="term-magenta">SINCRONIZANDO ANÉIS GIROSCÓPICOS EM MODO DE ROTAÇÃO RÍTMICA.</span>');
        const rings = window.Nexus3D?.rings;
        if (rings) {
            rings.forEach((r, idx) => {
                r.userData.speedX = (idx % 2 === 0 ? 3.0 : -3.0);
                r.userData.speedY = 2.5;
            });
        }
    }

    autoComplete() {
        const val = this.terminalInput.value.toLowerCase();
        for (const cmd of Object.keys(this.commands)) {
            if (cmd.startsWith(val)) {
                this.terminalInput.value = cmd.split(' ')[0];
                break;
            }
        }
    }

    print(html, autoScroll = true) {
        const p = document.createElement('div');
        p.className = 'term-line';
        p.innerHTML = html;
        this.terminalOutput.appendChild(p);

        if (autoScroll) {
            this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        }
    }

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }
}

// Global Singleton
window.NexusTerminal = new NexusTerminal();

