// ==========================================
// AMOR EM SITE ❤️
// TESTE GRATUITO
// ==========================================

const API_URL = "https://amor-em-site-backend.vercel.app";

const nameInput = document.getElementById("loveName");
const yourNameInput = document.getElementById("yourName");
const messageInput = document.getElementById("loveMessage");
const dateInput = document.getElementById("loveDate");
const photoInput = document.getElementById("lovePhoto");
const musicInput = document.getElementById("loveMusic");
const storyInput = document.getElementById("loveStory");

const reason1Input = document.getElementById("reason1");
const reason2Input = document.getElementById("reason2");
const reason3Input = document.getElementById("reason3");

const form = document.getElementById("builderForm");

const previewName = document.getElementById("previewName");
const previewMessage = document.getElementById("previewMessage");
const previewPhoto = document.getElementById("previewPhoto");
const previewPhotoImage = document.getElementById("previewPhotoImage");
const previewPhotoPlaceholder = document.getElementById("previewPhotoPlaceholder");
const previewMusic = document.getElementById("previewMusic");
const previewDate = document.getElementById("previewDate");
const previewStory = document.getElementById("previewStory");

const previewReason1 = document.getElementById("previewReason1");
const previewReason2 = document.getElementById("previewReason2");
const previewReason3 = document.getElementById("previewReason3");

const heroPreview = document.getElementById("heroPreview");

const planButtons = document.querySelectorAll("[data-plan]");
const checkoutButton = document.getElementById("checkoutButton");
const generatePreviewButton = document.getElementById("generatePreviewButton");

let selectedPlan = "";
let photoData = "";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updatePreview() {
  const name = nameInput?.value.trim() || "meu amor";
  const message = messageInput?.value.trim() ||
    "Crie uma mensagem especial e veja sua surpresa aparecer aqui.";
  const story = storyInput?.value.trim() ||
    "Conte aqui um pedacinho da história de vocês.";
  const music = musicInput?.value || "Nossa música";
  const reason1 = reason1Input?.value.trim() || "Um motivo especial ❤️";
  const reason2 = reason2Input?.value.trim() || "Outro motivo especial ❤️";
  const reason3 = reason3Input?.value.trim() || "Mais um motivo especial ❤️";

  if (previewName) previewName.textContent = name;
  if (previewMessage) previewMessage.textContent = message;
  if (previewMusic) previewMusic.textContent = music;

  if (previewStory) {
    const maxStoryLength = 190;
    previewStory.textContent =
      story.length > maxStoryLength
        ? story.substring(0, maxStoryLength) + "..."
        : story;
  }

  if (previewReason1) previewReason1.textContent = reason1;
  if (previewReason2) previewReason2.textContent = reason2;
  if (previewReason3) previewReason3.textContent = reason3;

  if (previewDate) {
    if (dateInput?.value) {
      const date = new Date(`${dateInput.value}T00:00:00`);
      previewDate.textContent =
        `♥ Nossa data: ${date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        })}`;
    } else {
      previewDate.textContent = "✦ Nossa data especial ✦";
    }
  }

  if (heroPreview) {
    const heroTitle = heroPreview.querySelector("h2");

    if (heroTitle) {
      if (name === "meu amor") {
        heroTitle.innerHTML = "Oi, meu<br><em>amor.</em>";
      } else {
        heroTitle.innerHTML =
          `Oi, <em>${escapeHtml(name)}.</em>`;
      }
    }
  }
}

[
  nameInput,
  yourNameInput,
  messageInput,
  dateInput,
  musicInput,
  storyInput,
  reason1Input,
  reason2Input,
  reason3Input
].forEach((element) => {
  if (!element) return;
  element.addEventListener("input", updatePreview);
  element.addEventListener("change", updatePreview);
});


// ==========================================
// EDITOR DE FOTO
// ==========================================

const photoEditor = document.getElementById("photoEditor");
const photoZoom = document.getElementById("photoZoom");
const photoX = document.getElementById("photoX");
const photoY = document.getElementById("photoY");

