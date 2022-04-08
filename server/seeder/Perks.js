const Moralis = require('moralis/node');
require('../models/Perk');
require('../models/Coupon');
let mongoose = require("mongoose");
let Perk = mongoose.model('Perk');
let Coupon = mongoose.model('Coupon');


mongoose.connect('mongodb://localhost:27017/LegendaryVault', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(() => mongoose.connection.db.dropCollection('perks', (err, result) => {
        console.log('Connected To DB!')
        if(!err) {
            console.log('Perk Collection Dropped!')
            mongoose.connection.db.dropCollection('coupons', (err1, result1) => {
                if(!err1){
                    console.log('Coupon Collection Dropped!');
                    seedPerks();
                }else{
                    seedPerks();
                }
            })
        }else{
            seedPerks();
        }
    }))

seedPerks = async() => {
    let description = [
        'Whitelist',
        '$5 Discount',
        '$10 Discount',
        '$15 Discount',
        '$20 Discount',
        'Whitelist',
        '$APE Coin',
        'Raffle: 50 $APE',
        'Raffle:100 $APE',
        'Raffle:200 $APE'
    ];

    let price = [250, 160, 330, 500, 660, 250, 1100, 260, 530, 730];

    let quantity = [15, 2, 2, 2, 2, 10, 10, 10, 10, 10];

    let image = [
        'https://legendary-perks.s3.us-west-1.amazonaws.com/CM_WL.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/discount_1.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/discount_2.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/discount_3.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/discount_4.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/Humaninas_WL.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/Ape-Coin.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/Raffle-Ticket-APE.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/Raffle-Ticket-APE.png',
        'https://legendary-perks.s3.us-west-1.amazonaws.com/Raffle-Ticket-APE.png',
    ]

    let type = [2, 1, 1, 1, 1, 2, 2, 2, 2, 2,];

    let showOnTop = [ true, true, true, false, false, false, false, false, false, false]

    for(let i = 0;i < 10;i++) {
        let perk = new Perk();
        perk.description = description[i];
        perk.image = image[i];
        perk.price = price[i];
        perk.type = type[i];
        perk.quantity = quantity[i];
        perk.showOnTop = showOnTop[i];

        perk.save().then(async () => {
            for(let j = 0;j < quantity[i];j++){
                let coupon = new Coupon();
                coupon.sold = false;
                coupon.coupon = Math.floor(Math.random() * 9999).toString();
                coupon.perk = perk.slug;
                await coupon.save();
            }
        });
    }
    console.log('Perks & Coupons Seeded!')
}