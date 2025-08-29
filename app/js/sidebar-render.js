// 添加图片的数量
const addImgsNumObj = {
    many: 23,
    fewer: 11,
    showmore: 36,
    showSuperMore: 108,
};

// 获取初始添加几张图片
function getInitImgsNum(citys) {
    if (citys < 3) {
        return addImgsNumObj.many;
    }
    return addImgsNumObj.fewer;
}

// 连续3次点击一个分类的showmore 则 showsupermore
let lastClickShowMoreParent = null;
let hasClickTimes = 0;
function getAddImagesNum(parentElement) {
    if (parentElement === lastClickShowMoreParent) {
        hasClickTimes++;
    } else {
        hasClickTimes = 1;
        lastClickShowMoreParent = parentElement;
    }

    if (hasClickTimes >= 3) {
        return addImgsNumObj.showSuperMore;
    }
    return addImgsNumObj.showmore;
}

// 添加更多图片
function showMoreImages(event, imgs) {
    const parentElement = event.target.closest(".imgs-list");
    // 除掉“显示更多”
    const lastElement = parentElement.childNodes[parentElement.childNodes.length - 1];
    // 获取第一个的位置
    const strat = parentElement.children.length - 1;
    const addImg = getAddImagesNum(parentElement);
    const end = strat + addImg;
    const multipleLi = creatMultipleImageBoxHtml(imgs, strat, end);
    multipleLi.forEach((li) => {
        parentElement.insertBefore(li, lastElement);
    });
}

// 创建 img-box 图片盒子
function creatImageBoxHtml(src) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    li.addEventListener("click", function () {
        openPopup(src);
    });
    li.appendChild(img);
    return li;
}

// 创建 显示更多盒子
function creatShowMoreHtml(imgs) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = "显示更多";
    li.appendChild(span);
    li.addEventListener("click", function (event) {
        showMoreImages(event, imgs);
    });
    return li;
}

// 创建 info 城市介绍
function creatInfoDivHtml(info) {
    const city = info.length === 0 ? "其它" : info;
    const cityInfoDiv = document.createElement("div");
    cityInfoDiv.classList.add("info");
    cityInfoDiv.textContent = city;
    return cityInfoDiv;
}

// 创建 [<li>,<li>,<li>] 数组
function creatMultipleImageBoxHtml(imgs, start, end) {
    let list = [];
    for (let i = start; i < end && i < imgs.length; i++) {
        // 补偿图片路径
        const src = imgs[i].imgSrc;
        const li = creatImageBoxHtml(src);
        list.push(li);
    }
    return list;
}

// 创建 imgs-list 图片列表
function creatImageListHtml(imgs, citys) {
    const ul = document.createElement("ul");
    ul.classList.add("imgs-list");

    // 获取初始添加图片数量
    const initImgsNum = getInitImgsNum(citys);
    // 创建图片 li item
    const multipleLi = creatMultipleImageBoxHtml(imgs, 0, initImgsNum);
    multipleLi.forEach((li) => {
        ul.appendChild(li);
    });

    // 添加 显示更多盒子
    const li = creatShowMoreHtml(imgs);
    ul.appendChild(li);

    return ul;
}

// 创建城市 li 分类
function creatCitysListHtml(imgs, cityName, cityNum) {
    const cityLi = document.createElement("li");
    // 地点介绍
    const div = creatInfoDivHtml(cityName);
    // 很多图片的ul
    const ul = creatImageListHtml(imgs, cityNum);

    cityLi.appendChild(div);
    cityLi.appendChild(ul);
    return cityLi;
}
