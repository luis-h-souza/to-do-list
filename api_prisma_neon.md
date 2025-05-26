
# API REST com Prisma, Neon DB e PostgreSQL

Este guia ensina a criar uma API REST simples de lista de tarefas usando:
- Prisma ORM
- PostgreSQL hospedado no [Neon](https://neon.tech)
- Node.js com Express

---

## 1. Pré-requisitos

- Node.js instalado
- Conta no [Neon](https://neon.tech)
- VS Code ou outro editor

---

## 2. Criar projeto Node.js

```bash
mkdir app-prisma-neon
cd app-prisma-neon
npm init -y
npm install prisma --save-dev
npx prisma init
npm install @prisma/client express cors
```

---

## 3. Configurar conexão com o Neon DB

No Neon:
1. Crie um projeto.
2. Copie a connection string (começa com `postgresql://...`).

No arquivo `.env`, adicione:

```env
DATABASE_URL="postgresql://usuario:senha@host/dbname?sslmode=require"
```

---

## 4. Definir modelo Prisma

No arquivo `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

Execute a migração:

```bash
npx prisma migrate dev --name init
```

---

## 5. Estrutura do projeto

```
app-prisma-neon/
│
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
├── index.js
└── routes/
    └── tasks.js
```

---

## 6. Criar servidor Express

### `index.js`

```js
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const taskRoutes = require('./routes/tasks')

app.use(cors())
app.use(express.json())
app.use('/tasks', taskRoutes)

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})
```

---

## 7. Criar rotas da API

### `routes/tasks.js`

```js
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany()
  res.json(tasks)
})

router.post('/', async (req, res) => {
  const { title } = req.body
  const newTask = await prisma.task.create({ data: { title } })
  res.status(201).json(newTask)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { done: true }
  })
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await prisma.task.delete({ where: { id: Number(id) } })
  res.status(204).send()
})

module.exports = router
```

---

## 8. Testar a API

- Use Postman ou Insomnia.
- Ou conecte com HTML + JavaScript usando `fetch`.

---

## 9. Pronto!

Você criou uma API Node.js com banco de dados PostgreSQL na nuvem (Neon) e ORM Prisma.



---

## 10. Criar Frontend HTML + JS Vanilla

### Estrutura

```
app-prisma-neon/
└── public/
    └── index.html
```

### `public/index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Lista de Tarefas</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    li { margin-bottom: 10px; }
    .done { text-decoration: line-through; color: gray; }
  </style>
</head>
<body>
  <h1>Minha Lista de Tarefas</h1>

  <input type="text" id="taskInput" placeholder="Nova tarefa..." />
  <button onclick="addTask()">Adicionar</button>

  <ul id="taskList"></ul>

  <script>
    const API_URL = 'http://localhost:3000/tasks'

    async function fetchTasks() {
      const res = await fetch(API_URL)
      const tasks = await res.json()
      const list = document.getElementById('taskList')
      list.innerHTML = ''

      tasks.forEach(task => {
        const li = document.createElement('li')
        li.innerHTML = \`
          <span class="\${task.done ? 'done' : ''}">\${task.title}</span>
          \${!task.done ? \`<button onclick="markDone(\${task.id})">Concluir</button>\` : ''}
          <button onclick="deleteTask(\${task.id})">Deletar</button>
        \`
        list.appendChild(li)
      })
    }

    async function addTask() {
      const input = document.getElementById('taskInput')
      const title = input.value.trim()
      if (!title) return alert("Digite algo!")
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      input.value = ''
      fetchTasks()
    }

    async function markDone(id) {
      await fetch(\`\${API_URL}/\${id}\`, { method: 'PUT' })
      fetchTasks()
    }

    async function deleteTask(id) {
      await fetch(\`\${API_URL}/\${id}\`, { method: 'DELETE' })
      fetchTasks()
    }

    fetchTasks()
  </script>
</body>
</html>
```

### Servir com Express (opcional)

Adicione no `index.js`:

```js
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
```

---

## Finalizado!

Agora você tem:
- Backend com Node.js + Express + Prisma + Neon DB
- Frontend HTML com JavaScript Vanilla
- API funcional para tarefas (CRUD)
