const express = require('express');
const server = express();
const postsRouter = require ('./postsRouter');
require('dotenv').config();

server.use (express.json());
server.use ('/api/posts', postsRouter);
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server on ${port}`));
