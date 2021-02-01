/**
 * parse后台脚手架
 * www.yourCompany.com
 */

const parse = require('../common');

const hello = request => {
  //Parse.Cloud.useMasterKey();
  return 'Hi, yourApp!';
}

parse.defineCloudFunction(hello);
