const http = require('http');
const url = require('url');

let dictionary = [];

let requestCount = 0;

// Function to parse JSON body from request to resolve or reject a promise
function parseBody(req) {
    return new Promise((res, rej) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            res(JSON.parse(body));
        });
        req.on('error', err => {
            rej(err);
        });
    });
}

// Validate user input
function isValidInput(str) {
    if (typeof str !== 'string' || str.trim() === '') {
        return false;
    }
    const trimString = str.trim();
    if (trimString === 0) {
        return false;
    }

    return true;
}

const server = http.createServer(async (req, res) => {

    // allow requests from any origin (Cross Origin Resource Sharing)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    // check request endpoint is definitions
    if (pathName === '/api/definitions' || pathName === '/api/definitions/') {
        requestCount++;

        // GET request -> grabs the definition of the word.
        if (req.method === 'GET') {
            const word = parsedUrl.query.word;

            // Check if inputted word is valid
            if (!isValidInput(word)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Invalid input',
                    requestNumber: requestCount
                }));
                return;
            }

            // trim any white spaces
            const searchWord = word.trim().toLowerCase();
            const wordDefinition = dictionary.find(item => item.word.toLowerCase() === searchWord);

            if (wordDefinition) {
                // Respond with the definition if found
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    word: searchWord,
                    definition: wordDefinition,
                    requestNumber: requestCount
                }));
            } else {
                // If word not found, throw 404 error
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    message: `Word ${searchWord} not found`,
                    requestNumber: requestCount,
                    totalEntries: dictionary.length,
                }));
            }
        }
        else if (req.method === 'POST') {
            // Try Catch to handle end point and input errors
            try {
                const body = await parseBody(req);
                const { word, definition } = body;

                // Check if inputs by user are valid
                if (!isValidInput(word)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Invalid word: word is required',
                        requestNumber: requestCount
                    }));
                    return;
                }

                // Check if inputs by user are valid
                if (!isValidInput(definition)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Invalid definition: definition is required, Please try again.',
                        requestNumber: requestCount
                    }));
                    return;
                }

                // trim any white spaces
                const newWord = word.trim();
                const newDefinition = definition.trim();

                // Check if word alr exists in dictionary
                const existingWord = dictionary.find(item => item.word.toLowerCase() === newWord.toLowerCase());

                // if word exists, throw a 409 error.
                if (existingWord) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: `Word ${newWord} already exists`,
                        requestNumber: requestCount,
                        totalEntries: dictionary.length,
                    }))
                } else {
                    dictionary.push({
                        word: newWord,
                        definition: newDefinition
                    });
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: `Word ${newWord} added successfully`,
                        word: newWord,
                        definition: newDefinition,
                        requestNumber: requestCount,
                        totalEntries: dictionary.length,
                    }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Invalid JSON body',
                    requestNumber: requestCount
                }));
            }
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Method Not Allowed',
                requestNumber: requestCount
            }));
        }
    } else { 
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Endpoint Not Found',
            requestNumber: requestCount
        }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});