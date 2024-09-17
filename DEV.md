# 开发 geo draw 和相关 project 的一些问题

### geodraw 代码逻辑改变了, 如何应用到 geoeditor 中?

```
cd geodraw
./build-editor.sh -p
# published new package, version as 0.1.79

cd geoeditor
npm i @simpledraw/geodraw@0.1.79

# refresh the site, will get the new geodraw code
```

核心坑点:

- 清理 `src/package/excalidraw/package/dist`, 不然不会 rebuild, 测试脚本 `find dist -name '*.js' |xargs grep "setup window.P as test 1" | wc -l`
- 需要在 geoeditor 中重新安装, 不然也不会生效, 好像 react-scripts 在管理是否重新 build
- 不需要额外加载 `/public/js/excalidraw-development.js` , 生效的是在 `node_modules/@simpledraw/geodraw`
