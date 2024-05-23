const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let erasing = false;
let penSize = 5;
let eraserSize = 20;
let color = 'black'; // Domyślny kolor

const penButton = document.getElementById('pen');
const eraserButton = document.getElementById('eraser');
const penSizeInput = document.getElementById('penSize');
const eraserSizeInput = document.getElementById('eraserSize');
const colorButtons = document.querySelectorAll('.color-button');

penButton.addEventListener('click', () => {
    erasing = false;
    penButton.classList.add('active');
    eraserButton.classList.remove('active');
});

eraserButton.addEventListener('click', () => {
    erasing = true;
    eraserButton.classList.add('active');
    penButton.classList.remove('active');
});

penSizeInput.addEventListener('input', (e) => {
    penSize = e.target.value;
});

eraserSizeInput.addEventListener('input', (e) => {
    eraserSize = e.target.value;
});

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        color = button.getAttribute('data-color');
        document.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

penButton.classList.add('active'); // Start with pen mode active
colorButtons[0].classList.add('active'); // Set initial color button as active

function startDrawing(e) {
    if (isInsideToolbar(e)) return;
    drawing = true;
    draw(e, true); // Przekazujemy true, gdy zaczynamy rysowanie
}

function endDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e, isDrawing = false) {
    if (!drawing) return;

    e.preventDefault(); // Zapobiega domyślnemu zachowaniu (np. przewijaniu strony)

    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    if (erasing) {
        ctx.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
        socket.emit('erase', { x, y, size: eraserSize });
        return;
    }

    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    if (isDrawing) {
        ctx.beginPath(); // Rozpoczynamy nową ścieżkę
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    socket.emit('draw', { x, y, color, penSize, isDrawing });
}

function isInsideToolbar(e) {
    const toolbar = document.getElementById('toolbar');
    const rect = toolbar.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => startDrawing(e));
canvas.addEventListener('touchend', (e) => endDrawing(e));
canvas.addEventListener('touchmove', (e) => draw(e));

socket.on('draw', (data) => {
    const { x, y, color, penSize, isDrawing } = data;

    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    if (isDrawing) {
        ctx.beginPath(); // Rozpoczynamy nową ścieżkę
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
});

socket.on('erase', (data) => {
    const { x, y, size } = data;
    ctx.clearRect(x - size / 2, y - size / 2, size, size);
});

socket.on('canvasState', (state) => {
    state.forEach(action => {
        if (action.hasOwnProperty('color')) {
            const { x, y, color, penSize, isDrawing } = action;

            ctx.lineWidth = penSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;

            if (isDrawing) {
                ctx.beginPath(); // Rozpoczynamy nową ścieżkę
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
        } else if (action.hasOwnProperty('size')) {
            const { x, y, size } = action;
            ctx.clearRect(x - size / 2, y - size / 2, size, size);
        }
    });
});
