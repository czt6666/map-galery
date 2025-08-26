// 响应式
function responsive() {
    const body = document.body;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // 检查宽度是否小于 xxx
    if (screenWidth < 940) {
        body.classList.add('m');
    } else {
        body.classList.remove('m');
    }
}

// 执行主函数 
async function main() {
    window.addEventListener('DOMContentLoaded', responsive);
    window.addEventListener('resize', responsive);

    try {
        const { database, center, zoom } = parseUrlParams()
        const server = COMPUTER ? 'https://czt666.cn' : 'http://127.0.0.1'
        const ImageData = await fetchData(`${server}:${PORT}/geturldata`, { database });
        if (!ImageData) {
            throw new Error("获取数据失败");
        }
        // 初始化地图
        const map = await initMap(center, zoom);
        // 绑定地图事件
        addMapEvent(map, ImageData);
        // 延迟非关键组件渲染
        setTimeout(() => {
            // 初始化侧边栏
            initSideBar(ImageData)
            // 初始化弹窗
            initPopup()
        }, 0)
        // Promise.resolve().then(() => {
        // })
    } catch (error) {
        console.log(error);
        // 展示错误页面
        showErrorPage()
    }
}

main()