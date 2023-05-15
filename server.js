const express = require('express');
const app = express();
const path = require('path');
const signup = require('./src/routes/index');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const receiptsRouter = require('./src/routes/recipes-route') 
const mainRecipes = require('./src/routes/main-recipes') 
const favoritesRecipes = require('./src/routes/favorites-recipe') 

//Inicializaciones
require('./src/db/connectDB');
require('./src/passport/local-auth');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
//se almacena en una sesión
app.use(passport.session());

// Rutas
app.use('/api/HOME', signup);
app.use('/', signup); // Puedes ajustar esta ruta según tus necesidades
app.use(express.static(path.join(__dirname, 'public')));

// Ruta default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/HOME.html'));
});

//midleware para leer el body en el post y put como req.body
app.use(express.json())

app.use('/api/recetas',receiptsRouter);
app.use('/api/main',mainRecipes);
app.use('/api/favorites',favoritesRecipes);

//Starting Server
app.listen(app.get('port'), ()=>{
  console.log('Server on port', app.get('port'));
})