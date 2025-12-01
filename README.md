# Sistema de Controle de Inventário de Switches

Este projeto consiste em uma aplicação web Full Stack para gerenciamento de estoque de equipamentos de rede (Switches). O sistema permite o cadastro, edição, remoção e visualização de equipamentos, incluindo upload de fotos do ativo, controle de status operacional (Ativo/Manutenção), validação de condição física e registro de logs de auditoria de acesso.

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

```bash
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
O servidor iniciará em http://0.0.0.0:5000 (Acessível localmente e via rede).

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
Acesse a aplicação no navegador em http://localhost:5173.

## 📱 Acesso via Rede Local (Mobile/Outros PCs)
Para acessar o sistema através de outros dispositivos na mesma rede Wi-Fi (como celulares para testar a câmera ou tablets), é necessário configurar o IP da máquina servidora.

1. Descubra o IP da sua máquina:
    * No terminal Linux, execute:
    ```bash
    ip addr show | grep "inet " | grep -v 127.0.0.1
    ```
    Procure um endereço como `192.168.0.X` ou `192.168.1.X` (geralmente na interface `wlan0` ou `eth0`).

2. Configurar o Front-end para Usar o IP:
    * Edite o arquivo frontend/src/services/api.js:
    ```javascript
    import axios from 'axios';
    
    const api = axios.create({
        // Substitua 192.168.0.14 pelo IP da sua máquina
        baseURL: 'http://192.168.0.14:5000/api',
        headers: {
            'Content-Type': 'application/json',
            },
        });
        
        export default api;
    ```

3. Configurar o Firewall (se necessário):
```bash
# Permitir tráfego nas portas 5000 e 5173
sudo ufw allow 5000/tcp
sudo ufw allow 5173/tcp

# Verificar status
sudo ufw status
```

## 🖥️ Acesso ao Projeto em Máquina Virtual
Se o projeto está rodando dentro de uma máquina virtual (VirtualBox, VMware, Hyper-V, etc.), siga estas configurações adicionais:

### Configuração de Rede da VM
### Opção 1: Rede em Modo Bridge (Recomendado)
Esta opção faz a VM aparecer como um dispositivo independente na rede local.

##### VirtualBox:
1. Acesse Configurações → Rede
2. Altere Conectado a: para Placa em modo Bridge
3. Selecione sua interface de rede física (Wi-Fi ou Ethernet)
4. Reinicie a VM

##### VMware:
1. Vá em VM → Settings → Network Adapter
2. Selecione Bridged: Connected directly to the physical network
3. Reinicie a VM

Após configurar:
```bash
# Dentro da VM, descubra o novo IP
ip addr show | grep "inet " | grep -v 127.0.0.1
```
A VM terá um IP na mesma faixa da rede local (ex: 192.168.0.25). Use este IP para acessar de qualquer dispositivo na rede.

#### Opção 2: Port Forwarding (NAT)
Se não puder usar Bridge, configure redirecionamento de portas.

##### VirtualBox:
1. Acesse Configurações → Rede → Avançado → Redirecionamento de Portas
2. Adicione as regras:

| Protocolo | Hospedeiro Porta | Hospedeiro IP | Convidado Porta | Convidado         |
|-----------|------------------|---------------|-----------------|-------------------|
| TCP       | 127.0.0.1:5000   | 10.0.2.15     | 5000            | Flask API         |
| TCP       | 127.0.0.1:5173   | 10.0.2.15     | 5173            | React Dev         |

3. Clique em OK


### Configuração no Frontend:
Edite `frontend/src/services/api.js` para usar `localhost`:
```javascript
baseURL: 'http://localhost:5000/api',
```
## Acessar:
Na máquina host: http://localhost:5173
Em outros dispositivos: Use o IP da máquina host (não da VM)

#### Opção 3: Rede Host-Only + NAT (Híbrido)
Para acesso tanto do host quanto de outros dispositivos:

#### VirtualBox:
1. Configure Adaptador 1 como NAT (para internet)
2. Configure Adaptador 2 como Placa Host-Only
3. Dentro da VM, configure a segunda interface para obter IP via DHCP

Verificando a Conectividade
```bash
# Na VM, verificar se as portas estão abertas
sudo netstat -tulpn | grep -E '5000|5173'

# Do host ou outro dispositivo, testar conexão
curl http://IP_DA_VM:5000/api/health  # Se existir endpoint de health
```

Edite o arquivo frontend/src/services/api.js.
Altere a baseURL para usar o IP descoberto em vez de localhost.
```
// Exemplo se seu IP for 192.168.0.14
baseURL: '[http://192.168.0.14:5000/api](http://192.168.0.14:5000/api)', 
```

Acesse pelo dispositivo:
No navegador do celular, digite o IP da máquina e a porta do frontend: http://192.168.0.14:5173.

Nota: Certifique-se de que o firewall do Linux (ufw/iptables) permite conexões nas portas 5000 e 5173.

## 🏗 Modelagem de Dados

Abaixo está o diagrama de classes representando as entidades principais do sistema e seus relacionamentos.
<img src="https://raw.githubusercontent.com/Navelogic/estoque-switches/refs/heads/main/docs/diagramadeclasse.png" />

## 📸 Telas do Sistema
<img src="https://raw.githubusercontent.com/Navelogic/estoque-switches/refs/heads/main/docs/printintegrador1.png" />
<img src="https://raw.githubusercontent.com/Navelogic/estoque-switches/refs/heads/main/docs/printintegrador2.png" />
<img src="https://raw.githubusercontent.com/Navelogic/estoque-switches/refs/heads/main/docs/printintegrado3.png" />
<img src="https://raw.githubusercontent.com/Navelogic/estoque-switches/refs/heads/main/docs/printintegrador4.png" />


## 📖 Como Usar

1. Registro: Acesse a aplicação e clique em "Cadastre-se" para criar seu primeiro usuário.
2. Login: Utilize as credenciais criadas para entrar.
3. Dashboard:
    * Clique em "Novo Switch" para cadastrar um equipamento.
    * Utilize o ícone de Lápis para editar status ou informações.
    * Utilize o ícone de Lixeira para remover um item.

4. Logout: Clique em "Sair" na barra superior para encerrar a sessão.
