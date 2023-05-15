const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/usuarios');



// Solo requerimos el ID del usuario porque es lo que se intercambiara entre múltiples páginas (se autentica con el servidor) nos da el ID y se busca en la base de datos 
//Método para serializarlo (no autenticarlo cada que cambie de ruta)
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

//Método para deserializar
passport.deserializeUser(async(id, done)=>{
   await User.findById(id);
   done(null, User);
});

//Autenticación del usuario 
 passport.use('local-signup', new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password',
     passReqToCallback: true
   }, async (req, email, password, done) => {
             const newUser = new User();
             newUser.email = email;
             newUser.password = newUser.encryptPassword(password);
             await newUser.save();
             done(null, newUser);
        
   }));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({'email': email})
  console.log(user)
  if(user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
  console.log(newUser)
    await newUser.save();
    done(null, newUser);
  }
}));


   passport.use('local-login', new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password',
     passReqToCallback: true
   }, async (req, email, password, done) => {
     const user = await User.findOne({email: email});
     if(!user) {
       return done(null, false, req.flash('signinMessage', 'No User Found'));
     }
     if(!user.comparePassword(password)) {
       return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
     }
     return done(null, user);
   }));




module.exports = passport;