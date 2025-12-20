document.addEventListener("DOMContentLoaded", () =>
{
  // Função para carregar projetos na página projetos.html
  async function carregarProjetos()
  {
    const tabela = document.getElementById("tabelaProjetos");
    if (!tabela) return; // só monta se existir a tabela

    try {
      const response = await fetch("projetos.json"); // nome correto em minúsculo
      if (!response.ok) {
        throw new Error("Não foi possível carregar projetos.json");
      }
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
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  carregarProjetos();

  // Alternância de tema
  const toggleBtn = document.getElementById("toggle-theme");
  if (toggleBtn)
  {
    // Detecta preferência do sistema
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark)
    {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Modo Claro";
    }
    else
    {
      document.body.classList.add("light-mode");
      toggleBtn.textContent = "🌙 Modo Escuro";
    }

    // Alternância manual
    toggleBtn.addEventListener("click", () => {
      if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        toggleBtn.textContent = "🌙 Modo Escuro";
      } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️ Modo Claro";
      }
    });
  }

  // Destaca o menu selecionado (menuItem), utilizando a classe .active
  const itens = document.querySelectorAll('.menu-item');
  itens.forEach(item =>
  {
    item.addEventListener('click', () => {
      itens.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

});


