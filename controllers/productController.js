const bcrypt = require("bcrypt");
const auth = require("../auth.js");


const Product = require("../models/Product.js");


module.exports.addProduct = (requestBody, isAdmin) => {

	if (isAdmin) {
		let newProduct = new Product({
			name: requestBody.name,
			description: requestBody.description,
			category: requestBody.category,
			price: requestBody.price
		})

		return newProduct.save()
		.then((newProduct, error) => {
			if (error) {
				return false;
			}

			return true;
		});
	}else{
		// IF NOT ADMIN
		let message = Promise.resolve(`User must be an admin to create product.`);

		return message.then((value) => {
			return value;
		});
	}

};



module.exports.getAllProducts = () => {
	return Product.find({}).then(res => {
		return res;
	})
}



module.exports.getActiveProducts = () => {
	return Product.find({isActive: true}).then(result => {
		return result
	})
};


module.exports.getProductDetails = (productId) => {

	return Product.findById(productId)
	.then(result => {
		if(result == null){
			return `Product not found.`;
		}else{
			return `Product details:\n${result}`;
		}
	});

};



module.exports.updateProduct = (productId, isAdmin, newData) => {

	if (isAdmin) {
		return Product.findByIdAndUpdate(productId, {
			name: newData.name,
			description: newData.description,
			category: newData.category,
			price: newData.price
		})
		.then((updatedProduct, error) => {
			if (error) {
				return `Failed to update product ${updatedProduct.name}`;
			}else{
				return `Product ${updatedProduct.name} successfully updated.`;
			}
		})
	}else{
	
		let message = Promise.resolve(`User must be admin to update a product.`);

		return message.then((value) => {
			return value;
		});
	}

};



module.exports.archiveProduct = (productId, isAdmin) => {

	if (isAdmin) {
		return Product.findByIdAndUpdate(productId, {
			isActive: false
		})
		.then((archivedProduct, error) => {
			if (error) {
				return `Failed to archive product ${archivedProduct.name}.`;
			}else{
				return `Product ${archivedProduct.name} successfully archived.`;
			}
		})
	}else{
	
		let message = Promise.resolve(`User must be admin to archive a product.`);

		return message.then((value) => {
			return value;
		});
	}

};
