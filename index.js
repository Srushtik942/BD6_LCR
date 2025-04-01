let {checkDefaultBody} = require('./user');
const rateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
app.use(express.json())

const rateLimiter = rateLimit({
    user : 60 * 1000,
    max : 5
})

app.post('/login',async(req,res)=>{
    let {email, password} = req.body;
    if(!email || !password){
        return res.status(404).json({"message":"Check body again!"});
    }
    if(rateLimiter){
       return res.status(401).json({error: "Too many login attempts. Try again later."})
    }

    let result = await checkDefaultBody(email,password)
    res.status(200).json( {"success":true,"token":"JWT_TOKEN",result});
})


module.exports ={
    app
}


