// import
const express = require("express");
const router = express.Router();

const { create, list, remove } = require("../controllers/category");

const { authCheck, adminCheck } = require("../middlewares/authCheck")

// router
router.get("/category", list);
router.post("/category",authCheck, adminCheck, create);
router.delete("/category/:id",authCheck, adminCheck, remove);


// export
module.exports = router;