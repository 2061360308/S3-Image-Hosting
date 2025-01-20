import {S3Client as $hgUW1$S3Client, ListObjectsV2Command as $hgUW1$ListObjectsV2Command, HeadObjectCommand as $hgUW1$HeadObjectCommand, DeleteObjectCommand as $hgUW1$DeleteObjectCommand, DeleteObjectsCommand as $hgUW1$DeleteObjectsCommand, CopyObjectCommand as $hgUW1$CopyObjectCommand, GetObjectCommand as $hgUW1$GetObjectCommand, PutObjectCommand as $hgUW1$PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl as $hgUW1$getSignedUrl} from "@aws-sdk/s3-request-presigner";
import $hgUW1$cryptojs from "crypto-js";
import {HttpRequest as $hgUW1$HttpRequest} from "@smithy/protocol-http";
import {Buffer as $hgUW1$Buffer} from "buffer";



/**
 * Pack And Unpack Metadata
 */ class $28ac839a9eca26f5$export$20774910fdc32c96 extends Error {
    constructor(message = "Invalid Image Type"){
        super(message);
        this.name = "ImageTypeError";
    }
}
class $28ac839a9eca26f5$export$20f100ac05ce991b extends Error {
    constructor(message = "Image Already Exists"){
        super(message);
        this.name = "ImageAlreadyExistsError";
    }
}
class $28ac839a9eca26f5$export$7664f4590ee9849 extends Error {
    constructor(message = "Image Not Found"){
        super(message);
        this.name = "ImageNotFoundError";
    }
}
class $28ac839a9eca26f5$export$f1d7b40a8cdd31b0 extends Error {
    constructor(message = "Tags array cannot exceed 50 items"){
        super(message);
        this.name = "TagsOverflowError";
    }
}
class $28ac839a9eca26f5$export$6beddbe242a234b4 extends Error {
    constructor(message = "Tag name cannot exceed 8 characters"){
        super(message);
        this.name = "TagNameOverflowError";
    }
}
class $28ac839a9eca26f5$export$186ce778a76d3280 extends Error {
    constructor(message = "Album name cannot exceed 20 characters"){
        super(message);
        this.name = "AlbumNameOverflowError";
    }
}
class $28ac839a9eca26f5$export$93524e3e2f703cb2 extends Error {
    constructor(message = "Album/Tags name already exists"){
        super(message);
        this.name = "NameAlreadyExistsError";
    }
}
class $28ac839a9eca26f5$export$74d758e4ae8949f extends Error {
    constructor(message = "Invalid Album/Tags Name"){
        super(message);
        this.name = "InvalidNameError";
    }
}


/**
 * 基础工具函数
 * Basic Tool Functions
 */ 

