/**
 * 사용법은 test.js참조
 */

const Database = require('sqlite-async');

let db;
(async () => {
    db = await Database.open('database.sqlite3');
    console.log("DB prepared");
})();

const getSearchFunction = tableName => async ({ dateFrom, dateTo, insertDateFrom }) => {
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
        params.push(dateTo);
        query += 'AND insert_time >= ?';
    }

    return db.all(query, params);
};

module.exports = {
    searchPoliceDB: getSearchFunction('losts_police'),
    searchSeoulDB: getSearchFunction('losts_seoul'),
};