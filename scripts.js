document.addEventListener("DOMContentLoaded", () => {
  async function carregarProjetos() {
    const tabela = document.getElementById("tabelaProjetos");
    if (!tabela) return; // só monta se existir a tabela

    const response = await fetch("projetos.json");
    const data = await response.json();

    // Cabeçalho
    const cabecalho = Object.keys(data[0]);
    let thead = "<thead><tr>";
    cabecalho.forEach(col => {
      thead += `<th>${col}</th>`;
    });
    thead += "</tr></thead>";

    // Corpo
    let tbody = "<tbody>";
    data.forEach(item => {
      let linha = "<tr>";
      cabecalho.forEach(col => {
        linha += `<td>${item[col]}</td>`;
      });
      linha += "</tr>";
      tbody += linha;
    });
    tbody += "</tbody>";

    tabela.innerHTML = thead + tbody;
  }

  carregarProjetos();

  // Alternância de tema
  const toggleBtn = document.getElementById("toggle-theme");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      toggleBtn.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Modo Claro"
        : "🌙 Modo Escuro";
    });
  }
});
