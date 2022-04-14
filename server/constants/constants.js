const PERK_TYPE = {
    COIN: "coin",
    COUPON: "coupon",   
};

const EVENT_TYPE = {
    STAKED: "Staked",
    UNSTAKED: "Unstaked",   
};

const MORALIS = {
    serverUrl: "https://rpc11whc2ogq.usemoralis.com:2053/server",
    appId: "iNsfWaO6RE0vRpBkcPQN2JmOdSm94lMKnaAu2bMV"
};

const MORALIS_EVENTS = {
    serverUrl: "https://z101lcihky72.usemoralis.com:2053/server",
    appId: "FPHda0SBrkhWMudW5wLNWLPzlrRalnjrEKiNpv1q"
}

const NFT_CONTRACT_ADDRESS = "0x8c714199d2ea08cc1f1f39a60f5cd02ad260a1e3"; //0x0D731c7D2247d53a22cE8848F62908991883CF0B  0x8c714199d2ea08cc1f1f39a60f5cd02ad260a1e3  (Mainnet NFT Collection Smart Contract Address)

const CHAIN = "eth";

module.exports = {
    PERK_TYPE,
    MORALIS,
    NFT_CONTRACT_ADDRESS,
    CHAIN,
    MORALIS_EVENTS,
    EVENT_TYPE,
}