var $d131d10da03f6396$require$Buffer = $hgUW1$Buffer;
const $d131d10da03f6396$export$8eabe2f62e1ca016 = async (fileData)=>{
    let wordArray;
    if (fileData instanceof Uint8Array || fileData instanceof $d131d10da03f6396$require$Buffer) wordArray = (0, $hgUW1$cryptojs).lib.WordArray.create(fileData);
    else if (fileData instanceof Blob) {
        const arrayBuffer = await fileData.arrayBuffer();
        wordArray = (0, $hgUW1$cryptojs).lib.WordArray.create(new Uint8Array(arrayBuffer));
    } else throw new Error("Unsupported file data type");
    return (0, $hgUW1$cryptojs).SHA256(wordArray).toString((0, $hgUW1$cryptojs).enc.Hex).substring(0, 16);
};
const $d131d10da03f6396$export$37cc283d8fbd3462 = (str)=>{
    if (typeof window !== "undefined") // 浏览器环境
    return btoa(str);
    else // Node.js 环境
    return $d131d10da03f6396$require$Buffer.from(str).toString('base64');
};
const $d131d10da03f6396$export$c537b38001c583b7 = (str)=>{
    if (typeof window !== "undefined") // 浏览器环境
    return atob(str);
    else // Node.js 环境
    return $d131d10da03f6396$require$Buffer.from(str, 'base64').toString();
};
const $d131d10da03f6396$export$7d34d7d04d13c816 = (stream)=>{
    return new Promise((resolve, reject)=>{
        const chunks = [];
        stream.on("data", (chunk)=>chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", ()=>resolve($d131d10da03f6396$require$Buffer.concat(chunks).toString("utf-8")));
    });
};


const $26cb92ebad322ae7$export$b0aeac08c6e3d884 = (data)=>{
    return new $26cb92ebad322ae7$export$e7adebdc1ebd2fed(new Date(data.createdat), new Date(data.updatedat), (0, $d131d10da03f6396$export$c537b38001c583b7)(data.album), (0, $d131d10da03f6396$export$c537b38001c583b7)(data.tags).split(",").filter((tag)=>tag !== ""));
};
const $26cb92ebad322ae7$export$74350c758df75150 = (create, update, album, tags)=>{
    return new $26cb92ebad322ae7$export$e7adebdc1ebd2fed(create, update, album, tags);
};
class $26cb92ebad322ae7$export$e7adebdc1ebd2fed {
    constructor(create, update, album = "", tags = []){
        this.album = "";
        this.tags = [];
        this.createdAt = create;
        this.updatedAt = update;
        this.addTags(tags);
        this.setAlbum(album);
    }
    addTags(tags) {
        if (this.tags.length + tags.length > 50) throw new (0, $28ac839a9eca26f5$export$f1d7b40a8cdd31b0)();
        for (const tag of tags){
            if (tag.length > 8) throw new (0, $28ac839a9eca26f5$export$6beddbe242a234b4)();
        }
        this.tags.push(...tags);
    }
    setAlbum(album) {
        if (album.length > 20) throw new (0, $28ac839a9eca26f5$export$186ce778a76d3280)();
        this.album = album;
    }
    pack() {
        return {
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            album: (0, $d131d10da03f6396$export$37cc283d8fbd3462)(this.album),
            tags: (0, $d131d10da03f6396$export$37cc283d8fbd3462)(this.tags.join(","))
        };
    }
}




/**
 * 分类相关的基础方法（相册、标签）
 * Basic methods related to classification (album, tag)
 */ /**
 * 用于处理数据文件的工具函数
 * Tool functions for processing data files
 */ 


const $713c000131f25c26$export$3c533bd2a4ab2eb5 = (body)=>{
    /**
   * 处理数据文件原始内容
   */ const lines = body.split("\n");
    if (lines[lines.length - 1] === "") lines.pop(); // 移除最后一个空字符串
    return lines;
};
const $713c000131f25c26$export$f563dc7b2d3a2c1e = (data)=>{
    /**
   * 编码数据文件原始内容
   */ return data.join("\n") + "\n";
};
const $713c000131f25c26$export$47c083f78c950059 = async (client, bucketName, prefix)=>{
    /**
   * 给出前缀，返回该前缀下的所有数据文件的大小(字节)
   */ const sizes = {};
    let continuationToken = undefined;
    do {
        const command = new (0, $hgUW1$ListObjectsV2Command)({
            Bucket: bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
            MaxKeys: 1000
        });
        const response = await client.send(command);
        response.Contents?.forEach((item)=>{
            if (item.Key && item.Size !== undefined) sizes[item.Key] = item.Size;
        });
        continuationToken = response.NextContinuationToken;
    }while (continuationToken);
    return sizes;
};
const $713c000131f25c26$export$a2f95a96d77047fb = async (client, bucketName, prefix)=>{
    /**
   * 给出前缀，返回该前缀下的所有数据文件的条目数
   */ let sizes = await $713c000131f25c26$export$47c083f78c950059(client, bucketName, prefix);
    let nums = {};
    for(let key in sizes)nums[key] = Math.ceil(sizes[key] / 17);
    // 按照键对结果进行排序
    const sortedKeys = Object.keys(nums).sort((a, b)=>a.localeCompare(b, undefined, {
            numeric: true
        }));
    const sortedNums = {};
    for (let key of sortedKeys)sortedNums[key] = nums[key];
    return sortedNums;
};
const $713c000131f25c26$export$e0fed6628b323e3 = async (client, bucketName, key)=>{
    /**
   * 获取数据文件中的所有条目
   */ let hasFile = await (0, $9243cb92a5f656f2$export$5d7e08f51deab78c)(client, bucketName, key);
    if (!hasFile) return [];
    else {
        const command = new (0, $hgUW1$GetObjectCommand)({
            Bucket: bucketName,
            Key: key
        });
        const response = await client.send(command);
        const body = await (0, $d131d10da03f6396$export$7d34d7d04d13c816)(response.Body);
        return $713c000131f25c26$export$3c533bd2a4ab2eb5(body);
    }
};
const $713c000131f25c26$export$92a2d3028ce1f360 = async (client, bucketName, key, type, value)=>{
    /**
   * 更新数据文件中的条目
   */ // 获取原始数据
    let data = await $713c000131f25c26$export$e0fed6628b323e3(client, bucketName, key);
    // 更新数据
    if (type === "add") data = data.concat(value);
    else if (type === "remove") data = data.filter((item)=>!value.includes(item));
    // 如果数据为空，直接删除远程文件
    if (data.length === 0) try {
        const command = new (0, $hgUW1$DeleteObjectCommand)({
            Bucket: bucketName,
            Key: key
        });
        await client.send(command);
        return true;
    } catch (error) {
        console.error(`Error deleting data file ${key}:`, error);
        return false;
    }
    // 如果数据不为空，则需要上传数据
    try {
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: $713c000131f25c26$export$f563dc7b2d3a2c1e(data)
        };
        const command = new (0, $hgUW1$PutObjectCommand)(uploadParams);
        await client.send(command);
        return true;
    } catch (error) {
        console.error("Error updating metadata global file:", error);
        return false;
    }
};
const $713c000131f25c26$export$2ba0bc83e35a7bff = async (client, bucketName, prefix, page, pageSize)=>{
    let result = [];
    let start = (page - 1) * pageSize;
    let end = page * pageSize;
    let dataFilesItemsNums = await $713c000131f25c26$export$a2f95a96d77047fb(client, bucketName, prefix);
    const totalNum = Object.values(dataFilesItemsNums).reduce((acc, num)=>acc + num, 0);
    let currentCount = 0;
    let hasMoreData = false;
    for(let fileKey in dataFilesItemsNums){
        let num = dataFilesItemsNums[fileKey];
        if (currentCount + num > start) {
            let fileStartIndex = Math.max(0, start - currentCount);
            let fileEndIndex = Math.min(num, end - currentCount);
            // 获取文件内容
            const lines = await $713c000131f25c26$export$e0fed6628b323e3(client, bucketName, fileKey);
            // 获取所需范围的数据
            result.push(...lines.slice(fileStartIndex, fileEndIndex));
            if (result.length >= pageSize) {
                hasMoreData = currentCount + num > end;
                break;
            }
        }
        currentCount += num;
    }
    result = result.slice(0, pageSize); // 确保结果不超过pageSize
    const lastPage = page * pageSize < totalNum;
    return {
        page: page,
        pageSize: pageSize,
        lastPage: lastPage,
        data: result
    };
};




