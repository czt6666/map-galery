// 响应式
function responsive() {
    const body = document.body;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // 检查宽度是否小于 xxx
    if (screenWidth < 940) {
        body.classList.add("m");
    } else {
        body.classList.remove("m");
    }
}

// 执行主函数
async function main() {
    window.addEventListener("DOMContentLoaded", responsive);
    window.addEventListener("resize", responsive);

    try {
        const { database, center, zoom } = parseUrlParams();
        const server = COMPUTER ? "https://czt666.cn" : "http://127.0.0.1";
        const [ImageData, map] = await Promise.all([
            fetchData(`${server}:${PORT}/api/geturldata`, { database }),
            initMap(center, zoom),
        ]);

        if (!ImageData) {
            throw new Error("获取数据失败");
        }

        // 替换 gps
        const transImageData = ImageData.map((item) => ({
            ...item,
            gps: wgs84togcj02(item.gps),
        }));

        // 绑定地图事件
        addMapEvent(map, transImageData);
        // 延迟非关键组件渲染
        setTimeout(() => {
            // 初始化侧边栏
            initSideBar(transImageData);
            // 初始化弹窗
            initPopup();
        }, 0);
    } catch (error) {
        console.log(error);
        // 展示错误页面
        showErrorPage();
    }
}

main();
