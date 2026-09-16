const whatsappNumber = "5566974005474";

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
const button = document.getElementById("whatsapp");
let selectedPlan = "";

function updatePreview() {
  const name = nameInput?.value.trim() || "meu amor";
  const message = messageInput?.value.trim() || "Crie uma mensagem especial e veja sua surpresa aparecer aqui.";
  if (previewName) previewName.textContent = name;
  if (previewMessage) previewMessage.textContent = message;
  if (heroPreview) heroPreview.querySelector("h2").innerHTML = `Oi, ${name === "meu amor" ? "meu<br><em>amor.</em>" : `<em>${name}.</em>`}`;
}

[nameInput, yourNameInput, messageInput, dateInput].forEach((el) => {
  if (el) el.addEventListener("input", updatePreview);
});

photoInput?.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const url = event.target.result;
    previewPhoto.style.backgroundImage = `url("${url}")`;
    previewPhoto.classList.add("has-photo");
    previewPhoto.querySelector("span").style.display = "none";
  };
  reader.readAsDataURL(file);
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  updatePreview();
  document.getElementById("lovePreview")?.classList.add("ready");
  document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedPlan = link.dataset.plan || "";
    updateWhatsapp();
  });
});

function updateWhatsapp() {
  const name = nameInput?.value.trim() || "não informado";
  const recipient = nameInput?.value.trim() || "meu amor";
  const message = messageInput?.value.trim() || "não informada";
  const plan = selectedPlan || "Quero saber qual plano escolher";
  const text = `Olá! Testei o Amor em Site e gostei da prévia. ❤️\n\nPessoa especial: ${recipient}\nMensagem: ${message}\nPlano: ${plan}\n\nQuero liberar meu site completo.`;
  if (button) button.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

updatePreview();
updateWhatsapp();
