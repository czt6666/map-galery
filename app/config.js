// 本机:0 https服务器:1
const COMPUTER = 0;
const PORT = 7105;
const VERSION = "0.2.0";

const AmapConfig = {
    key: "cace0c9b67dbbaebc5f2d68d371ccfdf",
    securityJsCode: "daa2af11f5b4ed49eb8724d0c187e58e",
};

const adjustFileLocation = "./upload";

const UrlCustomParams = {
    // 按省市范围分类
    bj: {
        name: "北京市",
        database: [
            "37yytyinghua",
            "37xiaoyuanqiujing",
            "37bulaotun",
            "37beihaixue",
            "37jinguangcd",
            "37taoyuanxiangu",
            "37lizesoho",
            "37guixiaoshi",
            "37beilizaochun",
            "37beilichunxue",
        ],
        center: [116.37218, 40.057733],
        zoom: 9.07,
    },
    cq: {
        name: "重庆市",
        database: ["36chongqing"],
        center: [106.573239, 29.567702],
        zoom: 14.57,
    },
    xj: {
        name: "新疆省",
        database: ["36xinjiang"],
        center: [84.357511, 41.518856],
        zoom: 5.53,
    },
    gx: {
        name: "广西省",
        database: ["36guangxi"],
        center: [108.763404, 23.563656],
        zoom: 7.29,
    },
    hz: {
        name: "杭州市",
        database: ["37hangzhou"],
        center: [120.165287, 30.246661],
        zoom: 12.8,
    },
    sh: {
        name: "上海市",
        database: ["37hangzhou"],
        center: [121.490402, 31.237001],
        zoom: 14.79,
    },
    jl: {
        name: "吉林省",
        database: ["37chunjie"],
        center: [126.366674, 44.025178],
        zoom: 8.39,
    },

    // 按拍摄主体分类
    yh: {
        name: "烟花",
        database: ["36guangxi"],
        center: [114.438554, 28.104841],
        zoom: 17.87,
    },

    // 北京市外旅游活动
    xdy: {
        name: "西大洋",
        database: ["55xidayang"],
        center: [114.748432, 38.767695],
        zoom: 14.52,
    },

    // 北京市内旅游活动
    blt: {
        name: "不老屯",
        database: ["37bulaotun"],
        center: [116.979279, 40.558116],
        zoom: 16.11,
    },
    yyt: {
        name: "玉渊潭",
        database: ["37yytyinghua"],
        center: [116.314635, 39.915796],
        zoom: 15.67,
    },
    yhy: {
        name: "颐和园",
        database: ["37jinguangcd"],
        center: [116.267996, 39.99153],
        zoom: 14.57,
    },
    ymy: {
        name: "圆明园",
        database: [],
        center: [116.3067, 40.004237],
        zoom: 15.23,
    },
    blg: {
        name: "北理工",
        database: ["37xiaoyuanqiujing", "37beilizaochun", "37beilichunxue"],
        center: [116.164918, 39.731306],
        zoom: 16.11,
    },
    bhgy: {
        name: "北海公园",
        database: ["37beihaixue"],
        center: [116.385098, 39.923835],
        zoom: 16.55,
    },

    // location: {
    //     name: "北京市",
    //     database: [],
    //     center: [jingdu, weidu],
    //     zoom: zoomnumber,
    // },
    // location: {
    //     name: "北京市",
    //     database: [],
    //     center: [jingdu, weidu],
    //     zoom: zoomnumber,
    // },
};
