/**
 * parse后台脚手架
 * www.yourCompany.com
 */

var express = require('express');
var https = require('https');
var {
  default: ParseServer,
  ParseGraphQLServer
} = require('parse-server');
var path = require('path');
var ParseDashboard = require('parse-dashboard');
var ParseSwagger = require('./parse-swagger');
var swaggerUi = require('swagger-ui-express');
var fs = require('fs');
var appConfig = require('./app.json');

let {
  parse_port = 1337,
  dashboard_port = 4040,
  parse_host = {
    value: 'testapi.yourCompany.com'
  },
  applications,
  dashboardUsers = [{
    "user": "user",
    "pass": "user_pass"
  }]
} = appConfig;

let host = parse_host.value;

//TODO: RELEASE_HOST与DEV_HOST的配置，需要与app.json中的parse_host.value配置结合起来
// domain对应parse_host.value，dbIp为相应的数据库ip
const RELEASE_HOST = {
  domain: 'api.yourCompany.com',
  dbIp: '127.0.0.1'
};
const DEV_HOST = {
  domain: 'testapi.yourCompany.com',
  dbIp: '127.0.0.2'
};

// 数据库IP地址配置
let db_ip = (Object.is(host, RELEASE_HOST.domain)) ? RELEASE_HOST.dbIp : DEV_HOST.dbIp;

let parse_baseUrl = `https://${host}:${parse_port}`;
let dashboard_baseUrl = `https://${host}:${dashboard_port}`;

let apps = applications.map(item => {
  let {
    dbConfig = {}, graphQLServerURL = {}, appId, appName, masterKey, cloud = {}
  } = item;
  let {
    user,
    pass,
    dbName,
    liveQuery
  } = dbConfig;

  let isDbConfigInValid = (user === undefined || pass === undefined || dbName === undefined);
  if (isDbConfigInValid) {
    Console.error("数据库连接信息缺失！");
    return;
  }

  let graphQLPath = graphQLServerURL.value;
  let graphQLServerURL_fullPath = graphQLPath === undefined ? undefined : `${parse_baseUrl}${graphQLPath}`;
  let cloudDir = cloud.value;
  let cloudFullDir = cloudDir === undefined ? undefined : path.resolve(__dirname, cloudDir);

  return {
    parseBaseURL: parse_baseUrl,
    dashboardBaseUrl: dashboard_baseUrl,
    appId: appId.value,
    appName: appName.value,
    databaseURI: `mongodb://${user}:${pass}@${db_ip}:27017/${dbName}`,
    cloud: cloudFullDir,
    masterKey: masterKey.value,
    serverURL: `${parse_baseUrl}/${appId.value}`,
    graphQLServerURL: graphQLServerURL_fullPath,
    graphQLPath: graphQLPath,
    liveQuery: liveQuery,
    maxUploadSize: "100mb"
  };
});

/***************ParseServer部分配置********************/

// Client-keys like the javascript key or the .NET key are not necessary with
// parse-server If you wish you require them, you can set them as options in the
// initialization above: javascriptKey, restAPIKey, dotNetKey, clientKey
let parseApp = express();
let dashboardApp = express();

apps.map(item => {
  let {
    appId,
    graphQLServerURL,
    graphQLPath
  } = item;

  let api = new ParseServer(item);
  //router 
  parseApp.use(`/${appId}`, api.app);

  /***************parse的swagger配置********************/
  let parseSwagger = new ParseSwagger(item);
  parseApp.use(parseSwagger);// 挂载swagger docs，路径为“/docs-${appId}”
  // swagger UI
  let swaggerOpt = { swaggerUrl: parse_baseUrl + `/docs-${appId}` };
  parseApp.use(`/swagger-${appId}`, swaggerUi.serve, swaggerUi.setup(null, swaggerOpt));

  /***************parse的GraphQL配置*********************/
  if (!(Object.is(graphQLServerURL, undefined))) {
    var parseGraphQLServer_WP = new ParseGraphQLServer(
      api, {
      graphQLPath: graphQLPath,
      playgroundPath: '/playground'
    }
    );

    // Mounts the GraphQL API on parse-server, NOT on dashboard.
    /* 
    In fact,you can mount it on dashboardApp too.
    (with 'graphQLServerURL' change to `${dashboard_baseUrl}${graphQLPath}` )
    */
    parseGraphQLServer_WP.applyGraphQL(parseApp);

    //仅在非生产环境开启graphQL playground，
    if (!Object.is(host, RELEASE_HOST.domain)) {
      // (Optional) Mounts the GraphQL Playground - do NOT use in Production
      parseGraphQLServer_WP.applyPlayground(parseApp);
    }
  }
});

/***************Dashboard部分配置********************/
//配置dashboard仅支持https协议访问
let dashboardOptions = {
  allowInsecureHTTP: false
};

let dashboard = new ParseDashboard({
  apps: apps,
  //设置dashboard的登录用户名密码，格式如下：
  /*
  'users': [{
    'user': 'user',
    'pass': 'user_pass',
    // "readOnly": false,
    // "apps": [{ "appId": "yourApp" }]
  }]  */
  users: dashboardUsers
},
  dashboardOptions);

// Parse Server plays nicely with the rest of your web routes
//默认访问时的提示信息
parseApp.get('/', function (req, res) {
  res.status(200).send(
    '欢迎访问parse-scaffold(parse后台脚手架)!');
});

//TODO:仅在非生产环境开启dashboard服务
//if (!Object.is(host,'api.yourCompany.com')) {
dashboardApp.use('/dashboard', dashboard);

// /public 静态资源目录，以后可公开发布的信息
//dashboardApp.use('/public', express.static(path.join(__dirname, '/public')));

//}

//TODO: 此项需要配置服务器支持https访问（一般在nginx中配置）
let httpsOption = {
  key: fs.readFileSync('/etc/nginx/cert/1234567_testapi.yourCompany.com.key'),
  cert: fs.readFileSync('/etc/nginx/cert/1234567_testapi.yourCompany.com.pem')
};

let httpsServer = https.createServer(httpsOption, parseApp);
httpsServer.listen(parse_port, () => {
  console.info(new Date().toLocaleString() + `: parse-server  已通过https在端口 ${parse_port} 启动`);
});
ParseServer.createLiveQueryServer(httpsServer);

https.createServer(httpsOption, dashboardApp).listen(dashboard_port, () => {
  console.info(new Date().toLocaleString() + `: parse-dashboard 已通过https在端口 ${dashboard_port} 启动`);
});