const $82005a386fe404d6$export$1f5945d7cd2e1cf6 = async (client, bucketName, indexFileKey)=>{
    let albumNames = await (0, $713c000131f25c26$export$e0fed6628b323e3)(client, bucketName, indexFileKey);
    return albumNames.filter((name)=>name !== "");
};
const $82005a386fe404d6$export$e16d8520af44a096 = async (client, bucketName, indexFileKey, addNames)=>{
    if (!Array.isArray(addNames)) throw new (0, $28ac839a9eca26f5$export$74d758e4ae8949f)();
    // 判断相册是否已经存在
    const allNames = await $82005a386fe404d6$export$1f5945d7cd2e1cf6(client, bucketName, indexFileKey);
    for (let name of addNames){
        if (allNames.includes(name)) throw new (0, $28ac839a9eca26f5$export$93524e3e2f703cb2)();
    }
    let result = await (0, $713c000131f25c26$export$92a2d3028ce1f360)(client, bucketName, indexFileKey, "add", addNames);
    return result;
};
const $82005a386fe404d6$export$cd7f480d6b8286c3 = async (client, bucketName, indexFileKey, dataFilesPrefix, removeNames)=>{
    // 判断相册是否存在
    const allNames = await $82005a386fe404d6$export$1f5945d7cd2e1cf6(client, bucketName, indexFileKey);
    for (let name of removeNames){
        if (!allNames.includes(name)) throw new (0, $28ac839a9eca26f5$export$74d758e4ae8949f)();
    }
    let result = await (0, $713c000131f25c26$export$92a2d3028ce1f360)(client, bucketName, indexFileKey, "remove", removeNames);
    // Todo: 不能保证所有数据文件都删除成功，数据不一致处理
    for (let name of removeNames){
        let prefix = `${dataFilesPrefix}${name}`;
        let _result = await (0, $9243cb92a5f656f2$export$6592bdab5938aa46)(client, bucketName, prefix);
        result = result && _result;
    }
    return result;
};
const $82005a386fe404d6$export$b5ef8d197d88de83 = async (client, bucketName, indexFileKey, dataFilesPrefix, name, page, pageSize)=>{
    // 判断 相册|标签 是否存在
    const allNames = await $82005a386fe404d6$export$1f5945d7cd2e1cf6(client, bucketName, indexFileKey);
    if (!allNames.includes(name)) throw new (0, $28ac839a9eca26f5$export$74d758e4ae8949f)();
    let prefix = `${dataFilesPrefix}${name}`;
    let result = await (0, $713c000131f25c26$export$2ba0bc83e35a7bff)(client, bucketName, prefix, page, pageSize);
    return result;
};
const $82005a386fe404d6$export$8250d5b41185d62d = async (client, bucketName, indexFileKey, dataFilesPrefix, name, imageHashs)=>{
    // 判断 相册|标签 是否存在
    const allNames = await $82005a386fe404d6$export$1f5945d7cd2e1cf6(client, bucketName, indexFileKey);
    if (!allNames.includes(name)) throw new (0, $28ac839a9eca26f5$export$74d758e4ae8949f)();
    // 计算图片分布的文件
    let imagePaths = {};
    for (let hash of imageHashs){
        let key = `${dataFilesPrefix}${name}/${hash.slice(0, 2)}.data`;
        if (!imagePaths[key]) imagePaths[key] = [];
        imagePaths[key].push(hash);
    }
    let result = true;
    // Todo: 不能保证所有图片都添加成功，数据不一致处理
    for(let key in imagePaths){
        let res = await (0, $713c000131f25c26$export$92a2d3028ce1f360)(client, bucketName, key, "add", imagePaths[key]);
        result = result && res;
    }
    return result;
};
const $82005a386fe404d6$export$219ace522198cb2e = async (client, bucketName, indexFileKey, dataFilesPrefix, name, imageHashs)=>{
    // 判断相册是否存在
    const allNames = await $82005a386fe404d6$export$1f5945d7cd2e1cf6(client, bucketName, indexFileKey);
    if (!allNames.includes(name)) throw new (0, $28ac839a9eca26f5$export$74d758e4ae8949f)();
    // 计算图片分布的文件
    let imagePaths = {};
    for (let hash of imageHashs){
        let key = `${dataFilesPrefix}${name}/${hash.slice(0, 2)}.data`;
        if (!imagePaths[key]) imagePaths[key] = [];
        imagePaths[key].push(hash);
    }
    let result = true;
    // Todo: 不能保证所有图片都添加成功，数据不一致处理
    for(let key in imagePaths){
        let res = await (0, $713c000131f25c26$export$92a2d3028ce1f360)(client, bucketName, key, "add", imagePaths[key]);
        result = result && res;
    }
    return result;
};


