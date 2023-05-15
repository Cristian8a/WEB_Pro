const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const User = require('../db/usuarios');
const { validarBody,authStrict } = require("../middlewares/recipes.js");
const { MainRecipe } = require("../db/mainRecipes.js");
const nanoid = require("nanoid");

// Ruta default
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Public/HOME.html'));
  });

//ruta para registrarse
router.get('/signup', (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../Public/signup.html'));
});

//escuchar datos en ruta para registrarse
router.post('/signup', passport.authenticate('local-signup', {
    /*mofidicar para que se vaya al perfil del usuario */
    successRedirect: '/profile',
    failRedirect: '/signup',
    passReqToCallback: true
}));

//ruta para logearse
router.get('/login', (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../Public/login.html'));
});

//escuchar datos en ruta para logearse
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    passReqToCallback: true
}));
   
router.get('/logout', (req, res) => {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });

router.get('/profile', isAuthenticated,(req, res, next)=>{
    res.sendFile(path.join(__dirname, '../Public/profile.html'));
});

router.delete('/profile/delete', isAuthenticated, (req, res) => {
    User.findOneAndDelete({ _id: req.user.id }, (err, user) => {
      if (err) {
        console.error(err);
        // Maneja el error si ocurre al eliminar el usuario
        res.status(500).json({ message: 'Error al eliminar el usuario' });
      } else {
        // Eliminación exitosa
        // Desconecta al usuario utilizando req.logout()
        req.logout();
        res.json({ message: 'Usuario eliminado correctamente' });
      }
    });
});


//Middleware
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/login')
  }



module.exports = router;
