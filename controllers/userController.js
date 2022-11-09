const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Product = require("../models/Product.js")


module.exports.registerUser = (reqBody) => {

	return User.find({email : reqBody.email}).then(result => {
		if(result.length > 0){
			return "The email address you've entered is already registered.";
		} else {

			let newUser = new User({
				username : reqBody.username,
				email : reqBody.email,
				password : bcrypt.hashSync(reqBody.password, 10)
			})

			return newUser.save().then((user, error) => {
				if(error){
					return "Registration failed. Try again.";
				}else {
					return "You have successfully registered!";
				}
			})
		}
	})

	
}



module.exports.loginUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {
		if(result == null){
			return "User not Found";
		}else{
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

			if(isPasswordCorrect){
				//Generate an access
				return  {access : auth.createAccessToken(result)}
			}
		}
	})
}


module.exports.getUserDetails = (data) => {
	return User.findById(data).then(result => {
		if (result == null) {
			return "User not found";
		}else {

			return result;
		}
	})
}


// Get all users

module.exports.getAllUsers = () => {
	return User.find({}).then(result => {
		return result
	})
}
