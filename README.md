# Sistema de Controle de Inventário de Switches

Este projeto consiste em uma aplicação web Full Stack para gerenciamento de estoque de equipamentos de rede (Switches). O sistema permite o cadastro, edição, remoção e visualização de equipamentos, com controle de acesso via autenticação e registro de logs de auditoria.

O projeto foi desenvolvido como parte de um desafio técnico, visando exercitar lógica de programação, arquitetura MVC/Service Pattern e integração entre Flask e React.

---

## 🚀 Tecnologias Utilizadas

### Back-end
* **Linguagem:** Python 3.11+
* **Framework:** Flask (Microframework)
* **ORM:** SQLAlchemy (Abstração do Banco de Dados)
* **Migrações:** Flask-Migrate (Alembic)
* **Autenticação:** Werkzeug Security (Hash de senhas)

### Front-end
* **Framework:** ReactJS (Vite)
* **UI Library:** Material UI (MUI v5)
* **HTTP Client:** Axios
* **Roteamento:** React Router Dom

### Banco de Dados
* **SGBD:** MariaDB (Compatível com MySQL)
* **Driver:** Mysqlclient

---

## 📋 Pré-requisito
Para rodar este projeto em um ambiente Linux (Debian/Ubuntu), você precisará das seguintes ferramentas instaladas:

* Git
* Python 3 e pip
* Node.js (v18 ou superior) e npm
* MariaDB Server
* Bibliotecas de desenvolvimento (para compilar o driver MySQL do Python)

### Instalação de dependências do sistema (Debian/Ubuntu)
```bash
sudo apt update
sudo apt install git python3 python3-pip python3-venv mariadb-server \
pkg-config python3-dev default-libmysqlclient-dev build-essential -y
```

## 🔧 Configuração e Instalação
Siga os passos abaixo para configurar o ambiente de desenvolvimento.

### 1. Clonar o Repositório
```bash
git clone git@github.com:Navelogic/estoque-switches.git
cd estoque-switches
```

### 2. Configuração do Banco de Dados
Acesse o terminal do MariaDB e crie um banco de dados vazio.

```bash
sudo mariadb -u root -p
```
Dentro do console do banco:

```sql
CREATE DATABASE inventory_switches CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Configuração do Back-end (API)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` e configure a conexão com o banco. (Substitua `SUA_SENHA` pela senha do seu usuário root do MariaDB).

```TOML
DATABASE_URL=mysql://root:SUA_SENHA@localhost/inventory_switches
```

#### Migrações

Execute o comando para gerar as tabelas no banco de dados:

```bash
flask db upgrade
```

#### Rodar a API

```bash
python3 app.py
```
O servidor iniciará em http://127.0.0.1:5000

### 4. Configuração do Front-end

Abra um novo terminal, volte à raiz do projeto e entre na pasta do frontend.

```bash
cd frontend
npm install
```

Rodar a Aplicação Web

```bash
npm run dev
```
Acesse a aplicação no navegador em http://localhost:5173 (ou a porta indicada).


## 📖 Como Usar

1. Registro: Acesse a aplicação e clique em "Cadastre-se" para criar seu primeiro usuário.
2. Login: Utilize as credenciais criadas para entrar.
3. Dashboard:
    * Clique em "Novo Switch" para cadastrar um equipamento.
    * Utilize o ícone de Lápis para editar status ou informações.
    * Utilize o ícone de Lixeira para remover um item.

4. Logout: Clique em "Sair" na barra superior para encerrar a sessão.