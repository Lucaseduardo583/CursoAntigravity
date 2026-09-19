/**
 * ===================================================================
 * UNIVERSE UI - Cockpit Telemetry, Search Engine & Discovery Codex
 * HUD Telemetry | Universal Search | Celestial Drawer | Discoveries
 * ===================================================================
 */

class UniverseUI {
    constructor() {
        this.selectedPlanet = null;

        // Elementos de Telemetria
        this.locationEl = document.getElementById('hud-location-text');
        this.distanceEl = document.getElementById('hud-distance-text');
        this.speedEl = document.getElementById('hud-speed-text');
        this.coordsEl = document.getElementById('hud-coords-text');
        this.scaleEl = document.getElementById('hud-scale-badge');

        // Painel de Objetos Celestes e Busca
        this.celestialListEl = document.getElementById('celestial-objects-list');
        this.searchInput = document.getElementById('universe-search-input');
        this.searchResultsEl = document.getElementById('search-results-dropdown');

        // Gaveta de Detalhes do Planeta
        this.dossierDrawer = document.getElementById('planet-dossier-drawer');
        this.discoveriesModal = document.getElementById('discoveries-modal');
    }

    init() {
        this.populateCelestialList();
        this.bindSearchEvents();
        this.bindUIButtons();
        this.updateDiscoveryCodex();
    }

    // =========================================================
    // POPULA LISTA DE OBJETOS CELESTES PRÓXIMOS
    // =========================================================
    populateCelestialList() {
        if (!this.celestialListEl) return;
        this.celestialListEl.innerHTML = '';

        UniverseData.celestialBodies.forEach((body) => {
            const item = document.createElement('div');
            item.className = 'celestial-item interactive-ui';
            item.dataset.id = body.id;

            const isDiscovered = UniverseData.DiscoveryStore.getDiscoveredIds().includes(body.id);

            item.innerHTML = `
                <div class="celestial-item-dot" style="background-color: #${body.color.toString(16).padStart(6, '0')};"></div>
                <div class="celestial-item-info">
                    <div class="celestial-item-name">${body.name} ${isDiscovered ? '★' : ''}</div>
                    <div class="celestial-item-type">${body.type}</div>
                </div>
                <button type="button" class="btn-travel-mini" title="Viajar até o corpo celeste">
                    <i class="fa-solid fa-plane-up"></i>
                </button>
            `;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.btn-travel-mini')) {
                    window.FlightController?.travelToObject(body.id);
                } else {
                    window.UniverseAudio?.playUIBeep(1200);
                    window.UniverseEngine?.focusOnBody(body.id, true);
                }
            });

