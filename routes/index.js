const express = require('express');

const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Card Model
const Card = require('../models/Card');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) =>{ 

  try {
  
  let broi = 0;
  const d = new Date();
  
  const cards = await Card.find({ uid: req.user.uid,"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }).sort({_id:-1}).limit(4);

  const cardsall = await Card.find({"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }).count();
  
  const cardstotal = await User.aggregate([{ $group: { _id: null, cards: { $sum: "$cards" }}}]);
 
  const area = await Card.aggregate([
    {
      $match : {"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }
    },
    {
      $group : {
         _id :  '$area' ,

         count: { $sum: 1 }
      }
    },
    {
      $sort : { _id: 1 }
    }
   ]);

   const alabels = [];
   const adata = [];

   area.forEach(ar => {
    alabels.push(ar._id);
    adata.push(ar.count);
   });

   const location = await Card.aggregate([
    {
      $match : {"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }
    },
    {
      $group : {
         _id :  '$location' ,

         count: { $sum: 1 }
      }
    },
    {
      $sort : { _id: 1 }
    }
   ]);

   const llabels = [];
   const ldata = [];
   
   location.forEach(loc => {
    llabels.push(loc._id);
    ldata.push(loc.count);
   });
  
   

   const isafe = await Card.aggregate([
    {
      $match : {"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }
    },
    {
      $group : {
         _id :  '$isitsafe' ,

         count: { $sum: 1 }
      }
    },
    {
      $sort : { _id: 1 }
    }
   ]);

   let danger = 0;
   let safe = 0;
   isafe.forEach(isa =>{
      switch (isa._id){
        case "safe":
          safe = isa.count;
          break;
        case "danger":
          danger = isa.count;
          break;
      }
   
   });

  
 
   const risk = await Card.aggregate([
    {
      $match : {"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }
    },
    {
      $group : {
         _id :  '$risk' ,

         count: { $sum: 1 }
      }
    },
    {
      $sort : { _id: 1 }
    }
   ]);

   let non = 0;
   let lw = 0;
   let med = 0;
   let hi = 0;

   risk.forEach(ri =>{
    switch (ri._id){
      case "none":
        non = ri.count;
        break;
      case "low":
        lw = ri.count;
        break;
      case "medium":
        med = ri.count;
        break;
      case "high":
        hi = ri.count;
        break;
    }
   });




   //if (risk[3] != undefined){ non = JSON.parse(risk[3].count); }
   //if (risk[1] != undefined){ lw = JSON.parse(risk[1].count); }
   //if (risk[3] != undefined){ med = JSON.parse(risk[2].count); }
   //if (risk[3] != undefined){ hi = JSON.parse(risk[0].count); }
   //const non = JSON.parse(risk[3].count);
   //const lw = JSON.parse(risk[1].count);
   //const med = JSON.parse(risk[2].count);
   //const hi = JSON.parse(risk[0].count);

 // console.log(med);
   const observe = await Card.aggregate([
    {
      $match : {"$expr": { "$eq": [{ "$month": "$date" }, d.getMonth()+1] } }
    },
    {
      $group : {
         _id :  '$observe' ,

         count: { $sum: 1 }
      }
    },
    {
      $sort : { _id: 1 }
    }
   ]);

   
   const olabels = [];
   const odata = [];
   
   observe.forEach(ob => {
    olabels.push(ob._id);
    odata.push(ob.count);
   }); 

   


  cards.forEach(card => {
    if (card.date.getMonth() === d.getMonth()){
      broi++;
    }
  });
  

  let progress = Math.floor(broi/req.user.cards*100);
  
 
// Year report ----------------

const yrep = await Card.aggregate([
  {$group: {
      _id: {$month: "$date"}, 
      cards: {$sum: 1} 
  }}
]);

let ydata = [0,0,0,0,0,0,0,0,0,0,0,0];

yrep.forEach(yr =>{
  ydata[yr._id-1] = yr.cards
});


//console.log(yrep);

// -----------------------
    
  res.render('dashboard', {
    month: d.getMonth(),
    broi: broi,
    progress: progress,
    done: cardsall,
    remain: cardstotal[0].cards-cardsall,
    alabels: alabels,
    adata: adata,
    llabels: llabels,
    ldata: ldata,
    danger: danger,
    safe: safe,
    non: non,
    lw: lw,
    med: med,
    hi: hi,
    olabels: olabels,
    odata: odata,
    ydata: ydata,
    cards
  })
} catch (err) {
  console.error(err);
  
}
});

module.exports = router;
