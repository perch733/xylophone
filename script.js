// IIFE (Immediately Invoked Function Expression)
// Esto crea un ámbito local para evitar "contaminar" el ámbito global del navegador.
// Es una buena práctica para encapsular tu código.
(() => {
  // Seleccionamos el contenedor principal.
  const container = document.querySelector(".contenedor");
  // Si no existe, salimos para evitar errores.
  if (!container) return;

  // Seleccionamos todos los botones que tengan el atributo data-note.
  // Esto es más robusto que usar solo una clase.
  const noteButtons = container.querySelectorAll(".note[data-note]");
  
  // Usamos un Map para almacenar los audios.
  // Map es ideal cuando queremos asociar claves (notas) con valores (objetos Audio).
  const audioByNote = new Map();

  // Precargamos los audios
  for (const button of noteButtons) {
    const note = button.dataset.note;
    // Creamos el objeto Audio una sola vez al inicio para evitar lag al tocar.
    audioByNote.set(note, new Audio(`sound/${note}.mp3`));
  }

  // Función para reproducir una nota
  const playNote = (noteButton) => {
    const note = noteButton.dataset.note;
    const audio = audioByNote.get(note);
    
    // Si no encontramos el audio, salimos.
    if (!audio) return;

    // Reiniciamos el audio para que si se pulsa rápido, suene desde el principio
    // en lugar de esperar a que termine.
    audio.pause();
    audio.currentTime = 0;
    
    // Reproducimos el audio. .play() devuelve una Promesa.
    const playPromise = audio.play();
    
    // Manejo de errores de reproducción (por ejemplo, si el navegador bloquea el autoplay).
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        console.warn("No se pudo reproducir el audio:", error);
      });
    }

    // --- MEJORA DE ANIMACIÓN ---
    // En lugar de usar setTimeout, reiniciamos la animación CSS.
    // Esto es vital si el usuario toca la tecla muy rápido ("spamming").
    
    // 1. Quitamos la clase si ya existe
    noteButton.classList.remove("is-active");
    
    // 2. Forzamos un "Reflow" (repintado). 
    // Al leer offsetWidth, obligamos al navegador a aplicar el cambio anterior (quitar clase)
    // antes de aplicar el siguiente (ponerla de nuevo).
    void noteButton.offsetWidth; 
    
    // 3. Añadimos la clase de nuevo para reiniciar la animación definida en CSS (@keyframes hit)
    noteButton.classList.add("is-active");
    
    // Nota: Ya no necesitamos setTimeout porque CSS @keyframes controla la duración
    // y al quitar la clase arriba, ya estamos reseteando el estado.
    // Si quisieras limpiar la clase al final de la animación para ser purista:
    const removeClass = () => {
        noteButton.classList.remove("is-active");
        noteButton.removeEventListener("animationend", removeClass);
    };
    noteButton.addEventListener("animationend", removeClass);
  };

  // Escuchamos eventos de puntero (ratón, táctil, lápiz) en el contenedor (Delegación de eventos).
  // Es más eficiente poner un solo listener en el padre que uno en cada botón.
  container.addEventListener("pointerdown", (event) => {
    // Buscamos el elemento .note más cercano al click.
    const noteButton = event.target.closest(".note[data-note]");
    // Si no se hizo click en una nota, ignoramos.
    if (!noteButton || !container.contains(noteButton)) return;
    
    playNote(noteButton);
  });

  // Escuchamos eventos de teclado globales
  document.addEventListener("keydown", (event) => {
    // Si la tecla está repetida (mantener pulsado), ignoramos para no saturar.
    if (event.repeat) return;

    // Convertimos la tecla a minúscula para comparar fácilmente
    const key = event.key.toLowerCase();
    
    // Buscamos si hay algún botón que tenga esa tecla asignada en data-key
    const noteButton = container.querySelector(`.note[data-key="${key}"]`);

    if (noteButton) {
      // Si encontramos la nota mapeada a esa tecla, la tocamos
      playNote(noteButton);
    }
  });

  // Mantenemos el soporte original para Enter/Espacio si el botón tiene el foco (Accesibilidad)
  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const noteButton = event.target.closest(".note[data-note]");
    if (!noteButton || !container.contains(noteButton)) return;
    
    event.preventDefault(); // Evitamos scroll con espacio
    playNote(noteButton);
  });

})();
