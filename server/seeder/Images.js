let fs = require('fs');
let request = require('request');

const path = './images/',
      baseUrl = 'https://ipfs.io/ipfs/QmcNmNc3sEPg2HgFGR9mTvuoivzHyVQeL9mLaQBHy1oPZS';

function download(uri, filename) {
    let file = fs.createWriteStream(filename);

    return new Promise((resolve, reject) => {
        request({
            uri,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            gzip: true
        })
        .pipe(file)
        .on('finish', () => {
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        })
    })
    .catch(error => {
        console.log(`Something happened: ${error}`);
    });
}


const seedImages = async () => {
    for(let i = 0;i < 10; i++) {
        const uri = `${baseUrl}/${i}.png`,
              fileName = `${path}/${i}.png`;
        console.log('start', i)
        await 
            download(uri, fileName).
            then(() => console.log('done', i));
    }
}

seedImages();


