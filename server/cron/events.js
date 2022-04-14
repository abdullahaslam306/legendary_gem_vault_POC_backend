const Moralis = require('moralis/node');
let { MORALIS_EVENTS } = require('../constants/constants');


const listStakedEvents = async () => {
    console.log('Getting Staked Events...');
    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const StakedEvents = Moralis.Object.extend("StakedEvents");
    const query = new Moralis.Query(StakedEvents);
    const results = await query.find();
    console.log('STAKED', results[0].attributes, results[0].createdAt);
    listUnstakedEvents();
}

const listUnstakedEvents = async () => {
    console.log('Getting Unstaked Events...');
    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const UnstakedEvents = Moralis.Object.extend("UnstakedEvents");
    const query = new Moralis.Query(UnstakedEvents);
    const results = await query.find();
    console.log('UNSTAKED', results[0].attributes, results[0].createdAt);
}

listStakedEvents();