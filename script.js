// ==========================================
// AMOR EM SITE ❤️
// TESTE GRATUITO
// ==========================================

const API_URL = "https://amor-em-site-backend.vercel.app";

const whatsappNumber = "5566974005474";


// ==========================================
// ELEMENTOS
// ==========================================

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
const previewMusic = document.getElementById("previewMusic");
const previewDate = document.getElementById("previewDate");
const previewStory = document.getElementById("previewStory");

const previewReason1 = document.getElementById("previewReason1");
const previewReason2 = document.getElementById("previewReason2");
const previewReason3 = document.getElementById("previewReason3");

const heroPreview = document.getElementById("heroPreview");

const planButtons =
  document.querySelectorAll("[data-plan]");

let selectedPlan = "";
let photoData = "";


// ==========================================
// SEGURANÇA
// ==========================================

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ==========================================
// ATUALIZAR PRÉVIA
// ==========================================

function updatePreview() {

  const name =
    nameInput?.value.trim() ||
    "meu amor";

  const message =
    messageInput?.value.trim() ||
    "Crie uma mensagem especial e veja sua surpresa aparecer aqui.";

  const story =
    storyInput?.value.trim() ||
    "Conte aqui um pedacinho da história de vocês.";

  const music =
    musicInput?.value ||
    "Nossa música";

  const reason1 =
    reason1Input?.value.trim() ||
    "Um motivo especial ❤️";

  const reason2 =
    reason2Input?.value.trim() ||
    "Outro motivo especial ❤️";

  const reason3 =
    reason3Input?.value.trim() ||
    "Mais um motivo especial ❤️";


  // Nome

  if (previewName) {
    previewName.textContent = name;
  }


  // Mensagem

  if (previewMessage) {
    previewMessage.textContent = message;
  }


  // Música

  if (previewMusic) {
    previewMusic.textContent = music;
  }


  // História

  if (previewStory) {

    const maxStoryLength = 190;

    let storyText = story;

    if (storyText.length > maxStoryLength) {
      storyText =
        storyText.substring(0, maxStoryLength) +
        "...";
    }

    previewStory.textContent = storyText;
  }


  // Motivos

  if (previewReason1) {
    previewReason1.textContent = reason1;
  }

  if (previewReason2) {
    previewReason2.textContent = reason2;
  }

  if (previewReason3) {
    previewReason3.textContent = reason3;
  }


  // Data

  if (previewDate) {

    if (dateInput?.value) {

      const date =
        new Date(
          `${dateInput.value}T00:00:00`
        );

      const formatted =
        date.toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }
        );

      previewDate.textContent =
        `♥ Nossa data: ${formatted}`;

    } else {

      previewDate.textContent =
        "✦ Nossa data especial ✦";
    }
  }


  // Hero

  if (heroPreview) {

    const heroTitle =
      heroPreview.querySelector("h2");

    if (heroTitle) {

      if (name === "meu amor") {

        heroTitle.innerHTML =
          `Oi, meu<br><em>amor.</em>`;

      } else {

        heroTitle.innerHTML =
          `Oi, <em>${escapeHtml(name)}.</em>`;
      }
    }
  }
}


// ==========================================
// CAMPOS EM TEMPO REAL
// ==========================================

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

  if (element) {

    element.addEventListener(
      "input",
      updatePreview
    );

    element.addEventListener(
      "change",
      updatePreview
    );
  }

});


// ==========================================
// FOTO
// ==========================================

photoInput?.addEventListener(
  "change",
  () => {

    const file =
      photoInput.files?.[0];

    if (!file) return;


    if (file.size > 10 * 1024 * 1024) {

      alert(
        "Escolha uma imagem de até 10 MB."
      );

      photoInput.value = "";

      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      (event) => {

        const originalUrl =
          event.target.result;


        // Mostrar na prévia

        if (previewPhoto) {

          previewPhoto.style.backgroundImage =
            `url("${originalUrl}")`;

          previewPhoto.classList.add(
            "has-photo"
          );

          const placeholder =
            previewPhoto.querySelector(
              "span"
            );

          if (placeholder) {
            placeholder.style.display =
              "none";
          }
        }


        // Comprimir

        const img =
          new Image();


        img.onload =
          () => {

            const max = 700;

            const scale =
              Math.min(
                1,
                max /
                  Math.max(
                    img.width,
                    img.height
                  )
              );


            const canvas =
              document.createElement(
                "canvas"
              );


            canvas.width =
              Math.round(
                img.width * scale
              );

            canvas.height =
              Math.round(
                img.height * scale
              );


            const ctx =
              canvas.getContext(
                "2d"
              );


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
                0.68
              );
          };


        img.src =
          originalUrl;
      };


    reader.readAsDataURL(file);
  }
);


// ==========================================
// NAVEGAÇÃO DA PRÉVIA
// ==========================================

const previewTabs =
  document.querySelectorAll(
    "[data-preview-tab]"
  );

const previewPages =
  document.querySelectorAll(
    "[data-preview-page]"
  );


previewTabs.forEach((tab) => {

  tab.addEventListener(
    "click",
    () => {

      const target =
        tab.dataset.previewTab;


      previewTabs.forEach((item) => {
        item.classList.remove(
          "active"
        );
      });


      previewPages.forEach((page) => {
        page.classList.remove(
          "active"
        );
      });


      tab.classList.add(
        "active"
      );


      const page =
        document.querySelector(
          `[data-preview-page="${target}"]`
        );


      if (page) {
        page.classList.add(
          "active"
        );
      }

    }
  );

});


// ==========================================
// GERAR PRÉVIA
// ==========================================

form?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    updatePreview();


    const preview =
      document.getElementById(
        "lovePreview"
      );


    preview?.classList.add(
      "ready"
    );


    setTimeout(() => {

      preview?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 100);

  }
);


// ==========================================
// PLANOS
// ==========================================

planButtons.forEach((button) => {

  button.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      selectedPlan =
        button.dataset.plan || "";


      const pedido =
        document.getElementById(
          "pedido"
        );


      if (pedido) {

        pedido.scrollIntoView({
          behavior: "smooth"
        });

      }


      updateWhatsapp();

    }
  );

});


// ==========================================
// WHATSAPP
// ==========================================

function updateWhatsapp() {

  const recipient =
    nameInput?.value.trim() ||
    "meu amor";

  const sender =
    yourNameInput?.value.trim() ||
    "não informado";

  const message =
    messageInput?.value.trim() ||
    "não informada";

  const plan =
    selectedPlan ||
    "Quero saber qual plano escolher";


  const text =
`Olá! Testei o Amor em Site e gostei da prévia. ❤️

Pessoa especial: ${recipient}
Meu nome: ${sender}
Mensagem: ${message}
Plano: ${plan}

Quero liberar meu site completo.`;


  const button =
    document.getElementById(
      "whatsapp"
    );


  if (button) {

    button.href =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

  }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

updatePreview();

updateWhatsapp();


console.log(
  "❤️ Amor em Site iniciado"
);

console.log(
  "Backend:",
  API_URL
);
