// Get DOM elements
const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const deadlineInput = document.getElementById("deadline");
const statusInput = document.getElementById("status");
const taskContainer = document.getElementById("taskContainer");
const clearBtn = document.getElementById("clearBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("student_tasks")) || [];
let editingIndex = null;

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("student_tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskContainer.innerHTML = "<p>No tasks added yet!</p>";
    updateProgress();
    return;
  }

  tasks.forEach((task, index) => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task");

    taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || "No description provided."}</p>
      <p class="meta"><strong>Deadline:</strong> ${task.deadline || "N/A"} | <strong>Status:</strong> ${task.status}</p>
      <div class="task-buttons">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskContainer.appendChild(taskEl);
  });

  updateProgress();
}

// Update progress bar
function updateProgress() {
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  const totalTasks = tasks.length;

  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${completedTasks}/${totalTasks} tasks completed`;
}

// Add or update task
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    deadline: deadlineInput.value,
    status: statusInput.value
  };

  if (editingIndex !== null) {
    tasks[editingIndex] = task;
    editingIndex = null;
  } else {
    tasks.push(task);
  }

  saveTasks();
  form.reset();
  renderTasks();
});

// Edit task
function editTask(index) {
  const task = tasks[index];
  titleInput.value = task.title;
  descriptionInput.value = task.description;
  deadlineInput.value = task.deadline;
  statusInput.value = task.status;
  editingIndex = index;
}

// Delete task
function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// Clear all tasks
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Initialize
renderTasks();
