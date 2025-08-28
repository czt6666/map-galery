// getLocationData.test.js
const getLocationData = require("../scripts/photoCompress/getLocation");
const axios = require("axios");

// Mock axios.get
jest.mock("axios");

describe("getLocationData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // test("返回正确的省市区信息", async () => {
    //     axios.get.mockResolvedValue({
    //         data: {
    //             status: "1",
    //             regeocode: {
    //                 addressComponent: {
    //                     province: "北京市",
    //                     city: "北京市",
    //                     district: "海淀区",
    //                 },
    //             },
    //         },
    //     });

    //     const result = await getLocationData({ latitude: 39.9, longitude: 116.3 });
    //     expect(result).toEqual({
    //         province: "北京市",
    //         city: "北京市",
    //         district: "海淀区",
    //     });
    //     expect(axios.get).toHaveBeenCalledTimes(1);
    // });

    // test("重复请求同一位置以内10000米复用缓存", async () => {
    //     axios.get.mockResolvedValue({
    //         data: {
    //             status: "1",
    //             regeocode: { addressComponent: { province: "北京市", city: "北京市", district: "朝阳区" } },
    //         },
    //     });

    //     // 第一次请求
    //     await getLocationData({ latitude: 39.9, longitude: 116.3 });

    //     // 第二次：在10000米内
    //     const result2 = await getLocationData({ latitude: 39.9001, longitude: 116.3001 });
    //     const result3 = await getLocationData({ latitude: 39.9011, longitude: 116.3021 });
    //     const result4 = await getLocationData({ latitude: 39.9021, longitude: 116.3031 });

    //     expect(result2).toEqual({
    //         province: "北京市",
    //         city: "北京市",
    //         district: "朝阳区",
    //     });
    //     expect(result3).toEqual({
    //         province: "北京市",
    //         city: "北京市",
    //         district: "朝阳区",
    //     });
    //     expect(result4).toEqual({
    //         province: "北京市",
    //         city: "北京市",
    //         district: "朝阳区",
    //     });

    //     // axios.get 只调用一次
    //     expect(axios.get).toHaveBeenCalledTimes(1);
    // });

    // test("请求失败时自动重试3次", async () => {
    //     axios.get
    //         .mockRejectedValueOnce(new Error("网络错误"))
    //         .mockRejectedValueOnce(new Error("网络错误"))
    //         .mockResolvedValueOnce({
    //             data: {
    //                 status: "1",
    //                 regeocode: {
    //                     addressComponent: { province: "上海市", city: "上海市", district: "浦东新区" },
    //                 },
    //             },
    //         });

    //     const result = await getLocationData({ latitude: 31.2, longitude: 121.5 });
    //     expect(result.city).toBe("上海市");
    //     expect(axios.get).toHaveBeenCalledTimes(3); // 重试了 2 次后成功
    // });

    // test("无经纬度返回空对象", async () => {
    //     const result = await getLocationData({ latitude: 0 });
    //     expect(result).toEqual({});
    // });

    test("批量请求并发控制，最多 3 个同时请求", async () => {
        let currentConcurrency = 0;
        let maxConcurrency = 0;

        // 模拟 axios.get 慢请求
        axios.get.mockImplementation(async () => {
            currentConcurrency++;
            if (currentConcurrency > maxConcurrency) maxConcurrency = currentConcurrency;

            // 模拟网络延迟
            await new Promise((r) => setTimeout(r, 50));

            currentConcurrency--;

            return {
                data: {
                    status: "1",
                    regeocode: {
                        addressComponent: { province: "测试省", city: "测试市", district: "测试区" },
                    },
                },
            };
        });

        const requests = Array.from({ length: 100 }, (_, i) =>
            getLocationData({ latitude: 10 + i * 0.5, longitude: 120 + i * 1 }),
        );

        const results = await Promise.all(requests);

        // 检查返回结果是否正确
        results.forEach((r) => {
            expect(r.city).toBe("测试市");
            expect(r.province).toBe("测试省");
        });

        // 检查最大并发数是否 <= 3
        expect(maxConcurrency).toBeLessThanOrEqual(3);
        console.log("最大并发数:", maxConcurrency);
    }, 15000); // 适当延长超时时间
});
