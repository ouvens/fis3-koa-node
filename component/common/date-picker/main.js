
var Pikaday = require('./pikaday');

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


        self.$el.pikaday({
            minDate: new Date('2010-01-01'),
            maxDate: new Date('2020-01-01')
        })

    }
}

module.exports = datePicker;
