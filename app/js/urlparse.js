const defaultCoordinates = {
    center: [108.2, 36.5],
    zoom: 4,
    database: [],
}

function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    const dataParam = urlParams.get('data');
    const displayParam = urlParams.get('display');
    const centerParam = urlParams.get('center');
    const zoomParam = urlParams.get('zoom');

    // 预设数据范围
    if (dataParam && UrlCustomParams[dataParam]) {
        const data = UrlCustomParams[dataParam];
        return { database: data.database, center: data.center, zoom: data.zoom };
    }

    // 预设展示范围
    if (displayParam && UrlCustomParams[displayParam]) {
        const data = UrlCustomParams[displayParam];
        return { center: data.center, zoom: data.zoom };
    }

    // 自定义展示范围
    if (centerParam || zoomParam) {
        try {
            const center = JSON.parse(centerParam) || defaultCoordinates.center;
            const zoom = parseInt(zoomParam, 10) || defaultCoordinates.zoom;

            // 检查center是否为长度为2的数组并且数组元素都是数字
            if (!Array.isArray(center) || center.length !== 2 || isNaN(center[0]) || isNaN(center[1])) {
                throw new Error("center必须是包含两个数字的数组");
            }

            // 检查zoom是否为数字
            if (isNaN(zoom) || zoom <= 0) {
                throw new Error("zoom必须是数字");
            }

            return { database: [], center, zoom };
        } catch (error) {
            console.error(error);
            return defaultCoordinates;
        }
    }

    return defaultCoordinates
}
