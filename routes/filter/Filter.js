const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// importing middlewares
const FetchUser = require("../../middlewares/FetchUser");

// importing models
const User = require("../../models/User");
const Product = require("../../models/Product");

// route :: get filter product
router.get('/byprice', async (req, res) => {
  try {

    let maxValue =(req.query.max);
    let minValue =(req.query.min);
    let filter = {
      results: {},
      next: null,
      previous: null,
    };

    let query = {};
    if ( !maxValue || !minValue)
    {
        res.status(200).json({msg:"values are missing"});
    }
    else   {
      query = {
       price : { $gte: minValue , $lte :maxValue},
      };
    }
    filter.results = await Product.find( query);
    res.status(200).json(filter.results);
  } catch (error) {
    console.log(error.message);
    res.status(200).json({ success: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
