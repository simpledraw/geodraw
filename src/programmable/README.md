# Programmable doc

## 接口:

P.\_xxx

### geomode 定义

geomode 用来改写 ui 状态, 从而适应在 mobile 上使用 app 的场景

## debug words

```
window.location='/?geomode=1'
window.location='http://localhost:10002/?geomode=1&url=https://sfo2.digitaloceanspaces.com/geodraw/puzzles/2/0.json&script=https://sfo2.digitaloceanspaces.com/geodraw/puzzles/2/0.js'
window.location='http://localhost:10002/?geomode=1&url=https://sfo2.digitaloceanspaces.com/geodraw/puzzles/3/0.json&script=https://sfo2.digitaloceanspaces.com/geodraw/puzzles/3/0.js''
alert(window.location);
window.location='http://localhost:10002/?geomode=1#url=https://sfo2.digitaloceanspaces.com/geodraw/puzzles/3/0.json';
alert(P._state().geoModeEnabled);
P._resetScene();
```
