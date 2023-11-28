document.addEventListener('DOMContentLoaded', function () {
  // Load tasks from local storage on page load
  loadTasks();
});

function saveTask() {
  const titleInput = document.getElementById('task-title');
  const descriptionInput = document.getElementById('task-description');
  const dateInput = document.getElementById('task-date');
  const priorityInput = document.getElementById('task-priority');

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;

  if (!title || !date || !priority) {
    alert('Please enter a task title, date, and priority.');
    return;
  }

  const task = {
    title,
    description,
    date,
    priority,
    completed: false,
  };

  // Save the task to local storage
  saveTaskToLocalstorage(task);

  // Clear input fields
  titleInput.value = '';
  descriptionInput.value = '';
  dateInput.value = '';
  priorityInput.value = 'low';

  // Reload tasks to update the task list
  loadTasks(true); // Pass true to indicate that a new task has been added
}

function saveTaskToLocalstorage(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  // Sort tasks based on priority and date
  tasks.sort((a, b) => {
    if (a.priority !== b.priority) {
      const priorityOrder = { 'low': 0, 'medium': 1, 'high': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(scrollToBottom) {
  const taskListContainer = document.getElementById('task-list');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Clear existing tasks
  taskListContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    const daysLeft = getDaysLeft(task.date);

    taskItem.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Date: ${task.date}</p>
        <p>Priority: ${task.priority}</p>
        <p>Days Left: ${daysLeft} days</p>
      </div>
      <div>
        <button onclick="toggleTaskCompletion(${index})">${task.completed ? 'Activate' : 'Complete'}</button>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskListContainer.appendChild(taskItem);
  });

  if (scrollToBottom) {
    // Scroll to the last added task
    taskListContainer.scrollTop = taskListContainer.scrollHeight;
  }
}

function getDaysLeft(dateString) {
  const currentDate = new Date();
  const dueDate = new Date(dateString);
  const timeDifference = dueDate.getTime() - currentDate.getTime();
  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return daysLeft >= 0 ? daysLeft : 'Overdue';
}

function toggleTaskCompletion(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskToEdit = tasks[index];

  // Populate the form with the task details for editing
  document.getElementById('task-title').value = taskToEdit.title;
  document.getElementById('task-description').value = taskToEdit.description;
  document.getElementById('task-date').value = taskToEdit.date;
  document.getElementById('task-priority').value = taskToEdit.priority;

  // Remove the task being edited from the list
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Reload tasks to update the task list
  loadTasks();
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}
