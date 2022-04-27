let router = require('express').Router();
let mongoose = require("mongoose");
let NFT = mongoose.model('NFT');
let httpResponse = require('express-http-response');
let OkResponse = httpResponse.OkResponse;
let ForbiddenResponse = httpResponse.ForbiddenResponse;
let BadRequestResponse = httpResponse.BadRequestResponse;

router.get('/', (req, res, next) => {
    let query = {};
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 30,
    }

    let traitsQueryArray = [];

    if(req.query.tattoos){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Tattoos', value: {$in: req.query.tattoos.split(',')}}}
        );
    }
    if(req.query.hair){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Hair', value: {$in: req.query.hair.split(',')}}}
        );
    }
    if(req.query.clothes){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Clothes', value: {$in: req.query.clothes.split(',')}}}
        );
    }
    if(req.query.vibes){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Vibes', value: {$in: req.query.vibes.split(',')}}}
        );
    }
    if(req.query.thirdClub){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Third Club', value: {$in: req.query.thirdClub.split(',')}}}
        );
    }
    if(req.query.specialVibes){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Special Vibes', value: {$in: req.query.specialVibes.split(',')}}}
        );
    }
    if(req.query.specialLegendItem){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Special Legend Item', value: {$in: req.query.specialLegendItem.split(',')}}}
        );
    }
    if(req.query.specialEdition){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Special Edition', value: {$in: req.query.specialEdition.split(',')}}}
        );
    }
    if(req.query.specialClubItem){
        
        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Special Club Items', value: {$in: req.query.specialClubItem.split(',')}}}
        );
    }
    if(req.query.secondClub){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Second Club', value: {$in: req.query.secondClub.split(',')}}}
        );
    }
    if(req.query.legend){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Legend', value: {$in: req.query.legend.split(',')}}}
        );
    }
    if(req.query.fourthClub){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Fourth Club', value: {$in: req.query.fourthClub.split(',')}}}
        );
    }
    if(req.query.ear){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Ear', value: {$in: req.query.ear.split(',')}}}
        );
    }
    if(req.query.club){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Club', value: {$in: req.query.club.split(',')}}}
        );
    }
    if(req.query.background){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Background', value: {$in: req.query.background.split(',')}}}
        );
    }
    if(req.query.accessories){

        traitsQueryArray.push(
            {$elemMatch: {trait_type: 'Accessories', value: {$in: req.query.accessories.split(',')}}}
        );
    }


    console.log('Traits Query Array: ',traitsQueryArray)
    if(traitsQueryArray.length != 0){
        query.traits = {$all: traitsQueryArray};
    }

    if (typeof req.query.min !== undefined && req.query.min && req.query.min !== null && 
        typeof req.query.max !== undefined && req.query.max && req.query.max !== null) {
        query.noOfGems = { $gte: req.query.min, $lte: req.query.max };
    }

    if(typeof req.query.legendNo !== undefined && req.query.legendNo == 1 && req.query.legendNo !== null){
        options.sort = 'tokenId';
    }

    if(typeof req.query.gems !== undefined && req.query.gems == 1 && req.query.gems !== null){
        options.sort = '-noOfGems';
    }

    NFT.paginate(query, options, (err, result1) => {
        if(err) {
            next(new BadRequestResponse({err: err}));
        }else{
            let maxGems = 0;
            NFT.find({}, (err, result) => {
                for(let i = 0;i < result.length;i++){
                    if(result[i].noOfGems > maxGems){
                        maxGems = result[i].noOfGems;
                    }
                }
                next(new OkResponse({result: result1, maxGems: maxGems}));
            })
        }
    })
});

// {traits: {$all: [{$elemMatch: {"trait_type": 'Tattoos', "value": "Galileo Tattoos 4"}}, {$elemMatch: {"trait_type": 'Legend', "value": "Galileo"}}]}}
//  {traits: {$all: [{$elemMatch: {"trait_type": 'Tattoos', "value": {$in:["Galileo Tattoos 4","Lincoln Tattoos 4"]}}}]}}

router.get('/search', (req, res, next) => {
    NFT.find().then((result) =>{
        result = result.filter(x => x.tokenId.toString().includes(req.query.tokenId));
        next(new OkResponse({result: result}));
    });
});


module.exports = router;