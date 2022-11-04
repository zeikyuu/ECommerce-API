const Product = require("../models/Product");

// Add Product
module.exports.addProduct = (data) => {
	if(data.isAdmin){
		let newProduct = new Product({
			name: data.product.name,
			description: data.product.description,
			price: data.product.price
		})
		return newProduct.save()
		.then((newProduct, error) =>{
			if(error){
				return "An error occured!";
			}else{
				return newProduct;
			}
		})
	}

	let message = Promise.resolve('User must be ADMIN to access this :P');
	return message.then((value) =>{
		return value;
	})
}


// Getting all products
module.exports.getAllProducts = () => {
	return Product.find({}).then(res => {
		return res;
	})
}


// Getting all active Products
module.exports.getActiveProducts = () => {
	return Product.find({isActive: true}).then (res => {
		return res;
	})
}