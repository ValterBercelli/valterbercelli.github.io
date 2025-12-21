document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     Tabela de projetos
     =========================== */
  async function carregarProjetos() {
    const tabela = document.getElementById("tabelaProjetos");
    if (!tabela) return;

    try {
      const response = await fetch("projetos.json");
      if (!response.ok) {
        throw new Error("Não foi possível carregar projetos.json");
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const cabecalho = Object.keys(data[0]);
      let thead = "<thead><tr>";
      cabecalho.forEach(col => {
        thead += `<th>${col}</th>`;
      });
      thead += "</tr></thead>";

      let tbody = "<tbody>";
      data.forEach(item => {
        let linha = "<tr>";
        cabecalho.forEach(col => {
          linha += `<td>${item[col] ?? ""}</td>`;
        });
        linha += "</tr>";
        tbody += linha;
      });
      tbody += "</tbody>";

      tabela.innerHTML = thead + tbody;
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  carregarProjetos();

  /* ===========================
     Tema: escuro/claro
     - respeita o SO
     - usa localStorage
     - botão alterna manualmente
     =========================== */

  const toggleBtn = document.getElementById("toggle-theme");

  function aplicarTema(tema) {
    document.body.classList.remove("dark-mode", "light-mode");

    if (tema === "light") {
      document.body.classList.add("light-mode");
      if (toggleBtn) toggleBtn.textContent = "🌙 Modo escuro";
    } else {
      document.body.classList.add("dark-mode");
      if (toggleBtn) toggleBtn.textContent = "☀️ Modo claro";
    }
  }

  function detectarTemaInicial() {
    const salvo = localStorage.getItem("tema-bercelli");

    if (salvo === "light" || salvo === "dark") {
      return salvo;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    // Padrão: escuro
    return "dark";
  }

  const temaInicial = detectarTemaInicial();
  aplicarTema(temaInicial);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const temaAtual = document.body.classList.contains("light-mode") ? "light" : "dark";
      const novoTema = temaAtual === "light" ? "dark" : "light";
      aplicarTema(novoTema);
      localStorage.setItem("tema-bercelli", novoTema);
    });
  }

  /* ===========================
     Destaque de menu ativo (extra)
     =========================== */

  const itensMenu = document.querySelectorAll(".menuItem");
  itensMenu.forEach(item => {
    item.addEventListener("click", () => {
      itensMenu.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
});
