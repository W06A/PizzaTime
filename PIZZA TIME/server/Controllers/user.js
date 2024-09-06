const User = require('../Models/user');

const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');



const register= async(req,res)=>{

    try{
        let data = req.body;
        let user = new User(data);

        user.password = bcrypt.hashSync(data.password,10);
        let savedUser = await user.save();
        res.send(savedUser);


    }

    catch(error){
        res.send(error);
    }

}


const login=async(req,res)=>{

    try{
        let{email,password}=req.body;
        let user = await User.findOne({email:email});

        if(!user){
            return res.send('email or password invalid');
        }
        let validPass = bcrypt.compareSync(password,user.password);

        if(!validPass){
            return res.send('email or password invalid');
        }
        let payload= {
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            address:user.address,
            city: user.city,
            state: user.state,
            password:user.password,
            confirm:user.confirm,
            _id:user._id,
           
        }
        let token = jwt.sign(payload,'12345687hh');
        res.send({mytoken:token});
        }

    catch(err){
      console.error(err);
      res.status(500).send('An error occurred');
    }

};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

const updateUserByID = async (req, res) => {
  try {
    const { userId } = req.params; 
    console.log('userId:', userId);
    const { firstName, lastName, email, address, city, state ,checkedFavorites } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
     
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname:firstName|| user.firstName,
        lastname:lastName|| user.lastName,
        email:email|| user.email,
        address:address|| user.address,
        city:city|| user.city,
        state:state|| user.state,
        checkedFavorites: checkedFavorites || User.checkedFavorites,
      },
      {new:true}
    );
   
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({success: false,
      message: "Error while updating profile",
      error,
    });
  }
}

module.exports={
    register,
    login,
    getUserById,
    updateUserByID
}