const photoZoomValue =
  document.getElementById("photoZoomValue");
const photoXValue =
  document.getElementById("photoXValue");
const photoYValue =
  document.getElementById("photoYValue");

const photoReset =
  document.getElementById("photoReset");

const photoRatioButtons =
  document.querySelectorAll(".photo-ratio");

let photoRatio = "4/5";
let draggingPhoto = false;

let dragStartX = 0;
let dragStartY = 0;

let dragStartPhotoX = 50;
let dragStartPhotoY = 20;

function clampPhoto(value) {
  return Math.max(0, Math.min(100, value));
}

function applyPhotoEditor() {
  if (!previewPhoto) return;

  const zoom = Number(photoZoom?.value || 100);
  const x = Number(photoX?.value || 50);
  const y = Number(photoY?.value || 20);

  previewPhoto.style.aspectRatio = photoRatio;

  if (previewPhotoImage) {
    previewPhotoImage.style.objectPosition = `${x}% ${y}%`;
    previewPhotoImage.style.transform = `scale(${zoom / 100})`;
  }

  if (photoZoomValue) photoZoomValue.textContent = `${zoom}%`;
  if (photoXValue) photoXValue.textContent = `${x}%`;
  if (photoYValue) photoYValue.textContent = `${y}%`;
}

function showPhotoEditor() {
  if (photoEditor) {
    photoEditor.classList.add("visible");
  }

  applyPhotoEditor();
}

[photoZoom, photoX, photoY].forEach((control) => {
  control?.addEventListener("input", applyPhotoEditor);
});

photoRatioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    photoRatio = button.dataset.ratio || "4/5";

    photoRatioButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    applyPhotoEditor();
  });
});

photoReset?.addEventListener("click", () => {
  if (photoZoom) photoZoom.value = 100;
  if (photoX) photoX.value = 50;
  if (photoY) photoY.value = 20;

  photoRatio = "4/5";

  photoRatioButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.ratio === "4/5"
    );
  });

  applyPhotoEditor();
});


// ==========================================
// ARRASTAR FOTO COM MOUSE OU DEDO
// ==========================================

previewPhoto?.addEventListener("pointerdown", (event) => {
  if (!previewPhoto.classList.contains("has-photo")) return;

  draggingPhoto = true;

  dragStartX = event.clientX;
  dragStartY = event.clientY;

  dragStartPhotoX =
    Number(photoX?.value || 50);

  dragStartPhotoY =
    Number(photoY?.value || 20);

  previewPhoto.classList.add("dragging");

  previewPhoto.setPointerCapture?.(event.pointerId);
});

previewPhoto?.addEventListener("pointermove", (event) => {
  if (!draggingPhoto) return;

  const dx = event.clientX - dragStartX;
  const dy = event.clientY - dragStartY;

  if (photoX) {
    photoX.value =
      clampPhoto(dragStartPhotoX - dx / 4);
  }

  if (photoY) {
    photoY.value =
      clampPhoto(dragStartPhotoY - dy / 4);
  }

  applyPhotoEditor();
});

function stopDraggingPhoto(event) {
  if (!draggingPhoto) return;

  draggingPhoto = false;

  previewPhoto?.classList.remove("dragging");

  previewPhoto?.releasePointerCapture?.(
    event.pointerId
  );
}

previewPhoto?.addEventListener(
  "pointerup",
  stopDraggingPhoto
);

previewPhoto?.addEventListener(
  "pointercancel",
  stopDraggingPhoto
);


// ==========================================
// ESCOLHER FOTO
// ==========================================

