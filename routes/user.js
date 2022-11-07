const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const userController = require("../controllers/userController.js");
const auth = require("../auth.js");
const orderController = require("../controllers/orderController.js")


router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
})


router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
})


router.post("/checkout", auth.verify, (req, res) => {
	orderController.createOrder(req.body).then(resultFromController => res.send(resultFromController));
})


router.get("/userDetails/:userId", auth.verify, (req, res) => {
	userController.getUserDetails(req.params.userId)
	.then(resultFromController => res.send(resultFromController));
});

router.get("/all", (req, res) => {
	userController.getAllUsers().then(resultFromController => {
		res.send(resultFromController)
	})
})


module.exports = router;