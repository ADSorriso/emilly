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

const planButtons = document.querySelectorAll("[data-plan-id]");
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
// PLANOS — PERSONALIZAÇÃO ANTES DO PAGAMENTO
// ==========================================

const PLAN_PRICES = {
  essencial: "R$ 10,90",
  romantico: "R$ 39,90",
  premium: "R$ 59,90"
};

const PLAN_NAMES = {
  essencial: "Essencial",
  romantico: "Romântico",
  premium: "Premium"
};

function ensurePlanPersonalizationModal() {
  if (document.getElementById("planPersonalizationModal")) return;

  const style = document.createElement("style");
  style.id = "planPersonalizationModalStyles";
  style.textContent = `
    #planPersonalizationModal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0,0,0,.82);
      backdrop-filter: blur(10px);
      overflow-y: auto;
    }
    #planPersonalizationModal.is-open { display: flex; }
    .pem-card {
      width: min(760px, 100%);
      max-height: calc(100vh - 48px);
      overflow-y: auto;
      background: #fff;
      color: #171117;
      border-radius: 24px;
      padding: 30px;
      box-shadow: 0 30px 90px rgba(0,0,0,.45);
    }
    .pem-head {
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:20px;
      margin-bottom:24px;
    }
    .pem-kicker {
      color:#e51d4f;
      font-size:11px;
      font-weight:800;
      letter-spacing:.2em;
      text-transform:uppercase;
      margin-bottom:7px;
    }
    .pem-title {
      margin:0;
      font-size:30px;
      line-height:1.1;
      font-weight:800;
    }
    .pem-title em {
      font-family:"Great Vibes",cursive;
      color:#e51d4f;
      font-weight:400;
      font-size:1.15em;
    }
    .pem-plan {
      margin-top:8px;
      color:#777;
      font-size:14px;
    }
    .pem-close {
      border:0;
      background:#f3eef0;
      width:40px;
      height:40px;
      border-radius:50%;
      cursor:pointer;
      font-size:22px;
      flex:0 0 auto;
    }
    .pem-grid {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:16px;
    }
    .pem-field { display:flex; flex-direction:column; gap:7px; }
    .pem-field.full { grid-column:1/-1; }
    .pem-field label { font-weight:700; font-size:14px; }
    .pem-field input,
    .pem-field textarea,
    .pem-field select {
      width:100%;
      box-sizing:border-box;
      border:1px solid #ddd;
      border-radius:12px;
      padding:13px 14px;
      font:inherit;
      background:#fff;
      color:#171117;
      outline:none;
    }
    .pem-field textarea { min-height:105px; resize:vertical; }
    .pem-field input:focus,
    .pem-field textarea:focus,
    .pem-field select:focus { border-color:#e51d4f; }
    .pem-help { color:#777; font-size:12px; line-height:1.4; }
    .pem-section {
      grid-column:1/-1;
      margin-top:4px;
      padding-top:16px;
      border-top:1px solid #eee;
    }
    .pem-section strong { font-size:15px; }
    .pem-actions {
      display:flex;
      justify-content:flex-end;
      gap:12px;
      margin-top:24px;
    }
    .pem-secondary, .pem-primary {
      border:0;
      border-radius:999px;
      padding:13px 22px;
      font-weight:800;
      cursor:pointer;
    }
    .pem-secondary { background:#f1ecee; color:#333; }
    .pem-primary { background:#e51d4f; color:#fff; }
    @media (max-width: 650px) {
      #planPersonalizationModal { padding:12px; }
      .pem-card { padding:22px; max-height:calc(100vh - 24px); border-radius:20px; }
      .pem-grid { grid-template-columns:1fr; }
      .pem-field.full, .pem-section { grid-column:auto; }
      .pem-title { font-size:25px; }
      .pem-actions { flex-direction:column-reverse; }
      .pem-secondary, .pem-primary { width:100%; }
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.id = "planPersonalizationModal";
  modal.innerHTML = `
    <div class="pem-card" role="dialog" aria-modal="true" aria-labelledby="pemTitle">
      <div class="pem-head">
        <div>
          <div class="pem-kicker">PERSONALIZE SEU SITE</div>
          <h2 class="pem-title" id="pemTitle">Seu site, <em>só de vocês.</em></h2>
          <div class="pem-plan" id="pemPlanName"></div>
        </div>
        <button class="pem-close" id="pemClose" type="button" aria-label="Fechar">×</button>
      </div>

      <form id="pemForm">
        <div class="pem-grid">
          <div class="pem-field">
            <label for="pemLoveName">Nome de quem vai receber *</label>
            <input id="pemLoveName" maxlength="40" placeholder="Ex.: Emilly" required>
          </div>

          <div class="pem-field">
            <label for="pemYourName">Seu nome</label>
            <input id="pemYourName" maxlength="40" placeholder="Ex.: Ricael">
          </div>

          <div class="pem-field full">
            <label for="pemMessage">Mensagem personalizada *</label>
            <textarea id="pemMessage" maxlength="180" placeholder="Ex.: Te amo meu amor ❤️" required></textarea>
          </div>

          <div class="pem-field" data-pem="date">
            <label for="pemDate">Data especial *</label>
            <input id="pemDate" type="date">
          </div>

          <div class="pem-field">
            <label for="pemPhoto">Foto principal *</label>
            <input id="pemPhoto" type="file" accept="image/*" required>
            <span class="pem-help">Até 10 MB.</span>
          </div>

          <div class="pem-field" data-pem="music">
            <label for="pemMusic">🎵 Música escolhida *</label>
            <select id="pemMusic">
              <option value="Nossa música">Nossa música</option>
              <option value="Piano romântico">Piano romântico</option>
              <option value="Romântica">Romântica</option>
            </select>
          </div>

          <div class="pem-field full" data-pem="story">
            <label for="pemStory">📖 Nossa história *</label>
            <textarea id="pemStory" maxlength="400" placeholder="Como vocês se conheceram?"></textarea>
          </div>

          <div class="pem-section" data-pem="romantic">
            <strong>💕 Recursos do Romântico/Premium</strong>
          </div>

          <div class="pem-field full" data-pem="romantic">
            <label for="pemReasons">❤️ 100 motivos *</label>
            <textarea id="pemReasons" maxlength="10000" rows="7"
              placeholder="Digite um motivo por linha. Ex.:
Seu sorriso
Seu carinho
Seu jeito de me apoiar"></textarea>
            <span class="pem-help">Você pode cadastrar até 100 motivos, um por linha.</span>
          </div>

          <div class="pem-field full" data-pem="romantic">
            <label for="pemLetter">💌 Carta interativa *</label>
            <textarea id="pemLetter" maxlength="2500" placeholder="Escreva sua carta de amor..."></textarea>
          </div>

          <div class="pem-field full" data-pem="romantic">
            <label for="pemSurprise">🎁 Surpresa final *</label>
            <textarea id="pemSurprise" maxlength="1500" placeholder="Mensagem da surpresa final..."></textarea>
          </div>
        </div>

        <div class="pem-actions">
          <button class="pem-secondary" id="pemCancel" type="button">Voltar</button>
          <button class="pem-primary" id="pemSubmit" type="submit">❤️ Criar meu site</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  document.getElementById("pemClose")?.addEventListener("click", close);
  document.getElementById("pemCancel")?.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  document.getElementById("pemForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const key = modal.dataset.planKey || "";
    const rules = PLAN_RULES[key];

    const modalLoveName = document.getElementById("pemLoveName");
    const modalMessage = document.getElementById("pemMessage");
    const modalPhoto = document.getElementById("pemPhoto");
    const modalDate = document.getElementById("pemDate");
    const modalStory = document.getElementById("pemStory");
    const modalMusic = document.getElementById("pemMusic");
    const modalReasons = document.getElementById("pemReasons");
    const modalLetter = document.getElementById("pemLetter");
    const modalSurprise = document.getElementById("pemSurprise");

    if (!modalLoveName.value.trim() || !modalMessage.value.trim()) {
      alert("Preencha o nome e a mensagem.");
      return;
    }

    if (!modalPhoto.files?.length) {
      alert("Escolha a foto principal.");
      return;
    }

    if (key !== "essencial" && !modalDate.value) {
      alert("Informe a data especial.");
      return;
    }

    if (rules?.story && !modalStory.value.trim()) {
      alert("Preencha a história de vocês.");
      return;
    }

    if (rules?.music && !modalMusic.value) {
      alert("Escolha a música.");
      return;
    }

    if (rules?.reasons) {
      const reasons = modalReasons.value.split("\\n").map(x => x.trim()).filter(Boolean);
      if (!reasons.length) {
        alert("Digite pelo menos 1 motivo.");
        return;
      }
      if (reasons.length > 100) {
        alert("O limite é de 100 motivos.");
        return;
      }
      if (!modalLetter.value.trim()) {
        alert("Preencha a carta interativa.");
        return;
      }
      if (!modalSurprise.value.trim()) {
        alert("Preencha a surpresa final.");
        return;
      }
    }

    const file = modalPhoto.files[0];
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      alert("Escolha uma imagem válida de até 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const originalUrl = e.target.result;
      const img = new Image();

      img.onload = async () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          alert("Não foi possível preparar a foto.");
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL("image/jpeg", 0.75);

        // Preenche o formulário original para reaproveitar a prévia,
        // as validações e o checkout já existentes.
        applyPlanRules();

        loveNameInput.value = modalLoveName.value.trim();
        yourNameInput.value = document.getElementById("pemYourName").value.trim();
        messageInput.value = modalMessage.value.trim();
        dateInput.value = modalDate.value || "";
        musicInput.value = modalMusic.value || "Nossa música";
        storyInput.value = modalStory.value.trim();

        const r1 = document.getElementById("reason1");
        const r2 = document.getElementById("reason2");
        const r3 = document.getElementById("reason3");
        const reasonLines = modalReasons.value.split("\\n").map(x => x.trim()).filter(Boolean);
        if (r1) r1.value = reasonLines[0] || "";
        if (r2) r2.value = reasonLines[1] || "";
        if (r3) r3.value = reasonLines[2] || "";

        const reasons100 = document.getElementById("reasons100");
        const loveLetter = document.getElementById("loveLetter");
        const loveSurprise = document.getElementById("loveSurprise");
        if (reasons100) reasons100.value = modalReasons.value.trim();
        if (loveLetter) loveLetter.value = modalLetter.value.trim();
        if (loveSurprise) loveSurprise.value = modalSurprise.value.trim();

        updatePreview();

        close();

        // Só agora, depois da personalização, abre o pagamento.
        await startCheckout();
      };

      img.src = originalUrl;
    };

    reader.readAsDataURL(file);
  });
}

