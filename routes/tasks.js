const express = require('express')
// Importar Prisma para tipos de erro específicos, como PrismaClientKnownRequestError
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // Utiliza o Prisma para buscar todas as tarefas (`task.findMany()`).
    const tasks = await prisma.task.findMany()
    res.json(tasks)
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: 'Não foi possível buscar as tarefas.' });
  }
})

router.post('/', async (req, res) => {
  try {
    const { title } = req.body
    // Verifica se `title` foi fornecido, se é uma string e se não é uma string vazia após remover espaços em branco.
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'O título é obrigatório e deve ser uma string não vazia.' });
    }
    // O objeto `data` especifica os campos e valores para a nova tarefa.
    const newTask = await prisma.task.create({ data: { title } })
    res.status(201).json(newTask)
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: 'Não foi possível criar a tarefa.' });
  }
})


router.put('/:id', async (req, res) => {
  // Desestrutura o `id` dos parâmetros da rota (`req.params`).
  const { id } = req.params
  const updated = await prisma.task.update({
    where: { id: Number(id) },
    data: { done: true }
  })
  res.json(updated)
  // Pontos de melhoria:
  // 1. Adicionar tratamento de erro (try...catch) como nas rotas POST e DELETE.
  //    - Lidar com `id` inválido (não numérico).
  //    - Lidar com o caso de a tarefa com o `id` fornecido não existir (Prisma lança um erro P2025).
  // 2. Tornar a atualização mais flexível: permitir que o cliente envie o valor de `done` (true/false)
  //    ou até mesmo outros campos (como `title`) no corpo da requisição (`req.body`).
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const taskId = Number(id);
    // Validação: verifica se `taskId` é um número válido.
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    await prisma.task.delete({ where: { id: taskId } })

    res.status(204).send()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    console.error("Erro ao deletar tarefa:", error);

    res.status(500).json({ error: 'Não foi possível deletar a tarefa.' });
  }
})

module.exports = router
