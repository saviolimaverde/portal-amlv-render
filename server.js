const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'amlv-portal-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Usuários de teste (em produção, usar banco de dados)
const users = [
    {
        id: 1,
        email: 'teste@amlvadvocacia.com.br',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 123456
        name: 'Cliente Teste',
        processes: [
            { id: 1, number: '001/2024', title: 'Ação Trabalhista', status: 'Em andamento', lastUpdate: '2024-06-01' },
            { id: 2, number: '002/2024', title: 'Consultoria Tributária', status: 'Concluído', lastUpdate: '2024-05-28' }
        ],
        documents: [
            { id: 1, name: 'Contrato de Prestação de Serviços.pdf', date: '2024-06-01', size: '2.3 MB' },
            { id: 2, name: 'Parecer Jurídico.pdf', date: '2024-05-28', size: '1.8 MB' }
        ],
        appointments: [
            { id: 1, title: 'Reunião de Acompanhamento', date: '2024-06-15', time: '14:00', type: 'Presencial' },
            { id: 2, title: 'Audiência Trabalhista', date: '2024-06-20', time: '09:30', type: 'Tribunal' }
        ],
        messages: [
            { id: 1, from: 'Dr. João Silva', subject: 'Atualização do Processo', date: '2024-06-05', read: false },
            { id: 2, from: 'Secretaria AMLV', subject: 'Agendamento Confirmado', date: '2024-06-03', read: true }
        ]
    }
];

// Middleware de autenticação
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
}

// Rotas
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Credenciais inválidas' });
    }
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/user', requireAuth, (req, res) => {
    const user = users.find(u => u.id === req.session.userId);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

app.get('/processes', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'processes.html'));
});

app.get('/documents', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documents.html'));
});

app.get('/appointments', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'appointments.html'));
});

app.get('/messages', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Portal AMLV rodando na porta ${PORT}`);
});

module.exports = app;

