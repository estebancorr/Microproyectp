const menuPrincipal = document.getElementById("menuprincipal");
const pantallajuego = document.getElementById("pantalla-juego");
const botonIniciar = document.getElementById("Start");
const botonReiniciar = document.getElementById("botonReiniciar"); 
const nombreUsuarioInput = document.getElementById("nombre-usuario");
const mensaje = document.getElementById("mensaje");
const puntuacion = document.getElementById("puntuacion");
const listaPuntajes = document.getElementById("lista-puntajes");

const botonesColores = document.querySelectorAll(".boton");

let secuenciaJuego = [];
let secuenciaUsuario = [];
let nivel = 0;
let nombreUsuario = "";

botonIniciar.addEventListener("click", iniciarJuego);
botonReiniciar.addEventListener("click", reiniciarJuego);
botonesColores.forEach(boton => {
    boton.addEventListener("click", e => {
        const colorSeleccionado = e.target.id; 
        manejarEntradaUsuario(colorSeleccionado);
    });
});

function iniciarJuego() {
    if (nombreUsuarioInput.value.trim() === "") {
        alert("Ingresa tu nombre para comenzar la partida");
        return;
    }
nombreUsuario = nombreUsuarioInput.value.trim();
alert('Hola, ${nombreUsuario}. El juego comenzará')
nivel = 0;
secuenciaJuego = [];
siguienteNivel();
}

function mostrarPantallaJuego() {
    menuPrincipal.style.display = "none";
    pantallajuego.style.display = "block";
    botonReiniciar.style.display = "none";
    mensaje.textContent = " ";
    puntuacion.textContent = "0";
}

function mostrarMenuPrincipal() {
    menuPrincipal.style.display = "block";
    pantallajuego.style.display = "none";
}

function siguienteNivel() {
    nivel++;
    puntuacion.textContent = nivel;
    secuenciaUsuario = [];
    const colorAleatorio = obtenerColorAleatorio();
    secuenciaJuego.push(colorAleatorio);
    reproducirSecuencia();
}

function obtenerColorAleatorio() {
    const colores = ["rojo", "verde", "azul", "amarillo"]; 
    const indiceAleatorio = Math.floor(Math.random() * colores.length);
    return colores[indiceAleatorio];
}

function reproducirSecuencia() {
    let indice = 0;
    mensaje.textContent = "Observa la secuencia. . .";
    const intervalo = setInterval(() => {
        iluminarBoton(secuenciaJuego[indice]);
        indice++;
        if (indice >= secuenciaJuego.length) {
            clearInterval(intervalo);
            mensaje.textContent = "Tu turno";
        }
    }, 1000 - (nivel * 50));
}

const sonidos = {
    rojo: new Audio(''),
    verde: new Audio(''),
    azul: new Audio(''),
    amarillo: new Audio(''),
};

function iluminarBoton(color) {
    const boton = document.getElementById(color);
    boton.classList.add("activo");
    sonidos[color].currentTime = 0;
    sonidos[color].play();
    setTimeout(() => {
        boton.classList.remove("activo");
    }, 500);
}

function manejarEntradaUsuario(colorSeleccionado) {
    secuenciaUsuario.push(colorSeleccionado);
    iluminarBoton(colorSeleccionado);
    verificarRespuesta(secuenciaUsuario.length - 1);
}

function verificarRespuesta(indiceActual) {
    if (secuenciaUsuario[indiceActual]!== secuenciaJuego[indiceActual]) {
        juegoTerminado();
        return;
    }
    if (secuenciaUsuario.length === secuenciaJuego.length) {
        mensaje.textContent = 'Prepárate para el siguiente nivel. . .';
        setTimeout(siguienteNivel, 1000);
    }
}

function juegoTerminado() {
    mensaje.textContent ='¡Error! Llegaste al nivel ${nivel}, ${nombreUsuario}.';
    document.body.classList.add('error');
    setTimeout(() => {
        document.body.classList.remove('error');
    }, 1500);
    guardarPuntaje(nombreUsuario, nivel);
    mostrarPuntaje(); 
    botonReiniciar.style.display = "block";
}

function reiniciarJuego() {
    nivel = 0;
    secuenciaJuego = [];
    secuenciaUsuario = [];
    puntuacion.textContent = " ";
    mensaje.textContent = " "; 
    botonReiniciar.style.display = "none"; 
    siguienteNivel();
}

function guardarPuntaje(nombre, nivelAlcanzado) {
    const puntajes = obtenerPuntajes();
    puntajes.push({nombre, nivel: nivelAlcanzado});
    puntajes.sort((a, b) => b.nivel - a.nivel);
    if (puntajes.length > 5) {
        puntajes.pop();
    }
    localStorage.setItem("puntajesSimonDice", JSON.stringify(puntajes));
}

function obtenerPuntajes() {
    const puntajesGuardados = localStorage.getItem("puntajesSimonDice");
    return puntajesGuardados ? JSON.parse(puntajesGuardados) : [];
}

const botonMostrarPuntajes = document.getElementById("boton-mostrar-puntajes");
const listaPuntajesDiv = document.getElementById("lista-puntajes");

botonMostrarPuntajes.addEventListener("click", () => {
    if (listaPuntajesDiv.style.display === "none" || !listaPuntajesDiv.style.display) {
        listaPuntajesDiv.style.display = "block";
    } else {
        listaPuntajesDiv.style.display = "none";
    }
});
function mostrarPuntaje() {
    const puntajes = obtenerPuntajes();
    const lista = document.getElementById("puntajes");
    lista.innerHTML = " ";
    puntajes.forEach((puntaje, index) => {
        const elemento = document.createElement("li");
        elemento.textContent = '#${index + 1} - ${puntaje.nombre}: Nivel ${puntaje.nivel}';
        lista.appendChild(elemento);
        });
    
}
document.addEventListener("DOMContentLoaded", () => {
    mostrarPuntaje();
});
