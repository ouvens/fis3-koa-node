define('testMod', function(require, exports, module) {

  /**
   * main
   * @require 'asyncComponent/testMod/index.scss' // 无需在页面中控制 css
   */
  
  var localAjax = require('localAjax');
  var testModTpl = require('testMod.tpl');
  
  module.exports = {
      init:  function() {
          // alert();
          $('body').append(testModTpl({word: 'KKK'}));
          console.log(+new Date());
      }
  }
  

});
