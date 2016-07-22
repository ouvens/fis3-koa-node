define('testMod1', function(require, exports, module) {

  /**
   * main
   * @require 'asyncComponent/testMod1/index.scss' // 无需在页面中控制 css
   */
  
  var localAjax = require('localAjax');
  var testModTpl = require('testMod1.tpl');
  
  module.exports = {
      init:  function() {
          // alert();
          $('body').append(testModTpl({word: 'MMMMM'}));
          console.log(+new Date());
      }
  }
  

});
