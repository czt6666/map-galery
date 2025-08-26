function compensataPath(src) {
    return `${adjustFileLocation}${src.replace(/ ^\.\//, '')}`
}

// 计算两个经纬度坐标之间的球面距离（单位：米）
function haversineDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 6371000; // 地球半径，单位：米
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
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
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach(item => url.searchParams.append(key, item));
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
        console.error('Error fetching data:', error);
        return null;
    }
}


function customDeepCopy(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (visited.has(obj)) {
        return visited.get(obj);
    }

    let clone = Array.isArray(obj) ? [] : {};
    visited.set(obj, clone);

    Object.keys(obj).forEach(key => {
        clone[key] = customDeepCopy(obj[key], visited);
    });

    return clone;
}


// module.exports = {
//     fetchData, haversineDistance,
//     calculateCentroid,
// }