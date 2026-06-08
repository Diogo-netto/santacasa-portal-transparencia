/* =========================================================================
   SISTEMA JAVASCRIPT DO PORTAL DA TRANSPARÊNCIA (SANTA CASA)
   ========================================================================= */

(function() {
  let tamanhoAtualFonte = 16; 

  function ajustarTamanhoFonte(acao) {
    const elementoRaiz = document.documentElement;
    const tamanhoMinimo = 12; 
    const tamanhoMaximo = 24; 
    const passo = 2;          

    if (acao === 'aumentar' && tamanhoAtualFonte < tamanhoMaximo) {
      tamanhoAtualFonte += passo;
    } else if (acao === 'diminuir' && tamanhoAtualFonte > tamanhoMinimo) {
      tamanhoAtualFonte -= passo;
    }
    
    elementoRaiz.style.fontSize = `${tamanhoAtualFonte}px`;
    localStorage.setItem('portalTamanhoFonte', tamanhoAtualFonte);
  }

  function alternarContraste() {
    document.body.classList.toggle('alto-contraste');
    const altoContrasteAtivo = document.body.classList.contains('alto-contraste');
    localStorage.setItem('portalAltoContraste', altoContrasteAtivo);
  }

  function abrirAba(evento, nomeAba) {
    const paineisConteudo = document.querySelectorAll('.painel-conteudo');
    paineisConteudo.forEach(painel => {
      painel.classList.remove('ativo');
      painel.setAttribute('aria-hidden', 'true'); 
    });

    const linksAbas = document.querySelectorAll('.aba-link');
    linksAbas.forEach(link => {
      link.classList.remove('ativo');
      link.setAttribute('aria-selected', 'false'); 
      link.setAttribute('tabindex', '-1');         
    });

    const painelAlvo = document.getElementById(nomeAba);
    if (painelAlvo) {
      painelAlvo.classList.add('ativo');
      painelAlvo.setAttribute('aria-hidden', 'false'); 
    }

    if (evento && evento.currentTarget) {
      const abaAtual = evento.currentTarget;
      abaAtual.classList.add('ativo');
      abaAtual.setAttribute('aria-selected', 'true');
      abaAtual.setAttribute('tabindex', '0'); 
    }
    
    localStorage.setItem('abaAtiva', nomeAba);
  }

  function abrirSubAba(evento, idSubAba, classeGrupo) {
    const subPaineis = document.querySelectorAll(`.sub-painel.${classeGrupo}`);
    subPaineis.forEach(painel => {
      painel.classList.remove('ativo');
    });

    const botoes = evento.currentTarget.parentElement.querySelectorAll('.btn-sub-aba');
    botoes.forEach(botao => {
      botao.classList.remove('ativo');
    });

    const painelAlvo = document.getElementById(idSubAba);
    if (painelAlvo) {
      painelAlvo.classList.add('ativo');
    }

    if (evento && evento.currentTarget) {
      evento.currentTarget.classList.add('ativo');
    }
  }

  function aplicarFiltros(evento) {
    evento.preventDefault(); 
    
    const formulario = evento.target;
    const botaoSubmit = formulario.querySelector('button[type="submit"]');
    const textoOriginal = botaoSubmit.textContent;
    
    botaoSubmit.textContent = "Buscando...";
    botaoSubmit.disabled = true;
    botaoSubmit.style.opacity = "0.7";
    
    const dadosFiltro = Object.fromEntries(new FormData(formulario).entries());
    console.log(`[Back-end Hook] Buscando dados no form: #${formulario.id}`, dadosFiltro);

    setTimeout(() => {
        botaoSubmit.textContent = textoOriginal;
        botaoSubmit.disabled = false;
        botaoSubmit.style.opacity = "1";
    }, 500);
  }

  function inicializarPortal() {
    const fonteSalva = localStorage.getItem('portalTamanhoFonte');
    if (fonteSalva) {
      tamanhoAtualFonte = parseInt(fonteSalva, 10);
      document.documentElement.style.fontSize = `${tamanhoAtualFonte}px`;
    }

    if (localStorage.getItem('portalAltoContraste') === 'true') {
      document.body.classList.add('alto-contraste');
    }

    const linksAbas = document.querySelectorAll('.aba-link');
    linksAbas.forEach(link => {
      const atributoOnclick = link.getAttribute('onclick');
      if (atributoOnclick) {
        const correspondencia = atributoOnclick.match(/abrirAba\(event,\s*\'(.*?)\'\)/);
        if (correspondencia) {
          const nomeAba = correspondencia[1];
          link.removeAttribute('onclick');
          link.addEventListener('click', (evento) => abrirAba(evento, nomeAba));
        }
      }
    });

    const abaInicial = localStorage.getItem('abaAtiva');
    if (abaInicial) {
        const linkAbaSalva = document.querySelector(`.aba-link[onclick*="${abaInicial}"]`) || 
                             Array.from(linksAbas).find(aba => aba.textContent.toLowerCase().includes(abaInicial.split('-')[1]));
        if (linkAbaSalva) linkAbaSalva.click(); 
    } else if (linksAbas.length > 0) {
        linksAbas[0].click(); 
    }

    linksAbas.forEach((link, indice) => {
      link.addEventListener('keydown', (evento) => {
        let proximoIndice = indice;
        if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') {
          proximoIndice = (indice + 1) % linksAbas.length;
          evento.preventDefault();
        } else if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
          proximoIndice = (indice - 1 + linksAbas.length) % linksAbas.length;
          evento.preventDefault();
        }
        if (proximoIndice !== indice) {
          linksAbas[proximoIndice].focus();
          linksAbas[proximoIndice].click();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', inicializarPortal);

  window.alterarFonte = function(acao) {
    ajustarTamanhoFonte(acao === 'aumentar' ? 'aumentar' : 'diminuir');
  };
  window.alternarContraste = alternarContraste;
  window.abrirAba = abrirAba;
  window.abrirSubAba = abrirSubAba; 
  window.aplicarFiltros = aplicarFiltros; 

})();