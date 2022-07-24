const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const multer = require("multer");
// importing models
const Sell = require("../../models/Sell");
const Scrap = require("../../models/Scrap");
const FetchAdmin = require("../../middlewares/FetchAdmin");
const Pagination = require("../../middlewares/Pagination");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/scrap/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// routes
router.post(
  "/sell",
  [
    body("email", "Invalid Email").isEmail(),
    body("fullName", "Name Requried").isLength({ min: 2 }),
    body("phone", "Mobile Number Requried").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ success: false, msg: "Invalid Input" });
    }
    try {
      if (!req.body.type) {
        return res.status(400).json({ success: false, msg: "Type is Needed" });
      }
      // if selling(from user) is related to vechiles & automobiles
      if (req.body.type == "automobile") {
        let sell = new Sell({
          type: req.body.type,
          email: req.body.email || "",
          fullName: req.body.fullName,
          phone: req.body.phone,
          details: {
            vechileName: req.body.vechileName,
            vechileNumber: req.body.vechileNumber,
          },
        });
        let newSell = await sell.save();
        return res.status(200).json({ success: true, data: newSell });
      }
      // if selling(from user) is related to metal
      else if (req.body.type == "metal") {
        let sell = new Sell({
          type: req.body.type,
          email: req.body.email || "",
          fullName: req.body.fullName,
          phone: req.body.phone,
          details: {
            weight: req.body.weight,
            metalType: req.body.metalType,
          },
        });
        let newSell = await sell.save();
        return res.status(200).json({ success: true, data: newSell });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
  }
);

// get all the selling products
router.get("/getsell", Pagination(Sell), FetchAdmin, async (req, res) => {
  try {
    if (req.pagination) {
      return res
        .status(200)
        .json({ success: true, pagination: req.pagination });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// // get all the scrap products
// router.get("/getscrap", FetchAdmin, Pagination(Scrap), async (req, res) => {
//   try {
//     if (req.pagination) {
//       return res
//         .status(200)
//         .json({ success: true, pagination: req.pagination });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, msg: "Internal Server Error" });
//   }
// });

router.post(
  "/scrap",
  // [
  //   body("email", "Invalid Email").isEmail(),
  //   body("fullName", "Name Requried").isLength({ min: 2 }),
  //   body("phone", "Mobile Number Requried").isLength({ min: 6 }),
  // ],
  upload.single("image"),
  async (req, res) => {
    console.log(req.file.path)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(401).json({ success: false, msg: "Invalid Input" });
    // }
    try {
      if (!req.body.type || !req.file) {
        return res.status(400).json({
          success: false,
          msg: "Type is Needed or please upload image",
        });
      }

      if (req.body.type == "automobile") {
        let scrap = new Scrap({
          type: req.body.type,
          email: req.body.email || "",
          fullName: req.body.fullName,
          image: req.file.path,
          phone: req.body.phone,
          details: {
            vechileName: req.body.vechileName,
            vechileNumber: req.body.vechileNumber,
          },
        });
        let newScrap = await scrap.save();
        return res.status(200).json({ success: true, data: scrap });
      }
      // if selling(from user) is related to metal
      else if (req.body.type == "metal") {
        let scrap = new Scrap({
          type: req.body.type,
          email: req.body.email || "",
          fullName: req.body.fullName,
          image: req.file.path,
          phone: req.body.phone,
          details: {
            weight: req.body.weight,
            metalType: req.body.metalType,
          },
        });
        let newscrap = await scrap.save();
        return res.status(200).json({ success: true, data: newscrap });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
  }
);
module.exports = router;
