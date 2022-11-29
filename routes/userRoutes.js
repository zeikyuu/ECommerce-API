const express = require("express");
const router = express.Router();
const User =  require("../models/User.js");
const userController =  require("../controllers/userController.js");
const orderController =  require("../controllers/orderController.js");
const cartController = require("../controllers/cartController.js");
const auth = require("../auth.js")


router.post("/register", (request, response) => {
	userController.registerUser(request.body)
	.then(resultFromController => response.send(resultFromController));
});


router.post("/checkEmail", (request, response) => {
	userController.checkEmail(request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.post("/login", (request, response) => {
	userController.loginUser(request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.post("/checkout", auth.verify , (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	orderController.createOrder(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.get("/details", auth.verify, (request, response) => {
	userController.getUserDetails(auth.decode(request.headers.authorization).id)
	.then(resultFromController => response.send(resultFromController));
});

router.put("/setAsAdmin/:newAdminUserId", auth.verify, (request, response) => {
	let isAdmin = auth.decode(request.headers.authorization).isAdmin

	userController.addAdmin(isAdmin, request.params.newAdminUserId)
	.then(resultFromController => response.send(resultFromController));
});

router.get("/myOrders", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	orderController.getMyOrders(customer)
	.then(resultFromController => response.send(resultFromController));
});

router.get("/orders", auth.verify, (request, response) => {
	let isAdmin = auth.decode(request.headers.authorization).isAdmin;

	orderController.getAllOrders(isAdmin)
	.then(resultFromController => response.send(resultFromController));
});

router.post("/addToCartMany", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin	
	}

	cartController.addToCartMany(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.get("/viewcart", auth.verify, (request, response) => {
	let customer ={
		fullName: auth.decode(request.headers.authorization).fullName,
		userId: auth.decode(request.headers.authorization).id,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	cartController.viewCart(customer)
	.then(resultFromController => response.send(resultFromController));
});

router.put("/updateAccountInfo", auth.verify, (request, response) => {
	let userId = auth.decode(request.headers.authorization).id;

	userController.updateAccountInfo(userId, request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.put("/changePassword", auth.verify, (request, response) => {
	let userId = auth.decode(request.headers.authorization).id;

	userController.changePassword(userId, request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.delete("/deactivate", auth.verify, (request, response) => {
	let userId = auth.decode(request.headers.authorization).id;

	userController.deactivateAccount(userId, request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.post("/addToCart", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName
	}

	cartController.addToCart(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.put("/carts/update", (request, response) => {
	cartController.updateCart(request.body)
	.then(resultFromController => response.send(resultFromController));
});

router.delete("/carts/clearcart", auth.verify, (request, response) => {
	cartController.clearCart(auth.decode(request.headers.authorization).id)
	.then(resultFromController => response.send(resultFromController));
});


module.exports = router;