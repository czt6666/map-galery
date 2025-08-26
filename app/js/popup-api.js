// 找到当前图片是全部图片的第几个
function findCurrentImgIndex(src) {
    const rawImgSrc = src.replace(adjustFileLocation, '')
    return CURRENTSHOWIMGS.findIndex(item => item.imgSrc === rawImgSrc)
}

// 显示弹窗
function showPopup() {
    dom.popup.style.display = "block";
    setTimeout(function () {
        dom.popup.style.opacity = 1;
    }, 0);
}

// 掩藏弹窗
function hiddenPopup() {
    dom.popup.style.opacity = 0;
    setTimeout(function () {
        dom.popup.style.display = "none";
    }, 300);
}

// 隐藏按钮
function hiddenButton(button) {
    dom[button].style.display = 'none'
}

// 显示按钮
function showButton(button) {
    dom[button].style.display = 'block'
}

// 执行下载
function downloadImg(src, name) {
    const a = document.createElement('a');
    a.href = src;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 更新图片
function updateImage(index) {
    if (0 <= index && index < CURRENTSHOWIMGS.length) {
        const src = compensataPath(CURRENTSHOWIMGS[index].imgSrc)
        CurImgIndex = index
        dom.pop_img.src = src
    }
}

// 预加载照片
function preloadImage(index) {
    if (0 <= index && index < CURRENTSHOWIMGS.length) {
        const src = compensataPath(CURRENTSHOWIMGS[index].imgSrc);
        const img = new Image();
        img.src = src;
    }
}

// 根据索引和动作判断 是否要隐藏按钮
function toggoButtonByIndex(index, lastAction = 'none') {
    // 判断一阶
    if (index >= CURRENTSHOWIMGS.length - 1) {
        hiddenButton('right')
    }
    if (index <= 0) {
        hiddenButton('left')
    }
    if (lastAction === "none") return
    // 判断反向及二阶
    if (lastAction === 'next') {
        // 判断反方向有没有
        if (index >= 0) {
            showButton('left')
        }
        if (index + 2 >= CURRENTSHOWIMGS.length) {
            // 下一个没有下一个 隐藏按钮
            hiddenButton('right')
        }
    }
    if (lastAction === 'last') {
        if (CurImgIndex + 1 <= CURRENTSHOWIMGS.length) {
            showButton('right')
        }
        if (CurImgIndex - 2 < 0) {
            hiddenButton('left');
        }
    }
}