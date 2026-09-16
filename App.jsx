import { useState } from "react";

const fotos = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=90",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=90",
];

const motivos = [
  "Seu sorriso.",
  "Seu jeito de me olhar.",
  "Seu abraço.",
  "Sua companhia.",
  "A forma como você me faz rir.",
  "Porque você deixa meus dias melhores.",
  "Seu carinho.",
  "Sua sinceridade.",
  "Seu coração.",
  "Porque ao seu lado eu me sinto em casa.",
  "Cada conversa que temos.",
  "Cada momento que vivemos.",
  "Sua presença.",
  "Seu jeito único.",
  "Porque você acredita em mim.",
  "Porque você me faz querer ser melhor.",
  "Seu beijo.",
  "Seu carinho nos pequenos detalhes.",
  "Porque você está comigo nos momentos difíceis.",
  "Porque você comemora minhas conquistas.",
];

const timeline = [
  {
    titulo: "Quando tudo começou",
    texto: "Aqui começa a nossa história. Um momento que talvez parecesse simples, mas que mudou tudo.",
  },
  {
    titulo: "Os primeiros momentos",
    texto: "Vieram as conversas, as risadas, os olhares e aquela sensação de que havia algo especial.",
  },
  {
    titulo: "Nós dois",
    texto: "Com o tempo, fomos construindo nossas próprias histórias, lembranças e momentos.",
  },
  {
    titulo: "E ainda é só o começo",
    texto: "Ainda temos muitos lugares para conhecer, histórias para viver e memórias para criar.",
  },
];

