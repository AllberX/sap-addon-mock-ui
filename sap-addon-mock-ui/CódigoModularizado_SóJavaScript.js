const form = document.getElementById("fornecedorForm");
const tableBody = document.querySelector("#fornecedorTable tbody");
const feedback = document.getElementById("formFeedback");
const countFornecedores = document.getElementById("countFornecedores");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const nomeInput = document.getElementById("nome");

function getFornecedores() {
  try {
    return JSON.parse(localStorage.getItem("fornecedores")) || [];
  } catch (error) {
    console.warn("Erro ao ler fornecedores do localStorage:", error);
    return [];
  }
}

function saveFornecedores(fornecedores) {
  localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
}

function showFeedback(message, type = "success") {
  feedback.className = `alert alert-${type} mt-3`;
  feedback.textContent = message;
  feedback.classList.remove("d-none");
}

function clearFeedback() {
  feedback.className = "alert mt-3 d-none";
  feedback.textContent = "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

document.addEventListener("DOMContentLoaded", loadFornecedores);

deleteSelectedBtn.addEventListener("click", function () {
  const selectedCodes = Array.from(document.querySelectorAll('.fornecedor-checkbox:checked'))
    .map((checkbox) => checkbox.dataset.codigo);

  if (!selectedCodes.length) {
    showFeedback("Selecione ao menos um fornecedor para deletar.", "warning");
    return;
  }

  if (!confirm("Deseja realmente excluir os fornecedores selecionados?")) {
    return;
  }

  const fornecedores = getFornecedores().filter((fornecedor) => !selectedCodes.includes(fornecedor.codigo));
  saveFornecedores(fornecedores);
  showFeedback("Fornecedores selecionados removidos com sucesso.", "success");
  loadFornecedores();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearFeedback();

  const codigo = document.getElementById("codigo").value.trim();
  const nome = nomeInput.value.trim();
  const tipo = document.getElementById("tipo").value;
  const status = document.getElementById("status").checked;

  if (!nome) {
    nomeInput.classList.add("is-invalid");
    showFeedback("Informe o nome do fornecedor.", "warning");
    nomeInput.focus();
    return;
  }

  if (!codigo || !nome || !tipo) {
    showFeedback("Preencha todos os campos obrigatórios.", "warning");
    return;
  }

  const fornecedores = getFornecedores();
  const existe = fornecedores.some((fornecedor) => fornecedor.codigo.toLowerCase() === codigo.toLowerCase());

  if (existe) {
    showFeedback(`O código "${codigo}" já foi cadastrado.`, "danger");
    document.getElementById("codigo").focus();
    return;
  }

  const newFornecedor = {
    codigo,
    nome,
    tipo,
    status: status ? "Ativo" : "Inativo",
  };

  fornecedores.push(newFornecedor);
  saveFornecedores(fornecedores);

  showFeedback(`Fornecedor "${nome}" salvo com sucesso!`, "success");
  form.reset();
  document.getElementById("codigo").focus();
  loadFornecedores();
});

nomeInput.addEventListener("input", function () {
  if (nomeInput.value.trim()) {
    nomeInput.classList.remove("is-invalid");
  }
});

form.addEventListener("reset", function () {
  clearFeedback();
  nomeInput.classList.remove("is-invalid");
  document.getElementById("codigo").focus();
});

function loadFornecedores() {
  const fornecedores = getFornecedores();
  tableBody.innerHTML = "";

  if (!fornecedores.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state py-4">Nenhum fornecedor cadastrado ainda.</td>
      </tr>
    `;
    countFornecedores.textContent = "0 itens";
    return;
  }

  fornecedores.forEach((fornecedor) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="text-center">
        <input class="form-check-input fornecedor-checkbox" type="checkbox" data-codigo="${escapeHtml(fornecedor.codigo)}" />
      </td>
      <td>${escapeHtml(fornecedor.codigo)}</td>
      <td>${escapeHtml(fornecedor.nome)}</td>
      <td>${escapeHtml(fornecedor.tipo)}</td>
      <td><span class="status-badge ${fornecedor.status === "Ativo" ? "active" : "inactive"}">${escapeHtml(fornecedor.status)}</span></td>
    `;
    tableBody.appendChild(row);
  });

  countFornecedores.textContent = `${fornecedores.length} item${fornecedores.length === 1 ? "" : "s"}`;
}

function simularSaida() {
  if (confirm("Deseja realmente sair?")) {
    alert("Simulação de saída realizada!");
  }
}

window.simularSaida = simularSaida;
