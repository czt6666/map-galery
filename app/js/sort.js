// 根据城市分类 active
function categorizeByCity(data) {
    if (!data || !data.length) {
        return null
    }

    const result = {};

    data.forEach(item => {
        const key = item.city || item.district;
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    });

    return result;
}

// 根据地区分类
function categorizeByDistrict(data) {
    if (!data || !data.length) {
        return null
    }

    const result = {};

    data.forEach(item => {
        const key = item.district;
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    });

    return result;
}

function categorizeByDate(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }

    const result = new Map();


    for (const item of data) {
        const key = item.shotDate;
        if (!result.has(key)) {
            result.set(key, []);
        }
        result.get(key).push(item);
    }

    const formattedResult = {};
    result.forEach((items, key) => {
        formattedResult[formatDate(key)] = items;
    });

    return formattedResult;
}

// 格式化日期
function formatDate(dateString) {
    const [year, month, day] = dateString.split(":").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

// 根据城市和地区分类
function categorizeByCityAndDistrict(data) {
    const citySort = categorizeByCity(data)

    const result = {}
    for (const city in citySort) {
        result[city] = categorizeByDistrict(citySort[city])
    }

    return result
}