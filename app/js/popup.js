let CurImgIndex = 0;

// 初始化
function initPopup() {
    // 初始化交互事件
    initPopupEvent();
}

// 初始化按钮
function initButton(index) {
    showButton("left");
    showButton("right");
    toggoButtonByIndex(index);
}

// 开启弹窗
function openPopup(src) {
    const index = findCurrentImgIndex(src);
    // 初始化弹窗按钮
    initButton(index);

    showPopup();
    // 更新当前图片
    updateImage(index);
    // 预加载前后图片
}

// 关闭弹窗
function closePopup() {
    CurImgIndex = -1;
    hiddenPopup();
}

// 下载当前照片
function downloadCurrntImg() {
    const src = compensataPath(CURRENTSHOWIMGS[CurImgIndex].imgSrc);
    // 获取文件名
    const filename = src.split("/").pop();
    downloadImg(src, filename);
}

// 播放下一张
function playNextPhoto() {
    const index = CurImgIndex;
    // 左右按钮的隐藏
    toggoButtonByIndex(index, "next");
    // 展示下一张
    updateImage(index + 1);
    // 预加载下下张
    preloadImage(index + 2);
}

// 播放上一张
function playLastPhoto() {
    const index = CurImgIndex;
    toggoButtonByIndex(index, "last");
    updateImage(index - 1);
    preloadImage(index - 2);
}

function initPopupEvent() {
    // 点击下一张 || 左滑
    dom.right.addEventListener("click", playNextPhoto);
    // 点击上一张 || 右滑
    dom.left.addEventListener("click", playLastPhoto);
    // 点击下载
    dom.download.addEventListener("click", downloadCurrntImg);
    // 点击关闭按钮
    dom.close.addEventListener("click", closePopup);
    // 点击图片的关闭
    dom.popup.addEventListener("click", function (event) {
        if (!event.target.closest(".ctrl")) {
            closePopup();
        }
    });

    // 左滑 右滑
    let startX;
    let startY;
    let threshold = 50; // 阈值，滑动距离大于该值时才算有效滑动

    // 监听touchstart事件，记录起始位置
    dom.popup.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });

    // 监听touchend事件，计算滑动距离，判断是左滑还是右滑
    dom.popup.addEventListener("touchend", function (event) {
        let endX = event.changedTouches[0].clientX;
        let endY = event.changedTouches[0].clientY;

        let deltaX = endX - startX;
        let deltaY = endY - startY;

        // 判断滑动距离是否大于阈值
        if (Math.abs(deltaX) > threshold && Math.abs(deltaY) < threshold) {
            // 左滑
            if (deltaX < 0) {
                playNextPhoto();
            }
            // 右滑
            else {
                playLastPhoto();
            }
        }
    });
}
