# CRUD de Produtos com Imagens Locais

Este é um projeto de exemplo para gerenciar produtos com funcionalidades de CRUD (Criar, Ler, Atualizar e Deletar) e suporte para upload de imagens locais. O projeto utiliza Node.js, Express, MySQL e Multer para o backend, e HTML, CSS e JavaScript para o frontend.

## Funcionalidades

- Listagem de produtos.
- Criação de novos produtos com upload de imagens.
- Edição de produtos existentes, incluindo a atualização ou remoção de imagens.
- Exclusão de produtos.
- Carrinho de compras no frontend para simulação de compras.

## Estrutura do Projeto



## Pré-requisitos

- Node.js (v16 ou superior)
- MySQL
- Gerenciador de pacotes npm ou yarn

## Configuração

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd crud_img



2. Instale as dependências:
   npm install


3. Configure o arquivo .env com as variáveis de ambiente:

DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco

4. Crie o banco de dados MySQL e a tabela products:

CREATE DATABASE nome_do_banco;
USE nome_do_banco;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
);

5. Inicie o servidor:

npm start
