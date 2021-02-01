exports.parseSwaggerConfig = function (config) {
    return {
        "swagger": "2.0",
        "info": {
            "title": `${config.appName} REST API`,
            "description": "Happy to code Parse API",
            "version": "1.0.0"
        },
        "schemes": [
            "https",
            "http"
        ],
        "securityDefinitions": {
            "ParseAppId": {
                "type": "apiKey",
                "name": "X-Parse-Application-Id",
                "in": "header"
            },
            "ParseSessionId": {
                "type": "apiKey",
                "name": "X-Parse-Session-Token",
                "in": "header"
            }
        },
        "basePath": "/",
        "produces": [
            "application/json"
        ],
        "components": {
            "schemas": {
                "Batch": {
                    "type": "object",
                    "properties": {
                        "requests": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "method": {
                                        "type": "string"
                                    },
                                    "path": {
                                        "type": "string"
                                    },
                                    "body": {
                                        "type": "object"
                                    }
                                }
                            }
                        }
                    }
                },
                "notfound": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string"
                        },
                        "error": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "paths": {
            "/parse/batch": {
                "post": {
                    "security": [
                        {
                            "ParseAppId": []
                        }
                    ],
                    "summary": "Batch Operations",
                    "description": "To reduce the amount of time spent on network round trips, you can create, update, or delete up to 50 objects in one call, using the batch endpoint.",
                    "parameters": [
                        {
                            "in": "body",
                            "name": "body",
                            "description": "batch requests",
                            "required": true,
                            "schema": {
                                "$ref": "#/components/schemas/Batch"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Returns operation status"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "406": {
                            "description": "Not Acceptable"
                        },
                        "500": {
                            "description": "Server Internal error"
                        }
                    },
                    "tags": [
                        "Parse"
                    ]
                }
            },
            "/parse/files/{filename}": {
                "post": {
                    "security": [
                        {
                            "ParseAppId": []
                        }
                    ],
                    "summary": "Uploading files",
                    "description": "To upload a file to Parse, send a POST request to the files URL, postfixed with the name of the file. The request must contain the Content-Type header associated with the file. Keep in mind that files are limited to 10 megabytes. Here’s a simple example that’ll create a file named hello.txt containing a string.",
                    "parameters": [
                        {
                            "in": "path",
                            "name": "filename",
                            "type": "string",
                            "description": "The filename of the file you want to upload.",
                            "required": true
                        }
                    ],
                    "requestBody": {
                        "content": {
                            "image/png": {
                                "schema": {
                                    "type": "string",
                                    "format": "binary"
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Returns operation status"
                        },
                        "400": {
                            "description": "Bad Request"
                        },
                        "401": {
                            "description": "Unauthorized"
                        },
                        "406": {
                            "description": "Not Acceptable"
                        },
                        "500": {
                            "description": "Server Internal error"
                        }
                    },
                    "tags": [
                        "Files"
                    ]
                }
            }
        }
    }
}