const form = document.getElementById("task-form");
const inputTitle = document.getElementById("task-title");

const todoColumn = document.getElementById("todo");
const doingColumn = document.getElementById("doing");
const doneColumn = document.getElementById("done");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function createTaskElement(task) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task", task.status);

  const title = document.createElement("p");
  title.classList.add("task-title");
  title.textContent = task.title;

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.classList.add("btn-edit");

  editButton.addEventListener("click", () => {
    const newTitle = prompt("Digite o novo título da tarefa:", task.title);

    if (newTitle === null) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === "") {
      alert("O título não pode ficar vazio.");
      return;
    }

    task.title = trimmedTitle;
    saveTasks();
    renderTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Excluir";
  deleteButton.classList.add("btn-delete");

  deleteButton.addEventListener("click", () => {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    renderTasks();
  });

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  if (task.status !== "todo") {
    const leftButton = document.createElement("button");
    leftButton.textContent = "<";
    leftButton.classList.add("btn-move");

    leftButton.addEventListener("click", () => {
      if (task.status === "doing") {
        task.status = "todo";
      } else if (task.status === "done") {
        task.status = "doing";
      }

      saveTasks();
      renderTasks();
    });

    actions.appendChild(leftButton);
  }

  if (task.status !== "done") {
    const rightButton = document.createElement("button");
    rightButton.textContent = ">";
    rightButton.classList.add("btn-move");

    rightButton.addEventListener("click", () => {
      if (task.status === "todo") {
        task.status = "doing";
      } else if (task.status === "doing") {
        task.status = "done";
      }

      saveTasks();
      renderTasks();
    });

    actions.appendChild(rightButton);
  }

  taskCard.appendChild(title);
  taskCard.appendChild(actions);

  return taskCard;
}

function renderTasks() {
  todoColumn.innerHTML = "";
  doingColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);

    if (task.status === "todo") {
      todoColumn.appendChild(taskElement);
    } else if (task.status === "doing") {
      doingColumn.appendChild(taskElement);
    } else if (task.status === "done") {
      doneColumn.appendChild(taskElement);
    }
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = inputTitle.value.trim();

  if (title === "") {
    alert("Digite o título da tarefa.");
    return;
  }

  const newTask = {
    id: generateId(),
    title: title,
    status: "todo"
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  inputTitle.value = "";
  inputTitle.focus();
});

renderTasks();
