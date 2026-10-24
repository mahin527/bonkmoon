const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
            maxlength: 120,
            lowercase: true,
            unique: [true, "email already exists"],
            index: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please fill a valid email address",
            ],
        },
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true,
            maxlength: 120,
        },
        password: {
            type: String,
            required: [true, "password is required"],
            maxlength: 120,
            minlength: [6, "password must be greater then 6"],
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.password;
                return ret;
            },
        },
    },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
    return;
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
