const express = require('express');
const path = require('path');

const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session); //возвращает функцию которую мы должны вызвать и передать пакет для синхронизации, после этого вернет класс, кот можно в дальнейшем использовать
const csrf = require('csurf');
const flash = require('connect-flash')

const { database: { url:mongodb_uri } } = require('./config')

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const aboutRoutes = require('./routes/about');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const User = require('./models/user');

//middlewares
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file');
const errorHandler = require('./middleware/error');

const app = express(); // server
const PORT = process.env.PORT || 3000;

const store = new MongoStore({
    collection: 'sessions', //table in DB
    uri: mongodb_uri
});

// настройка handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'// название движка то что в engine , по умолчанию 'handlebars'
});

app.engine('hbs', hbs.engine); // регистрируем в экспресс движок
app.set('view engine', 'hbs'); // использум в экспресс движкок
app.set('views', 'view'); // назвние папки, где будут лежать все наши шаблоны, по умолчанию это 'views'

// сделали папку статической
app.use(express.static(path.join(__dirname, 'public')));

//
app.use(express.urlencoded({extended: true}));

//session
app.use(session({
    secret: 'somesecret value',
    resave: false,
    saveUninitialized: false,
    store
})); // теперь доступно req.session

app.use(fileMiddleware.single('avatar'));

//csurf (after session)
app.use(csrf());

//connect-flash
app.use(flash());

//middlewares use
app.use(varMiddleware);
app.use(userMiddleware);

// регистрация роутов
app.use('/', homeRoutes); // первым параметром это перфиксы, которые будут добавляться к роутам этого главного роута
app.use('/about', aboutRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

//middlewares 404
app.use(errorHandler);// подключаем в конце чтобы express если не найдет роут взял этот

async function start() {
    try {
        await mongoose.connect(mongodb_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }); // конектимся к базе

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (err) {
        console.log(`Server ERROR: ${err}`);
    }

}

start();
