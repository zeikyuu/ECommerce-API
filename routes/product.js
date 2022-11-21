const express = require("express");
const router = express.Router();


const Product =  require("../models/Product.js");
const productController =  require("../controllers/productController.js");
const auth = require("../auth.js");



router.post("/create", auth.verify, (request, response) => {
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	productController.addProduct(request.body, isAdmin)
	.then(resultFromController => response.send(resultFromController));
});



router.get("/All", (req, res) => {
	productController.getAllProducts().then(resultFromController => {
		res.send(resultFromController);
	})
})




router.get("/active", (request, response) => {
	productController.getActiveProducts()
	.then(resultFromController => response.send(resultFromController));
});



router.get("/:productId", (request, response) => {
	productController.getProductDetails(request.params.productId)
	.then(resultFromController => response.send(resultFromController));
});



router.patch("/update/:productId", auth.verify, (request, response) => {
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	productController.updateProduct(request.params.productId, isAdmin, request.body)
	.then(resultFromController => response.send(resultFromController));
});


router.patch("/archive/:productId", auth.verify, (request, response) => {
	const isAdmin = auth.decode(request.headers.authorization).isAdmin;
	productController.archiveProduct(request.params.productId, isAdmin)
	.then(resultFromController => response.send(resultFromController));
});



module.exports = router;