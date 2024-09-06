const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  firstName:{
    type: String,
    require:[true, "First name is required"]
  },
  lastName: {type: String,
    require:[true, "Last name is required"]
},
  email: {
    type: String,
    require:[true, "Email is required"],
    unique: true
  },
  address: {
    type: String,
    require:[true, "Address is required"]
  },
  city: {
    type: String,
    require:[true, "City is required"]
  },
  state:{
    type: String,
    require:[true, "State  is required"]
  },
  password: {
    type: String,
    require:[true, "Password is required"],
    minlength: [8, "Password must be 8 characters or longer"]
  },
  confirm: { 
    type: Boolean, 
    default: true 
},
checkedFavorites: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'Order',
  default: [],
},


 
  }, {timestamps: true}
  );


module.exports= mongoose.model('User', userSchema);


 
