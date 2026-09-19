/**
 * ===================================================================
 * RADAR MINIMAP - 3D Tactical Celestial Scanner
 * Real-Time Positional Tracking | Range Rings | Target Vectors
 * ===================================================================
 */

class RadarMinimap {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.range = 350; // Raio em unidades
        this.size = 180;
    }

    init(canvasId = 'radar-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        this.bindEvents();
        this.renderLoop();
    }

    bindEvents() {
        // Zoom do radar
        document.getElementById('radar-zoom-in')?.addEventListener('click', () => {
            this.range = Math.max(100, this.range - 80);
            window.UniverseAudio?.playUIBeep(1800);
        });

        document.getElementById('radar-zoom-out')?.addEventListener('click', () => {
            this.range = Math.min(1200, this.range + 100);
            window.UniverseAudio?.playUIBeep(1200);
        });

        // Clique no radar para selecionar alvo próximo
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left - this.size / 2;
            const clickY = e.clientY - rect.top - this.size / 2;

            const shipPos = window.UniverseEngine?.camera?.position || new THREE.Vector3();
            let closestBody = null;
            let minDist = 18;

            UniverseData.celestialBodies.forEach((data) => {
                const mesh = window.UniverseEngine?.celestialMeshes.get(data.id);
                if (!mesh) return;

                const dx = mesh.position.x - shipPos.x;
                const dz = mesh.position.z - shipPos.z;

                const radarX = (dx / this.range) * (this.size / 2);
                const radarY = (dz / this.range) * (this.size / 2);

                const dist = Math.hypot(radarX - clickX, radarY - clickY);
                if (dist < minDist) {
                    minDist = dist;
                    closestBody = data;
                }
            });

            if (closestBody) {
                window.UniverseAudio?.playUIBeep(1500);
                window.UniverseEngine?.focusOnBody(closestBody.id, true);
            }
        });
    }

    renderLoop() {
        const draw = () => {
            requestAnimationFrame(draw);
            if (!this.ctx || !window.UniverseEngine?.camera) return;

            const shipPos = window.UniverseEngine.camera.position;
            const forward = new THREE.Vector3();
            window.UniverseEngine.camera.getWorldDirection(forward);

            const cx = this.size / 2;
            const cy = this.size / 2;

            // 1. Limpa fundo
            this.ctx.clearRect(0, 0, this.size, this.size);

            // 2. Anéis de Alcance Tático
            this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
            this.ctx.lineWidth = 1;

            [0.35, 0.7, 0.98].forEach((rRatio) => {
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, (this.size / 2) * rRatio, 0, Math.PI * 2);
                this.ctx.stroke();
            });

            // Linhas de Mira Cruzada
            this.ctx.beginPath();
            this.ctx.moveTo(cx, 4);
            this.ctx.lineTo(cx, this.size - 4);
            this.ctx.moveTo(4, cy);
            this.ctx.lineTo(this.size - 4, cy);
            this.ctx.stroke();

            // 3. Projeção dos Corpos Celestes
            UniverseData.celestialBodies.forEach((data) => {
                const mesh = window.UniverseEngine.celestialMeshes.get(data.id);
                if (!mesh) return;

                const dx = mesh.position.x - shipPos.x;
                const dz = mesh.position.z - shipPos.z;

                // Converte para coordenadas de radar 2D
                const radarX = cx + (dx / this.range) * (this.size / 2);
                const radarY = cy + (dz / this.range) * (this.size / 2);

                // Verifica se está dentro do diâmetro do radar
                if (Math.hypot(radarX - cx, radarY - cy) < this.size / 2 - 4) {
                    const isTargeted = window.UniverseEngine.focusedBody?.id === data.id;

                    this.ctx.fillStyle = isTargeted ? '#f72585' : `#${data.color.toString(16).padStart(6, '0')}`;
                    this.ctx.beginPath();
                    this.ctx.arc(radarX, radarY, isTargeted ? 3.5 : 2.2, 0, Math.PI * 2);
                    this.ctx.fill();

                    if (isTargeted) {
                        this.ctx.strokeStyle = '#f72585';
                        this.ctx.strokeRect(radarX - 5, radarY - 5, 10, 10);
                    }
                }
            });

            // 4. Marcador da Nave do Jogador no Centro
            const shipAngle = Math.atan2(forward.z, forward.x);
            this.ctx.save();
            this.ctx.translate(cx, cy);
            this.ctx.rotate(shipAngle + Math.PI / 2);

            this.ctx.fillStyle = '#00f2fe';
            this.ctx.beginPath();
            this.ctx.moveTo(0, -6);
            this.ctx.lineTo(4, 5);
            this.ctx.lineTo(0, 3);
            this.ctx.lineTo(-4, 5);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.restore();
        };

        draw();
    }
}

window.RadarMinimap = new RadarMinimap();

