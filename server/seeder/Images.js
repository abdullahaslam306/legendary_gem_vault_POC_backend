let fs = require('fs');
let request = require('request');

const download = (uri, filename, callback) => {
    request.head(uri, async function(err, res, body){
      await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

const seedImages = () => {
    for(let i = 0;i < 500;i++){
        download(`https://ipfs.io/ipfs/QmcNmNc3sEPg2HgFGR9mTvuoivzHyVQeL9mLaQBHy1oPZS/${i}.png`, `../public/images/${i}.png`, () => {
            console.log(i + ' Done');
        });
    }
}

seedImages();


