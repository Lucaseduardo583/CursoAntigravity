/**
 * ===================================================================
 * UNIVERSE EXPLORER - Master Bootstrap & Lifecycle Orchestrator
 * Three.js Initialization | Flight Control Wiring | Audio Awakening
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o Motor 3D do Universo
    window.UniverseEngine.init('universe-canvas-container');

    // 2. Inicializa o Controlador de Voo e Física
    window.FlightController.init();

    // 3. Inicializa o Radar Tático 3D
    window.RadarMinimap.init('radar-canvas');

    // 4. Inicializa o Cockpit HUD e a Interface
    window.UniverseUI.init();

    // 5. Inicialização do Áudio no primeiro gesto do usuário
    const unlockAudio = () => {
        window.UniverseAudio.init();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Dica de inicialização no console
    console.log(`
%c
   .---.
  /     \\     UNIVERSE EXPLORER v4.2 // SISTEMA ATIVO
 | () () |    Controles: WASD (Mover) | Scroll (Zoom de 5 Níveis)
  \\  ^  /     Shift (Acelerar) | Espaço (Frear) | M (Radar 3D) | E (Dossiê)
   |||||
`, 'color: #38bdf8; font-family: monospace; font-size: 13px; font-weight: bold;');
});
