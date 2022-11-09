const express = require("express");
const router = express.Router();
const Order = require("../models/Order.js");
const User = require("../models/User.js")
const orderController = require("../controllers/orderController.js");
const auth = require("../auth.js");
const mongoose = require("mongoose");


// Create Order
router.post("/checkout", auth.verify, (req, res) => {
	const data = {
		userId : auth.decode(req.headers.authorization).id,
		isAdmin : auth.decode(req.headers.authorization).isAdmin,
		productId : req.body.productId,
		quantity : req.body.quantity

		}
		orderController.createOrder(data).then(resultFromController => res.send(resultFromController))
})

// GET ALL ORDERS
router.get("/", auth.verify, (req, res) => {
	const data = auth.decode(req.headers.authorization).isAdmin
	orderController.getAllOrders(data).then(resultFromController => res.send(resultFromController))
})

// router.get("/userOrders", auth.verify, (req, res) => {
// 	const data = auth.decode(req.headers.authorization)
// 	orderController.getUserOrders(data).then(resultFromController => res.send(resultFromController))
// })

module.exports = router;