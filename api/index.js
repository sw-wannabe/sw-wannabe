/**
 * 사용법은 test.js참조
 */

const Database = require('sqlite-async');

let db;
(async () => {
    db = await Database.open('database.sqlite3');
    console.log("DB prepared");
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
        query += 'AND place = ?';
    }
	
    if (name) {
        params.push(name);
        query += 'AND name = ?';
    }
	
    if (category) {
        params.push(category);
        query += 'AND category = ?';
    }

    return db.all(query, params);
};

const getAllCategories = tableName => async () => {
    if (!db) {
        console.warn("DB is not prepared yet");
        return [];
    }

    const query = `SELECT DISTINCT CATEGORY FROM ${tableName} `;

    return db.all(query);
};

module.exports = {
    searchPoliceDB: getSearchFunction('losts_police'),
    searchSeoulDB: getSearchFunction('losts_seoul'),
	getPoliceDBCategories: getAllCategories('losts_police'),
	getSeoulDBCategories: getAllCategories('losts_seoul'),
};