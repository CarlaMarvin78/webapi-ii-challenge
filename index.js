const express = require('express');
const server = express();
const postsRouter = require ('./postsRouter');

server.use (express.json());
server.use ('/api/posts', postsRouter);

server.listen(5000, () => console.log("server on 5000"));