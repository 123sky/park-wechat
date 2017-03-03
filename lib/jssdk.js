 /*
 1 第一步：用户同意授权，获取code
 2 第二步：通过code换取网页授权access_token
 3 第三步：刷新access_token（如果需要）
 4 第四步：拉取用户信息(需scope为 snsapi_userinfo)
 5 附：检验授权凭证（access_token）是否有效
 */
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var debug = require('debug')('jswechat:jssdk');

function JSSDK(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
}

JSSDK.prototype = {
    getSignPackage: function (url, done) {
        var instance = this;

        this.getJsApiTicket(function (err, jsApiTicket) {
            if (err) {
                return done(err);
            }

            var nonceStr = instance.createNonceStr();
            var timestamp = Math.round(Date.now() / 1000);
            
            // 生成签名
            var rawString = 'jsapi_ticket='+jsApiTicket+'&noncestr='+nonceStr+'&timestamp='+timestamp+'&url='+url;
            var hash = crypto.createHash('sha1');
            var signature = hash.update(rawString).digest('hex');

            done(null, {
                'timestamp':timestamp,
                'url':url,
                'signature':signature,
                'nonceStr':nonceStr,
                'appId': instance.appId
            });
        });
    },

    getJsApiTicket: function (done) {
        var cacheFile = '.jsapiticket.json';
        var intance = this;
        var data = intance.readCacheFile(cacheFile);
        var time = Math.round(Date.now() / 1000);

        if (typeof data.expireTime === 'undefined' || data.expireTime < time) {
            debug('getJsApiTicket: from server');
            intance.getAccessToken(function (error, accessToken) {
                if (error) {
                    debug('getJsApiTicket.token.error:', error);
                    return done(error, null);
                }

                var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token='+accessToken;
                request.get(url, function (err, res, body) {
                    if (err) {
                        debug('getJsApiTicket.request.error:', err, url);
                        return done(err, null);
                    }

                    debug('getJsApiTicket.request.body:', body);

                    try {
                        var data = JSON.parse(body);

                        intance.writeCacheFile(cacheFile, {
                            expireTime: Math.round(Date.now() / 1000) + 7200,
                            jsApiTicket: data.ticket
                        });

                        done(null, data.ticket);
                    } catch (e) {
                        debug('getJsApiTicket.parse.error:', e, url);
                        done(e, null);
                    }
                });
            });
        } else {
            debug('getJsApiTicket: from cache');
            done(null, data.jsApiTicket);
        }
    },

    getAccessToken: function (done) {
        var cacheFile = '.accesstoken.json';
        var intance = this;
        var data = intance.readCacheFile(cacheFile);
        var time = Math.round(Date.now() / 1000);

        if (typeof data.expireTime === 'undefined' || data.expireTime < time) {
            debug('getAccessToken: from server');
            var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+this.appId+'&secret='+this.appSecret;
            request.get(url, function (err, res, body) {
                if (err) {
                    debug('getAccessToken.request.error:', err, url);
                    return done(err, null);
                }

                debug('getAccessToken.request.body:', body);

                try {
                    var data = JSON.parse(body);

                    intance.writeCacheFile(cacheFile, {
                        expireTime: Math.round(Date.now() / 1000) + 7200,
                        accessToken: data.access_token,
                    });

                    done(null, data.access_token);
                } catch (e) {
                    debug('getAccessToken.parse.error:', e, url);
                    done(e, null);
                }
            });
        } else {
            debug('getAccessToken: from cache');
            done(null, data.accessToken);
        }
    },

    createNonceStr: function () {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var length = chars.length;
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars.substr(Math.round(Math.random() * length), 1);
        }
        return str;
    },

    // 从文件里面读取缓存
    readCacheFile: function (filename) {
        try {
            return JSON.parse(fs.readFileSync(filename));
        } catch (e) {
            debug('read file %s failed: %s', filename, e);
        }

        return {};
    },

    // 往文件里面写缓存
    writeCacheFile: function (filename, data) {
        return fs.writeFileSync(filename, JSON.stringify(data));
    },
};

var jssdk = new JSSDK('wx5c957ab9c6d5195f','e00ca9ad5b5de010af586b91460709bf');
module.exports = jssdk;
