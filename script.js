// COLOQUE AQUI seu WhatsApp com DDI + DDD, sem espaços.
// Exemplo: 5516999999999
const whatsappNumber = "5566974005474";

const text = "Olá! Vi o Amor em Site no Instagram e quero criar um site-presente personalizado. ❤️";
const button = document.getElementById("whatsapp");

if (button) {
  button.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
