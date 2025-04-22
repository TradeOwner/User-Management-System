const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jerlibee'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Mock data storage
let cart = [];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);

    const sql = `
        SELECT userid, password, position 
        FROM user_management 
        WHERE userid = ?
    `;

    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            if (password === results[0].password) {
                const userRole = results[0].position;
                req.session.user = { username, role: userRole }; // Save the username and role in session

                res.json({ success: true, role: userRole });
                cart = [];
                console.log('Login successful');
            } else {
                res.json({ success: false, message: 'Invalid password' });
                console.log('Invalid password');
            }
        } else {
            res.json({ success: false, message: 'User not found' });
            console.log('User not found');
        }
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};


const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};

const isManagerOrAdmin = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'manager')) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Managers or Admins only' });
    }
};


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.listen(port, () => {
    console.log('Server running on port ${ port }');

});

