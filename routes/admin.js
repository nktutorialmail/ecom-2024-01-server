// import
const express = require("express");
const router = express.Router();

const { authCheck } = require("../middlewares/authCheck");
const { changeOrderStatus, getOrderAdmin } = require("../controllers/admin");

// router
router.put("/admin/order-status", authCheck, changeOrderStatus);
router.get("/admin/order", authCheck, getOrderAdmin);

// export
module.exports = router;