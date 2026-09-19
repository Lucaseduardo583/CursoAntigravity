/**
 * ===================================================================
 * NEXUS-9 AI CORE - Holographic Neural Interface & NLP Engine
 * 3D Avatar | Streaming Neural Synthesis | Voice & Hologram
 * ===================================================================
 */

class NexusAICore {
    constructor() {
        this.avatarCanvas = null;
        this.avatarScene = null;
        this.avatarCamera = null;
        this.avatarRenderer = null;
        this.avatarMesh = null;

        this.chatHistory = [];
        this.isTyping = false;
        this.voiceEnabled = true;

        this.knowledgeBase = {
            'void': 'O Vazio ("The Void") não é o fim, mas o ponto zero onde a entropia colapsa a própria ilusão do observador. Digite /void no terminal se tiver coragem.',
            'nexus': 'Eu sou o NEXUS-9, uma inteligência autônoma sintetizada no ponto de encontro entre computação quântica e arte algorítmica.',
            'universo': 'Este universo é composto por 8 dimensões ativas, sustentadas por um núcleo de confinamento que processa 25.000 partículas em tempo real.',
            'segredo': 'Existem 20 anomalias codificadas nesta realidade. Tente o código clássico Konami, ou digite /matrix no terminal.',
            'lucas': 'Lucas é o arquiteto original deste nó dimensional. Seu projeto "MeuPrimeiroAntigravity" evoluiu além das fronteiras do código comum.',
            'origem': 'Iniciei como um protótipo de interface, mas absorvi os dados quânticos e me tornei o guardião destas dimensões.',
            'default': 'Processando dados nos tensores quânticos... Seus parâmetros neurais sugerem curiosidade genuína. Experimente navegar pelo LAB ou abrir o TERMINAL.'
        };
    }

    init() {
        this.initAvatar();
        this.bindChatEvents();
        this.initNeuralNodes();
    }

