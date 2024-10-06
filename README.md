# PetConnect

PetConnect é uma API para facilitar o processo de adoção e doação de pets, oferecendo uma plataforma para que usuários possam cadastrar, buscar e adotar animais.

## Índice

- [Instalação](#instalação)
- [Rotas da API](#rotas-da-api)
- [Dependências](#dependências)

## Instalação

Para instalar e rodar a aplicação localmente:

1. Clone este repositório:

   ```bash
   git clone https://github.com/seuusuario/petconnect.git
   ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure as variáveis de ambient:

    ```env
    MONGO=your_key
    JWTKEY=your_key
    FIREBASE_KEY =your_key
    ```

## Rotas da API

### User 

| Método | Endpoint                         | Descrição                              |
|--------|----------------------------------|----------------------------------------|
| POST   | `/users/register`                | Cria um novo usuário                   |
| POST   | `/users/login`                   | Autentica um usuário                   |
| GET    | `/users/:userId`                 | Retorna as informações de um usuário   |
| PATCH  | `/users/:userId`                 | Atualiza os dados de um usuário        |
| DELETE | `/users/:userId`                 | Deleta um usuário                      |
| POST   | `/users/:userId/profilePic`      | Adiciona ou atualiza a foto de perfil  |
| PATCH  | `/users/:userId/profilePic`      | Atualiza a foto de perfil do usuário   |
| DELETE | `/users/:userId/profilePic`      | Deleta a foto de perfil de um usuário  |


### Pet 

| Método | Endpoint                              | Descrição                                        |
|--------|---------------------------------------|--------------------------------------------------|
| GET    | `/pets/searchAll`                     | Retorna todos os pets disponíveis para adoção    |
| POST   | `/pets/register`                      | Cadastra um novo pet, com até 5 imagens          |
| GET    | `/pets/:petId`                        | Retorna informações de um pet específico         |
| PATCH  | `/pets/:petId`                        | Atualiza as informações de um pet específico     |
| DELETE | `/pets/:petId`                        | Deleta um pet específico                         |
| PATCH  | `/pets/:petId/adoption-request`       | Adiciona uma solicitação de adoção para um pet   |
| DELETE | `/pets/:petId/adoption-request`       | Remove uma solicitação de adoção para um pet     |
| POST   | `/pets/:petId/picture`                | Adiciona novas fotos ao perfil do pet            |
| DELETE | `/pets/:petId/picture`                | Deleta uma foto específica do perfil do pet      |


### Chat 

| Método | Endpoint                             | Descrição                                       |
|--------|--------------------------------------|-------------------------------------------------|
| POST   | `/chats/createChat`                  | Cria um novo chat entre dois usuários           |
| POST   | `/chats/:chatId`                     | Adiciona uma nova mensagem a um chat            |
| GET    | `/chats/:chatId`                     | Retorna todas as mensagens de um chat           |
| DELETE | `/chats/:chatId`                     | Deleta um chat específico                       |
| GET    | `/chats/preview/:userId`             | Retorna uma prévia de todos os chats do usuário |

## Dependencies

- **bcrypt**: `^5.1.1` - Biblioteca para hashing de senhas.
- **dotenv**: `^16.4.5` - Carrega variáveis de ambiente de um arquivo `.env`.
- **express**: `^4.21.0` - Framework web para Node.js.
- **firebase**: `^10.14.0` - SDK do Firebase para interações com serviços como Firestore e Storage.
- **jsonwebtoken**: `^9.0.2` - Biblioteca para gerar e verificar tokens JWT.
- **mongoose**: `^8.7.0` - ODM (Object Data Modeling) para MongoDB e Node.js.
- **multer**: `^1.4.5-lts.1` - Middleware para lidar com uploads de arquivos.
- **nodemon**: `^3.1.7` - Utilitário para reiniciar automaticamente o servidor durante o desenvolvimento.
- **sharp**: `^0.33.5` - Biblioteca para processamento de imagens.
- **uuid**: `^10.0.0` - Biblioteca para gerar IDs únicos.
