(() => {
  const container = document.querySelector(".contenedor");
  if (!container) return;

  const noteButtons = container.querySelectorAll(".note[data-note]");
  const audioByNote = new Map();

  for (const button of noteButtons) {
    const note = button.dataset.note;
    audioByNote.set(note, new Audio(`sound/${note}.mp3`));
  }

  const playNote = (noteButton) => {
    const note = noteButton.dataset.note;
    const audio = audioByNote.get(note);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }

    noteButton.classList.add("is-active");
    window.setTimeout(() => {
      noteButton.classList.remove("is-active");
    }, 180);
  };

  container.addEventListener("pointerdown", (event) => {
    const noteButton = event.target.closest(".note[data-note]");
    if (!noteButton || !container.contains(noteButton)) return;
    playNote(noteButton);
  });

  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const noteButton = event.target.closest(".note[data-note]");
    if (!noteButton || !container.contains(noteButton)) return;
    event.preventDefault();
    playNote(noteButton);
  });
})();
