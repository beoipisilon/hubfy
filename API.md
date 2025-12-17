# API - Hubfy Task Manager

Documentação dos endpoints da API.

**Base URL:** `http://localhost:3000/api`

## Autenticação

A maioria dos endpoints precisa de um token JWT. Coloca no header assim:

```
Authorization: Bearer {seu_token}
```

---

## Autenticação

### POST /api/auth/register

Cria uma conta nova.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "Senha123"
}
```

**Validações:**
- Nome: pelo menos 2 caracteres
- Email: tem que ser um email válido
- Senha: mínimo 8 caracteres, precisa ter maiúscula, minúscula e número

**Sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

**Erros:**
- `409` - Email já tá cadastrado
- `400` - Algum campo inválido

---

### POST /api/auth/login

Faz login e te dá o token JWT.

**Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "Senha123"
}
```

**Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

**Erro (401):** Email ou senha errados

---

## Tarefas

Todos os endpoints de tarefas precisam estar autenticado.

### GET /api/tasks

Lista todas as tarefas do usuário logado.

**Headers:** `Authorization: Bearer {token}`

**Resposta:**
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Minha tarefa",
      "description": "Descrição da tarefa",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### POST /api/tasks

Cria uma tarefa nova.

**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

**Body:**
```json
{
  "title": "Nova tarefa",
  "description": "Descrição opcional",
  "status": "pending"
}
```

**Campos:**
- `title` (obrigatório): string, até 255 caracteres
- `description` (opcional): string
- `status` (opcional): `"pending"` | `"in_progress"` | `"completed"` (padrão: `"pending"`)

**Resposta (201):**
```json
{
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Nova tarefa",
    "description": "Descrição opcional",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT /api/tasks/[id]

Atualiza uma tarefa. Manda só os campos que quer mudar.

**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {token}`

**Body (todos os campos opcionais):**
```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "status": "in_progress"
}
```

**Resposta (200):** Retorna a tarefa atualizada

**Erros:**
- `404` - Tarefa não encontrada
- `400` - Não mandou nenhum campo pra atualizar

---

### DELETE /api/tasks/[id]

Deleta uma tarefa.

**Headers:** `Authorization: Bearer {token}`

**Resposta (200):**
```json
{
  "message": "Tarefa deletada com sucesso"
}
```

**Erro (404):** Tarefa não encontrada

---

## Códigos de Status

- `200` - Deu certo
- `201` - Criado
- `400` - Erro de validação
- `401` - Não autorizado (token inválido ou sem token)
- `404` - Não encontrado
- `409` - Conflito (ex: email duplicado)
- `500` - Erro do servidor

---

## Exemplo de Uso

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@test.com","password":"Senha123"}'

# 2. Login (pega o token da resposta)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"Senha123"}'

# 3. Criar tarefa
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Minha tarefa","status":"pending"}'

# 4. Listar tarefas
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer SEU_TOKEN"

# 5. Atualizar tarefa (ID 1)
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"status":"completed"}'

# 6. Deletar tarefa (ID 1)
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## Observações

- Senhas são hasheadas com bcrypt antes de salvar
- Tokens JWT expiram em 7 dias (dá pra configurar)
- Cada usuário só vê e mexe nas próprias tarefas
- Validação de dados com Zod em todos os endpoints
- Prepared statements pra evitar SQL injection
