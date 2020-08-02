const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  
  const { name, email, dep, uid, level, cards, isactive, password, password2  } = req.body;
  let errors = [];
  

  if (!name || !email || !uid || !level || !cards || !isactive || !dep ) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 3) {
    errors.push({ msg: 'Password must be at least 3 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      dep,
      uid,
      level,
      cards, 
      isactive,
      //password,
      //password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          dep,
          uid,
          level,
          cards, 
          isactive
          //password,
          //password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          dep,
          uid,
          level,
          cards, 
          isactive,
          password
        });
        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered with standard password'
                );
                res.redirect('/users/showusers');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/passwords', (req, res) => res.render('passwords'));

router.post('/passwords', ensureAuthenticated,  (req, res) =>{
  if (!bcrypt.compareSync(req.body.opassword, req.user.password)){
    req.flash('error', 'Wrong password!!!');
    console.log('Wrong password');
  } else{
    const password = req.body.password;
    const password2 = req.body.password2;
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password2);

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, function(err, hash){
        if(err){
          console.log(err);
        }

        User.update({_id: req.user.id}, {$set: {password: hash}}, function(err){
          if (err){
            console.log(err);
          }
          req.flash('success', 'User password updated!');
          res.redirect('/');
        });
      });
    });
  }
});

// Show All Users Form
router.get('/showusers', function(req, res){
  User.find({}).sort('name').exec(function(err, users){
    if(err){
      throw err
      console.log(err);
    } else {
      res.render('showusers', {
        users: users
      });
    }
  });
});

router.get('/:id', function(req, res){

  User.findById(req.params.id, function(err, euser){
    res.render('edituser', {
      euser: euser
    });
  });
});

router.post('/:id', function(req, res){
  let euser = {};
  euser.name = req.body.name;
  euser.email = req.body.email;
  euser.dep = req.body.dep;
  euser.uid = req.body.uid;
  euser.level = req.body.level;
  euser.isactive = req.body.isactive;
  euser.cards = req.body.cards;

  let query = {_id:req.params.id};

  User.update(query, euser, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'User data Updated');
      res.redirect('/users/showusers');
    }
  });
});

router.delete('/:id', function(req, res){
//  if(!req.user._id){
//    res.status(500).send();
//  }

console.log(req.params.id);


  let query = {_id:req.params.id}

  User.findById(req.params.id, function(err, euser){
    euser.remove(query, function(err){
      if(err){
        console.log(err);
      }
      res.send('Success');
    });

  });
});

router.post('/clr/:id', (req, res) =>{
    
  let query = {_id:req.params.id}
  
   

    console.log(query);
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash('123', salt, function(err, hash){
        if(err){
          console.log(err);
        }

        User.updateOne(query, {password: hash}, function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'User data Updated');
            res.redirect('/users/showusers');
          }
        });
    });
  });
});


module.exports = router;
