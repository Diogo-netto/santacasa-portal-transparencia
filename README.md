# 🏥 Santa Casa de Misericórdia de Lima Duarte - Portal Institucional & Transparência

Repositório central contendo a arquitetura de interface de usuário (Front-end UI/UX Kit) desenvolvida sob medida para a Santa Casa de Lima Duarte, MG. Este projeto foi estruturado utilizando tecnologias nativas e de alta performance, sem dependências de frameworks pesados, visando facilidade de manutenção e injeção dinâmica de dados por equipes de Back-end.

## 🚀 Visão Geral do Sistema
O ecossistema é dividido em dois módulos principais e independentes, permitindo uma arquitetura desacoplada (API-Ready):
1. **Landing Page (Vitrine Institucional):** Canal de comunicação com o cidadão, focado em captação de doações, engajamento e exibição de informações clínicas.
2. **Portal da Transparência (Dashboard SaaS):** Painel administrativo e de auditoria pública desenhado em estrita conformidade com a Lei de Acesso à Informação (LAI) e a Lei Geral de Proteção de Dados (LGPD).

---

## 💻 Módulo 1: Landing Page (Vitrine Institucional)
Localizado na raiz do projeto, o arquivo `index.html` gerencia a experiência institucional do usuário.

### Recursos Implementados:
* **Seção Hero Dinâmica:** Banner principal com tratamento de opacidade em CSS para garantir contraste textual sobre imagens de fundo.
* **Módulo Estatístico Animado:** Contador regressivo em JavaScript acionado via `IntersectionObserver` apenas quando o elemento ganha foco na tela.
* **Arquitetura de Atendimento Modular:** Substituição de listas extensas por Cards Direcionais Premium, separando a jornada do usuário entre **Serviços Médicos** (`servicos.html`) e **Guia do Paciente** (`guia-paciente.html`).
* **Grid de Notícias Escalável:** Layout em CSS Grid configurado para comportar até 11 cards de notícias simultâneos de forma organizada, incluindo gatilhos de ação "Saiba Mais" individuais.
* **Módulo de Doações Integrado:** Área dedicada para captação de recursos via PIX com usabilidade otimizada para dispositivos móveis.

---

## 📊 Módulo 2: Portal da Transparência (Dashboard)
Localizado no diretório `/Portal`, este módulo simula uma aplicação SPA (Single Page Application) utilizando manipulação limpa do DOM (Document Object Model).

### Recursos Implementados:
* **Navegação Lateral por Abas:** Alternância de painéis de dados sem necessidade de recarregamento de página, otimizando o consumo de banda de servidores.
* **Sistema de Sub-Abas em Pílulas:** Segregação inteligente de dados dentro dos módulos, permitindo triagem detalhada por esferas administrativas: **Municipal, Estadual e Federal**.
* **Buscadores Textuais Independentes:** Formulários de pesquisa nativos presentes em todos os módulos intermediários de tabelas, preparados para interceptar submissões.
* **Tabelas de Dados Responsivas:** Blindagem via CSS (`overflow-x: auto`) que impede a quebra ou vazamento do layout em telas mobile, isolando o scroll apenas na zona de dados.

---

## ♿ Motor de Acessibilidade & Inclusão (LBI)
O projeto atende de forma nativa e rigorosa às exigências da Lei Brasileira de Inclusão e auditorias públicas:
* **Redimensionamento de Fonte:** Controle via JavaScript que altera a unidade raiz (`rem`) do documento de forma proporcional, sem quebrar os limites das tabelas de dados.
* **Blindagem de Alto Contraste:** Inversão total de propriedades CSS através da classe `.alto-contraste` injetada no `<body>`. Garante fundos em preto absoluto (`#000000`), textos em branco puro (`#ffffff`) e elementos de realce em amarelo destaque (`#ffff00`).
* **Acessibilidade de Teclado:** Mapeamento de eventos `keydown` para permitir navegação completa por abas através das setas direcionais do teclado.
* **Integração VLibras:** Plugin oficial do Governo Federal totalmente integrado e funcional para tradução simultânea em Libras.

---

## 🛠️ Guia de Integração (Para a Equipe de TI / Back-end)

O código foi propositalmente arquitetado para que a injeção de dados seja o mais simples possível, independente da linguagem do servidor (PHP, Node.js, Python, C#, etc.).

### 1. Injeção de Linhas em Tabelas
Todas as tabelas possuem corpos (`<tbody>`) parametrizados com IDs exclusivos e linhas (`<tr>`) marcadas com a classe `.linha-dados` e atributos `data-*`. O desenvolvedor deve apenas realizar o laço de repetição (`foreach`) renderizando as tags neste formato:
```html
<tbody id="corpo-tabela-emendas">
  <tr class="linha-dados" data-id-registro="ID_DO_BANCO">
    <td><span class="etiqueta etiqueta-info">Federal</span></td>
    <td>Nome do Autor</td>
    <td>Objeto do Repasse</td>
    <td>Data</td>
    <td>Valor Formatado</td>
    <td><a href="LINK_DO_PDF_NO_SERVIDOR" class="link-acao">📄 Ver PDF</a></td>
  </tr>
</tbody>
