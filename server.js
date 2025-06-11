const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// ✅ Redireciona para domínio oficial SOMENTE na página principal
app.use((req, res, next) => {
  if (req.headers.host === 'portal-amlv-render.onrender.com' && req.url === '/') {
    return res.redirect(301, 'https://portal.amlvadvocacia.com.br');
  }
  next();
});

// ✅ Servir arquivos estáticos da pasta public (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Rota da página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Rota da dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ✅ Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(__dirname + '/public/dashboard.html');
});

