
    async function carregarProjetos()
    {
      const response = await fetch("projetos.json"); // lê JSON atualizado
      const data = await response.json();

      const tabela = document.getElementById("tabelaProjetos");

      // Cabeçalho: pega chaves do primeiro objeto
      const cabecalho = Object.keys(data[0]);
      let thead = "<tr>";
      cabecalho.forEach(col => {
        thead += `<th>${col}</th>`;
      });
      thead += "</tr>";
      tabela.innerHTML = thead;

      // Linhas
      data.forEach(item => {
        let linha = "<tr>";
        cabecalho.forEach(col => {
          linha += `<td>${item[col]}</td>`;
        });
        linha += "</tr>";
        tabela.innerHTML += linha;
      });
    }

    carregarProjetos();
