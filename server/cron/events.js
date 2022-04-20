const Moralis = require('moralis/node');
let { MORALIS_EVENTS } = require('../constants/constants');
const cron = require('node-cron');
require('../models/Event');
require('../models/Staking');
require('../models/NFT');
let mongoose = require("mongoose");
let Event = mongoose.model("Event");
let Staking = mongoose.model("Staking");
let NFT = mongoose.model("NFT");
let { EVENT_TYPE, GEMS_CONFIG } = require('../constants/constants');


const listEvents = async (eventType) => {
    console.log('Getting '+ eventType +' Events...');
    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const events = Moralis.Object.extend(eventType==EVENT_TYPE.STAKED?"StakedEvents":"UnstakedEvents");
    const query = new Moralis.Query(events);
    let results = await query.find();
    for await (let doc of results) {
        let record = await Event.findOne({docId: doc.id + '-' + eventType});
        if(!record){
            console.log(eventType + ' Record Inserted In DB!');
            let event = new Event();
            event.docId = doc.id + '-' + eventType;
            event.tokenIds = doc.attributes.tokenIds;
            event.address = doc.attributes.address;
            event.block_timestamp = doc.attributes.block_timestamp;
            event.eventType = eventType;

            await event.save();
        }
    }
    console.log(eventType + ' Events Complete!');
}

const populateEvents = async () => {
    await listEvents(EVENT_TYPE.STAKED);
    await listEvents(EVENT_TYPE.UNSTAKED);
}

const updateStakingRecords = async () => {
    console.log('Updating Staking Records...');
    let allUnprocessedEvents = await Event.find({isProcessed: false}).sort({"block_timestamp":1});
    for await (let record of allUnprocessedEvents) {
        if(record.eventType == EVENT_TYPE.STAKED){

            try{
                for await (let tokenId of record.tokenIds){
                    let stakingRecord = await Staking.findOne({asset: tokenId, endDate: null});
                    if(!stakingRecord){   //check if staking doc already exists
                        let staking = new Staking();
                        staking.asset = tokenId;
                        staking.startDate = record.block_timestamp;
            
                        await staking.save();
                    }
                }
                record.isProcessed = true;
                await record.save();
            }catch(e){
                record.hasException = true;
                await record.save();
            }
        }else if(record.eventType == EVENT_TYPE.UNSTAKED){

            try{
                let stakingRecord = await Staking.findOne({asset: record.tokenIds[0], endDate: null});
                if(stakingRecord){
                    stakingRecord.endDate = record.block_timestamp;
                    await stakingRecord.save();
                    record.isProcessed = true;
                    await record.save();
                }else{
                    record.hasException = true;
                    await record.save();
                }
            }catch(e){
                record.hasException = true;
                await record.save();
            }
        }
    }

    console.log('Staking Records Updated!');
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
    .then(async (connection) => {
        console.log("Connected to DB in development environment");
        await populateEvents();
        await updateStakingRecords();
    });
});






