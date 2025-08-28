function calculateCoreDistanceForPoint(point, neighbors, minPts) {
    let sortedNeighbors = sortNeighborsByDistance(point, neighbors);
    return sortedNeighbors[minPts - 1].distance; // 第minPts个邻居的距离为核心距离
}

function sortNeighborsByDistance(point, neighbors) {
    return neighbors.sort((a, b) => calculateDistance(point, a) - calculateDistance(point, b));
}

function calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

function optics(data, eps, minPts) {
    calculateCoreDistance(data, eps, minPts);

    let orderedPoints = clusterOrdering(data);

    return orderedPoints;
}

function calculateCoreDistance(data, eps, minPts) {
    for (let i = 0; i < data.length; i++) {
        let neighbors = findNeighbors(data, data[i], eps);
        if (neighbors.length >= minPts) {
            data[i].coreDistance = calculateCoreDistanceForPoint(data[i], neighbors, minPts);
        } else {
            data[i].coreDistance = null;
        }
    }
}

function findNeighbors(data, point, eps) {
    let neighbors = [];
    for (let i = 0; i < data.length; i++) {
        if (calculateDistance(point, data[i]) <= eps) {
            neighbors.push(data[i]);
        }
    }
    return neighbors;
}

function clusterOrdering(data) {
    // 实现聚类结构构建逻辑
    return data;
}

var gpsData = [
    [107.870567, 21.796001],
    [107.871234, 21.795111],
    [107.872222, 21.797333],
    [107.88, 21.8],
    [107.882222, 21.802222],
    [107.89, 21.79],
];

// let eps = 0.05; // 邻域半径
// let minPts = 2; // 最小邻居数
// let result = optics(gpsData = [
//     [107.870567, 21.796001],
//     [107.871234, 21.795111],
//     [107.872222, 21.797333],
//     [107.880000, 21.800000],
//     [107.882222, 21.802222],
//     [107.890000, 21.790000]
// ], eps, minPts);

// console.log(result);
