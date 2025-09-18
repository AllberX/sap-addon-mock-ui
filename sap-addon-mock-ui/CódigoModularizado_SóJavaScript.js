const form = document.getElementById("applicationForm");
const appTableBody = document.querySelector("#appTable tbody");

// Carrega dados ao iniciar
document.addEventListener("DOMContentLoaded", loadApplications);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const codigo = document.getElementById("codigo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const tipo = document.getElementById("tipo").value;
  const status = document.getElementById("status").checked ? "Ativo" : "Inativo";

  if (!codigo || !descricao || !tipo) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const newApp = { codigo, descricao, tipo, status };

  let apps = JSON.parse(localStorage.getItem("apps")) || [];

  apps.push(newApp);
  localStorage.setItem("apps", JSON.stringify(apps));

  alert("Aplicação salva com sucesso!");
  form.reset();
  loadApplications();
});

function loadApplications() {
  const apps = JSON.parse(localStorage.getItem("apps")) || [];
  appTableBody.innerHTML = "";

  apps.forEach((app) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${app.codigo}</td>
      <td>${app.descricao}</td>
      <td>${app.tipo}</td>
      <td>${app.status}</td>
    `;

    appTableBody.appendChild(tr);
  });
}

function simularSaida() {
  alert("Saindo da tela do AddOn (simulação).");
  // Aqui você pode colocar o código para fechar a janela ou redirecionar
}
