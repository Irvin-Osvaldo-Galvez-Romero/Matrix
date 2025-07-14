const container = document.getElementById('matrix-container');
const heartBackground = document.getElementById('heart-background');
const words = [
    'te quiero mucho '
];

const columns = 5; // Número de columnas para distribuir las palabras
const maxCharacters = 400; // Muchísimas palabras en pantalla
const columnWidth = 100 / columns;
const minVerticalGap = 0; // Mínima separación vertical entre palabras (en px)
const fallSpeed = 10; // Velocidad fija para todas las palabras (en px por frame)

let characters = [];
let columnStreams = Array.from({ length: columns }, () => []);

// Crear corazones de fondo
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 6 + 's';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';

    heartBackground.appendChild(heart);

    // Remover corazones antiguos si hay demasiados
    const hearts = heartBackground.querySelectorAll('.heart');
    if (hearts.length > 50) {
        hearts[0].remove();
    }
}

// Crear corazones iniciales
for (let i = 0; i < 30; i++) {
    setTimeout(() => createHeart(), i * 300);
}

// Crear nuevos corazones periódicamente
setInterval(() => {
    createHeart();
}, 2000);

// Crear un carácter en una columna específica
function createCharacterInColumn(column) {
    const character = document.createElement('div');
    character.className = 'matrix-character';
    character.textContent = words[0];
    character.dataset.column = column;
    character.style.left = (column * columnWidth + columnWidth / 2 - 5) + '%';
    character.style.top = '-40px';
    character.dataset.speed = fallSpeed; // velocidad fija
    container.appendChild(character);
    characters.push(character);
    columnStreams[column].push(character);
}

// Inicializar: varias palabras por columna
for (let col = 0; col < columns; col++) {
    for (let i = 0; i < 10; i++) {
        createCharacterInColumn(col);
    }
}

// Crear nuevos caracteres periódicamente en cada columna
setInterval(() => {
    for (let col = 0; col < columns; col++) {
        // Si no hay palabras o la última está suficientemente abajo, agrega otra
        const stream = columnStreams[col];
        if (
            stream.length === 0 ||
            (parseFloat(stream[stream.length - 1].style.top) > minVerticalGap)
        ) {
            if (characters.length < maxCharacters) {
                createCharacterInColumn(col);
            }
        }
    }
}, 60);

// Animación de caída
function fallAnimation() {
    for (let col = 0; col < columns; col++) {
        const stream = columnStreams[col];
        for (let i = 0; i < stream.length; i++) {
            const char = stream[i];
            const currentTop = parseFloat(char.style.top);
            const speed = fallSpeed;
            char.style.top = (currentTop + speed) + 'px';
            // Si sale de la pantalla, eliminarlo
            if (currentTop > window.innerHeight + 40) {
                char.remove();
                stream.splice(i, 1);
                characters = characters.filter(c => c !== char);
                i--;
            }
        }
    }
}
setInterval(fallAnimation, 50);

// Efecto de parpadeo aleatorio
setInterval(() => {
    if (characters.length === 0) return;
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    if (randomChar) {
        randomChar.style.opacity = '0.3';
        setTimeout(() => {
            if (randomChar) {
                randomChar.style.opacity = '1';
            }
        }, 300);
    }
}, 2000);

// Mensaje especial al hacer clic
function createClickMessage(x, y) {
    const message = document.createElement('div');
    message.className = 'click-message';
    message.textContent = 'te quiero mucho belencita';
    message.style.left = (x - 50) + 'px';
    message.style.top = (y - 50) + 'px';

    container.appendChild(message);

    // Remover el mensaje después de la animación
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 2000);
}

// Evento de clic
container.addEventListener('click', (e) => {
    createClickMessage(e.clientX, e.clientY);
}); 