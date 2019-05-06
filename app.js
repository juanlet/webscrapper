const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

function append(file, data){
      fs.appendFile(file, data.join('\n'),'utf8', function (err) {
        if (err) throw err;
        console.log('Data appended!');
      });
}

function filterUrls($){
 const hyper = $('a[href]');
     hyper.each((index, elem)=>{
       scrapedData.push($(elem).attr('href'));
    }); 
}

async function scrape(uri){
    var options = {
        uri,
        transform: function(body){
            return cheerio.load(body);
        }
    };

    try {
        const $ = await rp(options);
        filterUrls($);
    } catch(err){
        console.log(err);
    }
 
}

const urlArray = process.argv.slice(2);
let scrapedData = [];

let promisesArray = [];
urlArray.map(url => {
    promisesArray.push(scrape(url));
});

Promise.all(promisesArray).then(() => {
    const filteredData = scrapedData.filter(url=>
        ['http','www'].some(el => url.includes(el)));

    append("urls.txt",filteredData);    
});


