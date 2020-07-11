const express = require('express');

const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Card Model
const Card = require('../models/Card');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) =>{ 
try {
  const cards = await Card.find({ uid: req.user.uid }).sort({_id:-1}).limit(4);
  let broi = 0;
  const d = new Date();
  cards.forEach(card => {
    if (card.date.getMonth() == d.getMonth()){
      broi++;
    }
  });
  
  let progress = Math.floor(broi/req.user.cards*100);
  console.log(progress);
  res.render('dashboard', {
    month: d.getMonth(),
    broi: broi,
    progress: progress,
    cards
  })
} catch (err) {
  console.error(err);
  
}
});

module.exports = router;
