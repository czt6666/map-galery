/**
 * 关于照片路径
 *
 * 输入：该图片绝对路径，图片输出目录，图片输入目录
 * 输出：该图片绝对路径，图片相对路径（相对于/app/upload）
 */
const sharp = require("sharp"); // 用于图像处理
const path = require("path"); // 用于处理文件路径
const fs = require("fs"); // 用于文件系统操作
const config = require("../../config");
const watermarkVertical = path.resolve(__dirname, "const/vertical.png");
const watermarkHorizontal = path.resolve(__dirname, "const/horizontal.png");

// 压缩图片的函数
async function imageCompress(imagePath, outputFile, inputPath) {
    const newFileName = changeFileExtName(path.basename(imagePath)); // 新文件名
    const relativeDir = truncatePath(imagePath, inputPath);
    const lastDir = path.basename(outputFile);
    const outputDir = path.join(outputFile, relativeDir).replace(/\\/g, "/");
    const relativePath = path.join("/", lastDir, relativeDir, newFileName).replace(/\\/g, "/");
    const outputPath = path.join(outputDir, newFileName).replace(/\\/g, "/");

    // 检查输出目录是否存在，若不存在则创建
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 获取图片元数据并压缩图片
    return new Promise((resolve) => {
        sharp(imagePath)
            .metadata()
            .then(({ width, height, orientation }) => {
                // 根据图片元数据确定 resize 和 composite 选项
                const { resize, composite } = getResizeAndComposite(width, height, orientation);

                // 使用指定选项压缩图片并保存到文件
                const sharpInstance = sharp(imagePath).withMetadata();

                // 进行压缩
                sharpInstance.resize(resize).jpeg({
                    quality: 80, // 图片质量(%)
                    progressive: true, // 渐进式加载
                    trellisQuantisation: true, // Trellis量化，优化压缩质量
                    overshootDeringing: true, // 超调去锯齿，减少锯齿感
                    optimiseScans: true, // 优化扫描
                });

                // 是否添加水印
                if (config.watermark.checkAdd) {
                    sharpInstance.composite([composite]);
                }

                return sharpInstance.toFile(outputPath);
            })
            .then(() => {
                // 利用fs获取占用存储空间
                let fileSize = 0;
                fs.stat(outputPath, (err, stats) => {
                    if (err) {
                        console.error("获取文件大小时出错：", err);
                        return;
                    }
                    fileSize = (stats.size / 1000).toFixed(1);
                });

                // 获取resize后的信息
                sharp(outputPath)
                    .metadata()
                    .then((metadata) => {
                        resolve({
                            relativePath,
                            absolutePath: outputPath,
                            fileName: newFileName,
                            format: metadata.format,
                            // image
                            fileSize,
                            width: metadata.width,
                            height: metadata.height,
                            density: metadata.density,
                        });
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    });
}

// 修改文件名扩展名
function changeFileExtName(fileName) {
    if (fileName.toLowerCase().endsWith(".jpg")) {
        fileName = fileName.slice(0, -3) + "jpeg";
    }
    return fileName;
}

// 截取路径的前半部分
function truncatePath(absolutePath, inputPath) {
    const prefix = inputPath.replace(/\\/g, "/");
    const dirpath = path.dirname(absolutePath);
    if (dirpath.startsWith(prefix)) {
        return dirpath.substring(prefix.length);
    } else {
        return "";
    }
}

// 根据图片元数据确定 resize 和 composite 选项
function getResizeAndComposite(width, height, orientation) {
    // 全景图resize宽度为1920
    const aspectRatio = width / height;
    ``;
    const resizeWidth = aspectRatio > 2 ? config.imageWidth.panorama : config.imageWidth.default;

    // 判断图片是否为竖直方向
    const isVertical = orientation >= 5 && orientation <= 8;
    // 计算水印位置
    const topOffset =
        getResizeHeight(width, height, resizeWidth) -
        config.watermark.size[isVertical ? "w" : "h"] -
        config.watermark.padding;
    const leftOffset = isVertical
        ? config.watermark.padding
        : resizeWidth - config.watermark.size.w - config.watermark.padding;
    // 水印图片路径
    const compositeInput = isVertical ? watermarkVertical : watermarkHorizontal;

    return {
        resize: { width: resizeWidth },
        composite: { input: compositeInput, top: topOffset, left: leftOffset },
    };
}

// 根据原始宽度、高度和目标宽度计算调整后的高度
function getResizeHeight(ow, oh, rw) {
    return parseInt((oh * rw) / ow);
}

module.exports = imageCompress;
