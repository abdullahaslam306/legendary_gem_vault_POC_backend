const PERK_TYPE = {
    COIN: "coin",
    COUPON: "coupon",   
};

const EVENT_TYPE = {
    STAKED: "Staked",
    UNSTAKED: "Unstaked",   
};

const MORALIS = {
    serverUrl: "https://d1aqvg2oym8a.usemoralis.com:2053/server",    
    appId: "olsLXRBsPPaeKp861pGEXZs0Fc9Njg7M0tzEW2Gk"     
};

const MORALIS_EVENTS = {
    // serverUrl: "https://z101lcihky72.usemoralis.com:2053/server",  //Testnet
    // appId: "FPHda0SBrkhWMudW5wLNWLPzlrRalnjrEKiNpv1q"   //Testnet
    serverUrl: "https://ypumqbvkl3e5.usemoralis.com:2053/server",  //Mainnet
    appId: "eBQqH0TGhThvV25jmMC16AfhItYDmjOderRUbou9"   //Mainnet
}

// const NFT_CONTRACT_ADDRESS = "0x0D731c7D2247d53a22cE8848F62908991883CF0B"; //Testnet
const NFT_CONTRACT_ADDRESS = "0x8c714199d2ea08cc1f1f39a60f5cd02ad260a1e3"; //Mainnnet

// const CHAIN = "goerli"; //Testnet
const CHAIN = "eth"; //Mainnet

const GEMS_CONFIG = {
    thirtyDays: 10,
    sixtyDays: 20,
    nintyDays: 30
};

module.exports = {
    PERK_TYPE,
    MORALIS,
    NFT_CONTRACT_ADDRESS,
    CHAIN,
    MORALIS_EVENTS,
    EVENT_TYPE,
    GEMS_CONFIG
}