// 找到给定点的邻居
function findNeighbors(points, pointIndex, epsilon) {
    const neighbors = [];
    const point = points[pointIndex];
    for (let i = 0; i < points.length; i++) {
        if (i !== pointIndex) {
            const distance = haversineDistance(point, points[i]);
            if (distance <= epsilon) {
                neighbors.push(i);
            }
        }
    }
    return neighbors;
}

// 扩展簇
function expandCluster(points, pointIndex, neighbors, cluster, visited, epsilon, minPts) {
    cluster.push(pointIndex);

    for (let i = 0; i < neighbors.length; i++) {
        const neighborIndex = neighbors[i];
        if (!visited[neighborIndex]) {
            visited[neighborIndex] = true;
            const newNeighbors = findNeighbors(points, neighborIndex, epsilon);
            if (newNeighbors.length >= minPts) {
                neighbors.push(...newNeighbors);
            }
        }
        if (!cluster.includes(neighborIndex)) {
            cluster.push(neighborIndex);
        }
    }
}

// DBSCAN算法
function dbscan(points, epsilon, minPts) {
    const visited = new Array(points.length).fill(false);
    const clusters = [];

    for (let i = 0; i < points.length; i++) {
        if (visited[i]) continue;

        visited[i] = true;
        const neighbors = findNeighbors(points, i, epsilon);

        if (neighbors.length < minPts) {
            clusters.push(null); // 标记为噪声
        } else {
            const cluster = [];
            expandCluster(points, i, neighbors, cluster, visited, epsilon, minPts);
            clusters.push(cluster);
        }
    }

    return clusters;
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

// 将点进行聚类
function mapDbscan(imgData, epsilon, minPts) {
    // 分离gps数据
    const gpsData = imgData.map((img) => img.gps)
    // console.log(11);
    // 聚类
    const clustersGpsIndex = dbscan(gpsData, epsilon, minPts);
    // console.log(clustersGpsIndex);
    // console.log(22);
    // 将聚类索引解析为imgList
    const clustersImageList = clustersGpsIndex
        // 噪声点
        .filter(item => item)
        .map(clusterIndexList => {
            if (clusterIndexList === null) {
                return;
            }

            // 根据索引拿图片
            return clusterIndexList.map(index => imgData[index]);
        });
    // console.log(clustersImageList);

    // 计算imgList中心
    const clustersResult = clustersImageList.map(imgList => {
        // 得到一类图片的gps信息
        const gpsList = imgList.map(img => img.gps)
        const center = calculateCentroid(gpsList)

        return {
            center: center,
            imgsInfo: imgList,
        }
    })
    // console.log(clustersResult);
    // console.log(33);
    return clustersResult
}

// 示例GPS数据
const gpsData = [
    [107.870567, 21.796001],
    [107.871234, 21.795111],
    [107.872222, 21.797333],
    [107.880000, 21.800000],
    [107.882222, 21.802222],
    [107.890000, 21.790000]
];

// 运行DBSCAN聚类
const epsilon = 500; // 距离阈值，单位：米
const minPts = 0; // 最小点数阈值

// const clusters = mapDbscan(gpsData, epsilon, minPts)

// console.log(clusters);

// module.exports = dbscan