const $a94a5523d8875f41$var$indexFileKey = ".data/album.data";
const $a94a5523d8875f41$var$dataFilesPrefix = ".data/album/";
const $a94a5523d8875f41$export$628f9bbbb9088c13 = async (client, bucketName)=>{
    /**
   * 从 相册 索引文件中获取所有相册名称
   */ return await (0, $82005a386fe404d6$export$1f5945d7cd2e1cf6)(client, bucketName, $a94a5523d8875f41$var$indexFileKey);
};
const $a94a5523d8875f41$export$3daeb05d0ef91923 = async (client, bucketName, addNames)=>{
    /**
   * 添加 相册
   */ return await (0, $82005a386fe404d6$export$e16d8520af44a096)(client, bucketName, $a94a5523d8875f41$var$indexFileKey, addNames);
};
const $a94a5523d8875f41$export$7ab6e6c6da95eb15 = async (client, bucketName, removeNames)=>{
    /**
   * 删除 相册
   */ return await (0, $82005a386fe404d6$export$cd7f480d6b8286c3)(client, bucketName, $a94a5523d8875f41$var$indexFileKey, $a94a5523d8875f41$var$dataFilesPrefix, removeNames);
};
const $a94a5523d8875f41$export$2dac09c26f6aaf7d = async (client, bucketName, albumName, page, pageSize)=>{
    /**
   * 列出 相册 中的所有图片
   */ return await (0, $82005a386fe404d6$export$b5ef8d197d88de83)(client, bucketName, $a94a5523d8875f41$var$indexFileKey, $a94a5523d8875f41$var$dataFilesPrefix, albumName, page, pageSize);
};
const $a94a5523d8875f41$export$f61bfd0605573f3b = async (client, bucketName, albumName, imageHashs)=>{
    /**
   * 向 相册 中添加图片
   */ return await (0, $82005a386fe404d6$export$8250d5b41185d62d)(client, bucketName, $a94a5523d8875f41$var$indexFileKey, $a94a5523d8875f41$var$dataFilesPrefix, albumName, imageHashs);
};
const $a94a5523d8875f41$export$d0a4697a2a36f5f7 = async (client, bucketName, albumName, imageHashs)=>{
    /**
   * 从 相册 中删除图片
   */ return await (0, $82005a386fe404d6$export$219ace522198cb2e)(client, bucketName, $a94a5523d8875f41$var$indexFileKey, $a94a5523d8875f41$var$dataFilesPrefix, albumName, imageHashs);
};
var $a94a5523d8875f41$export$2e2bcd8739ae039 = {
    getAllAlbumNames: $a94a5523d8875f41$export$628f9bbbb9088c13,
    addAlbum: $a94a5523d8875f41$export$3daeb05d0ef91923,
    removeAlbum: $a94a5523d8875f41$export$7ab6e6c6da95eb15,
    listAlbumItems: $a94a5523d8875f41$export$2dac09c26f6aaf7d,
    albumAddImages: $a94a5523d8875f41$export$f61bfd0605573f3b,
    albumRemoveImages: $a94a5523d8875f41$export$d0a4697a2a36f5f7
};



const $1b43dab7e83c8dc9$var$indexFileKey = ".data/tag.data";
const $1b43dab7e83c8dc9$var$dataFilesPrefix = ".data/tag/";
const $1b43dab7e83c8dc9$export$52d2f51df4110c7e = async (client, bucketName)=>{
    /**
   * 从 标签 索引文件中获取所有标签名称
   */ return await (0, $82005a386fe404d6$export$1f5945d7cd2e1cf6)(client, bucketName, $1b43dab7e83c8dc9$var$indexFileKey);
};
const $1b43dab7e83c8dc9$export$d220bf936897c3f = async (client, bucketName, addNames)=>{
    /**
   * 添加 标签
   */ return await (0, $82005a386fe404d6$export$e16d8520af44a096)(client, bucketName, $1b43dab7e83c8dc9$var$indexFileKey, addNames);
};
const $1b43dab7e83c8dc9$export$c21dc7c320b3abf4 = async (client, bucketName, removeNames)=>{
    /**
   * 删除 标签
   */ return await (0, $82005a386fe404d6$export$cd7f480d6b8286c3)(client, bucketName, $1b43dab7e83c8dc9$var$indexFileKey, $1b43dab7e83c8dc9$var$dataFilesPrefix, removeNames);
};
const $1b43dab7e83c8dc9$export$ae490555303ec81a = async (client, bucketName, TagName, page, pageSize)=>{
    /**
   * 列出 标签 中的所有图片
   */ return await (0, $82005a386fe404d6$export$b5ef8d197d88de83)(client, bucketName, $1b43dab7e83c8dc9$var$indexFileKey, $1b43dab7e83c8dc9$var$dataFilesPrefix, TagName, page, pageSize);
};
const $1b43dab7e83c8dc9$export$afd17cecab0849ae = async (client, bucketName, TagName, imageHashs)=>{
    /**
   * 向 标签 中添加图片
   */ return await (0, $82005a386fe404d6$export$8250d5b41185d62d)(client, bucketName, $1b43dab7e83c8dc9$var$indexFileKey, $1b43dab7e83c8dc9$var$dataFilesPrefix, TagName, imageHashs);
};
const $1b43dab7e83c8dc9$export$de59df4dd3dd12ec = async (client, bucketName, TagName, imageHashs)=>{
    /**
   * 从 标签 中删除图片
   */ return await (0, $82005a386fe404d6$export$219ace522198cb2e)(client, bucketName, $1b43dab7e83c8dc9$var$indexFileKey, $1b43dab7e83c8dc9$var$dataFilesPrefix, TagName, imageHashs);
};
var $1b43dab7e83c8dc9$export$2e2bcd8739ae039 = {
    getAllTagNames: $1b43dab7e83c8dc9$export$52d2f51df4110c7e,
    addTag: $1b43dab7e83c8dc9$export$d220bf936897c3f,
    removeTag: $1b43dab7e83c8dc9$export$c21dc7c320b3abf4,
    listTagItems: $1b43dab7e83c8dc9$export$ae490555303ec81a,
    tagAddImages: $1b43dab7e83c8dc9$export$afd17cecab0849ae,
    tagRemoveImages: $1b43dab7e83c8dc9$export$de59df4dd3dd12ec
};


