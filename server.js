const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 🔁 Redireciona automaticamente do domínio padrão da Render para o domínio personalizado
app.use((req, res, next) => {
  if (req.headers.host === 'portal-amlv-render.onrender.com') {
    return res.redirect(301, 'https://portal.amlvadvocacia.com.br' + req.url);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
