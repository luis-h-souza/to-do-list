const express = require('express')
const cors = require('cors') // 2. Importa o middleware CORS, que permite que seu frontend (rodando em um domínio diferente, ex: localhost:outra_porta ou um domínio de produção) faça requisições para esta API.
const app = express() 
const port = 3000 
const taskRoutes = require('./routes/tasks')
const path = require('path')

// 7. Habilita o middleware CORS para todas as rotas. Isso adiciona os cabeçalhos HTTP necessários para permitir requisições de diferentes origens.
app.use(cors())
app.use(express.json()) // 8. Adiciona um middleware que analisa o corpo das requisições recebidas com o `Content-Type: application/json`. Isso torna os dados JSON enviados no corpo da requisição acessíveis através de `req.body`

app.use('/tasks', taskRoutes)
 // 10. Configura o Express para servir arquivos estáticos (como HTML, CSS, JavaScript do lado do cliente, imagens) da pasta `public`. `__dirname` é uma variável global do Node.js que representa o diretório do arquivo atual, e `path.join` constrói o caminho absoluto para a pasta `public` de forma segura entre diferentes sistemas operacionais.
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => { 
  console.log(`Api rodando em http://localhost:${port}`)
})
