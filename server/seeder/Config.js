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
    .then(async(connection) => {
        console.log("Connected to DB in development environment");
        try{
            await mongoose.connection.db.dropCollection('configs');
            console.log("Config Collection Dropped...");
            seedConfig();
        }catch(e){
            seedConfig();
        }
    });

const seedConfig = () => {
    let config = new Config();
    config.days = -1;
    config.gems = 100;
    config.gems10Legends = 100;
    config.gems25Legends = 250;
    config.gems50Legends = 500;

    config.save().then(() => {
        console.log("Config Seeded");
        process.exit(0);
    })
}