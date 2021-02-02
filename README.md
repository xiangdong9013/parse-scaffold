# parse-scaffold

parse 示例脚手架，集成parse-server、parse-dashboard、parse-swagger

### Installation
clone本项目后：
```
cd parse-scaffold
npm install
npm start
```
启动后，访问：https://${parse_host}:${parse_port}/，显示：
```
欢迎访问parse-scaffold(parse后台脚手架)!
```
即表示启动成功。

### Config

> 1. 配置前请确保您的app服务器有域名，且支持https访问（本项目中parse-dashboard配置为仅支持https）；
> 2. 根据服务器https的配置，配置index.js中的httpsOption；
> 3. 根据服务器域名和数据库ip，配置index.js中的RELEASE_HOST和DEV_HOST；

1. app.json: 配置您的app、graphQL、数据库地址、云函数位置等；
2. cloud/yourApp: 此目录为您的特定app的云函数所在文件夹（与app.json的applications.cloud.value字段配置对应）；
3. cloud/yourApp/triggerConfig.js: 配置您的trigger关联关系；
4. cloud/common.js: trigger的实现部分，本项目暂只实现了afterSave trigger，欢迎大家补充；
5. 自动生成swagger文档(发布版本建议删去swagger配置)，地址为：https://${parse_host}:${parse_port}/swagger-${appId} (eg.https://api.yourApp.com:1337/swagger-yourApp)；
6. parse服务地址：https://${parse_host}:${parse_port}/${appId} (eg.https://api.yourApp.com:1337/yourApp)；
- > 因安全原因，一般显示为则表示服务已启动：
```
{"error":"unauthorized"}
```

7. dashboard地址：https://${parse_host}:${dashboard_port}/dashboard (eg.https://api.yourApp.com:4040/dashboard/)；
8. dashboard访问用户名和密码的初始配置为user/user_pass，可在app.json的dashboardUsers配置项中修改；

### TODO
1. 除afterSave外，其他trigger函数均未实现；
2. 缓存机制未设置；
