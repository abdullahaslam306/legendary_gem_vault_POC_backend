let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let secret = require("../config").secret;

let UserSchema = new mongoose.Schema({
    walletAddress: {type: String},
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);