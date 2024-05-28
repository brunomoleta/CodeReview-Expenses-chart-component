const chart = document.getElementById("chart");
const totalEl = document.getElementById("total");
const balanceEl = document.getElementById("balance");
const differenceEl = document.getElementById("difference");

class ExpenseCalculator {
  data = [];
  income = 0;
  expensesLastMonth = 0;

  constructor(income, expensesLastMonth) {
    this.income = income;
    this.expensesLastMonth = expensesLastMonth;
  }

  setData(data) {
    this.data = data;
  }
  getTotal() {
    return this.data.reduce((total, item) => (total + item.amount), 0);
  }

  getBalance() {
    return this.income - this.getTotal();
  }

  getDifference() {
    const total = this.getTotal();

    const diff =
      total < this.expensesLastMonth
        ? "-" + ((this.expensesLastMonth - total) * 100) / total
        : ((total - this.expensesLastMonth) * 100) / this.expensesLastMonth;

    return (Math.sign(diff) > 0 ? "+" : "") + Number(diff).toFixed(1);
  }
}

const expenseCalculator = new ExpenseCalculator(2000, 234.34);

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      expenseCalculator.setData(data);
      totalEl.textContent = `$${expenseCalculator.getTotal()}`;
      balanceEl.textContent = `$${expenseCalculator.getBalance()}`;
      differenceEl.textContent = `${expenseCalculator.getDifference()}%`;

      expenseCalculator.data.forEach((item) => {
        const col = document.createElement("div");

        const date = Date.now();
        const options = { weekday: "short" };
        const day = new Intl.DateTimeFormat("en-US", options)
          .format(date)
          .toLowerCase();

        col.className = "expenses-component__chart-col";
        col.innerHTML = `
            <span class="expenses-component__chart-number">$${
              item.amount
            }</span>
            <div class="expenses-component__chart-bar ${
              day === item.day ? "expenses-component__chart-bar--today" : ""
            }" style="height:${item.amount * 2.9}px"></div>
            <span class="expenses-component__chart-day">${item.day}</span>
          `;
        chart.appendChild(col);
      });
    });
});

chart.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("expenses-component__chart-bar")) {
    const el = document.querySelector(
      ".expenses-component__chart-number--visible"
    );
    if (el) {
      el.classList.remove("expenses-component__chart-number--visible");
    }

    e.target.previousElementSibling.classList.add(
      "expenses-component__chart-number--visible"
    );
  }
});

chart.addEventListener("mouseleave", (e) => {
  const el = document.querySelector(
    ".expenses-component__chart-number--visible"
  );
  if (el) {
    el.classList.remove("expenses-component__chart-number--visible");
  }
});
