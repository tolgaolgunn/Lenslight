import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import validator from 'validator';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true,'Username is required'],
        lowerCase:true,
        validate:[validator.isAlphanumeric,'Only Alphanumeric characters'],
        unique:true,
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique:true,
        validate:[validator.isEmail,'Valid email is required'],
    },
    password:{
        type:String,
        required:[true,'Password is required'], 
        minLength:[5,'At least 5 characters'],
    },
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    followings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
},
{
    timestamps:true
}
);

userSchema.pre('save',function(next){
    const user=this;
    bcrypt.hash(user.password,10,(err,hash)=>{
        user.password=hash;
        next();
    });
});

const User = mongoose.model("User", userSchema);

export default User;
