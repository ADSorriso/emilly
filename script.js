// ==========================================
// AMOR EM SITE ❤️
// TESTE GRATUITO + PERSONALIZAÇÃO + CHECKOUT
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

// ==========================================
// REGRAS DE PERSONALIZAÇÃO POR PLANO
// ==========================================

const PLAN_RULES = {
  essencial: {
    label: "Essencial",
    fields: ["loveName", "yourName", "loveMessage", "lovePhoto"],
    extras: false,
    music: false,
    reasons: 0,
    story: false
  },
  romantico: {
    label: "Romântico",
    fields: [
      "loveName",
      "yourName",
      "loveMessage",
      "loveDate",
      "lovePhoto",
      "loveStory",
      "reasons"
    ],
    extras: true,
    music: false,
    reasons: 100,
    story: true
  },
  premium: {
    label: "Premium",
    fields: [
      "loveName",
      "yourName",
      "loveMessage",
      "loveDate",
      "lovePhoto",
      "loveMusic",
      "loveStory",
      "reasons"
    ],
    extras: true,
    music: true,
    reasons: 100,
    story: true
  }
};

function getPlanKey(plan = selectedPlan) {
  const raw = String(plan || "")
    .split(" — ")[0]
    .trim()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase();

  if (raw.includes("premium")) return "premium";
  if (raw.includes("romantico")) return "romantico";
  if (raw.includes("essencial")) return "essencial";
  return "";
}

function getSelectedPlanRules() {
  return PLAN_RULES[getPlanKey()] || null;
}

function getFieldContainer(element) {
  return element?.closest("label") || element?.parentElement;
}

function setFieldVisibility(element, visible, required = false) {
  const container = getFieldContainer(element);
  if (!container) return;

  container.style.display = visible ? "" : "none";

  if ("required" in element) {
    element.required = visible && required;
  }

  if (!visible) {
    element.value = "";
  }
}

function ensureAdvancedFields() {
  const existing = document.getElementById("advancedPlanFields");
  if (existing) return existing;

  const wrapper = document.createElement("div");
  wrapper.id = "advancedPlanFields";
  wrapper.style.display = "none";
  wrapper.innerHTML = `
    <div class="reasons-title">💌 Recursos do plano Romântico/Premium</div>

    <label id="letterField">
      💌 Carta interativa
      <textarea id="loveLetter" maxlength="2500"
        placeholder="Escreva uma carta especial para o seu amor..."></textarea>
      <small class="field-help">Este conteúdo será usado na carta interativa do site.</small>
    </label>

    <label id="surpriseField">
      🎁 Surpresa final
      <textarea id="loveSurprise" maxlength="1500"
        placeholder="Escreva a mensagem que aparecerá na surpresa final..."></textarea>
      <small class="field-help">Mensagem exibida no momento da surpresa.</small>
    </label>

    <label id="reasons100Field">
      ❤️ 100 motivos
      <textarea id="reasons100" maxlength="10000" rows="8"
        placeholder="Digite um motivo por linha. Exemplo:
1. Seu sorriso
2. Seu carinho
3. Seu jeito de me apoiar
..."></textarea>
      <small class="field-help">No plano Romântico/Premium, você pode cadastrar até 100 motivos, um por linha.</small>
    </label>

    <div id="premiumAdvancedNote" class="field-help" style="display:none;">
      👑 O Premium inclui música escolhida, personalização avançada e mais animações.
    </div>
  `;

  const reasonsTitle = document.querySelector(".reasons-title");
  const formElement = document.getElementById("builderForm");

  if (reasonsTitle?.parentElement) {
    reasonsTitle.parentElement.insertBefore(wrapper, reasonsTitle.nextSibling);
  } else if (formElement) {
    const button = document.getElementById("generatePreviewButton");
    formElement.insertBefore(wrapper, button || null);
  }

  return wrapper;
}

function applyPlanRules() {
  const rules = getSelectedPlanRules();
  const advanced = ensureAdvancedFields();

  // Antes de escolher um plano, mantém a prévia gratuita funcionando.
  if (!rules) {
    advanced.style.display = "none";
    setFieldVisibility(nameInput, true, true);
    setFieldVisibility(yourNameInput, true, false);
    setFieldVisibility(messageInput, true, false);
    setFieldVisibility(dateInput, true, false);
    setFieldVisibility(photoInput, true, false);
    setFieldVisibility(musicInput, true, false);
    setFieldVisibility(storyInput, true, false);
    [reason1Input, reason2Input, reason3Input].forEach((el) => setFieldVisibility(el, true, false));
    return;
  }

  const isEssential = getPlanKey() === "essencial";
  const isRomanticOrPremium = rules.extras;

  setFieldVisibility(nameInput, true, true);
  setFieldVisibility(yourNameInput, true, false);
  setFieldVisibility(messageInput, true, true);
  setFieldVisibility(dateInput, !isEssential, !isEssential);
  setFieldVisibility(photoInput, true, true);
  setFieldVisibility(musicInput, rules.music, rules.music);
  setFieldVisibility(storyInput, rules.story, rules.story);

  // Os 3 motivos antigos não são usados como recurso principal nos planos pagos.
  [reason1Input, reason2Input, reason3Input].forEach((el) => {
    setFieldVisibility(el, !isRomanticOrPremium, !isRomanticOrPremium);
  });

  advanced.style.display = isRomanticOrPremium ? "" : "none";

  const letter = document.getElementById("loveLetter");
  const surprise = document.getElementById("loveSurprise");
  const reasons100 = document.getElementById("reasons100");
  const premiumNote = document.getElementById("premiumAdvancedNote");

  if (letter) letter.required = isRomanticOrPremium;
  if (surprise) surprise.required = isRomanticOrPremium;
  if (reasons100) reasons100.required = isRomanticOrPremium;
  if (premiumNote) premiumNote.style.display = getPlanKey() === "premium" ? "" : "none";
}

