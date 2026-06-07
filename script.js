// =========================================================================
// SCRIPTS DO SITE INSTITUCIONAL
// =========================================================================

let tamanhoAtualFonte = 16;

// Acessibilidade: Fonte
function alterarFonte(acao) {
  if (acao === 'aumentar' && tamanhoAtualFonte < 24) {
    tamanhoAtualFonte += 2;
  } else if (acao === 'diminuir' && tamanhoAtualFonte > 12) {
    tamanhoAtualFonte -= 2;
  }
  document.documentElement.style.fontSize = tamanhoAtualFonte + 'px';
}

// Acessibilidade: Contraste
function alternarContraste() {
  document.body.classList.toggle('alto-contraste');
}

// Menu Mobile
function alternarMenuMobile() { 
  const menu = document.getElementById('menu-navegacao');
  const botao = document.querySelector('.botao-mobile');
  menu.classList.toggle('aberto'); 
  botao.setAttribute('aria-expanded', menu.classList.contains('aberto'));
}

// Submenu Mobile (Doações)
function alternarSubmenuMobile(evento) {
  if (window.innerWidth <= 992) {
    evento.preventDefault(); 
    const dropdown = evento.target.nextElementSibling;
    dropdown.classList.toggle('mostrar-mobile');
  }
}



/* =========================================================================
   ANIMAÇÃO: CONTADOR DE ESTATÍSTICAS
   Faz os números subirem gradativamente quando o usuário rola a página
   ========================================================================= */

function animarContadores() {
  const contadores = document.querySelectorAll('.numero-contador');
  const velocidade = 200; // Quanto menor, mais rápido conta

  // Usamos o IntersectionObserver para saber quando a seção aparece na tela
  const observador = new IntersectionObserver((entradas, observadorProprio) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        // O elemento apareceu na tela, começa a contar
        const elemento = entrada.target;
        const alvo = +elemento.getAttribute('data-alvo');
        
        const atualizarContador = () => {
          const valorAtual = +elemento.innerText;
          const incremento = alvo / velocidade;

          if (valorAtual < alvo) {
            elemento.innerText = Math.ceil(valorAtual + incremento);
            setTimeout(atualizarContador, 10);
          } else {
            elemento.innerText = alvo; // Garante que termine no número exato
          }
        };

        atualizarContador();
        observadorProprio.unobserve(elemento); // Para de observar depois que contou uma vez
      }
    });
  }, { threshold: 0.5 }); // Só ativa quando 50% da seção estiver visível

  contadores.forEach(contador => {
    observador.observe(contador);
  });
}

// Inicia a animação quando o HTML carregar
document.addEventListener('DOMContentLoaded', animarContadores);