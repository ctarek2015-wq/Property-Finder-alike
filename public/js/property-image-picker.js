(() => {
  const input = document.getElementById("images");
  const previews = document.getElementById("image-previews");
  if (!input || !previews) return;

  input.addEventListener("change", () => {
    previews.replaceChildren();
    [...input.files].forEach((file, index) => {
      const item = document.createElement("label");
      item.className = "image-preview-item";
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      image.alt = `Selected image ${index + 1}`;
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "mainImagePublicId";
      radio.value = `new:${index}`;
      radio.checked = index === 0;
      item.append(image, radio, document.createTextNode(" Featured image"));
      previews.append(item);
    });
  });
})();
