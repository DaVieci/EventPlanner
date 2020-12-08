const userSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;