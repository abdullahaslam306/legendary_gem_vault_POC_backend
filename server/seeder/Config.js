const Moralis = require('moralis/node');
require('../models/Config');
let mongoose = require("mongoose");
let Config = mongoose.model("Config");

mongoose.connect('mongodb://localhost:27017/LegendaryVault', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then((connection) => {
        console.log("Connected to DB in development environment");
        seedConfig();
    });

const seedConfig = () => {
    let config = new Config();
    config.days = -1;
    config.gems = 1000;

    config.save().then(() => {
        console.log("Config Seeded");
    })
}