(() => {
  const modal = document.getElementById("image-viewer-modal");
  if (!modal) return;

  const images = [...document.querySelectorAll(".gallery-thumb")];
  const viewerImage = modal.querySelector(".viewer-image");
  const counter = modal.querySelector(".viewer-counter");
  const closeButton = modal.querySelector(".viewer-close");
  const previousButton = modal.querySelector(".viewer-prev");
  const nextButton = modal.querySelector(".viewer-next");
  let currentIndex = 0;
  let trigger;
  let touchStartX = 0;

  const render = () => {
    const image = images[currentIndex];
    viewerImage.src = image.src;
    viewerImage.alt = image.alt;
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  const open = (index, source) => {
    currentIndex = index;
    trigger = source;
    render();
    modal.hidden = false;
    document.body.classList.add("image-viewer-open");
    closeButton.focus();
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("image-viewer-open");
    if (trigger) trigger.focus();
  };

  const move = (step) => {
    currentIndex = (currentIndex + step + images.length) % images.length;
    render();
  };

  images.forEach((image, index) => {
    image.addEventListener("click", () => open(index, image));
    image.addEventListener("keydown", (event) => {
      // Open viewer from keyboard
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(index, image);
      }
    });
  });

  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));
  modal.querySelector(".viewer-backdrop").addEventListener("click", close);
  modal.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });
  modal.addEventListener("touchend", (event) => {
    // Support horizontal swipe navigation
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 50) move(distance > 0 ? -1 : 1);
  });
  document.addEventListener("keydown", (event) => {
    // Handle viewer keyboard controls
    if (modal.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
})();
