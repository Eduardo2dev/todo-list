let filter = "all";

const input = document.getElementById("taskInput");
const btnAdd = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");

let search = "";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

btnAdd.addEventListener("click", addTask);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

/*  logica de filtro dee tarefas */
searchInput.addEventListener("input", (e) => {
  search = e.target.value.toLowerCase();
  render();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text: text,
    done: false
  });

  save();
  render();
  input.value = "";
}

function render() {
  list.innerHTML = "";

  const pendingCount = tasks.filter(t => !t.done).length;
  counter.textContent = `${pendingCount} tarefa(s) pendente(s)`;

  if (tasks.length === 0 && search === "") {
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

    // Botão de Sconcluido
    const btnDone = document.createElement("button");
    btnDone.style.background = "none";
    btnDone.style.border = "none";
    btnDone.style.cursor = "pointer";
    btnDone.style.fontSize = "1.1rem";
    btnDone.textContent = task.done ? "✅" : "⬜";
    btnDone.onclick = () => toggle(i);

    const span = document.createElement("span");
    span.textContent = task.text;

    const boxBtns = document.createElement("div");
    boxBtns.className = "actions";

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏️";
    btnEdit.title = "Editar tarefa";
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
    btnRemove.title = "Excluir tarefa";
    btnRemove.onclick = () => remove(i, li);

    boxBtns.appendChild(btnEdit);
    boxBtns.appendChild(btnRemove);

    li.appendChild(btnDone);
    li.appendChild(span);
    li.appendChild(boxBtns);

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

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setFilter(f, e) {
  filter = f;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  render();
}

render();