import mongoose from "mongoose";

const userSchema  =  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name : {
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilepic:{
        type:String,
        default:"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
    }
}, {
    timestamps:true,
});

const User = mongoose.model('user',userSchema);
export default User;