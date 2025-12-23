const box = document.getElementById("box");

let x = 100;
let y = 100;
let dx = 4;
let dy = 4;
let running = false;

const boxWidth = 120;
const boxHeight = 80;

function move() {
    if (!running) return;

    x += dx;
    y += dy;

    if (x <= 0 || x + boxWidth >= window.innerWidth) dx *= -1;
    if (y <= 0 || y + boxHeight >= window.innerHeight) dy *= -1;

    box.style.left = x + "px";
    box.style.top = y + "px";

    requestAnimationFrame(move);
}

function start() {
    if (!running) {
        running = true;
        move();
    }
}
