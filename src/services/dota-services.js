'use strict';

const axios = require('axios').default;
const { opendota_api } = require('../config.json');

module.exports = {
  getPlayerInfo: (accountId) => {
    return axios.get(`${opendota_api}/players/${accountId}`);
  },
  getRecentMatches: (accountId) => {
    return axios.get(`${opendota_api}/players/${accountId}/recentMatches`);
  },
};
