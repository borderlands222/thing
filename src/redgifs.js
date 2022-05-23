'use strict';

const fetch = require('node-fetch');
const logger = require('./logger');

function curateGif(gif) {
    return {
	id: gif.id,
	sources: {
	    hd: gif.urls.hd,
	    sd: gif.urls.sd,
	},
	hasAudio: gif.hasAudio,
	thumb: gif.urls.thumbnail,
	views: gif.views,
	duration: gif.duration,
	tags: gif.tags,
	likes: gif.likes,
	width: gif.width,
	height: gif.height,
	averageColor: gif.avgColor,
	created: new Date(gif.createDate * 1000),
    };
}

function curateCollection(collection, gifs) {
    return {
	title: collection.folderName,
	description: collection.description,
	username: collection.userId,
	created: new Date(collection.createDate * 1000),
	content: gifs.map((gif) => curateGif(gif)),
    };
}

async function getUserCollection(username, collectionId) {
    logger.debug(`Requesting RedGIFs collection ${username}/${collectionId}`);

    const collectionRes = await fetch(`https://api.redgifs.com/v2/users/${username}/collections/${collectionId}`);
    const gifsRes = await fetch(`https://api.redgifs.com/v2/users/${username}/collections/${collectionId}/gifs?count=1000&page=1`);

    if (!collectionRes.ok || !gifsRes.ok) {
	throw new Error(`RedGIFs API returned ${res.status}`);
    }

    const collectionData = await collectionRes.json();
    const gifsData = await gifsRes.json();

    return curateCollection(collectionData, gifsData.gifs);
}

async function getCollection(url) {
    if (!url) {
	return;
    }

    const userCollection = url.match(/\/users\/(\w+)\/collections\/(\w+)/);

    if (userCollection) {
	return getUserCollection(userCollection[1], userCollection[2]);
    }
}

module.exports = { getCollection };
