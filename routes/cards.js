const express = require('express');
const router = express.Router();

// Card Model
const Card = require('../models/Card');
const { ensureAuthenticated } = require('../config/auth');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_card');
});

router.post('/add', ensureAuthenticated, async (req, res) => {
  //console.log(req.body);
  const uid = req.user.uid;
  const { odate, area, location, locdetail, participant, isitsafe, observe, oremark, risk, conseq, cremark, action, aremark, remark } = req.body;
  let errors = [];


  if (!odate || !area || !location || !locdetail || !participant || !isitsafe || !observe || !oremark  || !risk || !conseq || !action) {
    errors.push({ msg: 'Please enter all required fields' });
  }
  console.log(errors);
  if (errors.length > 0) {
    res.render('add_card', {
      errors,
      odate,
      area,
      location,
      locdetail,
      participant,
      isitsafe, 
      observe,
      oremark,
      risk,
      conseq,
      cremark,
      action,
      aremark,
      remark
    });
  } else {
    const newCard = new Card({
      uid,
      odate,
      area,
      location,
      locdetail,
      participant,
      isitsafe,
      observe,
      oremark,
      risk,
      conseq,
      cremark,
      action,
      aremark,
      remark
    });
    newCard.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','News card added');
        res.redirect('/dashboard');
      }
    });
  }
});

module.exports = router;