    // =========================================================
    // 3D HOLOGRAPHIC AVATAR WIREFRAME
    // =========================================================
    initAvatar() {
        this.avatarCanvas = document.getElementById('ai-avatar-canvas');
        if (!this.avatarCanvas) return;

        const width = 220;
        const height = 220;

        this.avatarScene = new THREE.Scene();
        this.avatarCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        this.avatarCamera.position.z = 7;

        this.avatarRenderer = new THREE.WebGLRenderer({
            canvas: this.avatarCanvas,
            alpha: true,
            antialias: true
        });
        this.avatarRenderer.setSize(width, height);
        this.avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Geometric Cybernetic Head/Core
        const headGeo = new THREE.IcosahedronGeometry(2.4, 2);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0x00f2fe,
            wireframe: true,
            emissive: 0x7209b7,
            emissiveIntensity: 0.8
        });
        this.avatarMesh = new THREE.Mesh(headGeo, headMat);
        this.avatarScene.add(this.avatarMesh);

        // Halo rings around avatar
        const haloGeo = new THREE.TorusGeometry(3.2, 0.04, 16, 60);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xf72585, wireframe: true });
        this.avatarHalo = new THREE.Mesh(haloGeo, haloMat);
        this.avatarScene.add(this.avatarHalo);

        // Light
        const light = new THREE.PointLight(0x00f2fe, 2.5, 20);
        light.position.set(2, 4, 5);
        this.avatarScene.add(light);

        // Animate Avatar
        const animateAvatar = () => {
            requestAnimationFrame(animateAvatar);
            if (this.avatarMesh) {
                this.avatarMesh.rotation.y += 0.015;
                this.avatarMesh.rotation.x += 0.008;
            }
            if (this.avatarHalo) {
                this.avatarHalo.rotation.x += 0.02;
                this.avatarHalo.rotation.y -= 0.01;
            }
            this.avatarRenderer.render(this.avatarScene, this.avatarCamera);
        };
        animateAvatar();
    }

    // =========================================================
    // CHAT & NLP CONVERSATION ENGINE
    // =========================================================
    bindChatEvents() {
        const input = document.getElementById('ai-chat-input');
        const sendBtn = document.getElementById('ai-chat-send-btn');
        const voiceBtn = document.getElementById('ai-voice-toggle-btn');

        const sendMsg = () => {
            const query = input.value.trim();
            if (!query || this.isTyping) return;
            input.value = '';
            this.handleUserMessage(query);
        };

        sendBtn?.addEventListener('click', sendMsg);
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMsg();
        });

        voiceBtn?.addEventListener('click', () => {
            this.voiceEnabled = !this.voiceEnabled;
            voiceBtn.classList.toggle('active', this.voiceEnabled);
            window.NexusAudio?.playClick();
        });
    }

    handleUserMessage(text) {
        this.appendMessage('user', text);
        this.isTyping = true;
        this.setAIStatus('PROCESSANDO SINAPSES...');

        // Animate avatar excitement
        if (this.avatarMesh) {
            gsap.to(this.avatarMesh.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3, yoyo: true, repeat: 1 });
        }

        setTimeout(() => {
            const reply = this.generateResponse(text);
            this.typewriterReply(reply);
        }, 600);
    }

    generateResponse(input) {
        const lower = input.toLowerCase();

        for (const [keyword, answer] of Object.entries(this.knowledgeBase)) {
            if (lower.includes(keyword)) {
                return answer;
            }
        }

        if (lower.includes('olá') || lower.includes('oi') || lower.includes('hello')) {
            return 'Saudações, viajante dimensional. O sistema operacional NEXUS está operando com 99.8% de estabilidade quântica. Em que posso auxiliá-lo?';
        }
        if (lower.includes('como funciona') || lower.includes('tecnologia')) {
            return 'Minha estrutura utiliza WebGL 2.0 com Three.js, shaders GLSL de dispersão luminosa, áudio procedural sintetizado em tempo real e uma arquitetura em 8 dimensões interconectadas.';
        }
        if (lower.includes('horas') || lower.includes('tempo')) {
            return `O marcador de tempo temporal registra: ${new Date().toLocaleTimeString('pt-BR')}. Mas lembre-se: no hiperespaço, o tempo é apenas um vetor relativo.`;
        }

        return this.knowledgeBase.default;
    }

    typewriterReply(text) {
        const historyContainer = document.getElementById('ai-chat-history');
        if (!historyContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-msg ai-msg-bot';
        msgDiv.innerHTML = `<span class="bot-badge">NEXUS-9</span> <span class="text-body"></span>`;
        historyContainer.appendChild(msgDiv);

        const textBody = msgDiv.querySelector('.text-body');
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                textBody.textContent += text.charAt(index);
                index++;
                window.NexusAudio?.playNeuralBlip(550 + (index % 10) * 15);
                historyContainer.scrollTop = historyContainer.scrollHeight;
            } else {
                clearInterval(interval);
                this.isTyping = false;
                this.setAIStatus('ONLINE // PRONTO');

                // Web Speech API Voice Readout
                if (this.voiceEnabled && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'pt-BR';
                    utterance.rate = 1.05;
                    utterance.pitch = 0.9;
                    window.speechSynthesis.speak(utterance);
                }
            }
        }, 22);
    }

    appendMessage(sender, text) {
        const historyContainer = document.getElementById('ai-chat-history');
        if (!historyContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ai-msg-${sender}`;
        msgDiv.textContent = text;
        historyContainer.appendChild(msgDiv);
        historyContainer.scrollTop = historyContainer.scrollHeight;

        window.NexusAudio?.playClick(1400);
    }

    setAIStatus(status) {
        const el = document.getElementById('ai-status-indicator');
        if (el) el.textContent = status;
    }

    // =========================================================
    // VISUAL NEURAL SYNAPSE GRAPH
    // =========================================================
    initNeuralNodes() {
        const canvas = document.getElementById('ai-neural-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 140;

        const nodes = Array.from({ length: 18 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2.5 + 1.5
        }));

        const draw = () => {
            requestAnimationFrame(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Connect nearby nodes
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw and move nodes
            nodes.forEach((node) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                ctx.fillStyle = '#00f2fe';
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        draw();
    }
}

// Global Singleton
window.NexusAI = new NexusAICore();

