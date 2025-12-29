document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     CONFIGURAÇÃO DA API
     =========================== */
  const API_BASE = "https://controle-acessos-api.vercel.app/api";

  /* ===========================
     GERAR OU RECUPERAR USER ID
     =========================== */
  function obterOuCriarUserId() {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }

    return userId;
  }

  const userId = obterOuCriarUserId();


  /* ===========================
     REGISTRAR VISITA (POST)
     =========================== */
  async function registrarVisita() {
    try {
      await fetch(`${API_BASE}/registrar-acesso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
    } catch (erro) {
      console.error("Erro ao registrar visita:", erro);
    }
  }


  /* ===========================
     CARREGAR CONTADORES (GET)
     =========================== */
  async function carregarContadores() {
    const totalEl = document.getElementById("contador-total");
    const usuarioEl = document.getElementById("contador-usuario");

    if (!totalEl || !usuarioEl) return;

    try {
      const resposta = await fetch(`${API_BASE}/visitas-usuario?uuid=${userId}`);
      const dados = await resposta.json();

      totalEl.textContent = dados.totalVisitas ?? "--";
      usuarioEl.textContent = dados.visitasUsuario ?? "--";

    } catch (erro) {
      console.error("Erro ao carregar contadores:", erro);
    }
  }


  /* ===========================
     EXECUTAR AO CARREGAR
     =========================== */
  registrarVisita().then(carregarContadores);


  /* ===========================
     TABELA DE PROJETOS
     ===========================
  
     async function carregarProjetos() {
    const tabela = document.getElementById("tabelaProjetos");
    if (!tabela) return;

    try {
      const response = await fetch("projetos.json");
      if (!response.ok) throw new Error("Não foi possível carregar projetos.json");

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const cabecalho = Object.keys(data[0]);
      let thead = "<thead><tr>";
      cabecalho.forEach(col => thead += `<th>${col}</th>`);
      thead += "</tr></thead>";

      let tbody = "<tbody>";
      data.forEach(item => {
        tbody += "<tr>";
        cabecalho.forEach(col => {
          tbody += `<td>${item[col] ?? ""}</td>`;
        });
        tbody += "</tr>";
      });
      tbody += "</tbody>";

      tabela.innerHTML = thead + tbody;

    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  carregarProjetos();
*/

/* ==================
   TABELA DE PROJETOS
   ================== */

let projetos = []; // cache dos dados

/* =================
   CARREGAR PROJETOS
   ================= */

async function carregarProjetos()
{
 
  if (window.location.pathname.includes("projetos.html"))
  {
    const tabela = document.getElementById("tabelaProjetos");
    if (!tabela) {
      console.warn("Elemento #tabelaProjetos não encontrado.");
      return;
    }
  }

  try {
    const response = await fetch("projetos.json");

    if (!response.ok) {
      console.error("Erro ao carregar projetos.json:", response.status);
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("projetos.json está vazio ou não é um array.");
      return;
    }

    // Armazena no cache global
    projetos = data;

    // Monta a tabela inicial
    montarTabela(projetos);

  } catch (error) {
    console.error("Erro inesperado ao carregar projetos:", error);
  }
}

/* =============
   MONTAR TABELA
   ============= */
function montarTabela(lista) {
  const tabela = document.getElementById("tabelaProjetos");
  if (!tabela) return;

  // Se não houver resultados, limpa a tabela e mostra aviso
  if (lista.length === 0) {
    tabela.innerHTML = `
      <thead>
        <tr><th>Nenhum resultado encontrado</th></tr>
      </thead>
      <tbody></tbody>
    `;
    return;
  }

  const colunas = Object.keys(lista[0]).filter(col => col !== "Link");

  const thead = `
    <thead>
      <tr>
        ${colunas.map(col => `<th>${col}</th>`).join("")}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${lista.map(item => `
        <tr>
          ${colunas.map(col => {
            let valor = item[col] ?? "";

            if (col === "NomeDoProjeto" && item.Link) {
              valor = `
                <a href="${item.Link}" target="_blank" class="link-projeto">
                  ${valor} 🔗
                </a>
              `;
            }

            return `<td>${valor}</td>`;
          }).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;

  tabela.innerHTML = thead + tbody;
}

/* ===========================
   FILTROS
   =========================== */
function aplicarFiltros() {
  const nomeFiltro = document.getElementById("filtroNome")?.value.trim().toLowerCase();
  const linguagensFiltro = document.getElementById("filtroLinguagens")?.value.trim().toLowerCase();

  const filtrados = projetos.filter(p => {
    const nome = (p.NomeDoProjeto ?? "").toLowerCase();
    const linguagens = (p.Linguagens ?? "").toLowerCase();

    const nomeOK = nomeFiltro ? nome.includes(nomeFiltro) : true;
    const linguagensOK = linguagensFiltro ? linguagens.includes(linguagensFiltro) : true;

    return nomeOK && linguagensOK;
  });

  montarTabela(filtrados);
}

/* Eventos dos filtros */
const filtroNome = document.getElementById("filtroNome");
const filtroLinguagens = document.getElementById("filtroLinguagens");
const btnLimpar = document.getElementById("btnLimparFiltros");

if (filtroNome) filtroNome.addEventListener("input", aplicarFiltros);
if (filtroLinguagens) filtroLinguagens.addEventListener("input", aplicarFiltros);

if (btnLimpar)
{
  btnLimpar.addEventListener("click", () =>
  {
    filtroNome.value = "";
    filtroLinguagens.value = "";
    aplicarFiltros();
  });
}


/* Inicialização */
carregarProjetos();

  /* ===========================
     TEMA ESCURO/CLARO
     =========================== */
  const toggleBtn = document.getElementById("toggle-theme");

  function aplicarTema(tema) {
    document.body.classList.remove("dark-mode", "light-mode");

    if (tema === "light") {
      document.body.classList.add("light-mode");
      toggleBtn.textContent = "🌙 Modo escuro";
    } else {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Modo claro";
    }
  }

  function detectarTemaInicial() {
    const salvo = localStorage.getItem("tema-bercelli");
    if (salvo === "light" || salvo === "dark") return salvo;

    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";

    return "dark";
  }

  aplicarTema(detectarTemaInicial());

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const temaAtual = document.body.classList.contains("light-mode") ? "light" : "dark";
      const novoTema = temaAtual === "light" ? "dark" : "light";
      aplicarTema(novoTema);
      localStorage.setItem("tema-bercelli", novoTema);
    });
  }


  /* ===========================
     MENU ATIVO
     =========================== */
  const itensMenu = document.querySelectorAll(".menuItem");
  itensMenu.forEach(item => {
    item.addEventListener("click", () => {
      itensMenu.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

});
