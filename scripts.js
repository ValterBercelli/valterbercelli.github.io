document.addEventListener("DOMContentLoaded", () => {
  async function carregarProjetos() {
    const response = await fetch("projetos.json");
    const data = await response.json();

    const tabela = document.getElementById("tabelaProjetos");

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

    // Junta tudo
    tabela.innerHTML = thead + tbody;
  }

  carregarProjetos();
});
