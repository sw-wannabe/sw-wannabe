/**
 * 사용법은 test.js참조
 */

const fs = require('fs').promises;
const path = require('path');

const Database = require('sqlite-async');
const axios = require('axios');

let db;
let routes;
(async () => {
    db = await Database.open(path.join(__dirname, 'database.sqlite3'));
    console.log("DB prepared");
    let routesString = (await fs.readFile(path.join(__dirname, 'routes.txt'))).toString('utf-8');
    routes = routesString.split('\n');
})();

const getSearchFunction = tableName => async ({ dateFrom, dateTo, insertDateFrom, location, name, category }) => {
    if (!db) {
        console.warn("DB is not prepared yet");
        return [];
    }

    let query = `SELECT * FROM ${tableName} WHERE 1=1 `;
    let params = [];
    if (dateFrom) {
        params.push(dateFrom);
        query += 'AND date >= ?';
    }

    if (dateTo) {
        params.push(dateTo);
        query += 'AND date <= ?';
    }

    if (insertDateFrom) {
        params.push(insertDateFrom);
        query += 'AND insert_time >= ?';
    }

    if (location) {
        params.push(location);
        query += 'OR place = ?';
    }

    if (name) {
        params.push(name);
        query += 'OR name = ?';
    }

    if (category) {
        params.push(category);
        query += 'OR category = ?';
    }

    return db.all(query, params);
};

function searchBusRoute(routeName) {
    const re1 = /[0-9]{0,3}-[0-9]{0,4}-[0-9]{0,4}/;
    const re2 = /[가-힣]([가-힣]| )+/;
    

    routeName = routeName.replace(/ /g, '');
    const ret = [];

    function _filter(x) {
        if (!x) return x;
        return x[0];
    }

    for (let i = 0; i < routes.length; i++) {
        if (routes[i].replace(/ /g, '').indexOf(routeName) >= 0) {
            ;
            info = routes[i].split('|')[1];
            ret.push({
                phone: _filter(info.match(re1)),
                company: _filter(info.match(re2))
            });
        }
    }

    return ret;
}
const getAllCategories = tableName => async () => {
    if (!db) {
        console.warn("DB is not prepared yet");
        return [];
    }

    const query = `SELECT DISTINCT CATEGORY FROM ${tableName} `;

    return db.all(query);
};

async function sendToElasticSearch(json) {
    const endpoint = 'http://3.35.135.122:9200/losts/_doc/';
    return await axios
        .post(endpoint, json);
}

module.exports = {
    searchPoliceDB: getSearchFunction('losts_police'),
    searchSeoulDB: getSearchFunction('losts_seoul'),
    getPoliceDBCategories: getAllCategories('losts_police'),
    getSeoulDBCategories: getAllCategories('losts_seoul'),
    searchBusRoute,
    sendToElasticSearch
};