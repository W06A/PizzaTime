
const jwt=require('jsonwebtoken');



const verifyToken=(req,res,next)=>{
    try{
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], '12345687hh')
        req.user=decoded;
        next();
    }
    catch(error){
        res.status(401).send('invalid token');
    }
};

module.exports = verifyToken;