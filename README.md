# Desafio
Desafio Dev Hubfy

Desafio Técnico Full Stack - Desenvolvedor React/Next.js

Sobre o Desafio

Bem-vindo ao desafio técnico da Hubfy.ai! Este é um desafio full stack completo que avaliará suas habilidades em desenvolvimento frontend, backend, banco de dados, autenticação, testes e documentação. Você irá construir do zero um sistema de gestão de tarefas que demonstrará seu domínio das tecnologias que utilizamos no dia a dia.

Objetivo:
Desenvolver uma aplicação web full stack para gerenciamento de tarefas, construindo toda a infraestrutura do zero, incluindo:
Frontend: Interface moderna e responsiva com React/Next.js
Backend: API RESTful completa criada por você
Banco de Dados: Modelagem e implementação em MySQL
Autenticação: Sistema completo de login e registro com JWT
Testes: Cobertura de testes automatizados
Documentação: Documentação completa da aplicação e da API

Requisitos Técnicos Obrigatórios

Stack Tecnológico
Sua solução deve utilizar as seguintes tecnologias:
Next.js (versão 14 ou superior)
React (versão 18 ou superior)
TypeScript
Tailwind CSS
MySQL (versão 8 ou superior)
JWT para autenticação
Funcionalidades Principais

1. Backend - API RESTful (Você deve criar do zero)
Você deve construir uma API REST completa usando Next.js API Routes com os seguintes endpoints:
Autenticação:
POST /api/auth/register - Registro de novos usuários
Recebe: { name, email, password }
Retorna: { message, user: { id, name, email } }
Valida email único e senha forte
POST /api/auth/login - Login de usuários
Recebe: { email, password }
Retorna: { token, user: { id, name, email } }
Retorna JWT token válido
Tarefas (protegidas por autenticação):
GET /api/tasks - Listar todas as tarefas do usuário autenticado
Header: Authorization: Bearer {token}
Retorna: { tasks: [...] }
POST /api/tasks - Criar uma nova tarefa
Header: Authorization: Bearer {token}
Recebe: { title, description, status }
Retorna: { task: {...} }
PUT /api/tasks/[id] - Atualizar uma tarefa existente
Header: Authorization: Bearer {token}
Recebe: { title?, description?, status? }
Retorna: { task: {...} }
DELETE /api/tasks/[id] - Deletar uma tarefa
Header: Authorization: Bearer {token}
Retorna: { message }
Requisitos da API:
Todas as rotas de tarefas devem validar o token JWT
Usuários só podem acessar suas próprias tarefas
Validação de dados de entrada em todos os endpoints
Tratamento adequado de erros com códigos HTTP corretos
Respostas padronizadas em JSON

2. Banco de Dados MySQL

Crie um banco de dados MySQL com as seguintes tabelas:

Tabela users:

SQL


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Tabela tasks:

SQL


CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


Requisitos do Banco:
Forneça o arquivo schema.sql com os comandos de criação
Adicione índices apropriados para otimização
Garanta integridade referencial com Foreign Keys

3. Autenticação e Segurança
Obrigatório:
Implementar autenticação JWT (Bearer Token)
Armazenar senhas usando hash seguro (bcrypt ou argon2)
Criar middleware de autenticação para proteger rotas
Garantir que usuários só possam acessar suas próprias tarefas
Utilizar variáveis de ambiente (.env) para credenciais sensíveis
Validar força da senha no registro (mínimo 8 caracteres)
Validar formato de email
Não permitido:
Senhas em texto plano
SQL injection (use prepared statements ou ORM)
Credenciais hardcoded no código
Tokens sem expiração

4. Frontend
Páginas obrigatórias:
Página de Login (/login)
Formulário com email e senha
Validação de campos em tempo real
Mensagens de erro claras
Redirecionamento após login bem-sucedido
Link para página de registro
Página de Registro (/register)
Formulário com nome, email e senha
Validação de campos (email válido, senha forte)
Confirmação de senha
Mensagens de erro claras
Redirecionamento para login após registro
Dashboard de Tarefas (/dashboard)
Listagem de todas as tarefas do usuário
Formulário para criar nova tarefa
Opções para editar e deletar tarefas
Filtro por status (pending, in_progress, completed)
Indicadores de loading durante requisições
Mensagens de sucesso/erro para ações
Botão de logout
Proteção de rota (apenas usuários autenticados)



