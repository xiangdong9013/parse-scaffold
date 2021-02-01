var express = require('express');
var request = require('request-promise');
var parseSchemaToSwagger = require('./schema-to-swagger').parseSchemaToSwagger;
var parseSwaggerConfig = require('./parse-swagger-config').parseSwaggerConfig;

/**
 * constructor
 * @returns app: express middleware
 */
function ParseSwagger(config) {
    var app = express();
    let swaggerConfig = parseSwaggerConfig(config);

    // 修改parseSwaggerConfig的部分默认配置
    swaggerConfig.paths[`/${config.appId}/batch`] = swaggerConfig.paths['/parse/batch'];
    delete swaggerConfig.paths['/parse/batch'];
    swaggerConfig.paths[`/${config.appId}/files/{filename}`] = swaggerConfig.paths['/parse/files/{filename}'];
    delete swaggerConfig.paths['/parse/files/{filename}'];
    /**
    * Get parse compatible api swagger.json base, and mount on /docs-${config.appId}
    */
    app.use(`/docs-${config.appId}`, function (req, res) {

        var options = {
            url: `${config.serverURL}/schemas`,
            method: 'GET',
            json: true,
            headers: { "X-Parse-Application-Id": config.appId, "X-Parse-Master-Key": config.masterKey }
        };

        request(options).then((data) => {
            var swagger = parseSchemaToSwagger(config.appId, swaggerConfig, data.results);
            res.json(swagger);
        }).catch((error) => {
            res.send('Request failed with response code ' + error.status);
        });
    });

    return app;
};

module.exports = ParseSwagger;