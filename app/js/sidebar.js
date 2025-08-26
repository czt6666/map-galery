let CURRENTSHOWIMGS = []

// 初始化
function initSideBar(imageData) {
    // 设置展示照片 
    CURRENTSHOWIMGS = imageData
    // 侧边栏宽度归位
    toggoSmlScreen()
    // 分类选项归位
    toggoTimeSort()
    // 初始化事件
    initSidebarEvent()
}

// 点击了图片标记
function clickImageMark(imageData) {
    CURRENTSHOWIMGS = imageData
    toggoLocationSort()
    showImagesSortByLocation()
    toggoMidOrLagScreen()
}

// 初始化事件
function initSidebarEvent() {
    // menubtn 菜单按钮
    dom.menubtn.addEventListener("click", function () {
        if (dom.sidebar.classList.contains("active") || dom.sidebar.classList.contains("full")) {
            // 半屏 -> 按钮 || 全屏 -> 按钮
            toggoSmlScreen()
        } else {
            // 按钮 -> 半屏
            toggoMidScreen()
        }
    });

    // fullbtn 全屏按钮
    dom.fullbtn.addEventListener("click", function () {
        if (!dom.sidebar.classList.contains("full")) {
            // 半屏 -> 全屏
            toggoLagScreen()
        } else {
            // 全屏 -> 半屏
            toggoMidScreen()
        }
    });

    // timenav 时光轴按钮
    dom.timebtn.addEventListener("click", function () {
        toggoTimeSort()
        showImagesSortByTime()
    });

    // locationbtn 地点分类按钮
    dom.locationbtn.addEventListener("click", function () {
        toggoLocationSort()
        showImagesSortByLocation()
    });
}

// 展示地点分类后的图片
function showImagesSortByTime() {
    const categorizeResult = categorizeByDate(CURRENTSHOWIMGS)
    showImages(categorizeResult, "时间")
}

// 展示时间分类后的图片
function showImagesSortByLocation() {
    const categorizeResult = categorizeByCity(CURRENTSHOWIMGS)
    showImages(categorizeResult, "城市")
}

function showSidebar() {
    dom.sidebar.style.display = "flex"
    dom.placeholder.style.display = "block"
}