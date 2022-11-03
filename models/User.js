const mongoose = require("mongoose");

	const userSchema = new mongoose.Schema({
		firstName : {
				type : String,
				required : [true, "First name is required"]
		},
		lastName : {
				type : String,
				required : [true, "Last name is required"]
		},
		email : {
			type : String,
			required : [true, "Email is required"]
		},
		password : {
			type : String,
			required : [true, "Password is required"]
		},
		isAdmin : {
			type : Boolean,
			default : false
		},
		orders : [
			{
				product : [{
					productName : {
						type : String,
						required : [true, "Product is require"]
					}
				}],
				totalAmount : {
					type : Number,
					required : [true, "Total amount is required"]
				},
				purchaseOn : {
					type : Date,
					default : new Date()
				}
			}


		]

	})

	module.exports = mongoose.model("User", userSchema);