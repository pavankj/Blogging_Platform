import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) => {
    console.log('REQ BODY ON SIGNUP', req.body)

    const {userName, email, password} = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({userName, email, password: hashedPassword});

    await newUser.save().then(() => {
        res.status(201).json('User Created successfully!')
    }).catch((err) => {

        next(err)
    
    });

    // res.status(201).json('User Created successfully!')

   
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body

    try {
        const validUser = await User.findOne({email})
        if (!validUser) return next(errorHandler(404, 'User not found!'))
        console.log('VALID USER', validUser)
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(400, 'Invalid Password!'))
        console.log('VALID PASSWORD', validPassword)
        const accountDisabled = validUser.disabled
        if (accountDisabled) return next(errorHandler(400, 'Account is disabled!'))
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        console.log('TOKEN', token)
        //dont want password to be sent back to client
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest)

        


    } catch (error) {
        next(error)
        
    }
}