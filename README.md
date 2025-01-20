# S3ImageHosting

> 纯前端、浏览器可用、超轻量的基于对象存储的图床管理工具

## 警告！！

### isExistImage()

根据测试脚本 `upload&delete.test.ts` 的测试结果来看，删除操作结束后立即检测图片是否存在可能会返回错误的结果。

删除操作（`deleteImage`）虽然是在等待请求后进行返回，但是由于对象储存是一个分布式系统，某些操作（如删除对象）可能会有短暂的延迟，导致在删除操作完成后立即检查对象是否存在时（`isExistImage`），仍然可能返回 true。

为了确保删除操作已经完全生效，可以在删除操作后添加一个短暂的延迟，然后再检查对象是否存在。在当前源码中，我在测试函数`upload&delete.test.ts`中暂时添加了 500ms 的延时，来避免这个问题。但请大家理解这不保证是绝对安全的，我认为这个值应该由后期开发者根据自己业务对速率的需求进行调整，或者你应该尽量避免在进行删除操作后立即检测图片是否存在。

```js
describe("isExist", () => {
  it("isExist should be false", async () => {
    // 添加一个短暂的延迟，确保删除操作已经完全生效
    await new Promise((resolve) => setTimeout(resolve, 500));

    let result = await imageHosting.isExistImage("94e2635af500225d");
    console.log("isExist result: ", result);
    expect(result).toBeFalsy();
  });
});
```