function openPlanPersonalization(planKey) {
  const planName = PLAN_NAMES[planKey];
  if (!planName) return;

  selectedPlan = `${planName} — ${PLAN_PRICES[planKey]}`;

  ensurePlanPersonalizationModal();

  const modal = document.getElementById("planPersonalizationModal");
  modal.dataset.planKey = planKey;

  document.getElementById("pemPlanName").textContent =
    `Plano escolhido: ${selectedPlan}`;

  const isEssential = planKey === "essencial";
  const isPremium = planKey === "premium";
  const romantic = planKey === "romantico" || isPremium;

  document.querySelectorAll("[data-pem='date']").forEach(el => {
    el.style.display = isEssential ? "none" : "";
  });
  document.getElementById("pemDate").required = !isEssential;

  document.querySelectorAll("[data-pem='story']").forEach(el => {
    el.style.display = romantic ? "" : "none";
  });
  document.getElementById("pemStory").required = romantic;

  document.querySelectorAll("[data-pem='romantic']").forEach(el => {
    el.style.display = romantic ? "" : "none";
  });

  document.querySelectorAll("[data-pem='music']").forEach(el => {
    el.style.display = isPremium ? "" : "none";
  });
  document.getElementById("pemMusic").required = isPremium;

  const reasons = document.getElementById("pemReasons");
  const letter = document.getElementById("pemLetter");
  const surprise = document.getElementById("pemSurprise");
  if (reasons) reasons.required = romantic;
  if (letter) letter.required = romantic;
  if (surprise) surprise.required = romantic;

  document.getElementById("pemSubmit").textContent =
    `❤️ Criar meu site — ${planName}`;

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    document.getElementById("pemLoveName")?.focus();
  }, 50);
}

planButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const planKey = button.dataset.planId || "";
    if (!PLAN_RULES[planKey]) return;

    openPlanPersonalization(planKey);
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
  () => startCheckout()
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

updatePreview();
applyPlanRules();
updateCheckoutButton();

console.log("❤️ Amor em Site iniciado");
console.log("Backend:", API_URL);
