const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 8000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});