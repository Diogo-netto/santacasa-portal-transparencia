/* =========================================================================
   SISTEMA JAVASCRIPT DO PORTAL DA TRANSPARÊNCIA (SANTA CASA)
   Desenvolvido com foco em Acessibilidade (LBI), Performance e Escalabilidade.
   ========================================================================= */

/* 
   BLOCO 1: ISOLAMENTO DE ESCOPO (IIFE - Immediately Invoked Function Expression)
   O QUE FAZ: Envelopa todo o código dentro de uma função anônima que se autoexecuta.
   PRA QUE SERVE: Evita que as variáveis deste arquivo (como 'tamanhoAtualFonte') 
   entrem em conflito com scripts da Landing Page ou de futuras bibliotecas que o 
   Back-end possa instalar. É uma prática de segurança e organização nível Sênior.
*/
(function() {
  
  // Variável de controle do tamanho da fonte (Inicia no padrão de 16 pixels)
  let tamanhoAtualFonte = 16; 

  /* -------------------------------------------------------------------------
     BLOCO 2: CONTROLE DE ACESSIBILIDADE - TAMANHO DA FONTE
     O QUE FAZ: Aumenta ou diminui a fonte raiz (html) do site inteiro.
     PRA QUE SERVE: Cumprir requisitos do Ministério Público e LBI para deficientes visuais.
  ------------------------------------------------------------------------- */
  function ajustarTamanhoFonte(acao) {
    const elementoRaiz = document.documentElement;
    const tamanhoMinimo = 12; // Trava de segurança: impede que a fonte fique microscópica
    const tamanhoMaximo = 24; // Trava de segurança: impede que a fonte quebre as tabelas
    const passo = 2;          // Aumenta ou diminui de 2 em 2 pixels para transição suave

    // Lógica condicional: Só aumenta/diminui se estiver dentro do limite de segurança
    if (acao === 'aumentar' && tamanhoAtualFonte < tamanhoMaximo) {
      tamanhoAtualFonte += passo;
    } else if (acao === 'diminuir' && tamanhoAtualFonte > tamanhoMinimo) {
      tamanhoAtualFonte -= passo;
    }
    
    // Aplica a alteração injetando CSS direto na tag <html>
    elementoRaiz.style.fontSize = `${tamanhoAtualFonte}px`;
    
    // Salva a escolha na memória do navegador (LocalStorage). 
    // Assim, se o usuário for para outra aba ou apertar F5, a fonte não reseta.
    localStorage.setItem('portalTamanhoFonte', tamanhoAtualFonte);
  }

  /* -------------------------------------------------------------------------
     BLOCO 3: CONTROLE DE ACESSIBILIDADE - ALTO CONTRASTE
     O QUE FAZ: Alterna a classe 'alto-contraste' no <body> da página.
     PRA QUE SERVE: O CSS detecta essa classe e troca as cores do hospital 
     (Vinho) por Preto, Branco e Amarelo, ajudando daltônicos e pessoas com baixa visão.
  ------------------------------------------------------------------------- */
  function alternarContraste() {
    // A função 'toggle' liga a classe se estiver desligada, e desliga se estiver ligada
    document.body.classList.toggle('alto-contraste');
    
    // Salva o estado atual (true ou false) na memória do navegador
    const altoContrasteAtivo = document.body.classList.contains('alto-contraste');
    localStorage.setItem('portalAltoContraste', altoContrasteAtivo);
  }

  /* -------------------------------------------------------------------------
     BLOCO 4: MOTOR DE NAVEGAÇÃO DO SISTEMA (ABAS / DASHBOARD)
     O QUE FAZ: Gerencia qual painel de dados aparece na tela.
     PRA QUE SERVE: Evita recarregar a página a cada clique, criando uma 
     experiência de aplicativo moderno (Single Page Application simulada).
  ------------------------------------------------------------------------- */
  function abrirAba(evento, nomeAba) {
    // PASSO A: Esconde todos os painéis e avisa aos leitores de tela (cegos) que eles sumiram
    const paineisConteudo = document.querySelectorAll('.painel-conteudo');
    paineisConteudo.forEach(painel => {
      painel.classList.remove('ativo');
      painel.setAttribute('aria-hidden', 'true'); // Etiqueta de Acessibilidade
    });

    // PASSO B: Tira o estilo de "clicado" (Dourado) de todos os botões do menu lateral
    const linksAbas = document.querySelectorAll('.aba-link');
    linksAbas.forEach(link => {
      link.classList.remove('ativo');
      link.setAttribute('aria-selected', 'false'); // Etiqueta de Acessibilidade
      link.setAttribute('tabindex', '-1');         // Tira do foco do teclado (Tab)
    });

    // PASSO C: Mostra o painel correto que o usuário pediu
    const painelAlvo = document.getElementById(nomeAba);
    if (painelAlvo) {
      painelAlvo.classList.add('ativo');
      painelAlvo.setAttribute('aria-hidden', 'false'); // Avisa o leitor de tela que este está visível
    }

    // PASSO D: Pinta o botão clicado de Dourado para o usuário saber onde está
    if (evento && evento.currentTarget) {
      const abaAtual = evento.currentTarget;
      abaAtual.classList.add('ativo');
      abaAtual.setAttribute('aria-selected', 'true');
      abaAtual.setAttribute('tabindex', '0'); // Permite focar com a tecla Tab
    }
    
    // PASSO E: Salva a aba atual para manter o usuário nela se ele recarregar a página (F5)
    localStorage.setItem('abaAtiva', nomeAba);
  }

  /* -------------------------------------------------------------------------
     BLOCO 5: MANIPULADOR DO BOTÃO DE FILTROS (MOCKUP PARA O BACK-END)
     O QUE FAZ: Prepara o terreno para quando o Banco de Dados for conectado.
     PRA QUE SERVE: Impede que a página pisque ao clicar em "Aplicar Filtros" e 
     mostra um feedback visual de carregamento.
  ------------------------------------------------------------------------- */
  function aplicarFiltros(evento) {
    // Trava o comportamento natural do HTML que tenta enviar formulários recarregando a tela
    evento.preventDefault(); 
    
    // Captura o botão que foi clicado
    const botao = evento.target;
    
    // Salva o texto original ("Aplicar Filtros")
    const textoOriginal = botao.textContent;
    
    // Muda visualmente para mostrar que o sistema está trabalhando
    botao.textContent = "Filtrando...";
    botao.style.opacity = "0.7";
    
    // Simula um delay de servidor (meio segundo) e depois volta ao normal.
    // *Nota para o Back-end:* Aqui entrará a chamada API (fetch/axios) para buscar os dados.
    setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.style.opacity = "1";
    }, 500);
  }

  /* -------------------------------------------------------------------------
     BLOCO 6: INICIALIZAÇÃO DO SISTEMA (BOOT)
     O QUE FAZ: Roda toda vez que a página é acessada para carregar as memórias salvas.
     PRA QUE SERVE: Manter a cor, a fonte e a aba que o usuário estava usando.
  ------------------------------------------------------------------------- */
  function inicializarPortal() {
    // 1. Restaura Fonte
    const fonteSalva = localStorage.getItem('portalTamanhoFonte');
    if (fonteSalva) {
      tamanhoAtualFonte = parseInt(fonteSalva, 10);
      document.documentElement.style.fontSize = `${tamanhoAtualFonte}px`;
    }

    // 2. Restaura Alto Contraste
    const contrasteSalvo = localStorage.getItem('portalAltoContraste');
    if (contrasteSalvo === 'true') {
      document.body.classList.add('alto-contraste');
    }

    // 3. Limpeza de HTML sujo: Remove o 'onclick' escrito no HTML e adiciona pelo JS.
    // Isso deixa o código mais seguro e rápido.
    const linksAbas = document.querySelectorAll('.aba-link');
    linksAbas.forEach(link => {
      const atributoOnclick = link.getAttribute('onclick');
      if (atributoOnclick) {
        // Usa Expressão Regular (Regex) para "pescar" o nome da aba dentro do onclick
        const correspondencia = atributoOnclick.match(/abrirAba\(event,\s*\'(.*?)\'\)/);
        if (correspondencia) {
          const nomeAba = correspondencia[1];
          link.removeAttribute('onclick');
          // Adiciona o ouvinte de clique nativo do JavaScript
          link.addEventListener('click', (evento) => abrirAba(evento, nomeAba));
        }
      }
    });

    // 4. Restaura a Aba que estava aberta antes do F5
    const abaInicial = localStorage.getItem('abaAtiva');
    if (abaInicial) {
        // Procura a aba salva ou faz um fallback buscando pelo nome
        const linkAbaSalva = document.querySelector(`.aba-link[onclick*="${abaInicial}"]`) || 
                             Array.from(linksAbas).find(aba => aba.textContent.toLowerCase().includes(abaInicial.split('-')[1]));
        if (linkAbaSalva) {
            linkAbaSalva.click(); // Força um clique virtual para abrir a aba
        }
    } else if (linksAbas.length > 0) {
        // Se for o primeiro acesso da vida do usuário, abre a aba de Finanças por padrão
        linksAbas[0].click(); 
    }

    // 5. Liga a função de simular filtro nos botões de pesquisa das tabelas
    const botoesFiltro = document.querySelectorAll('.botao-filtrar');
    botoesFiltro.forEach(botao => {
      // Confirma se o botão realmente pertence a um formulário de filtros
      if (botao.closest('.barra-filtros')) {
        botao.addEventListener('click', aplicarFiltros);
      }
    });

    // 6. Navegação de teclado avançada: Permite usar as setas (cima/baixo) para trocar de aba
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
          linksAbas[proximoIndice].focus(); // Move o contorno amarelo
          linksAbas[proximoIndice].click(); // Abre o painel correspondente
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
     BLOCO 7: GATILHO DE LARGADA E EXPOSIÇÃO GLOBAL
     O QUE FAZ: Diz ao navegador quando rodar a inicialização.
  ------------------------------------------------------------------------- */
  // Ouve o evento 'DOMContentLoaded', que significa: "O HTML inteiro já foi carregado e renderizado"
  document.addEventListener('DOMContentLoaded', inicializarPortal);

  // Expõe as funções essenciais para a "Janela" (Window) do navegador.
  // Isso impede que os botões de acessibilidade lá no topo do HTML quebrem.
  window.alterarFonte = function(acao) {
    ajustarTamanhoFonte(acao === 'aumentar' ? 'aumentar' : 'diminuir');
  };
  window.alternarContraste = alternarContraste;
  window.abrirAba = abrirAba;

})();