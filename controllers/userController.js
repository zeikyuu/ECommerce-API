const bcrypt = require("bcrypt");
const auth = require("../auth.js");



const User = require("../models/User.js");


module.exports.registerUser = (reqBody) => {
	let newUser = new User({
		firstName : reqBody.firstName,
		lastName : reqBody.lastName,
		email : reqBody.email,
		password : bcrypt.hashSync(reqBody.password, 10)
		// 10 = salt
	})

	return newUser.save().then((user, error) => {
		if(error){
			return false;
		}else{
			return true;
		}
	})
}



module.exports.loginUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {
		if(result == null){
			return false;
		}else{
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

			if(isPasswordCorrect){
				//Generate an access
				return  {access : auth.createAccessToken(result)}
			}
		}
	})
}



module.exports.getUserDetails = (userId) => {

	return User.findById(userId)
	.then(result => {
		if (result == null) {
			return false;
		}else{
			result.password = ``;
			return result;
		}
	})

};



// GET ALL USERS

module.exports.getAllUsers = () => {
	return User.find({}).then(result => {
		return result
	})
}


// USER SET AS ADMIN: ADMIN ONLY
module.exports.addAdmin = (isAdmin, newAdminUserId) => {

	if (isAdmin) {
		return User.findByIdAndUpdate(newAdminUserId, {
			isAdmin: true
		})
		.then((newAdmin, error) => {
			if (error) {
				return false;
			}else{
				return true;
			}
		})
	}else{
		
		let message = Promise.resolve(`User must be an admin to set other users as admin.`);

		return message.then((value) => {
			return value;
		});
	}

};


module.exports.getProfile = (data) => {
	return User.findById(data.userId).then(result => {
		return result;
	})
}


module.exports.checkEmailExists = (reqBody) => {
	return User.find({email : reqBody.email}).then(result => {
		if(result.length > 0){
			return true;
		}else{
			return false;
		}
	})
}