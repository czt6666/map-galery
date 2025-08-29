window._AMapSecurityConfig = {
    securityJsCode: AmapConfig.securityJsCode,
};

// 添加控件
function addControl(map) {
    AMap.plugin(["AMap.Scale", "AMap.MapType"], function () {
        const scale = new AMap.Scale();
        map.addControl(scale);
        map.addControl(new AMap.MapType());
    });
}

// 获取缩放后的显示区域横向距离，以米为单位
function getVisibleHorizontalDistance(map) {
    const bounds = map.getBounds();
    const southwest = bounds.getSouthWest();
    const northeast = bounds.getNorthEast();
    const horizontalDistance = AMap.GeometryUtil.distance(southwest, [northeast.lng, southwest.lat]);
    return horizontalDistance;
}

// 获取缩放后的显示区域纵向距离，以米为单位
function getVisibleVerticalDistance(map) {
    const bounds = map.getBounds();
    const southwest = bounds.getSouthWest();
    const northeast = bounds.getNorthEast();
    const verticalDistance = AMap.GeometryUtil.distance([northeast.lng, southwest.lat], northeast);
    return verticalDistance;
}

// 获取可见区域的数据
function getVisibleData(map, ImageData) {
    const bounds = map.getBounds();
    const visibleData = ImageData.filter((img) => bounds.contains(img.gps || img));
    return visibleData;
}

// 清除地图上所有的 CircleMarker
function clearAllCircleMarkers(map) {
    map.getAllOverlays().forEach(function (overlay) {
        if (overlay instanceof AMap.CircleMarker) {
            map.remove(overlay);
        }
    });
}

// 创建图片标记的 DOM 内容
function createImageMarkerHtml(src, num) {
    return `<div class="imgmark" style="background-image: url('${src}');"><span>${num}</span></div>`;
}

// 添加 DefaultMarker
function addDefaultMarker(map, points) {
    points.forEach(function (point) {
        const marker = new AMap.Marker({
            position: point,
            map: map,
        });

        // 鼠标悬浮
        marker.dom.addEventListener("mouseover", function () {
            console.log(point);
        });
    });
}

// 添加 CircleMarker
function addCricleMarker(map, points) {
    clearAllCircleMarkers(map);
    points.forEach((point) => {
        const centerPoint = new AMap.LngLat(point[0], point[1]);
        const circleMarker = new AMap.CircleMarker({
            center: centerPoint,
            radius: 10,
            strokeColor: "white",
            strokeWeight: 2,
            strokeOpacity: 0.5,
            fillColor: "rgba(0,0,255,1)",
            fillOpacity: 0.5,
            zIndex: 10,
            cursor: "pointer",
        });
        map.add(circleMarker);
    });
}

// 添加图片标记
function addImageMarker(map, marks) {
    map.clearMap();
    marks.forEach((mark) => {
        // const [gcjLon, gcjLat] = wgs84togcj02(mark.position);
        const content = createImageMarkerHtml(mark.src, mark.num);
        const marker = new AMap.Marker({
            content,
            // position: [gcjLon, gcjLat], // 基点位置
            position: mark.position, // 基点位置
        });
        map.add(marker);

        marker.dom.addEventListener("click", function () {
            // 点击了图片标记
            clickImageMark(mark.rawData);
        });

        // const circle = new AMap.Circle({
        //     center: [gcjLon, gcjLat],
        //     radius: 5, // 单位：米
        //     fillColor: "red",
        //     fillOpacity: 1,
        //     strokeWeight: 0,
        // });
        // map.add(circle);
    });
}

// 绘制可见点
function drawVisiblePoints(map, visibleData) {
    const visiblePoints = visibleData.map((item) => item.gps || item);
    addDefaultMarker(map, visiblePoints);
}

// 绘制簇中心点
function drawClusterPoints(map, clusteredData) {
    const clusterPoints = clusteredData.map((item) => item.center || item);
    addCricleMarker(map, clusterPoints);
}

// 绘制照片点
function drawPhotoPoints(map, clusteredData) {
    // 加工marks数组
    const marks = clusteredData.map((cluster) => {
        return {
            position: cluster.center,
            num: cluster.imgsInfo.length,
            src: cluster.imgsInfo[0].imgSrc, // 选择有代表性照片
            rawData: cluster.imgsInfo,
        };
    });
    addImageMarker(map, marks);
}

// 聚类点
function drawClusterResult(map, clusterPoints, checkTimer = true) {
    const clusterStartTime2 = performance.now();
    map.plugin(["AMap.MarkerCluster"], function () {
        cluster = new AMap.MarkerCluster(map, clusterPoints);
    });
    const clusterEndTime2 = performance.now();
    const clusterExecutionTime2 = clusterEndTime2 - clusterStartTime2;
    // console.log(`聚类为${clusteredData.length}个点，函数执行${executionTime}毫秒`);
    if (checkTimer) {
        console.log(`${clusterExecutionTime2}毫秒`);
    }
}

// 海量点
function drawMassivePoints(map, points) {
    const style = {
        url: "https://a.amap.com/jsapi_demos/static/images/mass0.png", //图标地址
        size: new AMap.Size(11, 11), //图标大小
        anchor: new AMap.Pixel(5, 5), //图标显示位置偏移量，基准点为图标左上角
    };
    const massMarks = new AMap.MassMarks(points, {
        zIndex: 5, //海量点图层叠加的顺序
        zooms: [3, 19], //在指定地图缩放级别范围内展示海量点图层
        style: style, //设置样式对象
    });
    massMarks.setMap(map);
}
