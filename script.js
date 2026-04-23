let filter = "all";
let search = "";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const input = document.getElementById("taskInput");
const btnAdd = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");
const themeBtn = document.getElementById("toggleTheme");

// Lógica de Dark Mode
if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
});

// Eventos
btnAdd.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") addTask(); });
searchInput.addEventListener("input", (e) => {
  search = e.target.value.toLowerCase();
  render();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text: text, done: false });
  save();
  render();
  input.value = "";
}

function render() {
  list.innerHTML = "";

  // Dashboard de Estatísticas
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const pendingCount = total - doneCount;

  counter.innerHTML = `
    <div class="stats-item"><strong>${total}</strong><span>Total</span></div>
    <div class="stats-item"><strong>${pendingCount}</strong><span>Pendentes</span></div>
    <div class="stats-item"><strong>${doneCount}</strong><span>Concluídas</span></div>
  `;

  if (total === 0 && search === "") {
    list.innerHTML = "<p style='text-align:center; opacity:0.5; font-size: 0.9rem;'>Sua lista está vazia</p>";
    return;
  }

  let hasResult = false;
  tasks.forEach((task, i) => {
    const matchesFilter = (filter === "all") || (filter === "done" && task.done) || (filter === "pending" && !task.done);
    const matchesSearch = task.text.toLowerCase().includes(search);
    
    if (!matchesFilter || !matchesSearch) return;
    hasResult = true;

    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const btnDone = document.createElement("button");
    btnDone.style = "background:none; border:none; cursor:pointer; font-size:1.1rem;";
    btnDone.textContent = task.done ? "✅" : "⬜";
    btnDone.onclick = () => toggle(i);

    const span = document.createElement("span");
    span.style.flex = "1";
    span.style.margin = "0 10px";
    span.textContent = task.text;

    const boxBtns = document.createElement("div");
    boxBtns.className = "actions";

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏️";
    btnEdit.onclick = () => {
      const novo = prompt("Editar tarefa:", task.text);
      if (novo && novo.trim()) {
        tasks[i].text = novo.trim();
        save();
        render();
      }
    };

    const btnRemove = document.createElement("button");
    btnRemove.textContent = "❌";
    btnRemove.onclick = () => remove(i, li);

    boxBtns.append(btnEdit, btnRemove);
    li.append(btnDone, span, boxBtns);
    list.appendChild(li);
  });

  if (!hasResult && search !== "") {
    list.innerHTML = "<p style='text-align:center; opacity:0.6; font-size: 0.9rem;'>Nada encontrado 🔎</p>";
  }
}

function toggle(i) {
  tasks[i].done = !tasks[i].done;
  save();
  render();
}

function remove(i, element) {
  element.style.transition = "0.3s";
  element.style.opacity = "0";
  element.style.transform = "translateX(25px)";
  setTimeout(() => {
    tasks.splice(i, 1);
    save();
    render();
  }, 300);
}

function save() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

function setFilter(f, e) {
  filter = f;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  render();
}

render();