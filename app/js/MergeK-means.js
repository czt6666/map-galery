/**
 * 聚类算法及簇合并
 *
 * 这个算法实现了 K-means 聚类算法，并在聚类完成后，根据设定的 epsilon 距离阈值，将距离在 epsilon 以内的簇合并。
 * 输入数据包含每个点的经纬度信息，根据经纬度计算点之间的正半矢距离。聚类完成后，返回每个簇的数据点及其质心信息。
 * 在聚类完成后，可以使用该算法将一组经纬度坐标聚类，并将距离在 epsilon 以内的簇合并，以便后续分析或可视化。
 *
 * 函数列表：
 * - assignPointsToClusters(data, centroids): 将数据点分配到最近的聚类中心
 * - updateCentroids(clusters): 更新聚类中心
 * - centroidsNotUpdated(oldCentroids, newCentroids): 检查新的聚类中心与旧的中心是否相同
 * - initializeCentroids(data, k): 固定选择初始聚类中心
 * - withinEpsilon(point1, point2, epsilon): 判断两个点之间是否在 epsilon 范围内
 * - mergeClusters(centroids, clusters, epsilon): 合并距离在 epsilon 以内的簇
 * - kMeans(data, k, maxIterations, epsilon): K均值聚类算法及簇合并主函数
 *
 * 使用到的工具函数：
 * - haversineDistance计算正半矢
 * - calculateCentroid计算聚类中心点
 */

// 根据给定的中心点，将数据点分配到最近的聚类中心
function assignPointsToClusters(data, centroids) {
    const clusters = new Array(centroids.length).fill().map(() => []);

    data.forEach((item) => {
        let minDistance = Infinity;
        let closestCentroidIndex = -1;
        centroids.forEach((centroid, index) => {
            const distance = haversineDistance(item, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                closestCentroidIndex = index;
            }
        });
        clusters[closestCentroidIndex].push(item);
    });

    return clusters;
}

// 根据分配的聚类，更新聚类中心
function updateCentroids(clusters) {
    return clusters.map((cluster) => {
        const centroid = cluster.reduce(
            (acc, item) => {
                acc[0] += parseFloat(item[0]);
                acc[1] += parseFloat(item[1]);
                return acc;
            },
            [0, 0],
        );

        return [centroid[0] / cluster.length, centroid[1] / cluster.length];
    });
}

// 检查新的聚类中心与旧的中心是否相同
function centroidsNotUpdated(oldCentroids, newCentroids) {
    return oldCentroids.every((centroid, index) => {
        if (!centroid) {
            console.error("无聚类中心", centroidsNotUpdated);
            return [];
        }
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
    return haversineDistance(point1, point2) <= epsilon;
}

// 合并距离在 epsilon 以内的簇
function mergeClusters(centroids, clusters, epsilon) {
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
function kMeans(data, k = 4, epsilon = 100, maxIterations = 100) {
    if (!data.length) {
        return [];
    }
    // 固定选择初始聚类中心
    let centroids = initializeCentroids(data, k);

    let iterations = 0;
    let oldCentroids;
    let clusters;

    // 迭代更新聚类中心
    do {
        oldCentroids = centroids.slice();
        clusters = assignPointsToClusters(data, centroids);
        centroids = updateCentroids(clusters);
        iterations++;
    } while (!centroidsNotUpdated(oldCentroids, centroids) && iterations < maxIterations);

    // 合并距离在 epsilon 以内的簇
    const mergedClusters = mergeClusters(centroids, clusters, epsilon);

    return mergedClusters;
}

// function mapKmens(visibleData, k = 4, epsilon = 100) {
//     // 获取纯GPS信息
//     const gpsData = visibleData.map(item => item.gps || item)

//     const clusteredGps = kMeans(gpsData, k, epsilon);

//     // 将聚类结果与原始数据点对应起来
//     const copyVisibleData = JSON.parse(JSON.stringify(visibleData));
//     const clusteredData = clusteredGps.map(cluster => {
//         return cluster.map(gps => {
//             const index = copyVisibleData.findIndex(item => {
//                 return item.gps[0] === gps[0] && item.gps[1] === gps[1] && !item.hasfind;
//             });
//             if (index !== -1) {
//                 copyVisibleData[index].hasfind = 1;
//                 return copyVisibleData[index];
//             }
//             return null;
//         }).filter(item => item !== null); // 过滤掉 null 值
//     });

//     const result = clusteredData
//         .filter(item => item.length)
//         .map(cluster => {
//             const pointsGps = cluster.map(item => item.gps)
//             const center = calculateCentroid(pointsGps)
//             return {
//                 center,
//                 imgsInfo: cluster,
//             }
//         })
//     return result
// }

function mapKmens(visibleData, k = 4, epsilon = 100) {
    // 获取纯GPS信息
    const gpsData = visibleData.map((item) => item.gps || item);

    // 使用 kMeans 进行聚类
    const clusteredGps = kMeans(gpsData, k, epsilon);

    // 构建一个 Map 来存储和查找 GPS 数据
    const gpsMap = new Map();
    visibleData.forEach((item) => {
        const key = item.gps.join(",");
        if (!gpsMap.has(key)) {
            gpsMap.set(key, []);
        }
        gpsMap.get(key).push(item);
    });

    // 将聚类结果与原始数据点对应起来
    const clusteredData = clusteredGps.map((cluster) => {
        return cluster
            .map((gps) => {
                const key = gps.join(",");
                const items = gpsMap.get(key) || [];
                const item = items.find((i) => !i.hasfind);
                if (item) {
                    item.hasfind = 1;
                    return item;
                }
                return null;
            })
            .filter((item) => item !== null); // 过滤掉 null 值
    });

    // 计算每个聚类的中心点并返回结果
    const result = clusteredData
        .filter((cluster) => cluster.length > 0)
        .map((cluster) => {
            const pointsGps = cluster.map((item) => item.gps);
            const center = calculateCentroid(pointsGps);
            return {
                center,
                imgsInfo: cluster,
            };
        });

    return result;
}

// 示例用法
// const visibleData = [
//     {
//         "imgSrc": "D:/WebFrontEnd/Study/SVG/广西照片/十万大山无人机/DJI_0903.JPEG",
//         "gps": ["106.675872", "22.997167"],
//         "shotTime": "1707367474000"
//     },
//     // 其他数据点...
// ];

// const k = 4;
// const epsilon = 100; // 单位为米
// const clusteredData = mapKmens(visibleData, k, epsilon);
// console.log(clusteredData);
