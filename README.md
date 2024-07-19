# Sistema de Agendamento de Vacinas - Programa de Estágio PINTANG

## Visão Geral

Este projeto foi desenvolvido para a etapa final do programa de contratação de estagiários da PITANG. O desafio consiste na criação de um sistema de agendamento de vacinas que consiste em consiste em uma aplicação frontend para agendamentos e uma API backend para lidar com o armazenamento e processamento dos dados.

### Funcionalidades

#### Frontend
- **Agendamento de Consultas:** Permite aos usuários agendar consultas de vacinação fornecendo seu nome, data de nascimento, e data e hora do agendamento.
- **Visualização de Consultas:** Exibe uma lista de agendamentos agrupados por dia e hora.
- **Edição e Exclusão de Agendamentos:** Usuários podem atualizar o status do agendamento ou excluí-lo.
- **Persistência de Dados:** Garante que os dados dos agendamentos não sejam perdidos ao recarregar a página, através da implementação do local storage.
- **Validação:** Utiliza React Hook Forms com ZOD para validação dos formulários.
- **Gerenciamento de Datas:** Utiliza react-datepicker para seleção de datas.
- **Context API:** Gerencia a exibição de modais/popups.

#### Backend
- **Endpoints da API:** Fornece endpoints para criar, ler, atualizar e deletar agendamentos.
- **Armazenamento de Dados em Memória:** Armazena os dados dos agendamentos em memória para simplicidade.

### Regras de Uso

1. **Agendamento de Consultas:**
   - Os agendamentos são feitos através de um formulário.
   - Cada dia possui 20 vagas disponíveis.
   - Cada hora pode acomodar 2 agendamentos.
   - Os agendamentos são espaçados com um intervalo de uma hora.

2. **Detalhes do Agendamento:**
   - Campos obrigatórios: nome do paciente, data de nascimento, data e hora do agendamento.
   - Os agendamentos são armazenados em memória.
   - Ao concluir o agendamento, uma mensagem de confirmação é exibida em um modal.
   - A página de listagem de agendamentos permite marcar consultas como realizadas e registrar conclusões.

### Estrutura do Projeto

- **Repositório Frontend:** [Vaccine Scheduler Frontend](https://github.com/LucasSBarros/PITANG-Vaccine-Scheduler-Frontend.git)
- **Repositório Backend:** [Vaccine Scheduler Backend](https://github.com/LucasSBarros/PITANG-Vaccine-Scheduler-Backend.git)

### Iniciando o Projeto

#### Pré-requisitos

- Node.js
- npm
- Git

#### Clonando os Repositórios

```sh
# Clonar o repositório do frontend
git clone https://github.com/LucasSBarros/PITANG-Vaccine-Scheduler-Frontend.git

# Clonar o repositório do backend
git clone https://github.com/LucasSBarros/PITANG-Vaccine-Scheduler-Backend.git
```

#### Configurando o Frontend

1. Navegue até o diretório do frontend:

```sh
cd PITANG-Vaccine-Scheduler-Frontend
```

2. Instale as dependências:

```sh
npm install
```

3. Inicie o servidor de desenvolvimento do frontend:

```sh
npm run dev
```

A aplicação frontend estará rodando em `http://localhost:5173`.

#### Configurando o Backend

1. Navegue até o diretório do backend:

```sh
cd PITANG-Vaccine-Scheduler-Backend
```

2. Instale as dependências:

```sh
npm install
```

3. Inicie o servidor do backend:

```sh
npm run dev
```

A API backend estará rodando em `http://localhost:3000`.

### Testes

- **Frontend:** Utiliza React Testing Library para testes de componentes.
- **Backend:** Utiliza Jest para realização dos testes.

---

Para mais detalhes e a documentação completa, consulte os respectivos repositórios no GitHub.