function App() {
  const [motivoAtual, setMotivoAtual] = useState(0);
  const [cartaAberta, setCartaAberta] = useState(false);
  const [surpresa, setSurpresa] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  const revelarMotivo = () => {
    setMotivoAtual((prev) => (prev + 1) % motivos.length);
  };

  return (
    <div className="site">

      {/* PARTICULAS */}
      <div className="particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i}>♥</span>
        ))}
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="#inicio" className="logo">
          Para o meu amor <span>♡</span>
        </a>

        <div className="nav-links">
          <a href="#inicio">Início</a>
          <a href="#historia">Nossa História</a>
          <a href="#fotos">Momentos</a>
          <a href="#motivos">Motivos</a>
          <a href="#carta">Carta</a>
          <a href="#surpresa">Surpresa</a>
        </div>

        <div className="love-button">♥ Eu te amo</div>
      </nav>

      {/* HERO */}
      <section id="inicio" className="hero">

        <div className="hero-glow"></div>

        <div className="hero-content">

          <p className="small-title">PARA A PESSOA MAIS ESPECIAL</p>

          <h1>
            Oi, meu
            <span> amor.</span>
          </h1>

          <p className="hero-text">
            Eu fiz esse cantinho especialmente para você.
            Porque algumas histórias merecem ser guardadas para sempre.
          </p>

          <a href="#historia" className="main-button">
            Entrar no nosso mundo
            <span>♥</span>
          </a>

        </div>

        <div className="scroll">
          <span></span>
          Role para explorar
        </div>
      </section>

      {/* HISTÓRIA */}
      <section id="historia" className="section">

        <div className="section-title">
          <span>NOSSA HISTÓRIA</span>
          <h2>Tudo começou com <em>nós dois.</em></h2>
          <p>
            Algumas histórias não precisam ser perfeitas.
            Só precisam ser verdadeiras.
          </p>
        </div>

        <div className="timeline">

          {timeline.map((item, index) => (
            <div className="timeline-item" key={index}>

              <div className="timeline-number">
                0{index + 1}
              </div>

              <div className="timeline-line"></div>

              <div className="timeline-content">
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* CORAÇÃO */}
      <section className="heart-section">

        <div className="section-title">
          <span>O NOSSO CORAÇÃO</span>
          <h2>Feito de <em>momentos.</em></h2>
        </div>

        <div className="heart-gallery">

          {fotos.slice(0, 9).map((foto, index) => (
            <button
              className={`heart-photo heart-${index + 1}`}
              key={index}
              onClick={() => setFotoSelecionada(foto)}
            >
              <img src={foto} alt={`Momento ${index + 1}`} />
            </button>
          ))}

          <div className="heart-center">
            <span>Eu te amo</span>
            <small>em cada detalhe</small>
            <b>♥</b>
          </div>

        </div>

      </section>

      {/* FOTOS */}
      <section id="fotos" className="section">

        <div className="section-title">
          <span>NOSSOS MOMENTOS</span>
          <h2>Pequenos momentos, <em>grandes memórias.</em></h2>
        </div>

        <div className="photo-grid">

          {fotos.map((foto, index) => (
            <button
              className={`photo-card photo-${index + 1}`}
              key={index}
              onClick={() => setFotoSelecionada(foto)}
            >
              <img src={foto} alt={`Nossa memória ${index + 1}`} />
              <div className="photo-overlay">
                <span>♥</span>
              </div>
            </button>
          ))}

        </div>

      </section>

      {/* MOTIVOS */}
      <section id="motivos" className="reasons-section">

        <div className="reason-number">
          {String(motivoAtual + 1).padStart(2, "0")}
        </div>

        <p className="reason-label">UM DOS 100 MOTIVOS</p>

        <h2>Por que eu te amo?</h2>

        <div className="reason-card">
          <span>♥</span>
          <p>{motivos[motivoAtual]}</p>
        </div>

        <button className="main-button" onClick={revelarMotivo}>
          Revelar outro motivo ♥
        </button>

        <p className="reason-counter">
          Motivo {motivoAtual + 1} de 100
        </p>

      </section>

      {/* CARTA */}
      <section id="carta" className="letter-section">

        <div className="section-title">
          <span>UMA CARTA</span>
          <h2>Algumas coisas precisam ser <em>ditas.</em></h2>
        </div>

        <button
          className={`envelope ${cartaAberta ? "opened" : ""}`}
          onClick={() => setCartaAberta(!cartaAberta)}
        >
          {!cartaAberta ? (
            <>
              <div className="envelope-flap"></div>
              <div className="envelope-heart">♥</div>
              <p>Clique para abrir</p>
            </>
          ) : (
            <div className="letter-paper">

              <span className="letter-top">Para você, meu amor.</span>

              <h3>Eu te amo.</h3>

              <p>
                Talvez eu não consiga colocar em palavras tudo aquilo
                que sinto por você.
              </p>

              <p>
                Mas tentei transformar um pouco desse sentimento
                em cada detalhe deste pequeno cantinho.
              </p>

              <p>
                Obrigado por fazer parte da minha vida, pelos momentos
                que vivemos e por todos aqueles que ainda vamos viver.
              </p>

              <p className="signature">
                Com todo meu amor,<br />
                sempre seu. ♥
              </p>

            </div>
          )}
        </button>

      </section>

      {/* FUTURO */}
      <section className="future-section">

        <div className="future-stars"></div>

        <div className="future-content">

          <span>AINDA TEM MUITO PELA FRENTE</span>

          <h2>
            E isso é apenas
            <em>o começo.</em>
          </h2>

          <div className="future-grid">

            <div>Mais viagens.</div>
            <div>Mais risadas.</div>
            <div>Mais abraços.</div>
            <div>Mais histórias.</div>
            <div>Mais sonhos.</div>
            <div>Mais nós.</div>

          </div>

        </div>

      </section>

      {/* SURPRESA */}
      <section id="surpresa" className="surprise-section">

        {!surpresa ? (
          <>
            <span>AINDA TEM UMA COISA...</span>

            <h2>
              Tenho uma última
              <em> surpresa.</em>
            </h2>

            <button
              className="surprise-button"
              onClick={() => setSurpresa(true)}
            >
              Abrir surpresa ♥
            </button>
          </>
        ) : (
          <div className="final-message">

            <div className="big-heart">♥</div>

            <p>PARA SEMPRE</p>

            <h2>
              Eu escolheria você
              <br />
              <em>em todas as vidas.</em>
            </h2>

            <span>
              Te amo. ❤️
            </span>

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer>
        <div>Para o meu amor ♥</div>
        <p>Feito com amor, especialmente para você.</p>
      </footer>

      {/* MODAL FOTO */}
      {fotoSelecionada && (
        <div
          className="photo-modal"
          onClick={() => setFotoSelecionada(null)}
        >
          <button
            className="close-modal"
            onClick={() => setFotoSelecionada(null)}
          >
            ×
          </button>

          <img src={fotoSelecionada} alt="Momento ampliado" />
        </div>
      )}

    </div>
  );
}

export default App;
