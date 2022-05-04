const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    user_name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
    },
    hashed_password:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        required:true,
        default:0
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    salt:String,

},{timestamps:true})

// virtual field
userSchema.virtual('password')
.set(
    function(password){
        this._password=password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    }
)
.get( function(){
    return this._password
})

// defining the methods
userSchema.methods={
    encryptPassword:
        function(password){
            if(!password) return ''
            try{
                return crypto.createHmac('sha1',this.salt)
                .update(password)
                .digest('hex')
            }
            catch(error){
                return ''
            }
        },
    authenticate:function(pwd){
        return this.encryptPassword(pwd)===this.hashed_password
    }
}

module.exports = mongoose.model("User",userSchema)