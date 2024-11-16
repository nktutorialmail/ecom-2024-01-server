const express = require("express");
const router = express.Router();

const { create, list, read, update, remove, listby, searchFilters, createImages, removeImages } = require("../controllers/product");
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.get("/products/:count", list);
router.post("/search/filters", searchFilters);
router.post("/product", create);
router.delete("/product/:id", remove);
router.get("/product/:id", read);
router.put("/product/:id", update);



router.post("/productby", listby);

router.post("/createImages", authCheck, adminCheck, createImages);
router.post("/removeImages", authCheck, adminCheck, removeImages);

module.exports = router;