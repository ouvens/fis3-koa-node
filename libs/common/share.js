'use strict';

var noop = function() {};

module.exports = {

    success: noop,
    cancel: noop,

    /**
     * 设置数据
     * @param {[type]} data [description]
     */
    _setData: function(data) {
        var self = this;

        self.data = {
            title: data.title || $('meta[itemprop=name]').attr('content') || document.title,
            desc: data.desc || $('meta[itemprop=description]').attr('content') || document.title,
            link: data.link || location.href,
            imgUrl: data.imgUrl || $('meta[itemprop=image]').attr('content'),

            type: data.type || '',
            dataUrl: data.dataUrl || '',
            success: self.success,
            cancel: self.cancel
        };

        var shareCfg = {
            title: self.data.title,
            thumb: self.data.imgUrl,
            targetUrl: self.data.link,
            content: self.data.desc,
        }

        //深度克隆
        self.QQData = JSON.stringify(self.data);
        self.QQData = JSON.parse(self.QQData);
        self.TimeLineData = JSON.stringify(self.data);
        self.TimeLineData = JSON.parse(self.TimeLineData);
        self.WeiBoData = JSON.stringify(self.data);
        self.WeiBoData = JSON.parse(self.WeiBoData);

        //反序列化
        self.QQData.success = self.success;
        self.TimeLineData.success = self.success;
        self.WeiBoData.success = self.success;
        self.QQData.cancel = self.cancel;
        self.TimeLineData.cancel = self.cancel;
        self.WeiBoData.cancel = self.cancel;
    },

    // 初始化调用
    start: function(opt, data) {
        var self = this;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: opt.appid, // 必填，公众号的唯一标识
            timestamp: opt.timestamp, // 必填，生成签名的时间戳
            nonceStr: opt.nonceStr, // 必填，生成签名的随机串
            signature: opt.signature, // 必填，签名，见附录1
            jsApiList: [
                'checkJsApi',
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'onMenuShareQQ',
                'onMenuShareQZone',
                'onMenuShareWeibo'
            ]
        });

        self._setData(data);

        wx.ready(function() {
            wx.onMenuShareAppMessage(self.data);
            wx.onMenuShareTimeline(self.data);
            wx.onMenuShareQQ(self.data);
            wx.onMenuShareQZone(self.data);
        });

    }
};