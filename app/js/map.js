// 初始化地图
async function initMap(center = [108.2, 36.5], zoom = 4) {
    const AMap = await AMapLoader.load({
        key: AmapConfig.key,
        version: "2.0"
    });

    // 设置中心点
    const satellite = new AMap.TileLayer.Satellite();
    const map = new AMap.Map("container", {
        zoom,
        center,
        layers: [satellite],
        correct: true
    });

    // 绑定控件
    addControl(map);

    return map;
}

// 添加地图事件
function addMapEvent(map, ImageData) {
    // 首次渲染 添加异步任务
    setTimeout(() => {
        handleMapChange(map, ImageData);
    }, 0)

    map.on('zoomend', function (event) {
        handleMapChange(map, ImageData);
    });

    map.on('moveend', function (event) {
        handleMapChange(map, ImageData);
    });

    map.on('click', function () {
        const { lng, lat } = map.getCenter()
        const zoom = map.getZoom()
        console.log(`    // lng:   ${lng}   lat:   ${lat}   zoom:   ${zoom}  `);
    })

    // 加载完成揭下面罩
    map.on("complete", function () {
        setTimeout(() => {
            loadingmask.style.display = "none"
        }, 1)
    })
}

// 获取 epsilon 值
function getEpsilon(map) {
    const verticalDistance = getVisibleVerticalDistance(map);
    return parseInt(verticalDistance / 10);
}

// 处理地图变化事件
function handleMapChange(map, ImageData) {
    // 获取可视区内标点
    const visiStartTime = performance.now();
    const visibleData = getVisibleData(map, ImageData);
    const visiEndTime = performance.now();
    const executionTime = visiEndTime - visiStartTime;
    // console.log(`${visibleData.length}个点在可视区内，计算用时${executionTime}毫秒`);

    // 调整聚类参数
    const epsilon = getEpsilon(map);
    // 开始聚类算法
    const clusterStartTime = performance.now();
    const clusteredData = mapKmens(visibleData, 5, epsilon);
    const clusterEndTime = performance.now();
    const clusterExecutionTime = clusterEndTime - clusterStartTime;
    console.log(`聚类为${clusteredData.length}个点，函数执行${clusterExecutionTime}毫秒`);



    // 绘制聚类点照片
    drawPhotoPoints(map, clusteredData)
    // 绘制所有可见点
    // drawVisiblePoints(map, visibleData)
    // 绘制聚类点
    // drawClusterPoints(map, clusteredData)
}