const $9243cb92a5f656f2$export$7f1dbdc603f656d4 = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg"
];
const $9243cb92a5f656f2$export$323a64aec89c7e8c = async (client, bucketName, hash)=>{
    try {
        const command = new (0, $hgUW1$ListObjectsV2Command)({
            Bucket: bucketName,
            Prefix: hash,
            MaxKeys: 1
        });
        const response = await client.send(command);
        return !!response.Contents && response.Contents.length > 0;
    } catch (error) {
        console.error("Error checking objects with prefix:", error);
        return false;
    }
};
const $9243cb92a5f656f2$export$6960310df10f9f50 = async (client, bucketName, prefix)=>{
    const command = new (0, $hgUW1$ListObjectsV2Command)({
        Bucket: bucketName,
        Prefix: prefix
    });
    const response = await client.send(command);
    const files = response.Contents?.map((item)=>item.Key).filter((key)=>key !== undefined) || []; // 保留完整路径
    // 按照从小到大的顺序排序
    files.sort((a, b)=>a.localeCompare(b, undefined, {
            numeric: true
        }));
    return files;
};
const $9243cb92a5f656f2$export$5d7e08f51deab78c = async (client, bucketName, key)=>{
    /**
   * 是否存在文件
   */ try {
        const command = new (0, $hgUW1$HeadObjectCommand)({
            Bucket: bucketName,
            Key: key
        });
        await client.send(command);
        return true;
    } catch (error) {
        if (error instanceof Error && (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404)) return false;
        else {
            console.error("Error checking file existence:", error);
            return false;
        }
    }
};
const $9243cb92a5f656f2$export$d5d18797070b684f = async (client, bucketName, keys)=>{
    /**
   * 删除文件
   */ try {
        for (let key of keys){
            const command = new (0, $hgUW1$DeleteObjectCommand)({
                Bucket: bucketName,
                Key: key
            });
            await client.send(command);
        }
        return true;
    } catch (error) {
        console.error("Error deleting files:", error);
        return false;
    }
};
const $9243cb92a5f656f2$export$6592bdab5938aa46 = async (client, bucketName, prefix)=>{
    /**
   * 删除某个前缀下的所有文件
   */ // 应要求删除多项文件时，需要在请求头中添加 Content-MD5 字段
    const contentMd5Middleware = ()=>(next)=>async (args)=>{
                const { request: request } = args;
                if ((0, $hgUW1$HttpRequest).isInstance(request)) {
                    // const contentMD5 = md5Digest.toString("base64");
                    const md5Digest = (0, $hgUW1$cryptojs).MD5(request.body);
                    // 将 MD5 摘要编码为 Base64
                    const contentMD5 = (0, $hgUW1$cryptojs).enc.Base64.stringify(md5Digest);
                    request.headers["Content-MD5"] = contentMD5;
                }
                return next(args);
            };
    // 添加 Content-MD5 中间件
    const addContentMd5Middleware = (stack)=>{
        stack.add(contentMd5Middleware(), {
            step: "build",
            tags: [
                "SET_CONTENT_MD5"
            ],
            name: "contentMd5Middleware"
        });
    };
    // 移除 Content-MD5 中间件
    const removeContentMd5Middleware = (stack)=>{
        stack.remove("contentMd5Middleware");
    };
    try {
        let continuationToken = undefined;
        let keys = [];
        // 列出所有匹配前缀的文件
        do {
            const listCommand = new (0, $hgUW1$ListObjectsV2Command)({
                Bucket: bucketName,
                Prefix: prefix,
                ContinuationToken: continuationToken
            });
            const listResponse = await client.send(listCommand);
            listResponse.Contents?.forEach((item)=>{
                if (item.Key) keys.push(item.Key);
            });
            continuationToken = listResponse.NextContinuationToken;
        }while (continuationToken);
        // 批量删除文件
        while(keys.length > 0){
            const chunk = keys.splice(0, 1000); // 每次最多删除1000个文件
            const deleteCommand = new (0, $hgUW1$DeleteObjectsCommand)({
                Bucket: bucketName,
                Delete: {
                    Objects: chunk.map((key)=>({
                            Key: key
                        }))
                }
            });
            addContentMd5Middleware(client.middlewareStack);
            await client.send(deleteCommand);
            removeContentMd5Middleware(client.middlewareStack);
        }
        return true;
    } catch (error) {
        console.error("Error deleting files with prefix:", error);
        return false;
    }
};
const $9243cb92a5f656f2$export$adcf4fdf589797d3 = async (client, bucketName, hash)=>{
    try {
        const listCommand = new (0, $hgUW1$ListObjectsV2Command)({
            Bucket: bucketName,
            Prefix: hash,
            MaxKeys: 1
        });
        const listResponse = await client.send(listCommand);
        if (listResponse.Contents && listResponse.Contents.length > 0) {
            const item = listResponse.Contents[0];
            if (item.Key) {
                // 获取文件的元数据
                const headCommand = new (0, $hgUW1$HeadObjectCommand)({
                    Bucket: bucketName,
                    Key: item.Key
                });
                const headResponse = await client.send(headCommand);
                let metadata = (0, $26cb92ebad322ae7$export$b0aeac08c6e3d884)(headResponse.Metadata);
                // 验证文件的album和tags是否存在
                /**
         * 备注：
         * album和tags可能已经被删除，但是还存在对应的文件元数据中
         * 原因是考虑到删除时依次遍历其下所有图片元数据不太划算
         * 所以在这时需要验证并更新当前的文件元数据，删除不存在的album和tags
         */ let albumNames = await (0, $a94a5523d8875f41$export$628f9bbbb9088c13)(client, bucketName);
                let tagNames = await (0, $1b43dab7e83c8dc9$export$52d2f51df4110c7e)(client, bucketName);
                if (metadata.album.length > 0 && !albumNames.includes(metadata.album)) metadata.album = "";
                if (metadata.tags.length > 0) metadata.tags = metadata.tags.filter((tag)=>tagNames.includes(tag));
                const copyCommand = new (0, $hgUW1$CopyObjectCommand)({
                    Bucket: bucketName,
                    CopySource: `${bucketName}/${item.Key}`,
                    Key: item.Key,
                    Metadata: metadata.pack(),
                    MetadataDirective: "REPLACE"
                });
                // 发送命令
                await client.send(copyCommand);
                return metadata;
            }
        }
        throw new Error("Image not found");
    } catch (error) {
        console.error("Error getting image metadata by prefix:", error);
        throw new Error("Image not found");
    }
};
const $9243cb92a5f656f2$export$a5102cf13ffa00f1 = async (client, bucketName, hash)=>{
    try {
        const listCommand = new (0, $hgUW1$ListObjectsV2Command)({
            Bucket: bucketName,
            Prefix: hash,
            MaxKeys: 1
        });
        const listResponse = await client.send(listCommand);
        if (listResponse.Contents && listResponse.Contents.length > 0) {
            const item = listResponse.Contents[0];
            if (item.Key) return item.Key;
        }
        throw new Error("Image not found");
    } catch (error) {
        console.error("Error getting image metadata by prefix:", error);
        throw new Error("Image not found");
    }
};
const $9243cb92a5f656f2$export$ea3f2e7331a4eed0 = async (client, bucketName, hash, expiresIn = 300 // 默认5分钟
)=>{
    try {
        const key = await $9243cb92a5f656f2$export$a5102cf13ffa00f1(client, bucketName, hash);
        const command = new (0, $hgUW1$GetObjectCommand)({
            Bucket: bucketName,
            Key: key
        });
        const signedUrl = await (0, $hgUW1$getSignedUrl)(client, command, {
            expiresIn: expiresIn
        });
        return signedUrl;
    } catch (error) {
        console.error("Error getting image signed URL:", error);
        throw new Error("Image not found");
    }
};








