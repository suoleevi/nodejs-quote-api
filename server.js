const http = require('http');
const fs = require('fs').promises;

const getRandomQuote = async () => {
    try {
        const data = await fs.readFile('quotes.json');

        const quotesObj = JSON.parse(data);
        const keys = Object.keys(quotesObj);
        const index = Math.floor(Math.random() * keys.length);
        const quoteObj = quotesObj[index];
    
        const quote = quoteObj.quote;
        const author = quoteObj.author;
    
        return [quote, author];
    } catch (error) {
        return null;
    }
};

const storeQuote = async (quoteData) => {
    try {
        const quotesFile = await fs.readFile('quotes.json');
        const quotesObj = JSON.parse(quotesFile);
        quotesObj.push(quoteData);
        await fs.writeFile('quotes.json', JSON.stringify(quotesObj));
    } catch (error) {
        return null;
    }
};

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST'
};

const requestListener = (req, res) => {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', async () => {
        if (req.method === 'GET' && req.url === '/quote') {

            const quote = await getRandomQuote();
            if (quote === null) {
                res.writeHead(404, headers);
                return res.end();
            }
    
            const resData = {
                quote: quote[0], 
                author: quote[1]
            };
        
            const jsonContent = JSON.stringify(resData);
    
            res.writeHead(200, headers);
            res.write(jsonContent);
            return res.end();
        }
    
        else if (req.method === 'HEAD') {
            res.writeHead(200, headers);
            return res.end();
        }
    
        else if (req.method === 'POST' && req.url === '/quote') {
            quoteData = JSON.parse(data);
            if (quoteData.author && quoteData.quote) {
                const store = await storeQuote(quoteData);
                res.writeHead(200, headers);
                return res.end();
            }
            else {
                res.writeHead(400, headers);
                return res.end();
            }
        }
    });    
};

const httpServer = http.createServer(requestListener);
httpServer.listen(3000);