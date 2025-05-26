const API_URL = 'http://localhost:3000/tasks';

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${task.done ? 'done' : ''}">${task.title}</span>
      <div class="actions">
      ${!task.done ? `<button class="check" onclick="markDone(${task.id})">Concluir</button>` : ''}
      <button class="delete" onclick="deleteTask(${task.id})">Deletar</button>
      <button class="edit" onclick="editTask(${task.id})">Editar</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const title = input.value.trim();
  if (!title) return alert("Digite algo!");
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  input.value = '';
  fetchTasks();
}

async function markDone(id) {
  await fetch(`${API_URL}/${id}`, { method: 'PUT' });
  fetchTasks();
}

async function editTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'PUT' });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

fetchTasks()
