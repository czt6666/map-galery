// 合并K均值聚类算法


// 计算两个经纬度点之间的距离（单位：米）
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球半径（米）
    const φ1 = lat1 * Math.PI / 180; // 纬度1（弧度）
    const φ2 = lat2 * Math.PI / 180; // 纬度2（弧度）
    const Δφ = (lat2 - lat1) * Math.PI / 180; // 两点纬度之差（弧度）
    const Δλ = (lon2 - lon1) * Math.PI / 180; // 两点经度之差（弧度）

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
}

// 计算两点之间的欧氏距离
function euclideanDistance(point1, point2) {
    const lat1 = point1[1];
    const lon1 = point1[0];
    const lat2 = point2[1];
    const lon2 = point2[0];
    return haversineDistance(lat1, lon1, lat2, lon2);
}

// 根据给定的中心点，将数据点分配到最近的聚类中心
function assignPointsToClusters(data, centroids) {
    const clusters = new Array(centroids.length).fill().map(() => []);

    data.forEach(point => {
        let minDistance = Infinity;
        let closestCentroidIndex = -1;
        centroids.forEach((centroid, index) => {
            const distance = euclideanDistance(point, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                closestCentroidIndex = index;
            }
        });
        clusters[closestCentroidIndex].push(point);
    });

    return clusters;
}

// 根据分配的聚类，更新聚类中心
function updateCentroids(clusters) {
    return clusters.map(cluster => {
        const centroid = cluster.reduce((acc, point) => {
            acc[0] += point[0];
            acc[1] += point[1];
            return acc;
        }, [0, 0]);

        return [centroid[0] / cluster.length, centroid[1] / cluster.length];
    });
}

// 检查新的聚类中心与旧的中心是否相同
function centroidsNotUpdated(oldCentroids, newCentroids) {
    return oldCentroids.every((centroid, index) => {
        return centroid.every((coord, i) => coord === newCentroids[index][i]);
    });
}

// 固定选择初始聚类中心
function initializeCentroids(data, k) {
    // 选择数据集中的 k 分点作为初始聚类中心
    const centroids = [];
    const dataSize = data.length;
    const interval = Math.floor(dataSize / k);

    for (let i = 0; i < k; i++) {
        const index = i * interval;
        centroids.push(data[index]);
    }

    return centroids;
}

// 判断两个点之间是否在 epsilon 范围内
function withinEpsilon(point1, point2, epsilon) {
    return euclideanDistance(point1, point2) <= epsilon;
}

// 合并距离在 epsilon 以内的簇
function mergeClusters(clusters, centroids, epsilon) {
    const mergedClusters = [];
    const mergedIndices = new Set();

    for (let i = 0; i < centroids.length; i++) {
        if (mergedIndices.has(i)) continue;

        const mergedCluster = clusters[i].slice();
        const centroid1 = centroids[i];

        for (let j = i + 1; j < centroids.length; j++) {
            if (mergedIndices.has(j)) continue;

            const centroid2 = centroids[j];

            if (withinEpsilon(centroid1, centroid2, epsilon)) {
                mergedCluster.push(...clusters[j]);
                mergedIndices.add(j);
            }
        }

        mergedClusters.push(mergedCluster);
    }

    return mergedClusters;
}

// K均值聚类算法
function kMeans(data, k, epsilon = 100, maxIterations = 100) {
    // 固定选择初始聚类中心
    let centroids = initializeCentroids(data, k);

    let iterations = 0;
    let oldCentroids;
    let clusters

    // 迭代更新聚类中心
    do {
        oldCentroids = centroids.slice();
        clusters = assignPointsToClusters(data, centroids);
        centroids = updateCentroids(clusters);
        iterations++;
    } while (!centroidsNotUpdated(oldCentroids, centroids) && iterations < maxIterations);

    // 合并距离在 epsilon 以内的簇
    const mergedClusters = mergeClusters(clusters, centroids, epsilon);

    return mergedClusters;
}

function mapKmens(visibleData, k = 4, epsilon) {
    const gpsData = visibleData.map(item => item.gps)

    // 进行聚类
    const clusters = kMeans(gpsData, k, epsilon);

    const result = clusters
        .filter(item => item.length)
        .map(cluster => {
            if (!cluster.length) {
                return null
            }
            const center = calculateCentroid(cluster)
            return {
                center,
                gpsInfo: cluster,
            }
        })
    return result
}

// 示例用法
// const data = [
//     [107.870567, 21.796001],
//     [107.871234, 21.795111],
//     [107.872222, 21.797333],
//     [107.880000, 21.800000],
//     [107.882222, 21.802222],
//     [107.890000, 21.790000],
//     [107.880000, 21.800000],
//     [107.882222, 21.802222],
// ];

// const k = 2;
// const clusters = kMeans(data, k);
