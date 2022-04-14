const Moralis = require('moralis/node');
let { MORALIS_EVENTS } = require('../constants/constants');
const cron = require('node-cron');
require('../models/Event');
let mongoose = require("mongoose");
let Event = mongoose.model("Event");
let {EVENT_TYPE} = require('../constants/constants');

const listStakedEvents = async () => {
    console.log('Getting Staked Events...');

    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const StakedEvents = Moralis.Object.extend("StakedEvents");
    const query = new Moralis.Query(StakedEvents);
    let results = await query.find();
    results = results.map(doc => doc.attributes);
    for await (let doc of results) {
        let record = await Event.findOne({tokenIds: doc.tokenIds, block_timestamp: doc.block_timestamp});
        if(!record){
            console.log('Staked Record Inserted In DB!');
            let event = new Event();
            event.tokenIds = doc.tokenIds;
            event.address = doc.address;
            event.block_timestamp = doc.block_timestamp;
            event.eventType = EVENT_TYPE.STAKED;

            await event.save();
        }
    }
    console.log('Staked Events Complete!');
}

const listUnstakedEvents = async () => {
    console.log('Getting Unstaked Events...');

    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const UnstakedEvents = Moralis.Object.extend("UnstakedEvents");
    const query = new Moralis.Query(UnstakedEvents);
    let results = await query.find();
    results = results.map(doc => doc.attributes);
    for await (let doc of results) {
        let record = await Event.findOne({tokenIds: doc.tokenIds, block_timestamp: doc.block_timestamp});
        if(!record){
            console.log('Unstaked Record Inserted In DB!');
            let event = new Event();
            event.tokenIds = doc.tokenIds;
            event.address = doc.address;
            event.block_timestamp = doc.block_timestamp;
            event.eventType = EVENT_TYPE.UNSTAKED;

            await event.save();
        }
    }
    console.log('Unstaked Events Complete!');
}

const run = async () => {
    await listStakedEvents();
    await listUnstakedEvents();
}

cron.schedule('*/15 * * * *', async () => {
    console.log('CRON RUNNING!')

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
        run();
    });
});






