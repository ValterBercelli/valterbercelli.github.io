/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const GITHUB_USER = "ValterBercelli";
const GITHUB_TOKEN = ""; // opcional

const GH_HEADERS = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
  : {};

const listaDestaques = document.getElementById("lista-destaques");
const listaProjetos = document.getElementById("lista-projetos");
const estadoCarregamento = document.getElementById("estado-carregamento");

const filtroNome = document.getElementById("filtro-nome");
const filtroLinguagem = document.getElementById("filtro-linguagem");
const limparFiltros = document.getElementById("limpar-filtros");

let reposCache = [];
let filtrosAtivos = false; // 🔥 evita duplicação no carregamento


/* ============================================================
   BUSCAR LINGUAGENS
   ============================================================ */
async function buscarLinguagens(repoName) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repoName}/languages`,
      { headers: GH_HEADERS }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Object.keys(data);
  } catch {
    return [];
  }
}


/* ============================================================
   VERIFICAR GITHUB PAGES
   ============================================================ */
async function verificarPages(repoName) {
  const url = `https://${GITHUB_USER.toLowerCase()}.github.io/${repoName}/`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}


/* ============================================================
   CARREGAR REPOS
   ============================================================ */
async function carregarRepos() {
  estadoCarregamento.textContent = "Carregando projetos...";

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
      { headers: GH_HEADERS }
    );

    reposCache = await res.json();

    // 🔥 Só ativa filtros DEPOIS que os dados carregarem
    filtrosAtivos = true;

    aplicarFiltros(); // roda apenas uma vez

    estadoCarregamento.textContent = "";

  } catch (erro) {
    estadoCarregamento.textContent = "Erro ao carregar projetos.";
  }
}


/* ============================================================
   FILTRAR
   ============================================================ */
function aplicarFiltros() {

  if (!filtrosAtivos) return; // 🔥 evita duplicação no carregamento

  const nomeFiltro = filtroNome.value.toLowerCase();
  const linguagemFiltro = filtroLinguagem.value.toLowerCase();

  const filtrados = reposCache.filter(repo => {
    const nomeOK = repo.name.toLowerCase().includes(nomeFiltro);
    const langOK = linguagemFiltro
      ? (repo.language || "").toLowerCase().includes(linguagemFiltro)
      : true;

    return nomeOK && langOK;
  });

  renderRepos(filtrados);
}


/* ============================================================
   RENDERIZAR
   ============================================================ */
async function renderRepos(repos) {

  // 🔥 limpa SEMPRE antes de renderizar
  listaDestaques.innerHTML = "";
  listaProjetos.innerHTML = "";

  for (const repo of repos) {

    const card = document.createElement("article");
    card.className = "card";

    const linguagens = await buscarLinguagens(repo.name);
    const pagesAtivo = await verificarPages(repo.name);
    const pagesUrl = `https://${GITHUB_USER.toLowerCase()}.github.io/${repo.name}/`;
    const ehDestaque = repo.topics?.includes("destaque");

    const dataAtualizacao = new Date(repo.updated_at).toLocaleDateString(
      "pt-BR",
      { year: "numeric", month: "short", day: "2-digit" }
    );

    card.innerHTML = `
      <h3>${repo.name}</h3>

      ${ehDestaque ? `<span class="badge destaque">⭐ Destaque</span>` : ""}

      <p>${repo.description || "Este repositório não possui descrição."}</p>

      <div class="badges">
        ${linguagens.map(lang => `<span class="badge">${lang}</span>`).join("")}
        <span class="badge">⭐ ${repo.stargazers_count}</span>
        <span class="badge">🍴 ${repo.forks_count}</span>
        <span class="badge">📅 ${dataAtualizacao}</span>
      </div>

      <a href="${repo.html_url}" target="_blank">Ver no GitHub</a>
      ${pagesAtivo ? `<a href="${pagesUrl}" target="_blank">Ver projeto (GitHub Pages)</a>` : ""}
    `;

    if (ehDestaque) {
      listaDestaques.appendChild(card);
    } else {
      listaProjetos.appendChild(card);
    }
  }
}


/* ============================================================
   EVENTOS
   ============================================================ */

filtroNome.addEventListener("input", aplicarFiltros);
filtroLinguagem.addEventListener("input", aplicarFiltros);

limparFiltros.addEventListener("click", () => {
  filtroNome.value = "";
  filtroLinguagem.value = "";
  aplicarFiltros();
});


/* ============================================================
   INICIAR
   ============================================================ */
carregarRepos();