            this.celestialListEl.appendChild(item);
        });
    }

    // =========================================================
    // SISTEMA DE BUSCA UNIVERSAL COM FILTRAGEM FUZZY
    // =========================================================
    bindSearchEvents() {
        if (!this.searchInput || !this.searchResultsEl) return;

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                this.searchResultsEl.classList.add('hidden');
                return;
            }

            const matches = UniverseData.celestialBodies.filter(b => 
                b.name.toLowerCase().includes(query) ||
                b.system.toLowerCase().includes(query) ||
                b.type.toLowerCase().includes(query)
            );

            this.renderSearchResults(matches);
        });

        // Fechar busca ao clicar fora
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.searchResultsEl.classList.add('hidden');
            }
        });
    }

    renderSearchResults(matches) {
        this.searchResultsEl.innerHTML = '';
        if (matches.length === 0) {
            this.searchResultsEl.innerHTML = '<div class="search-no-results">Nenhum corpo celeste encontrado.</div>';
            this.searchResultsEl.classList.remove('hidden');
            return;
        }

        matches.forEach((body) => {
            const row = document.createElement('div');
            row.className = 'search-result-row interactive-ui';
            row.innerHTML = `
                <div>
                    <strong>${body.name}</strong>
                    <small style="display:block; color: var(--text-muted);">${body.system} &bull; ${body.type}</small>
                </div>
                <button type="button" class="btn-search-travel">VIAJAR</button>
            `;

            row.querySelector('.btn-search-travel').addEventListener('click', (e) => {
                e.stopPropagation();
                this.searchResultsEl.classList.add('hidden');
                this.searchInput.value = '';
                window.FlightController?.travelToObject(body.id);
            });

            row.addEventListener('click', () => {
                this.searchResultsEl.classList.add('hidden');
                this.searchInput.value = '';
                window.UniverseEngine?.focusOnBody(body.id, true);
            });

            this.searchResultsEl.appendChild(row);
        });

        this.searchResultsEl.classList.remove('hidden');
    }

    // =========================================================
    // ATUALIZAÇÃO DA TELEMETRIA DO HUD DE VÔO
    // =========================================================
    updateFlightTelemetry(speed, pos) {
        // Velocidade formatada
        if (this.speedEl) {
            if (speed < 0.05) {
                this.speedEl.textContent = '0 km/s [PARADO]';
            } else if (speed < 4.0) {
                this.speedEl.textContent = `${(speed * 28.5).toFixed(1)} km/s [SUB-LUZ]`;
            } else {
                const cFactor = (speed / 1.6).toFixed(2);
                this.speedEl.textContent = `${cFactor} c [VELOCIDADE DE DOBRA]`;
            }
        }

        // Coordenadas
        if (this.coordsEl) {
            this.coordsEl.textContent = `X: ${pos.x.toFixed(1)} | Y: ${pos.y.toFixed(1)} | Z: ${pos.z.toFixed(1)}`;
        }

        // Distância ao objeto focado
        if (this.distanceEl && window.UniverseEngine?.focusedBody) {
            const mesh = window.UniverseEngine.celestialMeshes.get(window.UniverseEngine.focusedBody.id);
            if (mesh) {
                const dist = pos.distanceTo(mesh.position);
                const auDist = (dist / 54.0).toFixed(2);
                this.distanceEl.textContent = `${auDist} AU (${dist.toFixed(0)} unidades)`;
            }
        }
    }

    updateScaleIndicator(scaleLevel) {
        if (!this.scaleEl) return;
        const labels = {
            1: 'NÍVEL 1: ÓRBITA PLANETÁRIA',
            2: 'NÍVEL 2: SISTEMA SOLAR',
            3: 'NÍVEL 3: ESPAÇO PROFUNDO',
            4: 'NÍVEL 4: VIA LÁCTEA (ESPIRAL)',
            5: 'NÍVEL 5: UNIVERSO OBSERVÁVEL'
        };
        this.scaleEl.textContent = labels[scaleLevel] || 'NÍVEL CÓSMICO';
    }

    updateSelectedPlanet(data) {
        this.selectedPlanet = data;

        // Atualiza breadcrumb de localização
        if (this.locationEl) {
            this.locationEl.textContent = `Via Láctea // ${data.system} // ${data.name}`;
        }

        // Destaca item na lista
        document.querySelectorAll('.celestial-item').forEach((el) => {
            el.classList.toggle('active', el.dataset.id === data.id);
        });

        // Mostra botão de viagem rápido no HUD
        const targetBanner = document.getElementById('target-quick-action');
        const targetName = document.getElementById('target-quick-name');
        if (targetBanner && targetName) {
            targetName.textContent = data.name;
            targetBanner.classList.remove('hidden');
        }
    }

    // =========================================================
    // DOSSIÊ PLANETÁRIO DETALHADO (GAVETA DE DETALHES)
    // =========================================================
    openPlanetDossier(data) {
        if (!this.dossierDrawer) return;
        this.selectedPlanet = data;

        document.getElementById('dossier-name').textContent = data.name;
        document.getElementById('dossier-type').textContent = data.type;
        document.getElementById('dossier-system').textContent = data.system;
        document.getElementById('dossier-gravity').textContent = data.gravity || 'N/A';
        document.getElementById('dossier-temp').textContent = data.temperature || 'N/A';
        document.getElementById('dossier-atmos').textContent = data.atmosphere || 'N/A';
        document.getElementById('dossier-desc').textContent = data.description || '';
        document.getElementById('dossier-curiosity').textContent = data.curiosity || '';

        // Pontos de interesse
        const poiContainer = document.getElementById('dossier-poi-list');
        if (poiContainer && data.pointsOfInterest) {
            poiContainer.innerHTML = data.pointsOfInterest.map(p => `<li>${p}</li>`).join('');
        }

        this.dossierDrawer.classList.remove('hidden');
        window.UniverseAudio?.playUIBeep(1600);
    }

    // =========================================================
    // BANNERS CINEMATOGRÁFICOS DE VIAGEM E DESCOBERTA
    // =========================================================
    showWarpTravelBanner(destName) {
        const banner = document.getElementById('warp-travel-overlay');
        const destEl = document.getElementById('warp-dest-name');
        if (!banner) return;

        destEl.textContent = destName;
        banner.classList.remove('hidden');
        gsap.fromTo(banner, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    }

    showArrivalCompleteBanner(data) {
        const banner = document.getElementById('warp-travel-overlay');
        if (banner) {
            gsap.to(banner, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => banner.classList.add('hidden')
            });
        }

        // Notificação de chegada
        const toast = document.getElementById('arrival-toast');
        const text = document.getElementById('arrival-toast-text');
        if (toast && text) {
            text.textContent = `ÓRBITA ESTABELECIDA: ${data.name}`;
            toast.classList.remove('hidden');
            gsap.fromTo(toast, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });

            setTimeout(() => {
                gsap.to(toast, { y: -40, opacity: 0, duration: 0.5, onComplete: () => toast.classList.add('hidden') });
            }, 3500);
        }
    }

    showNewDiscoveryAlert(data) {
        const modal = document.getElementById('new-discovery-modal');
        const nameEl = document.getElementById('new-discovery-name');
        if (!modal || !nameEl) return;

        nameEl.textContent = data.name;
        modal.classList.remove('hidden');
        gsap.fromTo(modal, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });

        // Confetes espaciais
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 75,
                spread: 80,
                origin: { y: 0.6 }
            });
        }

        this.updateDiscoveryCodex();
        this.populateCelestialList();
    }

    updateBlackHoleAlert(isActive) {
        const alertEl = document.getElementById('black-hole-alert-banner');
        if (alertEl) {
            alertEl.classList.toggle('hidden', !isActive);
        }
    }

    // =========================================================
    // CATÁLOGO "MY DISCOVERIES"
    // =========================================================
    updateDiscoveryCodex() {
        const stats = UniverseData.DiscoveryStore.getProgress();
        const progressEl = document.getElementById('codex-progress-fill');
        const countEl = document.getElementById('codex-progress-count');

        if (progressEl) progressEl.style.width = `${stats.percent}%`;
        if (countEl) countEl.textContent = `${stats.discovered}/${stats.total} (${stats.percent}%)`;

        const grid = document.getElementById('codex-grid');
        if (!grid) return;

        const discovered = UniverseData.DiscoveryStore.getDiscoveredIds();
        grid.innerHTML = UniverseData.celestialBodies.map((b) => {
            const isFound = discovered.includes(b.id);
            return `
                <div class="codex-card ${isFound ? 'found' : 'locked'} interactive-ui" data-id="${b.id}">
                    <div class="codex-status">${isFound ? 'DESCOBERTO ★' : 'NÃO EXPLORADO ?'}</div>
                    <div class="codex-name">${isFound ? b.name : 'Sinal Desconhecido'}</div>
                    <div class="codex-system">${isFound ? b.system : 'Setor Inexplorado'}</div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.codex-card.found').forEach((card) => {
            card.addEventListener('click', () => {
                this.discoveriesModal.classList.add('hidden');
                window.UniverseEngine?.focusOnBody(card.dataset.id, true);
            });
        });
    }

    // =========================================================
    // EVENTOS DE BOTÕES GERAIS
    // =========================================================
    bindUIButtons() {
        // Botão de Viagem Rápida no Banner
        document.getElementById('btn-travel-target')?.addEventListener('click', () => {
            if (this.selectedPlanet) {
                window.FlightController?.travelToObject(this.selectedPlanet.id);
            }
        });

        // Botão de Viagem na Gaveta
        document.getElementById('btn-dossier-travel')?.addEventListener('click', () => {
            if (this.selectedPlanet) {
                this.dossierDrawer.classList.add('hidden');
                window.FlightController?.travelToObject(this.selectedPlanet.id);
            }
        });

        // Fechar gaveta
        document.getElementById('btn-dossier-close')?.addEventListener('click', () => {
            this.dossierDrawer.classList.add('hidden');
        });

        // Botão de Descobertas no Topo
        document.getElementById('btn-open-discoveries')?.addEventListener('click', () => {
            this.updateDiscoveryCodex();
            this.discoveriesModal.classList.remove('hidden');
            window.UniverseAudio?.playUIBeep(1400);
        });

        document.getElementById('btn-close-discoveries')?.addEventListener('click', () => {
            this.discoveriesModal.classList.add('hidden');
        });

        document.getElementById('btn-close-new-discovery')?.addEventListener('click', () => {
            document.getElementById('new-discovery-modal')?.classList.add('hidden');
        });

        // Alternar Mudo
        const soundBtn = document.getElementById('btn-toggle-sound');
        soundBtn?.addEventListener('click', () => {
            window.UniverseAudio?.init();
            const muted = window.UniverseAudio?.toggleMute();
            soundBtn.innerHTML = muted 
                ? '<i class="fa-solid fa-volume-xmark"></i>' 
                : '<i class="fa-solid fa-volume-high"></i>';
            soundBtn.classList.toggle('muted', muted);
        });
    }

    toggleMiniMap() {
        const radar = document.getElementById('radar-minimap-container');
        if (radar) radar.classList.toggle('hidden');
    }
}

window.UniverseUI = new UniverseUI();

