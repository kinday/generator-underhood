import authors from './authors';
import { reverse, merge } from 'ramda';
import tokens from 'twitter-tokens';
import getInfo from 'get-twitter-info';
import getAuthorArea from './helpers/get-author-area';
import saveAuthorArea from './helpers/save-author-area';
import log from './helpers/log';
import { remove, outputJSON } from 'fs-extra';
import saveMedia from './helpers/save-media';

const spaces = 2;

// INFO
function initInfo({ username }) {
  getInfo(tokens, username, (err, info) => {
    if (err) throw err;
    const existing = getAuthorArea(username, 'info');
    const result = merge(info, existing);
    saveAuthorArea(username, 'info', result);
  });
}

authors.map(initInfo);

// MEDIA
function initMedia({ username }) {
  saveMedia(tokens, username, username, (err, media) => {
    if (err) throw err;
    saveAuthorArea(username, 'media', media);
  });
}

authors.map(initMedia);


// MENTIONS

function createEmptyMentions({ username }) {
  outputJSON(`./dump/${username}-mentions.json`, { mentions: [] }, { spaces }, saveErr => {
    log(`${saveErr ? '✗' : '✓'} ${username}’s empty mentions`);
  });
}

authors.map(createEmptyMentions);

// TWEETS

import dump from './dump';
function reverseAndRenameTweets({ username, tweets: oldTweets }) {
  const tweets = reverse(oldTweets);
  outputJSON(`./dump/${username}-tweets.json`, { tweets }, { spaces }, saveErr => {
    log(`${saveErr ? '✗' : '✓'} ${username}’s reversed and renamed tweets`);
  });
  remove(`./dump/${username}.json`, rmErr => {
    log(`${rmErr ? '✗' : '✓'} ${username}’s old tweets removed`);
  });
}

authors.map(reverseAndRenameTweets);
