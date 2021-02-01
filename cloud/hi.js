/**
 * parse后台脚手架
 * www.yourCompany.com
 */

Parse.Cloud.define('hello', function(req, res) {
  //Parse.Cloud.useMasterKey();
  res.success('Hi,parse-scaffold!');
});
