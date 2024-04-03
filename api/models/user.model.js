import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    avatar:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    disabled:{
        type:Boolean,
        default:false
    },
    subscriptions: [{
        type: String,
        enum: ['Academic Resources', 'Career Services', 'Campus', 'Culture', 'Local Community Resources', 'Social', 'Sports', 'Health and Wellness', 'Technology', 'Travel', 'Alumni'],
      }], 
}, {timestamps: true});

const User = mongoose.model("User", userSchema)

export default User;

  