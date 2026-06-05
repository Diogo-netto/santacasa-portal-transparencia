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