Requisitos do Frontend:
Interface responsiva (mobile, tablet, desktop)
Estados de loading visíveis
Tratamento de erros com feedback visual
Validação de formulários
Proteção de rotas (redirecionamento se não autenticado)

5. Testes (Obrigatório)
Você deve implementar testes automatizados:
Testes de Backend (Obrigatório):
Testes de integração para endpoints da API
Testar autenticação (registro, login, token inválido)
Testar CRUD de tarefas
Testar isolamento de dados entre usuários
Usar Jest + Supertest ou similar
Testes de Frontend (Diferencial):
Testes de componentes com React Testing Library
Testar formulários e validações
Testar fluxos de autenticação
Cobertura mínima esperada: 60% dos endpoints da API

6. Documentação (Obrigatório)

README.md deve conter:
Descrição do projeto
Tecnologias utilizadas
Pré-requisitos (Node.js, MySQL, etc.)
Instruções detalhadas de instalação
Como criar e configurar o banco de dados
Como configurar variáveis de ambiente
Como rodar o projeto localmente
Como rodar os testes
Estrutura de pastas do projeto
Decisões técnicas importantes
Melhorias futuras
API.md deve conter:
Documentação completa de todos os endpoints:
URL e método HTTP
Descrição do endpoint
Headers necessários
Parâmetros (query, path, body)
Exemplo de requisição (curl ou JSON)
Exemplo de resposta (sucesso e erro)
Códigos de status HTTP possíveis
Exemplo de documentação de endpoint:

Markdown


### POST /api/auth/login

Autentica um usuário e retorna um token JWT.

**Headers:**
- Content-Type: application/json

**Body:**
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}

**Resposta de Sucesso (200):**
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "usuario@exemplo.com"
  }
}

**Resposta de Erro (401):**
{
  "error": "Email ou senha inválidos"
}


Diferenciais
Os seguintes itens não são obrigatórios, mas serão considerados diferenciais na avaliação:
Arquitetura e Qualidade
Utilização de ORM (Prisma ou Drizzle) para interagir com o banco de dados
Validação de entrada com Zod em todos os endpoints
Uso de React Hook Form para formulários
Gerenciamento de estado com TanStack Query ou Context API
Arquitetura em camadas (controllers, services, repositories)
Padrões de design aplicados
TypeScript rigoroso (evitando any)
Funcionalidades Extras
Sistema de refresh token
Paginação na listagem de tarefas
Busca e filtros avançados
Ordenação de tarefas (por data, status, etc.)
Dark/Light Mode com persistência
Testes E2E com Playwright ou Cypress
Cobertura de testes acima de 80%
DevOps e Documentação
Arquivo docker-compose.yml para orquestrar banco de dados e aplicação
Documentação interativa da API com Swagger/OpenAPI
Scripts de migração do banco de dados
CI/CD com GitHub Actions
Deploy da aplicação (Vercel, Railway, Render, etc.)
Critérios de Avaliação
Sua solução será avaliada com base nos seguintes critérios:

Critério
Descrição
Peso
Funcionalidade
A aplicação atende todos os requisitos obrigatórios?
Alto
Backend/API
A API está bem estruturada e segue boas práticas REST?
Alto
Segurança
Implementação correta de autenticação e proteção de dados?
Alto
Testes
Possui testes automatizados com boa cobertura?
Alto
Banco de Dados
Schema bem projetado e queries otimizadas?
Médio
Qualidade do Código
Código limpo, organizado e manutenível?
Alto
Frontend/UX
Interface intuitiva e responsiva?
Médio
Documentação
Documentação clara e completa?
Alto
Diferenciais
Implementou funcionalidades extras?
Baixo


Instruções de Entrega

1. Desenvolvimento

Crie um novo repositório público no GitHub ou GitLab
Desenvolva a solução seguindo os requisitos
Faça commits frequentes e com mensagens descritivas (conventional commits)
Mantenha um histórico de commits limpo e organizado

2. Estrutura do Repositório

Seu repositório deve conter:

Plain Text


projeto/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   └── tasks/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── dashboard/page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   └── middleware.ts
│   └── types/
├── tests/
│   ├── api/
│   │   ├── auth.test.ts
│   │   └── tasks.test.ts
│   └── components/
├── database/
│   └── schema.sql
├── .env.example
├── README.md
├── API.md
├── package.json
├── tsconfig.json
└── jest.config.js (ou vitest.config.ts)