function validatePlanPersonalization() {
  const rules = getSelectedPlanRules();
  if (!rules) return true;

  const key = getPlanKey();

  if (nameInput && !nameInput.value.trim()) {
    nameInput.reportValidity();
    return false;
  }

  if (messageInput && !messageInput.value.trim()) {
    messageInput.reportValidity();
    return false;
  }

  if (photoInput && !photoInput.files?.length && !photoData) {
    alert("Escolha a foto principal para continuar.");
    photoInput.focus();
    return false;
  }

  if (key !== "essencial" && dateInput && !dateInput.value) {
    dateInput.reportValidity();
    return false;
  }

  if (rules.story && storyInput && !storyInput.value.trim()) {
    storyInput.reportValidity();
    return false;
  }

  if (rules.music && musicInput && !musicInput.value.trim()) {
    musicInput.reportValidity();
    return false;
  }

  if (rules.reasons > 0) {
    const reasons100 = document.getElementById("reasons100");
    const reasons = (reasons100?.value || "")
      .split("\\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (reasons.length < 1) {
      alert("Digite pelo menos 1 motivo. Você pode cadastrar até 100 motivos.");
      reasons100?.focus();
      return false;
    }

    if (reasons.length > 100) {
      alert("O limite deste plano é de 100 motivos.");
      reasons100?.focus();
      return false;
    }

    const letter = document.getElementById("loveLetter");
    const surprise = document.getElementById("loveSurprise");

    if (!letter?.value.trim()) {
      alert("Preencha a carta interativa.");
      letter?.focus();
      return false;
    }

    if (!surprise?.value.trim()) {
      alert("Preencha a surpresa final.");
      surprise?.focus();
      return false;
    }
  }

  return true;
}

ensureAdvancedFields();


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
  async (event) => {
    event.preventDefault();

    // Sem plano selecionado: continua sendo apenas uma prévia gratuita.
    if (!selectedPlan) {
      generatePreview();
      return;
    }

    // Com plano selecionado: valida as regras daquele plano,
    // cria o pedido e leva o cliente ao pagamento.
    if (!validatePlanPersonalization()) return;

    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    updatePreview();
    await startCheckout();
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

// Intercepta o clique nos planos ANTES de qualquer outro listener.
// Assim, clicar em "Quero esse" nunca abre o Asaas diretamente.
document.addEventListener(
  "click",
  (event) => {
    const button = event.target.closest?.("[data-plan]");
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    selectedPlan = button.dataset.plan || "";

    applyPlanRules();
    updateCheckoutButton();

    // Primeiro o cliente personaliza. O pagamento só acontece
    // quando clicar em "Criar meu site".
    document
      .getElementById("teste")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    if (generatePreviewButton) {
      const planName = selectedPlan.split(" — ")[0];
      generatePreviewButton.textContent =
        `❤️ Criar meu site — ${planName}`;
      generatePreviewButton.classList.add("selected");
    }
  },
  true
);

function updateCheckoutButton() {
  if (!checkoutButton) return;

  if (selectedPlan) {
    const planName =
      selectedPlan.split(" — ")[0];

    checkoutButton.textContent =
      `Continuar com ${planName} ❤️`;

    checkoutButton.classList.add("selected");

    if (generatePreviewButton) {
      generatePreviewButton.textContent =
        `❤️ Criar meu site — ${planName}`;
      generatePreviewButton.classList.add("selected");
    }
  } else {
    checkoutButton.textContent =
      "Escolher meu plano ❤️";

    checkoutButton.classList.remove("selected");

    if (generatePreviewButton) {
      generatePreviewButton.textContent =
        "✨ Gerar minha prévia";
      generatePreviewButton.classList.remove("selected");
    }
  }
}

async function startCheckout() {

  if (!selectedPlan) {
    document
      .getElementById("planos")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    return;
  }

  // Garante que os recursos preenchidos correspondem ao plano escolhido.
  if (!validatePlanPersonalization()) return;

  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const originalText = checkoutButton?.textContent || "Continuar";

  if (checkoutButton) {
    checkoutButton.disabled = true;
    checkoutButton.textContent = "Preparando pagamento...";
  }

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
        reasons100: document.getElementById("reasons100")?.value.trim() || "",
        loveLetter: document.getElementById("loveLetter")?.value.trim() || "",
        loveSurprise: document.getElementById("loveSurprise")?.value.trim() || "",
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

    if (checkoutButton) {
      checkoutButton.disabled = false;
      checkoutButton.textContent = originalText;
    }
  }
}

checkoutButton?.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    event.stopPropagation();
    startCheckout();
  }
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

updatePreview();
applyPlanRules();
updateCheckoutButton();

console.log("❤️ Amor em Site iniciado");
console.log("Backend:", API_URL);
