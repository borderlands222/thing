'use strict';

const path = require('path');
const express = require('express');
const Router = require('express-promise-router');
const logger = require('./logger');

const { getCollection } = require('./redgifs');

async function initServer() {
    const app = express();
    const router = Router();

    router.use(express.static('public'));

    router.get('/api/collection', async (req, res) => {
	const collection = await getCollection(req.query.url);

	res.send(collection);
    });

    router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.use(router);

    const server = app.listen(3000, () => {
	const { address, port } = server.address();

	logger.info(`Web server listening on ${address}:${port}`);
    });
}

initServer();
