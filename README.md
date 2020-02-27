# webpack 源码阅读记录

### 如何调试

1. 通过[vscode](https://code.visualstudio.com/docs/editor/debugging)创建一个launch调试文件, 修改launch配置中的`program`字段值为`${workspaceFolder}/debug/start.js`. 打上断点点击调试按钮即可
2. 在chrome浏览器输入`chrome://inspect/#devices`点击下方的`Open dedicated DevTools for Node`连接会打开一个DevTools工具, 然后运行`npm run debug`即可开始调试
