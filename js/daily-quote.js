const dailyQuotes = [
    "La paz comienza con una sonrisa, incluso en los más pequeños.",
    "Cada respiración es una oportunidad para encontrar la calma.",
    "Jugar es la forma más elevada de investigación.",
    "Un niño feliz es un niño que respira desde el corazón.",
    "El yoga nos enseña a escuchar lo que nuestro cuerpo necesita.",
    "Sé tú mismo, los demás puestos ya están ocupados.",
    "Una mente tranquila es como un lago sin olas, refleja la belleza alrededor.",
    "Dentro de ti hay un sol brillante listo para iluminar el mundo.",
    "La naturaleza es nuestro mejor maestro de paciencia y equilibrio.",
    "Respira el arcoíris, exhala las nubes oscuras.",
    "Tu imaginación es tu superpoder más grande.",
    "En cada niño hay un universo de posibilidades brillando.",
    "El equilibrio no es no caer, es saber levantarse con una sonrisa.",
    "Agradece cada pequeño detalle, ahí reside la verdadera magia.",
    "Eres fuerte como una montaña y flexible como el agua.",
    "Cierra los ojos y mira todo lo hermoso que tienes dentro.",
    "El sonido del silencio también es música para el alma.",
    "Cultiva pensamientos amables, florecerán como un hermoso jardín.",
    "Un paso a la vez, incluso las tortugas llegan muy lejos.",
    "La verdadera fuerza viene de la inmensa suavidad del corazón.",
    "Cuando la mente se aquieta, la magia de la infancia despierta.",
    "Sé como el árbol: raíces fuertes en la tierra y ramas buscando el cielo.",
    "Tu respiración es tu ancla en medio de las tormentas.",
    "No hay prisa en crecer, disfruta cada momento como un juego.",
    "Lo que plantamos con amor en los niños, florece en el mundo.",
    "La felicidad se respira, se siente, se juega y se comparte.",
    "En la calma siempre puedes escuchar tu propia voz interior.",
    "Eres un regalo para el mundo, exactamente como eres.",
    "El amor es siempre el mejor lugar para descansar después de jugar.",
    "Deja que tus sonrisas cambien el mundo, y no al revés.",
    "Hoy es un día perfecto para hacer algo pequeño que te haga feliz."
];

document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el día actual (1-31) usando hora local
    const today = new Date();
    const dayOfMonth = today.getDate();
    // Clave para guardar en localStorage si ya lo cerró
    const closedKey = `yk_quote_closed_${dayOfMonth}`;

    // Si ya lo cerró hoy, no lo mostramos
    if (localStorage.getItem(closedKey)) {
        return;
    }
    
    // Ajustamos el índice (el array va de 0 a 30)
    const quoteIndex = dayOfMonth - 1;
    const currentQuote = dailyQuotes[quoteIndex];
    
    // Creamos los elementos de la burbuja
    const bubble = document.createElement("div");
    bubble.className = "daily-quote-bubble";
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "daily-quote-bubble-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("aria-label", "Cerrar inspiración");
    
    const label = document.createElement("span");
    label.className = "daily-quote-bubble-label";
    label.textContent = "Inspiración del día";
    
    const text = document.createElement("p");
    text.className = "daily-quote-bubble-text";
    text.textContent = `"${currentQuote}"`;
    
    bubble.appendChild(closeBtn);
    bubble.appendChild(label);
    bubble.appendChild(text);
    
    document.body.appendChild(bubble);
    
    // Mostrar con animación luego de un pequeño delay
    setTimeout(() => {
        bubble.classList.add("show");
    }, 1500); // 1.5s delay para que no aparezca inmediatamente al cargar la página
    
    // Cerrar y guardar en localStorage
    closeBtn.addEventListener("click", () => {
        bubble.classList.remove("show");
        localStorage.setItem(closedKey, "true");
        // Eliminar del DOM luego de la transición
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 600);
    });
});
