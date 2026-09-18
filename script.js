// ==========================================
// AMOR EM SITE ❤️
// Frontend + Checkout Asaas
// ==========================================

// URL do nosso backend no Vercel
const API_URL = "https://amor-em-site-backend.vercel.app";

// ==========================================
// ELEMENTOS
// ==========================================

const nameInput = document.getElementById("loveName");
const yourNameInput = document.getElementById("yourName");
const messageInput = document.getElementById("loveMessage");
const dateInput = document.getElementById("loveDate");
const photoInput = document.getElementById("lovePhoto");

const form = document.getElementById("builderForm");

const previewName = document.getElementById("previewName");
const previewMessage = document.getElementById("previewMessage");
const previewPhoto = document.getElementById("previewPhoto");
const heroPreview = document.getElementById("heroPreview");

const planButtons = document.querySelectorAll("[data-plan]");

let selectedPlan = "";
let photoData = "";


// ==========================================
// ATUALIZAR PRÉVIA
// ==========================================

function updatePreview() {
  const name = nameInput?.value.trim() || "meu amor";

  const message =
    messageInput?.value.trim() ||
    "Crie uma mensagem especial e veja sua surpresa aparecer aqui.";

  if (previewName) {
    previewName.textContent = name;
  }

  if (previewMessage) {
    previewMessage.textContent = message;
  }

  if (heroPreview) {
    const heroTitle = heroPreview.querySelector("h2");

    if (heroTitle) {
      if (name === "meu amor") {
        heroTitle.innerHTML = `Oi, meu<br><em>amor.</em>`;
      } else {
        heroTitle.innerHTML = `Oi, <em>${escapeHtml(name)}.</em>`;
      }
    }
  }
}


// ==========================================
// PROTEÇÃO CONTRA HTML INJETADO
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
// CAMPOS EM TEMPO REAL
// ==========================================

[nameInput, yourNameInput, messageInput, dateInput].forEach((element) => {
  if (element) {
    element.addEventListener("input", updatePreview);
  }
});


// ==========================================
// FOTO DA PRÉVIA
// ==========================================

photoInput?.addEventListener("change", () => {
  const file = photoInput.files?.[0];

  if (!file) return;

  // Limite simples para evitar arquivos absurdamente grandes
  if (file.size > 10 * 1024 * 1024) {
    alert("Escolha uma imagem de até 10 MB.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const originalUrl = event.target.result;

    // Mostrar imediatamente na prévia
    if (previewPhoto) {
      previewPhoto.style.backgroundImage = `url("${originalUrl}")`;
      previewPhoto.classList.add("has-photo");

      const placeholder = previewPhoto.querySelector("span");

      if (placeholder) {
        placeholder.style.display = "none";
      }
    }

    // Comprimir a imagem para gerar o link de teste
    const img = new Image();

    img.onload = () => {
      const max = 700;

      const scale = Math.min(
        1,
        max / Math.max(img.width, img.height)
      );

      const canvas = document.createElement("canvas");

      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      photoData = canvas.toDataURL("image/jpeg", 0.68);
    };

    img.src = originalUrl;
  };

  reader.readAsDataURL(file);
});


// ==========================================
// GERAR PRÉVIA
// ==========================================

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  updatePreview();

  document
    .getElementById("lovePreview")
    ?.classList.add("ready");

  gerarLinkDeTeste();

  // Leva o usuário para a prévia
  setTimeout(() => {
    document
      .getElementById("lovePreview")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
  }, 100);
});


// ==========================================
// GERAR LINK DE TESTE
// ==========================================

