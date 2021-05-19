const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const { AllCocktails, CocktailName} = require('../model/functions.js');

router.get( '/cocktails',
  asyncHandler(async (req, res) => {
    let result = await AllCocktails();
    res.status(result.status).send(result.data);
  }),
);

router.get('/cocktails/:name/zutaten',
  asyncHandler(async (req, res) => {
    let result = await CocktailName(req.params.name);
    res.status(result.status).send(result.data);
  }),
);

router.get('/cocktail/:price',
  asyncHandler(async (req, res) => {
    let result = await CocktailName(req.params.name);
    res.status(result.status).send(result.data);
  }),
)
 
router.delete('/cocktails/:name',
  asyncHandler(async (req, res) => {
    let result = await DeleteCocktail(req.params.name);
    res.status(result.status).send(result.data);
  }),
)

router.post('/cocktail',
  asyncHandler(async (req, res) => {
    let result = await AddCocktail(req.params.name);
    const {cid, cname, preis, zubereitung, kid, zgid, sgid} = req.body;
    req.status(result.status).send(result.data);
})
)




module.exports = router;