photoInput?.addEventListener("change", () => {
  const file = photoInput.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Escolha uma imagem válida.");
    photoInput.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Escolha uma imagem de até 10 MB.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const originalUrl = event.target.result;

    if (previewPhoto && previewPhotoImage) {
      previewPhotoImage.src = originalUrl;

      previewPhoto.classList.add("has-photo");

      if (previewPhotoPlaceholder) {
        previewPhotoPlaceholder.style.display = "none";
      }

      showPhotoEditor();
      applyPhotoEditor();
    }

    const img = new Image();

    img.onload = () => {
      const max = 900;

      const scale =
        Math.min(
          1,
          max / Math.max(img.width, img.height)
        );

      const canvas =
        document.createElement("canvas");

      canvas.width =
        Math.max(1, Math.round(img.width * scale));

      canvas.height =
        Math.max(1, Math.round(img.height * scale));

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      photoData =
        canvas.toDataURL(
          "image/jpeg",
          0.75
        );
    };

    img.src = originalUrl;
  };

  reader.readAsDataURL(file);
});


// ==========================================
// ABAS
// ==========================================

const previewTabs =
  document.querySelectorAll("[data-preview-tab]");

const previewPages =
  document.querySelectorAll("[data-preview-page]");

previewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.previewTab;

    previewTabs.forEach((item) => {
      item.classList.remove("active");
    });

    previewPages.forEach((page) => {
      page.classList.remove("active");
    });

    tab.classList.add("active");

    const page =
      document.querySelector(
        `[data-preview-page="${target}"]`
      );

    if (page) page.classList.add("active");
  });
});


// ==========================================
// GERAR PRÉVIA — GRATUITAMENTE
// ==========================================

function generatePreview() {
  updatePreview();

  const preview =
    document.getElementById("lovePreview");

  if (!preview) return;

  preview.classList.remove("ready");

  void preview.offsetWidth;

  preview.classList.add("ready");

  setTimeout(() => {
    preview.classList.remove("ready");
  }, 900);
}

generatePreviewButton?.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    generatePreview();
  }
);

form?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    generatePreview();
  }
);


// ==========================================
// PLANOS
// ==========================================

planButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    selectedPlan =
      button.dataset.plan || "";

    const pedido =
      document.getElementById("pedido");

    if (pedido) {
      pedido.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    updateCheckoutButton();
  });
});

function updateCheckoutButton() {
  if (!checkoutButton) return;

  if (selectedPlan) {
    const planName =
      selectedPlan.split(" — ")[0];

    checkoutButton.textContent =
      `Continuar com ${planName} ❤️`;

    checkoutButton.classList.add("selected");
  } else {
    checkoutButton.textContent =
      "Escolher meu plano ❤️";

    checkoutButton.classList.remove("selected");
  }
}

checkoutButton?.addEventListener(
  "click",
  async () => {

    if (!selectedPlan) {

      document
        .getElementById("planos")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      return;
    }

    const originalText = checkoutButton.textContent;

    checkoutButton.disabled = true;
    checkoutButton.textContent = "Preparando pagamento...";

    try {
      const payload = {
        plan: selectedPlan,

        customer: {
          loveName: nameInput?.value.trim() || "",
          yourName: yourNameInput?.value.trim() || "",
          loveMessage: messageInput?.value.trim() || "",
          loveDate: dateInput?.value || "",
          loveMusic: musicInput?.value || "",
          loveStory: storyInput?.value.trim() || "",
          reason1: reason1Input?.value.trim() || "",
          reason2: reason2Input?.value.trim() || "",
          reason3: reason3Input?.value.trim() || "",
          photoData: photoData || ""
        }
      };

      const response = await fetch(
        `${API_URL}/api/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
          result.message ||
          "Não foi possível criar o pagamento."
        );
      }

      if (!result.link) {
        throw new Error(
          "O checkout foi criado, mas o link de pagamento não foi retornado."
        );
      }

      window.location.href = result.link;

    } catch (error) {
      console.error("Erro ao criar checkout:", error);

      alert(
        error?.message ||
        "Não foi possível iniciar o pagamento. Tente novamente."
      );

      checkoutButton.disabled = false;
      checkoutButton.textContent = originalText;
    }
  }
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

updatePreview();
updateCheckoutButton();

console.log("❤️ Amor em Site iniciado");
console.log("Backend:", API_URL);
