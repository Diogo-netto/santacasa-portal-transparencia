let tamanhoAtualFonte = 16;

function alterarFonte(acao) {
  if (acao === 'aumentar' && tamanhoAtualFonte < 24) {
    tamanhoAtualFonte += 2;
  } else if (acao === 'diminuir' && tamanhoAtualFonte > 12) {
    tamanhoAtualFonte -= 2;
  }
  document.documentElement.style.fontSize = tamanhoAtualFonte + 'px';
}

function alternarContraste() {
  document.body.classList.toggle('alto-contraste');
}

function alternarMenuMobile() { 
  const menu = document.getElementById('menu-navegacao');
  const botao = document.querySelector('.botao-mobile');
  menu.classList.toggle('aberto'); 
  botao.setAttribute('aria-expanded', menu.classList.contains('aberto'));
}

function alternarSubmenuMobile(evento) {
  if (window.innerWidth <= 992) {
    evento.preventDefault(); 
    const dropdown = evento.target.nextElementSibling;
    dropdown.classList.toggle('mostrar-mobile');
  }
}

// Fecha o menu automaticamente quando um link é clicado
document.getElementById('menu-navegacao').addEventListener('click', function(event) {
  // Verifica se o elemento clicado é um link (tag <a>)
  if (event.target.tagName === 'A') {
    const menu = document.getElementById('menu-navegacao');
    const botao = document.querySelector('.botao-mobile');
    
    // Remove a classe aberto e atualiza a acessibilidade
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
  }
});

function animarContadores() {
  const contadores = document.querySelectorAll('.numero-contador');
  const velocidade = 200; 

  const observador = new IntersectionObserver((entradas, observadorProprio) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const elemento = entrada.target;
        const alvo = +elemento.getAttribute('data-alvo');
        
        const atualizarContador = () => {
          const valorAtual = +elemento.innerText;
          const incremento = alvo / velocidade;

          if (valorAtual < alvo) {
            elemento.innerText = Math.ceil(valorAtual + incremento);
            setTimeout(atualizarContador, 10);
          } else {
            elemento.innerText = alvo; 
          }
        };

        atualizarContador();
        observadorProprio.unobserve(elemento); 
      }
    });
  }, { threshold: 0.5 }); 

  contadores.forEach(contador => {
    observador.observe(contador);
  });
}

document.addEventListener('DOMContentLoaded', animarContadores);