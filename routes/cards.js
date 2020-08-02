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
  const { odate, otime, area, location, locdetail, participant, activity, isitsafe, observe, oremark, risk, conseq, cremark, action, aremark, remark } = req.body;
  let errors = [];


  if (!odate || !otime || !area || !location || !locdetail || !participant || !isitsafe || !observe || !oremark  || !risk || !conseq || !action) {
    errors.push({ msg: 'Please enter all required fields' });
  }
  console.log(errors);
  if (errors.length > 0) {
    res.render('add_card', {
      errors,
      odate,
      otime,
      area,
      location,
      locdetail,
      participant,
      activity,
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
      otime,
      area,
      location,
      locdetail,
      participant,
      activity,
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


router.get('/:id', function(req, res){

  Card.findById(req.params.id, function(err, scard){
    res.render('showcard', {
      scard
    });
  });
});


router.get('/reports/area/:id', function(req, res){
  
  const d = new Date();
 // res.render('gen_report');
  Card.find({'area': req.params.id, "$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }).exec(function(err, rcards){
    res.render('gen_report', {
      title: 'Area report ('+ req.params.id +')',
      subtitle: d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear(),
      rcards
    });
  });
});

router.get('/reports/loc/:id', function(req, res){
  const d = new Date();
  
  // res.render('gen_report');
   Card.find({'location': req.params.id, "$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] }}).exec(function(err, rcards){
     res.render('gen_report', {
      title: 'Location report ('+ req.params.id +')', 
      subtitle: d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear(),
      rcards
     });
   });
 });

 router.get('/reports/safe/:id', function(req, res){
  const d = new Date();
  
  // res.render('gen_report');
   Card.find({'isitsafe': req.params.id.toLowerCase(), "$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] }}).exec(function(err, rcards){
     res.render('gen_report', {
      title: 'Safe/danger report ('+ req.params.id +')', 
      subtitle: d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear(), 
      rcards
     });
   });
 });

 router.get('/reports/risk/:id', function(req, res){
  const d = new Date();
  
  // res.render('gen_report');
   Card.find({'risk': req.params.id.toLowerCase(), "$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] }}).exec(function(err, rcards){
     res.render('gen_report', {
      title: 'Risk level report ('+ req.params.id +')', 
      subtitle: d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear(), 
      rcards
     });
   });
 });


 router.get('/reports/observe/:id', function(req, res){
  const d = new Date();
  
  // res.render('gen_report');
   Card.find({'observe': req.params.id, "$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] }}).exec(function(err, rcards){
     res.render('gen_report', {
      title: 'Observations report ('+ req.params.id +')', 
      subtitle: d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear(), 
      rcards
     });
   });
 });




module.exports = router;