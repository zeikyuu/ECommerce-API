const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
	
	name: {
		type: String,
		required: [true, "Product Name is required."]
	},

	description: {
		type: String,
		required: [true, "Product Descripion is required."]
	},

	category: {
		type: String,
		required: [true, "Product Category is required."]
	},

	price: {
		type: Number,
		required: [true, "Product Price is required."]
	},

	isActive: {
		type: Boolean,
		default: true
	},

	createdOn: {
		type: Date,
		default: new Date()
	}

});



module.exports = mongoose.model("Product", productSchema);