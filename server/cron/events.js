const Moralis = require('moralis/node');
let { MORALIS_EVENTS } = require('../constants/constants');
const cron = require('node-cron');
let moment = require('moment');
require('../models/Event');
require('../models/Staking');
require('../models/NFT');
require('../models/OrderAsset');
let mongoose = require("mongoose");
let Event = mongoose.model("Event");
let Staking = mongoose.model("Staking");
let OrderAsset = mongoose.model("OrderAsset");
let NFT = mongoose.model("NFT");
let { EVENT_TYPE, GEMS_CONFIG } = require('../constants/constants');


const populateEventsInner = async (eventType) => {
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
    await populateEventsInner(EVENT_TYPE.STAKED);
    await populateEventsInner(EVENT_TYPE.UNSTAKED);
}

const updateStakingRecords = async () => {
    console.log('Updating Staking Records...');
    let allUnprocessedEvents = await Event.find({isProcessed: false, hasException: false}).sort({"block_timestamp":1});
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

const calculateGems = async() => {
    console.log('Calculating Gems...');
    let map = {};
    let allStakingRecords = await Staking.find().sort({"createdAt": 1});
    for(let doc of allStakingRecords){
        if(doc.endDate != null){
            let start = moment(doc.startDate);
            let end = moment(doc.endDate);
            let duration = moment.duration(end.diff(start));
            let days = duration.asDays();
            days = Number(days.toFixed(0));
            let gems = 0;
            if(days < 30){
                gems = GEMS_CONFIG.thirtyDays * days;
            }else if(days > 30 && days <= 90){
                gems = GEMS_CONFIG.thirtyDays * 30;
                gems += GEMS_CONFIG.sixtyDays * (days - 30);
            }else if(days > 90){
                gems = GEMS_CONFIG.thirtyDays * 30;
                gems += GEMS_CONFIG.sixtyDays * 60;
                gems += GEMS_CONFIG.nintyDays * (days - 90);
            }
            map[doc.asset] = (map[doc.asset] + Number(gems)) || 0;
        }else{
            let start = moment(doc.startDate);
            let end = moment(Date.now());
            let duration = moment.duration(end.diff(start));
            let days = duration.asDays();
            days = Number(days.toFixed(0));
            let gems = 0;
            if(days < 30){
                gems = GEMS_CONFIG.thirtyDays * days;
            }else if(days > 30 && days <= 90){
                gems = GEMS_CONFIG.thirtyDays * 30;
                gems += GEMS_CONFIG.sixtyDays * (days - 30);
            }else if(days > 90){
                gems = GEMS_CONFIG.thirtyDays * 30;
                gems += GEMS_CONFIG.sixtyDays * 60;
                gems += GEMS_CONFIG.nintyDays * (days - 90);
            }
            map[doc.asset] = (map[doc.asset] + Number(gems)) || 0;;
        }
    }

    let allOrderAssets = await OrderAsset.find().sort({"createdAt": 1});
    for(let orderDoc of allOrderAssets){
        map[orderDoc.address] = (map[orderDoc.address] - orderDoc.gems) || 0;
    }

    for(let doc in map){
        let nftRecord = await NFT.findOne({tokenId: Number(doc)});
        nftRecord.noOfGems = map[doc];
        await nftRecord.save();
    }    
    console.log('Gems Calculated!');
}

cron.schedule('*/5 * * * *', async () => {
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
        await calculateGems();
    });
});






