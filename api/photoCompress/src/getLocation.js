const axios = require("axios");
const config = require("../config");

/**
 * 从指定的 URL 获取数据
 * @param {string} url - 要获取数据的 URL
 * @returns {Promise} - 返回一个 Promise，resolve 时包含从 URL 获取的数据，reject 时包含错误信息
 */
async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

/**
 * 构建高德地图逆地理编码 API 的 URL
 * @param {string} gpsLocation - 经纬度坐标，格式为"经度,纬度"
 * @param {string} radius - 搜索半径，单位为米
 */
function buildApiUrl(gpsLocation) {
    return `https://restapi.amap.com/v3/geocode/regeo?key=${config.apiKey}&location=${gpsLocation}&extensions=base`;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // Distance in meters
    return d;
}

function isCloseDistance(lat1, lon1, lat2, lon2) {
    const distance = getDistance(lat1, lon1, lat2, lon2);
    return distance <= closeDistance;
}

/**
 * 从 API 获取地理位置数据，并提取省、市、区信息
 */
let lastResult = {
    latitude: 0,
    longitude: 0,
    locationData: null,
};
const closeDistance = 1000; // 米

async function getLocationData(gpsLocation) {
    // 判断是否有gps信息
    if (!gpsLocation.longitude) {
        return {};
    }

    // 100米以内，直接使用上一次结果
    const isWithin100m = isCloseDistance(
        gpsLocation.latitude,
        gpsLocation.longitude,
        lastResult.latitude,
        lastResult.longitude
    );

    if (isWithin100m) {
        // console.log('沿用lastLocation');
        return lastResult.locationData;
    }

    // 用promise返回
    return new Promise(async (resolve) => {
        // 获取地理位置信息
        const gpsStr = `${gpsLocation.longitude},${gpsLocation.latitude}`;
        try {
            const apiUrl = buildApiUrl(gpsStr);
            const result = await fetchData(apiUrl);
            if (result && result.status === "1") {
                const locationAllData = result.regeocode.addressComponent;
                const locationData = {
                    province: locationAllData.province.length === 0 ? "" : locationAllData.province, // 防止是空数组
                    city: locationAllData.city.length === 0 ? "" : locationAllData.city,
                    district: locationAllData.district.length === 0 ? "" : locationAllData.district,
                };
                // 更新上一次结果
                lastResult = {
                    latitude: gpsLocation.latitude,
                    longitude: gpsLocation.longitude,
                    locationData,
                };

                console.log("请求地址信息-等待50毫秒");
                setTimeout(() => {
                    resolve(locationData);
                }, 50);
            } else {
                console.log(result);
                console.log(apiUrl, "请求失败");
            }
        } catch (error) {
            console.error("Error getting location data:", error);
        }
    });
}

module.exports = getLocationData;
