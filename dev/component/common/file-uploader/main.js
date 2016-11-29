define('file-uploader', function(require, exports, module) {

  
  var Pikaday = require('component/common/file-uploader/pikaday');
  
  var datePicker = {
      $el: $('.ui-datepicker'),
      init: function() {
          this._renderData();
          this._bindEvent();
      },
  
      _renderData: function() {
          this._ajaxData();
      },
  
      _ajaxData: function() {
  
      },
  
      _bindEvent: function() {
          var self = this;
  
  
          alert()
  
      }
  }
  
  module.exports = datePicker;
  

});