function gerarLinkDeTeste() {
  const data = {
    loveName:
      nameInput?.value.trim() || "meu amor",

    yourName:
      yourNameInput?.value.trim() || "",

    message:
      messageInput?.value.trim() ||
      "Eu fiz esse cantinho especialmente para você.",

    date:
      dateInput?.value || "",

    photo:
      photoData || ""
  };

  const encoded = btoa(
    unescape(
      encodeURIComponent(
        JSON.stringify(data)
      )
    )
  );

  const link = new URL(
    "site.html",
    window.location.href
  );

  link.hash = "data=" + encoded;

  let box =
    document.getElementById(
      "generatedLinkBox"
    );

  if (!box) {
    box = document.createElement("div");

    box.id = "generatedLinkBox";
    box.className = "generated-link-box";

    form?.appendChild(box);
  }

  const safeLink = escapeHtml(link.href);

  box.innerHTML = `
    <div class="generated-title">
      🎉 Sua prévia foi criada!
    </div>

    <p>
      Este é o seu link de teste.
      Você pode abrir e compartilhar:
    </p>

    <input
      readonly
      value="${safeLink}"
      onclick="this.select()"
    >

    <div class="generated-actions">

      <a
        class="btn"
        href="${safeLink}"
        target="_blank"
        rel="noopener"
      >
        🔗 Abrir meu link
      </a>

      <button
        type="button"
        class="btn secondary"
        id="copyGenerated"
      >
        Copiar link
      </button>

    </div>
  `;

  document
    .getElementById("copyGenerated")
    ?.addEventListener("click", async () => {

      try {
        await navigator.clipboard.writeText(
          link.href
        );

        const button =
          document.getElementById(
            "copyGenerated"
          );

        if (button) {
          button.textContent =
            "✓ Copiado!";
        }

      } catch (error) {
        alert(
          "Não foi possível copiar automaticamente. Copie o link manualmente."
        );
      }
    });

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ==========================================
// PLANOS
// ==========================================

planButtons.forEach((button) => {

  button.addEventListener(
    "click",
    async (event) => {

      event.preventDefault();

      selectedPlan =
        button.dataset.plan || "";

      await iniciarCheckout(button);
    }
  );

});


// ==========================================
// IDENTIFICAR PLANO
// ==========================================

function getPlanId(planText) {

  const text =
    planText.toLowerCase();

  if (text.includes("essencial")) {
    return "essencial";
  }

  if (text.includes("romântico") ||
      text.includes("romantico")) {
    return "romantico";
  }

  if (text.includes("premium")) {
    return "premium";
  }

  return null;
}


// ==========================================
// CRIAR CHECKOUT
// ==========================================

async function iniciarCheckout(button) {

  const planId =
    getPlanId(selectedPlan);

  if (!planId) {
    alert(
      "Não foi possível identificar o plano escolhido."
    );

    return;
  }

  // Dados atuais do cliente
  const customerData = {

    loveName:
      nameInput?.value.trim() || "",

    yourName:
      yourNameInput?.value.trim() || "",

    message:
      messageInput?.value.trim() || "",

    date:
      dateInput?.value || "",

    photo:
      photoData || ""
  };


  // Exige pelo menos o nome da pessoa especial
  if (!customerData.loveName) {

    alert(
      "Antes de escolher o plano, coloque o nome de quem vai receber o site. ❤️"
    );

    nameInput?.focus();

    document
      .getElementById("teste")
      ?.scrollIntoView({
        behavior: "smooth"
      });

    return;
  }


  // Texto original do botão
  const originalText =
    button.textContent;


  // Estado de carregamento
  button.textContent =
    "⏳ Preparando pagamento...";

  button.style.pointerEvents =
    "none";

  button.style.opacity =
    "0.7";


  try {

    const response =
      await fetch(
        `${API_URL}/api/create-checkout`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            plan: planId,

            customerData:
              customerData

          })
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result?.error ||
        "Não foi possível criar o checkout."
      );
    }


    if (
      !result.checkoutUrl
    ) {

      throw new Error(
        "O Asaas não retornou o endereço do checkout."
      );
    }


    // Guardamos algumas informações
    // localmente para a página de retorno
    localStorage.setItem(
      "amorEmSiteOrder",
      JSON.stringify({

        orderId:
          result.orderId || "",

        checkoutId:
          result.checkoutId || "",

        plan:
          planId,

        loveName:
          customerData.loveName
      })
    );


    // Vai para o checkout do Asaas
    window.location.href =
      result.checkoutUrl;


  } catch (error) {

    console.error(
      "Erro ao criar checkout:",
      error
    );

    alert(
      error.message ||
      "Ocorreu um erro ao preparar o pagamento. Tente novamente."
    );


    // Restaurar botão
    button.textContent =
      originalText;

    button.style.pointerEvents =
      "";

    button.style.opacity =
      "";

  }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

updatePreview();


// ==========================================
// LOG DE TESTE
// ==========================================

console.log(
  "❤️ Amor em Site iniciado"
);

console.log(
  "Backend:",
  API_URL
);
