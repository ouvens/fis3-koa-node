/*
 * jQuery placeholder, fix for IE6,7,8,9
 * @author JENA
 * @since 20131115.1504
 * @website ishere.cn
 */

var check = function(){
    return 'placeholder' in document.createElement('input');
};
var fix = function($){
    $('input[placeholder]').each(function() {
        var self = $(this), txt = self.attr('placeholder');
        self.closest('.input-group').css({position:'relative'});
        var holder = $('<span class="placeholder"></span>').text(txt).css({position:'absolute', width: '100px', color:'#aaa', top: '10px', left: '5px'});
        
        self.after(holder);

        holder.on('focusin', function() {
            holder.hide();
        }).on('focusout', function() {
            if(!self.val()){
                holder.show();
            }
        }).on('click', function() {
            holder.hide();
            self.focus();
        });

        self.on('focusin', function() {
            holder.hide();
        }).on('focusout', function() {
            if(!self.val()){
                holder.show();
            }
        }).on('click', function() {
            holder.hide();
            self.focus();
        });
    });
};

var JPlaceHolder = {
    //检测
    //初始化
    init : function($){

        if(!check()){
            fix($);
        }
    }
};

module.exports = {
    init: JPlaceHolder.init
}