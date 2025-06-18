const form = document.querySelector("form");
const amountInput = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

const ul = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const totalAmout = document.querySelector("aside header h2");

amountInput.addEventListener("input", function () {
  let value = amountInput.value.replace(/\D/g, "");

  // transformar o valor em centavos
  value = Number(value) / 100;

  amountInput.value = formatCurrency(value);
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amountInput.value,
    created_at: new Date(),
  };
  console.log(newExpense);

  expanseAdd(newExpense);
  clearForm();
});

function formatCurrency(value) {
  // Formata o valor como moeda brasileira
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function expanseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // cria o ícone da despesa
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // cria as informações da despesa
    const expenseInfo = document.createElement("div");
    const expenseName = document.createElement("strong");
    const expenseCategory = document.createElement("span");
    expenseInfo.classList.add("expense-info");
    expenseName.textContent = newExpense.expense;
    expenseCategory.textContent = newExpense.category_name;

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");

    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // iconde de excluri
    const deleteIcon = document.createElement("img");
    deleteIcon.classList.add("remove-icon");
    deleteIcon.setAttribute("src", "img/remove.svg");
    deleteIcon.setAttribute("alt", "remover");

    expenseInfo.append(expenseName, expenseCategory);

    // adicionando os elementos ao item de despesa
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, deleteIcon);

    //aidciona as informações no item
    ul.append(expenseItem);

    updateTotals();
  } catch (error) {
    alert("Erro ao adicionar despesa: " + error.message);
  }
}

function updateTotals() {
  try {
    const items = ul.children;
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? " despesas" : " despesa"
    }`;

    // Calcula o total das despesas

    let total = 0;

    for (let i = 0; i < items.length; i++) {
      const itemAmout = items[i].querySelector(".expense-amount");
      const amoutText = itemAmout.textContent
        .replace("R$", "")
        .replace(",", ".");

      total += parseFloat(amoutText);
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    totalAmout.innerHTML = ""; // Limpa o conteúdo atual

    totalAmout.appendChild(symbolBRL);

    totalAmout.innerHTML = `<small>R$</small> ${formatCurrency(total).replace(
      "R$",
      ""
    )}`;
  } catch (error) {
    alert("Erro ao atualizar totais: " + error.message);
  }
}

ul.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    // closest() retorna o ancestral mais próximo
    const expanseItem = event.target.closest(".expense");

    if (expanseItem) {
      expanseItem.remove();
      updateTotals();
    }
  }
});

function clearForm() {
  amountInput.value = "";
  expense.value = "";
  category.value = "";

  expense.focus(); // Foca no campo de despesa
}
