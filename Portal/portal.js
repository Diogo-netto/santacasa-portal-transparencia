/* =========================================================================
   SCRIPTS ESPECÍFICOS DO PORTAL (TRANSPARÊNCIA E SISTEMA)
   ========================================================================= */

(function() {
  // Variável para controlar o tamanho da fonte
  let tamanhoAtualFonte = 16; 

  /**
   * Altera o tamanho da fonte do documento para melhorar a acessibilidade.
   * @param {string} acao - Ação a ser executada: 'aumentar' ou 'diminuir'.
   */
  function ajustarTamanhoFonte(acao) {
    const elementoRaiz = document.documentElement;
    const tamanhoMinimo = 12; // Tamanho mínimo da fonte em pixels
    const tamanhoMaximo = 24; // Tamanho máximo da fonte em pixels
    const passo = 2;          // Incremento/decremento do tamanho da fonte

    if (acao === 'aumentar' && tamanhoAtualFonte < tamanhoMaximo) {
      tamanhoAtualFonte += passo;
    } else if (acao === 'diminuir' && tamanhoAtualFonte > tamanhoMinimo) {
      tamanhoAtualFonte -= passo;
    }
    
    elementoRaiz.style.fontSize = `${tamanhoAtualFonte}px`;
    // Salvar preferência do usuário em localStorage para persistência
    localStorage.setItem('portalTamanhoFonte', tamanhoAtualFonte);
  }

  /**
   * Alterna o modo de alto contraste do portal.
   */
  function alternarContraste() {
    document.body.classList.toggle('alto-contraste');
    
    // Salvar preferência do usuário em localStorage para persistência
    const altoContrasteAtivo = document.body.classList.contains('alto-contraste');
    localStorage.setItem('portalAltoContraste', altoContrasteAtivo);
  }

  /**
   * Abre uma aba específica no portal e gerencia os estados de acessibilidade (ARIA).
   * @param {Event} evento - O evento de clique que disparou a função.
   * @param {string} nomeAba - O ID da aba a ser aberta.
   */
  function abrirAba(evento, nomeAba) {
    // Esconde todos os painéis de conteúdo
    const paineisConteudo = document.querySelectorAll('.painel-conteudo');
    paineisConteudo.forEach(painel => {
      painel.classList.remove('ativo');
      painel.setAttribute('aria-hidden', 'true');
    });

    // Remove a classe 'ativo' de todos os links de aba
    const linksAbas = document.querySelectorAll('.aba-link');
    linksAbas.forEach(link => {
      link.classList.remove('ativo');
      link.setAttribute('aria-selected', 'false');
      link.setAttribute('tabindex', '-1'); // Torna abas inativas não focáveis via tab
    });

    // Mostra o painel de conteúdo correto
    const painelAlvo = document.getElementById(nomeAba);
    if (painelAlvo) {
      painelAlvo.classList.add('ativo');
      painelAlvo.setAttribute('aria-hidden', 'false');
    }

    // Ativa o link da aba clicada
    if (evento && evento.currentTarget) {
      const abaAtual = evento.currentTarget;
      abaAtual.classList.add('ativo');
      abaAtual.setAttribute('aria-selected', 'true');
      abaAtual.setAttribute('tabindex', '0'); // Torna a aba ativa focável
    }
    
    // Salvar a aba ativa para persistência
    localStorage.setItem('abaAtiva', nomeAba);
  }

  /**
   * Gerencia os filtros e aplica a filtragem de dados.
   * @param {Event} evento - O evento de clique do botão de filtro.
   */
  function aplicarFiltros(evento) {
    evento.preventDefault();
    
    // Encontra o formulário de filtros mais próximo
    const formulario = evento.target.closest('.barra-filtros');
    if (!formulario) return;

    // Obtém os valores dos filtros
    const filtros = {
      ano: formulario.querySelector('select:nth-of-type(1)')?.value || 'Todos',
      mes: formulario.querySelector('select:nth-of-type(2)')?.value || 'Todos'
    };

    console.log('Filtros aplicados:', filtros);

    // Feedback visual temporário de filtragem
    const botao = evento.target;
    const textoOriginal = botao.textContent;
    botao.textContent = "Filtrando...";
    botao.style.opacity = "0.7";
    
    setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.style.opacity = "1";
    }, 500);
  }

  /**
   * Gerencia o envio do formulário de ouvidoria (caso adicionado futuramente).
   * @param {Event} evento - O evento de submit do formulário.
   */
  function lidarEnvioOuvidoria(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const nome = formulario.querySelector('#nome-ouvidoria')?.value;
    const email = formulario.querySelector('#email-ouvidoria')?.value;
    const assunto = formulario.querySelector('#assunto-ouvidoria')?.value;
    const mensagem = formulario.querySelector('#mensagem-ouvidoria')?.value;

    if (!nome || !email || !assunto || !mensagem) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    console.log('Mensagem de Ouvidoria:', { nome, email, assunto, mensagem });
    alert('Sua mensagem foi enviada com sucesso! Obrigado por entrar em contato.');
    
    formulario.reset();
  }

  /**
   * Inicializa as funcionalidades do portal ao carregar o DOM.
   */
  function inicializarPortal() {
    // Restaurar preferências de acessibilidade do localStorage
    const fonteSalva = localStorage.getItem('portalTamanhoFonte');
    if (fonteSalva) {
      tamanhoAtualFonte = parseInt(fonteSalva, 10);
      document.documentElement.style.fontSize = `${tamanhoAtualFonte}px`;
    }

    const contrasteSalvo = localStorage.getItem('portalAltoContraste');
    if (contrasteSalvo === 'true') {
      document.body.classList.add('alto-contraste');
    }

    // Adicionar event listeners limpos para os botões de acessibilidade
    const btnDiminuirFonte = document.querySelector('.btn-acesso[onclick*="diminuir"]');
    if (btnDiminuirFonte) {
      btnDiminuirFonte.removeAttribute('onclick');
      btnDiminuirFonte.addEventListener('click', () => ajustarTamanhoFonte('diminuir'));
    }

    const btnAumentarFonte = document.querySelector('.btn-acesso[onclick*="aumentar"]');
    if (btnAumentarFonte) {
      btnAumentarFonte.removeAttribute('onclick');
      btnAumentarFonte.addEventListener('click', () => ajustarTamanhoFonte('aumentar'));
    }

    const btnAlternarContraste = document.querySelector('.btn-acesso[onclick*="alternarContraste"]');
    if (btnAlternarContraste) {
      btnAlternarContraste.removeAttribute('onclick');
      btnAlternarContraste.addEventListener('click', alternarContraste);
    }

    // Processamento das abas para remover o onclick em linha e usar addEventListener
    const linksAbas = document.querySelectorAll('.aba-link');
    linksAbas.forEach(link => {
      const atributoOnclick = link.getAttribute('onclick');
      if (atributoOnclick) {
        // Captura o nome da aba enviada na função
        const correspondencia = atributoOnclick.match(/abrirAba\(event,\s*\'(.*?)\'\)/);
        if (correspondencia) {
          const nomeAba = correspondencia[1];
          link.removeAttribute('onclick');
          link.addEventListener('click', (evento) => abrirAba(evento, nomeAba));
        }
      }
    });

    // Restaurar aba ativa do LocalStorage (ou abrir a primeira por padrão)
    const abaInicial = localStorage.getItem('abaAtiva');
    if (abaInicial) {
        const linkAbaSalva = document.querySelector(`.aba-link[onclick*="${abaInicial}"]`) || 
                             Array.from(linksAbas).find(aba => aba.textContent.toLowerCase().includes(abaInicial.split('-')[1]));
        if (linkAbaSalva) {
            linkAbaSalva.click();
        }
    } else if (linksAbas.length > 0) {
        linksAbas[0].click(); // Abre Finanças como fallback padrão
    }

    // Adicionar funcionalidade para os botões de filtro
    const botoesFiltro = document.querySelectorAll('.botao-filtrar');
    botoesFiltro.forEach(botao => {
      if (botao.closest('.barra-filtros')) {
        botao.addEventListener('click', aplicarFiltros);
      }
    });

    // Ouvidoria
    const formularioOuvidoria = document.querySelector('.formulario-ouvidoria');
    if (formularioOuvidoria) {
      formularioOuvidoria.addEventListener('submit', lidarEnvioOuvidoria);
    }

    // Suporte para navegação por teclado (Setas direcionais entre abas)
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

  // Executa a inicialização quando o DOM estiver completamente carregado
  document.addEventListener('DOMContentLoaded', inicializarPortal);

  // Expor funções essenciais globalmente para evitar bugs caso HTML carregue fora de ordem
  window.alterarFonte = function(acao) {
    ajustarTamanhoFonte(acao === 'aumentar' ? 'aumentar' : 'diminuir');
  };
  window.alternarContraste = alternarContraste;
  window.abrirAba = abrirAba;
})();