const $ed1e4bca7eaa1efc$var$dataFilesPrefix = ".data/createdAt/";
const $ed1e4bca7eaa1efc$export$b3da9624443678bb = async (client, bucketName, page, pageSize)=>{
    /**
   * 按照创建时间顺序列出图片
   */ let prefix = $ed1e4bca7eaa1efc$var$dataFilesPrefix;
    let result = await (0, $713c000131f25c26$export$2ba0bc83e35a7bff)(client, bucketName, prefix, page, pageSize);
    return result;
};
const $ed1e4bca7eaa1efc$export$59a4b75abd5eef2d = async (client, bucketName, imageHashs)=>{
    /**
   * 添加 图片 到 创建时间数据文件
   */ // 获取当前日期, 年月日
    const date = new Date();
    let key = `${$ed1e4bca7eaa1efc$var$dataFilesPrefix}${date.toISOString().split("T")[0]}.data`;
    let result = await (0, $713c000131f25c26$export$92a2d3028ce1f360)(client, bucketName, key, "add", imageHashs);
    return result;
};
const $ed1e4bca7eaa1efc$export$1b2220ba384092bc = async (client, bucketName, imageHashs, createAt)=>{
    /**
   * 从创建时间数据文件中删除图片
   */ // 获取日期, 年月日
    let key = `${$ed1e4bca7eaa1efc$var$dataFilesPrefix}${createAt.toISOString().split("T")[0]}.data`;
    let result = await (0, $713c000131f25c26$export$92a2d3028ce1f360)(client, bucketName, key, "remove", imageHashs);
    return result;
};




const $cce4a2b83c911398$export$d2d510cadd39008a = async (client, bucketName, fileData, fileType, metadata)=>{
    try {
        const hash = await (0, $d131d10da03f6396$export$8eabe2f62e1ca016)(fileData);
        // Check if image already exists
        // 不管后缀是什么，只要hash相同，就认为是同一张图片
        if (await (0, $9243cb92a5f656f2$export$323a64aec89c7e8c)(client, bucketName, hash)) throw new (0, $28ac839a9eca26f5$export$20f100ac05ce991b)();
        // Check if image type is valid
        if (!(0, $9243cb92a5f656f2$export$7f1dbdc603f656d4).includes(fileType)) throw new (0, $28ac839a9eca26f5$export$20774910fdc32c96)();
        // 更新createAt数据索引
        let createAt_result = await (0, $ed1e4bca7eaa1efc$export$59a4b75abd5eef2d)(client, bucketName, [
            hash
        ]);
        if (!createAt_result) throw new Error("Error updating createdAt data index");
        // 如果有相册数据，更新相册数据索引
        if (metadata.album.length > 0) {
            // 更新album数据索引
            let album_result = await (0, $a94a5523d8875f41$export$f61bfd0605573f3b)(client, bucketName, metadata.album, [
                hash
            ]);
            if (!album_result) throw new Error("Error updating album data index");
        }
        // 如果有标签数据，更新标签数据索引
        if (metadata.tags.length > 0) // 更新tag数据索引
        for (let tag of metadata.tags){
            let tag_result = await (0, $1b43dab7e83c8dc9$export$afd17cecab0849ae)(client, bucketName, tag, [
                hash
            ]);
            if (!tag_result) throw new Error("Error updating tag data index");
        }
        const uploadParams = {
            Bucket: bucketName,
            Key: `${hash}.${fileType}`,
            Body: fileData,
            Metadata: metadata.pack()
        };
        const command = new (0, $hgUW1$PutObjectCommand)(uploadParams);
        const response = await client.send(command);
        return {
            success: true,
            metadata: metadata,
            hash: hash
        };
    } catch (error) {
        console.error("Error uploading image:", error);
        return {
            success: false
        };
    }
};








