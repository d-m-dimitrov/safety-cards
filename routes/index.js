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
  const cards = await Card.find({ uid: req.user.uid }).sort({_id:-1}).limit(4);
  let broi = 0;
  const d = new Date();
  
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

   const danger = JSON.parse(isafe[0].count);
   const safe = JSON.parse(isafe[1].count);

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

   const non = JSON.parse(risk[3].count);
   const lw = JSON.parse(risk[1].count);
   const med = JSON.parse(risk[2].count);
   const hi = JSON.parse(risk[0].count);

  
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
    cards
  })
} catch (err) {
  console.error(err);
  
}
});

module.exports = router;
