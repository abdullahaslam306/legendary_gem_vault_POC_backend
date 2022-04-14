const Moralis = require('moralis/node');
let { MORALIS_EVENTS } = require('../constants/constants');
let moment = require('moment');

const listStakedEvents = async () => {
    console.log('Getting Staked Events...');

    let date = moment().subtract(15, "minutes").format('YYYY-MM-DDTHH:mm:ss');
    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const StakedEvents = Moralis.Object.extend("StakedEvents");
    const query = new Moralis.Query(StakedEvents);
    let results = await query.find();
    results = results.filter(x => moment(x.attributes.block_timestamp).format('YYYY-MM-DDTHH:mm:ss') >= date);
    console.log('STAKED', results.length);
}

const listUnstakedEvents = async () => {
    console.log('Getting Unstaked Events...');

    let date = moment().subtract(15, "minutes").format('YYYY-MM-DDTHH:mm:ss');
    await Moralis.start({ serverUrl: MORALIS_EVENTS.serverUrl, appId: MORALIS_EVENTS.appId });
    const UnstakedEvents = Moralis.Object.extend("UnstakedEvents");
    const query = new Moralis.Query(UnstakedEvents);
    let results = await query.find();
    results = results.filter(x => moment(x.attributes.block_timestamp).format('YYYY-MM-DDTHH:mm:ss') >= date);
    console.log('UNSTAKED', results.length);
}

const run = async () => {
    await listStakedEvents();
    await listUnstakedEvents();
}

run();

