// Login de usuario      202104221203     GACC
const express = require('express');
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }));

//Middleware que revisa si el usuario está logeado
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.get('/', (req, res) => {
    res.redirect('/secret');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);

    const user = new User({
        username,
        password: hash
    });
    await user.save();

    //Usuario válido, se guarda el id en variable de sesión
    //Se guarda el Id por si se tiene que buscar al usuario
    req.session.user_id = user._id;
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
        req.session.user_id = user._id;    //ERROR
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;

    //También se puede usar, para destruir todo lo que se tenga en la sesión
    // req.session.destroy();
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.render('secret');
});

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('TOP SECRET !!');
});

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
});