3. Arquivos Obrigatórios

✅ README.md - Documentação completa do projeto
✅ API.md - Documentação completa da API
✅ .env.example - Template de variáveis de ambiente
✅ database/schema.sql - Schema do banco de dados
✅ package.json - Dependências e scripts
✅ Testes automatizados na pasta tests/ ou __tests__/

4. Envio

Envie o link do repositório público para o e-mail fornecido no processo seletivo com:
Assunto: Desafio Full Stack - [Seu Nome]
Corpo do e-mail:
Link do repositório público (GitHub/GitLab)
Link da aplicação em produção (se fez deploy)
Instruções especiais, se houver
Tempo aproximado gasto no desafio
Comentários sobre decisões técnicas importantes

Importante: O repositório deve ser público e acessível sem necessidade de permissões.

Prazo

Você terá 10 dias corridos a partir do recebimento deste desafio para enviar sua solução.

Dúvidas

Caso tenha dúvidas sobre o desafio, entre em contato através do e-mail fornecido no processo seletivo.
Exemplo de Fluxo da Aplicação

1.Usuário acessa /register e cria uma conta

2.Sistema valida dados e armazena usuário no banco com senha hasheada

3.Usuário é redirecionado para /login

4.Após login, sistema valida credenciais e retorna JWT token

5.Token é armazenado no cliente (localStorage, cookie ou state)

6.Usuário acessa /dashboard (rota protegida)

7.Frontend faz requisição para GET /api/tasks com token no header Authorization

8.Backend valida token, extrai user_id e retorna apenas tarefas daquele usuário

9.Usuário pode criar, editar e deletar suas tarefas

10.Todas as ações passam por validação e autenticação
Boas Práticas Esperadas
Durante o desenvolvimento, esperamos que você demonstre:

Backend:
Separação de responsabilidades (routes, controllers, services)
Middleware de autenticação reutilizável
Validação de entrada de dados
Tratamento adequado de erros
Queries SQL seguras (prepared statements ou ORM)
Logs apropriados
Códigos HTTP semânticos
Frontend:
Componentização adequada
Hooks customizados para lógica reutilizável
Gerenciamento de estado apropriado
Feedback visual para ações do usuário
Tratamento de erros
Loading states
Responsividade
Geral:
Commits semânticos e bem descritos
Código limpo e legível
Comentários onde necessário
TypeScript bem tipado
Testes bem estruturados
Documentação clara
Recursos Úteis
Documentação do Next.js
Documentação do MySQL
JWT.io
bcrypt.js
Prisma Docs
Drizzle ORM
Zod Validation
Jest Testing
Supertest
React Testing Library
Dicas Importantes
Comece pelo backend e banco de dados antes do frontend
Teste seus endpoints com Postman ou Insomnia antes de integrar
Implemente autenticação primeiro, depois as funcionalidades
Escreva testes enquanto desenvolve, não deixe para o final
Documente conforme avança, não deixe para o final
Faça commits frequentes com mensagens claras
Não commite arquivos .env com credenciais reais
Use o .env.example para documentar variáveis necessárias
Teste a aplicação do zero seguindo seu próprio README antes de enviar
O Que NÃO Fazer
❌ Usar APIs externas ou fake APIs (você deve criar sua própria API)
❌ Copiar código de tutoriais sem entender e adaptar
❌ Commitar credenciais ou tokens no repositório
❌ Deixar endpoints sem autenticação
❌ Armazenar senhas em texto plano
❌ Ignorar tratamento de erros
❌ Enviar sem testes
❌ Enviar sem documentação
❌ Criar repositório privado
Checklist Antes de Enviar
Todos os endpoints da API funcionam corretamente
Sistema de autenticação está completo e seguro
Senhas estão sendo hasheadas
Usuários só acessam suas próprias tarefas
Frontend está responsivo
Testes estão implementados e passando
README.md está completo com instruções claras
API.md documenta todos os endpoints
.env.example está incluído
schema.sql está incluído
Repositório é público
Não há credenciais commitadas
Testei seguindo as instruções do README do zero
Boa sorte! Estamos ansiosos para ver sua solução!

