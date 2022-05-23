const redgifsUrl = document.querySelector('#redgifsUrl');
const redgifsLoad = document.querySelector('#redgifsLoad');

const collectionInfo = document.querySelector('#collectionInfo');
const collectionTitle = document.querySelector('#collectionTitle');
const collectionSize = document.querySelector('#collectionSize');
const collectionContent = document.querySelector('#collectionContent');

const player = document.querySelector('#player');
const previous = document.querySelector('#previous');
const shuffle = document.querySelector('#shuffle');
const next = document.querySelector('#next');

const tags = document.querySelector('#tags');

const state = {
    collection: null,
    index: null,
};

function validateRedgifsUrl(url) {
    if (!url) {
	return false;
    }

    try {
	const { hostname } = new URL(url);

	if (hostname === 'redgifs.com' || hostname === 'www.redgifs.com') {
	    return true;
	}

	return false;
    } catch (error) {
	return false;
    }
}

function playVideo(index) {
    const video = state.collection.content[state.index];

    player.src = video.sources.hd;
    player.play();

    tags.innerHTML = '';

    video.tags.forEach((tag) => {
	const tagListItem = document.createElement('li');

	tagListItem.textContent = tag;
	tagListItem.classList.add('tag');

	tags.appendChild(tagListItem);
    });
}

function playRandomVideo() {
    state.index = Math.floor(Math.random() * state.collection.content.length);

    playVideo();
}

function playPreviousVideo() {
    if (state.index > 0) {
	state.index -= 1;
    } else {
	state.index = state.collection.content.length - 1;
    }

    playVideo();
}

function playNextVideo() {
    if (state.index < state.collection.content.length - 1) {
	state.index += 1;
    } else {
	state.index = 0;
    }

    playVideo();
}

async function retrieveCollection() {
    const url = redgifsUrl.value;

    if (!validateRedgifsUrl(url)) {
	return;
    }

    const res = await fetch(`/api/collection?url=${encodeURI(url)}`);

    if (!res.ok) {
	return;
    }

    const collection = await res.json();

    console.log(collection);

    collectionTitle.textContent = `${collection.title} by ${collection.username}`;
    collectionSize.textContent = `${collection.content.length} GIFs`;

    collectionContent.innerHTML = '';

    collection.content.forEach((gif) => {
	const gifListItem = document.createElement('li');

	gifListItem.textContent = gif.sources.hd;

	collectionContent.appendChild(gifListItem);
    });

    state.collection = collection;

    collectionInfo.classList.remove('hidden');

    playRandomVideo();
}

redgifsLoad.addEventListener('click', retrieveCollection);

previous.addEventListener('click', playPreviousVideo);
shuffle.addEventListener('click', playRandomVideo);
next.addEventListener('click', playNextVideo);
