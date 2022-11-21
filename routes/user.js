
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



router.post("/login", (request, response) => {
	userController.loginUser(request.body)
	.then(resultFromController => response.send(resultFromController));
});



router.get("/userDetails/:userId", auth.verify, (request, response) => {
	userController.getUserDetails(request.params.userId)
	.then(resultFromController => response.send(resultFromController));
});



router.get("/all", (req, res) => {
	userController.getAllUsers().then(resultFromController => {
		res.send(resultFromController)
	})
})






router.post("/checkout", auth.verify , (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}

	orderController.createOrder(customer, request.body)
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



router.post("/addToCart", auth.verify, (request, response) => {
	let customer = {
		userId: auth.decode(request.headers.authorization).id,
		fullName: auth.decode(request.headers.authorization).fullName,
		isAdmin: auth.decode(request.headers.authorization).isAdmin	
	}

	cartController.addToCart(customer, request.body)
	.then(resultFromController => response.send(resultFromController));
});



router.get("/viewCart", auth.verify, (request, response) => {
	let customer ={
		fullName: auth.decode(request.headers.authorization).fullName,
		userId: auth.decode(request.headers.authorization).id,
		isAdmin: auth.decode(request.headers.authorization).isAdmin
	}
	cartController.viewCart(customer)
	.then(resultFromController => response.send(resultFromController));
});


router.get("/details", auth.verify, (req, res) => {
	// We can get the token by accessing req.headers.authorization
	const userData = auth.decode(req.headers.authorization)

	userController.getProfile({userId : userData.id}).then(resultFromController => res.send(resultFromController));
})


router.post("/checkEmail", (req, res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
})





module.exports = router;