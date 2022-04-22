const Moralis = require('moralis/node');
require('../models/NFT');
let mongoose = require("mongoose");
let NFT = mongoose.model("NFT");
let { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(
    "https://eth-mainnet.alchemyapi.io/v2/demo",
);
let {MORALIS, NFT_CONTRACT_ADDRESS} = require("../constants/constants");



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
        seedNFTs();
        // seedTraits();
        // checkMissing();
    });


seedNFTs = async () => {
    let cursor = null;
    console.log('Seeding NFTs to the Database...');
    await Moralis.start({ serverUrl: MORALIS.serverUrl, appId: MORALIS.appId });
    for(let i = 0;i <= 9500;i=i+500) {
        let temp = await Moralis.Web3API.token.getAllTokenIds({
            chain: "eth",
            cursor: cursor,
            address: NFT_CONTRACT_ADDRESS,
        });
        cursor = temp.cursor;
        console.log(temp.result.length);
        for(let i = 0; i < temp.result.length; i++){
            let nft = new NFT();
            nft.address =  temp.result[i].token_address;
            nft.tokenId =  Number(temp.result[i].token_id);
            nft.tokenUri = temp.result[i].token_uri;
            await nft.save();
        }
    }

    let nft = new NFT();
    nft.address =  "0x8C714199d2eA08CC1f1F39A60f5cD02aD260A1e3";
    nft.tokenId =  8545;
    nft.tokenUri = "https://ipfs.moralis.io:2053/ipfs/QmNYfJMYagHws7gwN2Hw8USQfF7z2ZG9RwRX9MbmssyzhH/8545";
    await nft.save();
    console.log('NFTs Seeded!');
}

checkMissing = async () => {
    let nfts = await NFT.find();
    nfts = await nfts.map((nft) => {
        return (nft.tokenId);
    })

    for(let i = 0; i < nfts.length; i++) {
        if(!nfts.includes(i.toString())){
            console.log("HEY",i);
        }
    }
    console.log("That's IT");
}

seedTraits = async () => {
    console.log("Fetching Metadata for a crypto HoL NFT...");
    for(let i = 0;i < 9993;i++){
        const response = await web3.alchemy.getNftMetadata({
            contractAddress: "0x8c714199d2ea08cc1f1f39a60f5cd02ad260a1e3",
            tokenId: i
        })
        NFT.findOne({tokenId: i}).then((result) => {
            result.traits = response.metadata.attributes;
            result.save().then(() => {

            })
        })
    }
    console.log('Traits Seeded!');
}