const $de32dac16ae9f216$export$d662978b674595e0 = async (client, bucketName, hash)=>{
    try {
        if (!await (0, $9243cb92a5f656f2$export$323a64aec89c7e8c)(client, bucketName, hash)) throw new (0, $28ac839a9eca26f5$export$7664f4590ee9849)();
        let metadata = await (0, $9243cb92a5f656f2$export$adcf4fdf589797d3)(client, bucketName, hash);
        // 更新createAt数据索引
        let createAt_result = await (0, $ed1e4bca7eaa1efc$export$1b2220ba384092bc)(client, bucketName, [
            hash
        ], metadata.createdAt);
        if (!createAt_result) throw new Error("Error updating createdAt data index");
        // 如果有相册数据，更新相册数据索引
        if (metadata.album.length > 0) {
            // 更新album数据索引
            let album_result = await (0, $a94a5523d8875f41$export$d0a4697a2a36f5f7)(client, bucketName, metadata.album, [
                hash
            ]);
            if (!album_result) throw new Error("Error updating album data index");
        }
        // 如果有标签数据，更新标签数据索引
        if (metadata.tags.length > 0) // 更新tag数据索引
        for (let tag of metadata.tags){
            let tag_result = await (0, $1b43dab7e83c8dc9$export$de59df4dd3dd12ec)(client, bucketName, tag, [
                hash
            ]);
            if (!tag_result) throw new Error("Error updating tag data index");
        }
        // 删除图片, 先得到图片的key
        let key = await (0, $9243cb92a5f656f2$export$a5102cf13ffa00f1)(client, bucketName, hash);
        const command = new (0, $hgUW1$DeleteObjectCommand)({
            Bucket: bucketName,
            Key: key
        });
        await client.send(command);
        return true;
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
};





class $52a45618025e23c1$var$S3ImageHostingMethods {
    static{
        this.isExistImageStatic = (0, $9243cb92a5f656f2$export$323a64aec89c7e8c);
    }
    static{
        this.createMatadataStatic = (0, $26cb92ebad322ae7$export$74350c758df75150);
    }
    static{
        this.uploadImageStatic = (0, $cce4a2b83c911398$export$d2d510cadd39008a);
    }
    static{
        this.deleteImageStatic = (0, $de32dac16ae9f216$export$d662978b674595e0);
    }
    static{
        this.getImageMetadataStatic = (0, $9243cb92a5f656f2$export$adcf4fdf589797d3);
    }
    static{
        this.getImageSignedUrlStatic = (0, $9243cb92a5f656f2$export$ea3f2e7331a4eed0);
    }
    static{
        this.getAllAlbumNamesStatic = (0, $a94a5523d8875f41$export$628f9bbbb9088c13);
    }
    static{
        this.addAlbumStatic = (0, $a94a5523d8875f41$export$3daeb05d0ef91923);
    }
    static{
        this.removeAlbumStatic = (0, $a94a5523d8875f41$export$7ab6e6c6da95eb15);
    }
    static{
        this.listAlbumItemsStatic = (0, $a94a5523d8875f41$export$2dac09c26f6aaf7d);
    }
    static{
        this.albumAddImagesStatic = (0, $a94a5523d8875f41$export$f61bfd0605573f3b);
    }
    static{
        this.albumRemoveImagesStatic = (0, $a94a5523d8875f41$export$d0a4697a2a36f5f7);
    }
    static{
        this.getAllTagNamesStatic = (0, $1b43dab7e83c8dc9$export$52d2f51df4110c7e);
    }
    static{
        this.addTagStatic = (0, $1b43dab7e83c8dc9$export$d220bf936897c3f);
    }
    static{
        this.removeTagStatic = (0, $1b43dab7e83c8dc9$export$c21dc7c320b3abf4);
    }
    static{
        this.listTagItemsStatic = (0, $1b43dab7e83c8dc9$export$ae490555303ec81a);
    }
    static{
        this.tagAddImagesStatic = (0, $1b43dab7e83c8dc9$export$afd17cecab0849ae);
    }
    static{
        this.tagRemoveImagesStatic = (0, $1b43dab7e83c8dc9$export$de59df4dd3dd12ec);
    }
    static{
        this.listCratedAtItemsStatic = (0, $ed1e4bca7eaa1efc$export$b3da9624443678bb);
    }
}
var $52a45618025e23c1$export$2e2bcd8739ae039 = $52a45618025e23c1$var$S3ImageHostingMethods;



class $149c1bd638913645$var$S3ImageHosting extends (0, $52a45618025e23c1$export$2e2bcd8739ae039) {
    constructor(settings){
        super(), this.version = "1.0.0", this.isExistImage = async (key)=>{
            /**
     * Check if the image exists in the bucket
     * @param key The key of the image
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.isExistImageStatic(this.client, this.settings.bucket, key);
        }, this.uploadImage = async (fileData, fileType, create, update, album, tags)=>{
            /**
     * Upload an image to the bucket
     * @param fileData The image data  type: Blob | Buffer | Uint8Array
     * @param fileType The image type  type: string (png | jpg | gif | bmp | webp | svg)
     * @param create The creation date of the image  type: Date
     * @param update The update date of the image  type: Date
     * @param album The album of the image  type: string
     * @param tags The tags of the image  type: string[]
     * @returns A boolean value
     */ const metadata = $149c1bd638913645$var$S3ImageHosting.createMatadataStatic(create, update, album, tags);
            return $149c1bd638913645$var$S3ImageHosting.uploadImageStatic(this.client, this.settings.bucket, fileData, fileType, metadata);
        }, this.deleteImage = async (hash)=>{
            /**
     * Delete an image from the bucket
     * @param hash The key of the image
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.deleteImageStatic(this.client, this.settings.bucket, hash);
        }, this.getImageMetadata = async (hash)=>{
            /**
     * Get the metadata of the image
     * @param hash The hash of the image
     * @returns A string
     */ return await $149c1bd638913645$var$S3ImageHosting.getImageMetadataStatic(this.client, this.settings.bucket, hash);
        }, this.getImageSignedUrl = async (hash, expiresIn = 300)=>{
            /**
     * Get the signed url of the image
     * @param hash The hash of the image
     * @param expiresIn The expiration time of the url, default 300 seconds
     * @returns A string
     */ return $149c1bd638913645$var$S3ImageHosting.getImageSignedUrlStatic(this.client, this.settings.bucket, hash, expiresIn);
        }, this.getAllAlbumNames = async ()=>{
            /**
     * Get all album names
     * @returns An array of strings
     */ return $149c1bd638913645$var$S3ImageHosting.getAllAlbumNamesStatic(this.client, this.settings.bucket);
        }, this.addAlbum = async (album)=>{
            /**
     * Add albums
     * @param album The album name
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.addAlbumStatic(this.client, this.settings.bucket, album);
        }, this.removeAlbum = async (album)=>{
            /**
     * Remove albums
     * @param album The album name
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.removeAlbumStatic(this.client, this.settings.bucket, album);
        }, this.listAlbumItems = async (albumName, page, pageSize)=>{
            /**
     * List all images in the album
     * @param albumName The album name
     * @param page The page number
     * @param pageSize The page size
     * @returns A paginated result {page, pageSize, lastPage, data}
     */ return $149c1bd638913645$var$S3ImageHosting.listAlbumItemsStatic(this.client, this.settings.bucket, albumName, page, pageSize);
        }, this.albumAddImages = async (albumName, keys)=>{
            /**
     * Add images to the album
     * @param albumName The album name
     * @param keys The image keys
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.albumAddImagesStatic(this.client, this.settings.bucket, albumName, keys);
        }, this.albumRemoveImages = async (albumName, keys)=>{
            /**
     * Remove images from the album
     * @param albumName The album name
     * @param keys The image keys
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.albumRemoveImagesStatic(this.client, this.settings.bucket, albumName, keys);
        }, this.getAllTagNames = async ()=>{
            /**
     * Get all tag names
     * @returns An array of strings
     */ return $149c1bd638913645$var$S3ImageHosting.getAllTagNamesStatic(this.client, this.settings.bucket);
        }, this.addTag = async (tag)=>{
            /**
     * Add tags
     * @param tag The tag name
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.addTagStatic(this.client, this.settings.bucket, tag);
        }, this.removeTag = async (tag)=>{
            /**
     * Remove tags
     * @param tag The tag name
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.removeTagStatic(this.client, this.settings.bucket, tag);
        }, this.listTagItems = async (tagName, page, pageSize)=>{
            /**
     * List all images in the tag
     * @param tagName The tag name
     * @param page The page number
     * @param pageSize The page size
     * @returns A paginated result {page, pageSize, lastPage, data}
     */ return $149c1bd638913645$var$S3ImageHosting.listTagItemsStatic(this.client, this.settings.bucket, tagName, page, pageSize);
        }, this.tagAddImages = async (tagName, keys)=>{
            /**
     * Add images to the tag
     * @param tagName The tag name
     * @param keys The image keys
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.tagAddImagesStatic(this.client, this.settings.bucket, tagName, keys);
        }, this.tagRemoveImages = async (tagName, keys)=>{
            /**
     * Remove images from the tag
     * @param tagName The tag name
     * @param keys The image keys
     * @returns A boolean value
     */ return $149c1bd638913645$var$S3ImageHosting.tagRemoveImagesStatic(this.client, this.settings.bucket, tagName, keys);
        }, this.listCratedAtItems = async (page, pageSize)=>{
            /**
     * List all images by creation date
     * @param page The page number
     * @param pageSize The page size
     * @returns A paginated result {page, pageSize, lastPage, data}
     */ return $149c1bd638913645$var$S3ImageHosting.listCratedAtItemsStatic(this.client, this.settings.bucket, page, pageSize);
        };
        this.settings = settings;
        this.client = new (0, $hgUW1$S3Client)({
            region: settings.region,
            endpoint: settings.endpoint,
            credentials: {
                accessKeyId: settings.accessKeyId,
                secretAccessKey: settings.secretAccessKey
            }
        });
    }
}
var $149c1bd638913645$export$2e2bcd8739ae039 = $149c1bd638913645$var$S3ImageHosting;


export {$149c1bd638913645$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.js.map
