const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'segredo-seguro',
  resave: false,
  saveUninitialized: true
}));

// Página inicial → login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Autenticação de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (email === 'teste@amlvadvocacia.com.br' && senha === '123456') {
    req.session.usuario = email;
    res.redirect('/dashboard');
  } else {
    res.send('Credenciais inválidas');
  }
});

// Página protegida
app.get('/dashboard', (req, res) => {
  if (!req.session.usuario) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Portal AMLV rodando na porta ${port}`);
});
