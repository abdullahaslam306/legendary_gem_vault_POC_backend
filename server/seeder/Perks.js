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
    .then((connection) => {
        console.log("Connected to DB in development environment");
        seedPerks();
    });

seedPerks = async() => {
    let description = [
        'HOL Disk',
        'Tesla Cut',
        'Moon Piece',
        'Churchil Chill Kit',
        'Blue T-Shirt',
        'Legendary Cup',
        'Mirror Cut',
        'Bottle Cool',
        'Pet Product',
        'Earth Magic',
        'Mad Brains',
        'Laptop HOL'
    ];

    let price = [150, 110, 255, 550, 1250, 615, 1400, 1600, 1800, 715, 220, 180];

    let quantity = [10, 25, 5, 25, 4, 21, 5, 35, 8, 45, 3, 6];

    let image = [
        'https://cdn.pixabay.com/photo/2017/07/15/15/50/fantasy-2506830_960_720.jpg',
        'https://cdn.pixabay.com/photo/2014/04/17/23/26/environmental-protection-326923_960_720.jpg',
        'https://cdn.pixabay.com/photo/2014/02/05/08/19/smoke-258786_960_720.jpg',
        'https://cdn.pixabay.com/photo/2012/12/09/00/16/abstract-69124_960_720.jpg',
        'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
        'https://cdn.pixabay.com/photo/2012/06/08/06/19/clouds-49520_960_720.jpg',
        'https://cdn.pixabay.com/photo/2014/11/16/15/15/field-533541_960_720.jpg',
        'https://cdn.pixabay.com/photo/2011/12/13/14/31/earth-11015_960_720.jpg',
        'https://cdn.pixabay.com/photo/2015/10/22/17/45/leaf-1001679_960_720.jpg',
        'https://cdn.pixabay.com/photo/2013/02/20/11/30/autumn-83761_960_720.jpg',
        'https://cdn.pixabay.com/photo/2013/04/03/12/05/tree-99852_960_720.jpg',
        'https://cdn.pixabay.com/photo/2016/09/18/14/21/swimmer-1678307_960_720.jpg',
    ]

    let type = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

    let showOnTop = [ false, false, false, false, false, false, false, false, true, true, true, true,]

    for(let i = 0;i < 12;i++) {
        let perk = new Perk();
        perk.description = description[i];
        perk.image = image[i];
        perk.price = price[i];
        perk.type = type[i];
        perk.quantity = quantity[i];
        perk.showOnTop = showOnTop[i];

        perk.save().then(async () => {
            if(type[i] == 1){
                for(let j = 0;j < quantity[i];j++){
                    let coupon = new Coupon();
                    coupon.sold = false;
                    coupon.coupon = Math.floor(Math.random() * 9999).toString();
                    coupon.perk = perk._id;
                    await coupon.save();
                }
            }
        });
    }
    console.log('Perks Seeded!')
}