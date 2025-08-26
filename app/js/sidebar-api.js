// 切换屏幕大小
function toggoSmlScreen() {
    dom.sidebar.classList.remove("active");
    dom.sidebar.classList.remove("full");
    dom.menubtn_ref.innerText = "展开菜单"
    dom.fullbtn_ref.innerText = "全屏展示"
}

function toggoMidScreen() {
    dom.sidebar.classList.remove("full");
    dom.sidebar.classList.add("active");
    dom.menubtn_ref.innerText = "关闭菜单"
    dom.fullbtn_ref.innerText = "全屏展示"
}

function toggoLagScreen() {
    dom.sidebar.classList.remove("active");
    dom.sidebar.classList.add("full");
    dom.menubtn_ref.innerText = "关闭菜单"
    dom.fullbtn_ref.innerText = "半屏展示"
}

function toggoMidOrLagScreen() {
    if (!dom.sidebar.classList.contains("full")) {
        toggoMidScreen()
    }
}

// 切换时间分类
function toggoTimeSort(isReduce) {
    dom.timebtn.classList.add("active");
    dom.locationbtn.classList.remove("active");
    showImagesSortByTime(isReduce)
}

// 切换地点分类
function toggoLocationSort(isReduce) {
    dom.locationbtn.classList.add("active");
    dom.timebtn.classList.remove("active");
    showImagesSortByLocation(isReduce)
}

// 展示图片
// function showImages(categories, otherTag = '城市') {
//     dom.city_list.innerHTML = "";
//     let otherCity = null;
//     const fragment = document.createDocumentFragment();

//     // 获取所有城市名称
//     const cities = Object.keys(categories);

//     for (const city of cities) {
//         const cityNum = cities.length;
//         const cityLi = creatCitysListHtml(categories[city], city, cityNum);

//         // 最后添加其它城市
//         if (city === '') {
//             cityLi.querySelector('.info').innerText += otherTag;
//             otherCity = cityLi;
//             continue;
//         }

//         fragment.appendChild(cityLi);
//     }

//     // 添加其它城市
//     if (otherCity) {
//         fragment.appendChild(otherCity);
//     }

//     // 添加批量处理好的城市列表项
//     dom.city_list.appendChild(fragment);
// }

// 展示图片
function showImages(categories, otherTag = '城市') {
    dom.city_list.innerHTML = "";
    let otherCity = null;
    const fragment = document.createDocumentFragment();

    // 获取所有城市名称
    const cities = Object.keys(categories);

    for (const city of cities) {
        const cityNum = cities.length;
        const cityLi = creatCitysListHtml(categories[city], city, cityNum);

        // 最后添加其它城市
        if (city === '') {
            cityLi.querySelector('.info').innerText += otherTag;
            otherCity = cityLi;
            continue;
        }

        // 替换图片的src为data-src
        const images = cityLi.querySelectorAll('img');
        images.forEach(img => {
            img.dataset.src = img.src;
            img.src = '';
            img.classList.add('lazy');
        });

        fragment.appendChild(cityLi);
    }

    // 添加其它城市
    if (otherCity) {
        const images = otherCity.querySelectorAll('img');
        images.forEach(img => {
            img.dataset.src = img.src;
            img.src = '';
            img.classList.add('lazy');
        });

        fragment.appendChild(otherCity);
    }

    // 添加批量处理好的城市列表项
    dom.city_list.appendChild(fragment);

    // 设置IntersectionObserver
    const lazyLoadImages = () => {
        const lazyImages = document.querySelectorAll('img.lazy');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            observer.observe(img);
        });
    };

    // 调用懒加载函数
    lazyLoadImages();
}
