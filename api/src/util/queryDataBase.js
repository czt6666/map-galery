const db = require('../db')
const config = require('../config');
const { tableNames } = require("../config")
let client;
if (config.redis.use) {
    client = require('../redis');
}

async function queryMutData(tableNames) {
    if (!tableNames || tableNames.length === 0) {
        return [];
    }

    const cacheKey = `queryMutData:${tableNames.join(',')}`;

    try {
        if (config.redis.use) {
            const cachedResult = await client.get(cacheKey);
            if (cachedResult) {
                console.log('Cache hit for queryMutData');
                return JSON.parse(cachedResult);
            }
        }

        const queries = tableNames.map(tableName => `
            SELECT 
                relativePath,
                latitude,
                longitude,
                shotDate,
                city,
                district
            FROM ${tableName}
            WHERE latitude != '' AND is_delete = 0
        `).join(' UNION ALL ');

        const queryResult = await new Promise((resolve, reject) => {
            db.query(queries, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        config.redis.use && await client.set(cacheKey, JSON.stringify(queryResult), 'EX', 3600);

        return queryResult;
    } catch (error) {
        console.error('Error fetching data from tables:', tableNames, error);
        return [];
    }
}

async function clearCache(tableNames) {
    const cacheKey = `queryMutData:${tableNames.join(',')}`;
    await client.del(cacheKey);
}

module.exports = {
    queryMutData,
    clearCache,
};
