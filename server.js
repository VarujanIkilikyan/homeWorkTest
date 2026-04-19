import 'dotenv/config';
import http from 'http';
import axios from 'axios';


import { initFile } from './utils/storage.js';


const{PORT, HOSTNAME, MODENAME} = process.env;


const server = http.createServer(async (req, res) => {
 

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end('<h1>401</h1>');
});

async function startServer() {
    const dataFileLIst = ['users.json', `posts.json`];
    await initFile('data', dataFileLIst);
    server.listen(+PORT, () => {
        console.log(`Server is running on port ${PORT} in ${MODENAME} mode`);
    });
}
startServer();

