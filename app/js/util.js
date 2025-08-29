function compensatePath(src) {
    return COMPUTER ? src.replace("http://127.0.0.1", "https://czt666.cn") : src;

    return `${adjustFileLocation}${src.replace(/ ^\.\//, "")}`;
}

// 计算两个经纬度坐标之间的球面距离（单位：米）
function haversineDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 6371000; // 地球半径，单位：米
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // 计算距离并存入缓存
    const distance = R * c;
    return distance;
}

// 计算聚类中心点
function calculateCentroid(cluster) {
    if (!cluster || cluster.length === 0) {
        return null;
    }

    let sumLat = 0;
    let sumLon = 0;

    for (const point of cluster) {
        sumLat += Number(point[0]);
        sumLon += Number(point[1]);
    }

    const centroidLat = sumLat / cluster.length;
    const centroidLon = sumLon / cluster.length;

    return [centroidLat, centroidLon];
}

// 使用 async/await 获取数据
async function fetchData(baseUrl, params = {}, options = {}) {
    try {
        // 构建包含参数的完整 URL
        const url = new URL(baseUrl);
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach((item) => url.searchParams.append(key, item));
            } else {
                url.searchParams.append(key, value);
            }
        });
        console.log(url);
        // 发送网络请求
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function customDeepCopy(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (visited.has(obj)) {
        return visited.get(obj);
    }

    let clone = Array.isArray(obj) ? [] : {};
    visited.set(obj, clone);

    Object.keys(obj).forEach((key) => {
        clone[key] = customDeepCopy(obj[key], visited);
    });

    return clone;
}

// 判断是否在中国境内
function outOfChina(lon, lat) {
    return lon < 72.004 || lon > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0;
    return ret;
}

function transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0;
    return ret;
}

// WGS84 -> GCJ-02
function wgs84togcj02([lon, lat]) {
    if (outOfChina(lon, lat)) {
        return [lon, lat];
    }
    const a = 6378245.0; // 长半轴
    const ee = 0.00669342162296594323; // 偏心率平方
    let dLat = transformLat(lon - 105.0, lat - 35.0);
    let dLon = transformLon(lon - 105.0, lat - 35.0);
    const radLat = (lat / 180.0) * Math.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);
    const mgLat = lat + dLat;
    const mgLon = lon + dLon;
    return [mgLon, mgLat];
}

// module.exports = {
//     fetchData, haversineDistance,
//     calculateCentroid,
// }
