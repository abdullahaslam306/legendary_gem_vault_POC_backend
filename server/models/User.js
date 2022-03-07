let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let secret = require("../config").secret;

let UserSchema = new mongoose.Schema({
    walletAddress: {type: String, unique: true},
    nonce: {type: Number, default: Math.floor(Math.random() * 1000000)}
}, {timestamps: true});


UserSchema.plugin(uniqueValidator, { message: "is already taken." });
module.exports = mongoose.model("User", UserSchema);