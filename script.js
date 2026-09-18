from pathlib import Path
import re

base = Path("/mnt/data")
index = base / "index.html"
script = base / "script.js"

html = index.read_text(encoding="utf-8")
js = script.read_text(encoding="utf-8")

# 1) Cache-bust the stylesheet so GitHub Pages fetches the current CSS.
html = html.replace(
    '<link rel="stylesheet" href="style.css">',
    '<link rel="stylesheet" href="style.css?v=3">'
)

# 2) Turn the final CTA into a non-WhatsApp button.
html = html.replace(
    '''  <a
    id="whatsapp"
    class="btn big"
    target="_blank"
    rel="noopener"
  >
    Quero liberar meu site ❤️
  </a>''',
    '''  <button
    id="checkoutButton"
    class="btn big"
    type="button"
  >
    Escolher meu plano ❤️
  </button>'''
)

# Remove WhatsApp variables/function and replace the plan flow.
js = re.sub(r'\nconst whatsappNumber = ".*?";\n', '\n', js, count=1)

# Replace the plan handler's updateWhatsapp() call with final button update.
js = js.replace(
'''      updateWhatsapp();

    }
  );

});''',
'''      updateCheckoutButton();

    }
  );

});''',
1
)

# Replace the whole WhatsApp section with a local checkout-state button.
start_marker = "// ==========================================\n// WHATSAPP\n// =========================================="
end_marker = "// ==========================================\n// INICIALIZAÇÃO\n// =========================================="

start = js.find(start_marker)
end = js.find(end_marker)

if start != -1 and end != -1:
    replacement = '''// ==========================================
// CHECKOUT / PLANO ESCOLHIDO
// ==========================================

const checkoutButton =
  document.getElementById("checkoutButton");

function updateCheckoutButton() {

  if (!checkoutButton) return;

  if (selectedPlan) {

    checkoutButton.textContent =
      `Continuar com ${selectedPlan.split(" — ")[0]} ❤️`;

    checkoutButton.classList.add("selected");

  } else {

    checkoutButton.textContent =
      "Escolher meu plano ❤️";

    checkoutButton.classList.remove("selected");
  }
}


checkoutButton?.addEventListener(
  "click",
  () => {

    if (!selectedPlan) {

      document.getElementById("planos")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      return;
    }

    // O checkout do Asaas será conectado aqui.
    // Por enquanto, o cliente permanece no site.
    alert(
      `Plano selecionado: ${selectedPlan}\\n\\nO próximo passo será abrir o pagamento.`
    );
  }
);


'''
    js = js[:start] + replacement + js[end:]

# Remove old initialization call and replace it.
js = js.replace("updateWhatsapp();", "updateCheckoutButton();")

# 3) Improve photo preview behavior. The JS sets a better position for portraits.
old_photo_block = '''          previewPhoto.style.backgroundImage =
            `url("${originalUrl}")`;

          previewPhoto.classList.add(
            "has-photo"
          );'''
new_photo_block = '''          previewPhoto.style.backgroundImage =
            `url("${originalUrl}")`;

          // Mantém o rosto mais visível em fotos verticais.
          previewPhoto.style.backgroundSize = "cover";
          previewPhoto.style.backgroundPosition = "center 20%";

          previewPhoto.classList.add(
            "has-photo"
          );'''
js = js.replace(old_photo_block, new_photo_block)

# Add a small CSS class rule through JS-created style only if needed? Better:
# append a style override into the HTML head for the preview image behavior.
photo_css = '''
<style>
  .preview-photo.has-photo {
    background-size: cover !important;
    background-position: center 20% !important;
    background-repeat: no-repeat !important;
  }

  #checkoutButton {
    border: 0;
    cursor: pointer;
    font-family: inherit;
  }

  #checkoutButton.selected {
    box-shadow: 0 12px 35px rgba(255, 49, 88, .35);
  }
</style>
'''
if "</head>" in html and ".preview-photo.has-photo" not in html:
    html = html.replace("</head>", photo_css + "\n</head>")

index.write_text(html, encoding="utf-8")
script.write_text(js, encoding="utf-8")

print("Pronto. Arquivos corrigidos:")
print(index)
print(script)
print("\nMudanças:")
print("- WhatsApp removido do fluxo.")
print("- Botão final agora trabalha com o plano escolhido.")
print("- Foto da prévia prioriza a parte superior da imagem.")
print("- CSS ficou com ?v=3 para evitar cache.")
