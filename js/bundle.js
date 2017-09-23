(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Prismic = require('prismic-javascript');
var apiEndpoint = "https://cryptopedia.cdn.prismic.io/api/v2";

var app = angular.module("cryptopedia", []);

app.config(function() {
    initSlickCarousel();
});

// sidebar
app.controller('sidebarController', function($scope, $rootScope) {

    $scope.articles = [];

    // when sidebar item is clicked
    $scope.articleSelected = function(article) {
        $rootScope.$emit("ArticleSelected", { "articleId": article.id });
    };

    // load list of articles
    Prismic.getApi(apiEndpoint, {})
        .then(function(api) {
            return api.query("");
        }).then(function(response) {
            console.log("articles loaded::", response);
            $scope.articles = response.results;
            $scope.$apply();
        }, function(err) {
            console.log("API error: ", err);
        });

});

// article
app.controller('articleController', function($scope, $rootScope) {

    // article data
    $scope.bannerTitle = "";
    $scope.bannerText = "";
    $scope.additionalContentTitle = "";
    $scope.additionalContentText = "";
    $scope.additionalContentParagraph = "";

    $rootScope.$on("ArticleSelected", function(event, data) {
        console.log("Article Selected", data);

        // remove images in current carousel
        emtpySlickCarousel();

        // load article
        Prismic.getApi(apiEndpoint, {})
            .then(function(api) {
                return api.query(
                    Prismic.Predicates.at('document.id', data.articleId)
                );
            }).then(function(response) {
                console.log("article loaded: ", response);

                var article = response.results[0].data;

                // asign data to scope
                $scope.bannerTitle = article.heading[0].text;
                $scope.bannerText = article.description[0].text;

                // add images to carousel
                article.carousel.forEach(function(image) {
                    addImageToCarousel(image)
                });

                $scope.$apply();

            }, function(err) {
                console.log("API error: ", err);
            });

    });

});


function initSlickCarousel() {
    $(".banner__slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        prevArrow: '<div class="banner__slider-arrow-wrapper"><img src="images/slider-arrow.svg" class="banner__slider-arrow banner__slider-arrow--prev"></div>',
        nextArrow: '<div class="banner__slider-arrow-wrapper"><img src="images/slider-arrow.svg" class="banner__slider-arrow banner__slider-arrow--next"></div>'
    });
}

function addImageToCarousel(image) {
    var element = '<img src="' + image.slide_image.url + '" alt="' + image.slide_image.alt + '" class="banner__slider-item">';
    $(".banner__slider").slick('slickAdd', element);
}

function emtpySlickCarousel() {
    var numImages = $(".banner__slider").find("img").length;
    for(var i=0; i<numImages; i++) {
        $(".banner__slider").slick('slickRemove', 0);
    }
}

$(document).ready(function () {

    var $menu = $(".header__menu");
    var $menuBtn = $(".header__btn");

    $menuBtn.click(function (e) {
        e.stopPropagation();
        $menu.slideToggle("fast");
        $menu.toggleClass("header__menu--active");
    });
    
    $("*").not(".header__btn").click(function (e) {
        if ($menu.hasClass("header__menu--active") && $(window).width() < 992) {
            $menu.slideUp("fast");
            $menu.removeClass("header__menu--active");
            e.stopPropagation();
        }
    });

    var $popupOpen = $(".popup__open");
    $popupOpen.click(function (e) {
        e.preventDefault();
        var $this = $(this);
        openPopup($this);
    });
    
    function openPopup($this) {
        if ($(window).width() < 768) {
            $menu.slideUp("fast");
        }
        var target = $this.attr("data-popup");
        $(".popup").not(".popup[data-popup='" + target + "']").removeClass("popup--active");
        $(".popup[data-popup='" + target + "']").toggleClass("popup--active");
    }
    
    var $popupClose = $(".popup__close");
    $popupClose.click(function (e) {
        e.preventDefault();
        closePopup();
    });
    
    function closePopup($this) {
        $(".popup").removeClass("popup--active");
    }

});
},{"prismic-javascript":3}],2:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
var globalObj = typeof self !== 'undefined' && self || this;
module.exports = globalObj.fetch.bind(globalObj);

},{"whatwg-fetch":4}],3:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("fetch-everywhere")):"function"==typeof define&&define.amd?define("PrismicJS",["fetch-everywhere"],t):"object"==typeof exports?exports.PrismicJS=t(require("fetch-everywhere")):e.PrismicJS=t(e["fetch-everywhere"])}(this,function(e){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=9)}([function(e,t,r){"use strict";t.__esModule=!0;var n=function(){function e(e){this.data={},this.data=e}return e.prototype.id=function(){return this.data.id},e.prototype.ref=function(){return this.data.ref},e.prototype.label=function(){return this.data.label},e}();t.Variation=n;var o=function(){function e(e){this.data={},this.data=e,this.variations=(e.variations||[]).map(function(e){return new n(e)})}return e.prototype.id=function(){return this.data.id},e.prototype.googleId=function(){return this.data.googleId},e.prototype.name=function(){return this.data.name},e}();t.Experiment=o;var i=function(){function e(e){e&&(this.drafts=(e.drafts||[]).map(function(e){return new o(e)}),this.running=(e.running||[]).map(function(e){return new o(e)}))}return e.prototype.current=function(){return this.running.length>0?this.running[0]:null},e.prototype.refFromCookie=function(e){if(!e||""===e.trim())return null;var t=e.trim().split(" ");if(t.length<2)return null;var r=t[0],n=parseInt(t[1],10),o=this.running.filter(function(e){return e.googleId()==r&&e.variations.length>n})[0];return o?o.variations[n].ref():null},e}();t.Experiments=i},function(e,t,r){"use strict";function n(e){return"string"==typeof e?'"'+e+'"':e instanceof Array?"["+e.map(function(e){return n(e)}).join(",")+"]":"number"==typeof e?e:null}t.__esModule=!0;var o={at:"at",not:"not",missing:"missing",has:"has",any:"any",in:"in",fulltext:"fulltext",similar:"similar","number.gt":"number.gt","number.lt":"number.lt","number.inRange":"number.inRange","date.before":"date.before","date.after":"date.after","date.between":"date.between","date.day-of-month":"date.day-of-month","date.day-of-month-after":"date.day-of-month-after","date.day-of-month-before":"date.day-of-month-before","date.day-of-week":"date.day-of-week","date.day-of-week-after":"date.day-of-week-after","date.day-of-week-before":"date.day-of-week-before","date.month":"date.month","date.month-before":"date.month-before","date.month-after":"date.month-after","date.year":"date.year","date.hour":"date.hour","date.hour-before":"date.hour-before","date.hour-after":"date.hour-after","geopoint.near":"geopoint.near"},i={near:function(e,t,r,n){return"["+o["geopoint.near"]+"("+e+", "+t+", "+r+", "+n+")]"}},a={before:function(e,t){return"["+o["date.before"]+"("+e+", "+t.getTime()+")]"},after:function(e,t){return"["+o["date.after"]+"("+e+", "+t.getTime()+")]"},between:function(e,t,r){return"["+o["date.between"]+"("+e+", "+t.getTime()+", "+r.getTime()+")]"},dayOfMonth:function(e,t){return"["+o["date.day-of-month"]+"("+e+", "+t+")]"},dayOfMonthAfter:function(e,t){return"["+o["date.day-of-month-after"]+"("+e+", "+t+")]"},dayOfMonthBefore:function(e,t){return"["+o["date.day-of-month-before"]+"("+e+", "+t+")]"},dayOfWeek:function(e,t){return"["+o["date.day-of-week"]+"("+e+", "+t+")]"},dayOfWeekAfter:function(e,t){return"["+o["date.day-of-week-after"]+"("+e+", "+t+")]"},dayOfWeekBefore:function(e,t){return"["+o["date.day-of-week-before"]+"("+e+", "+t+")]"},month:function(e,t){return"number"==typeof t?"["+o["date.month"]+"("+e+", "+t+")]":"["+o["date.month"]+"("+e+', "'+t+'")]'},monthBefore:function(e,t){return"number"==typeof t?"["+o["date.month-before"]+"("+e+", "+t+")]":"["+o["date.month-before"]+"("+e+', "'+t+'")]'},monthAfter:function(e,t){return"number"==typeof t?"["+o["date.month-after"]+"("+e+", "+t+")]":"["+o["date.month-after"]+"("+e+', "'+t+'")]'},year:function(e,t){return"["+o["date.year"]+"("+e+", "+t+")]"},hour:function(e,t){return"["+o["date.hour"]+"("+e+", "+t+")]"},hourBefore:function(e,t){return"["+o["date.hour-before"]+"("+e+", "+t+")]"},hourAfter:function(e,t){return"["+o["date.hour-after"]+"("+e+", "+t+")]"}},u={gt:function(e,t){return"["+o["number.gt"]+"("+e+", "+t+")]"},lt:function(e,t){return"["+o["number.lt"]+"("+e+", "+t+")]"},inRange:function(e,t,r){return"["+o["number.inRange"]+"("+e+", "+t+", "+r+")]"}};t.default={at:function(e,t){return"["+o.at+"("+e+", "+n(t)+")]"},not:function(e,t){return"["+o.not+"("+e+", "+n(t)+")]"},missing:function(e){return"["+o.missing+"("+e+")]"},has:function(e){return"["+o.has+"("+e+")]"},any:function(e,t){return"["+o.any+"("+e+", "+n(t)+")]"},in:function(e,t){return"["+o.in+"("+e+", "+n(t)+")]"},fulltext:function(e,t){return"["+o.fulltext+"("+e+", "+n(t)+")]"},similar:function(e,t){return"["+o.similar+'("'+e+'", '+t+")]"},date:a,dateBefore:a.before,dateAfter:a.after,dateBetween:a.between,dayOfMonth:a.dayOfMonth,dayOfMonthAfter:a.dayOfMonthAfter,dayOfMonthBefore:a.dayOfMonthBefore,dayOfWeek:a.dayOfWeek,dayOfWeekAfter:a.dayOfWeekAfter,dayOfWeekBefore:a.dayOfWeekBefore,month:a.month,monthBefore:a.monthBefore,monthAfter:a.monthAfter,year:a.year,hour:a.hour,hourBefore:a.hourBefore,hourAfter:a.hourAfter,number:u,gt:u.gt,lt:u.lt,inRange:u.inRange,near:i.near,geopoint:i}},function(e,t,r){"use strict";function n(e,t){var r=t||{},n=new a.Api(e,r);return new Promise(function(e,t){var o=function(n,o){r.complete&&r.complete(n,o),n?t(n):e(o)};return n.get(function(e,t){!e&&t&&(n.data=t,n.refs=t.refs,n.tags=t.tags,n.types=t.types,n.forms=t.forms,n.bookmarks=t.bookmarks,n.experiments=new i.Experiments(t.experiments)),o(e,n)}),n})}t.__esModule=!0;var o=r(1),i=r(0),a=r(4);e.exports={experimentCookie:a.ExperimentCookie,previewCookie:a.PreviewCookie,Predicates:o.default,Experiments:i.Experiments,api:n,Api:a.Api,getApi:n}},function(t,r){t.exports=e},function(e,t,r){"use strict";t.__esModule=!0;var n=r(1),o=r(0),i=r(8),a=r(5),u=r(6);t.PreviewCookie="io.prismic.preview",t.ExperimentCookie="io.prismic.experiment";var s=function(){function e(e,t,r){this.api=e,this.form=t,this.data=r||{};for(var n in t.fields)t.fields[n].default&&(this.data[n]=[t.fields[n].default])}return e.prototype.set=function(e,t){var r=this.form.fields[e];if(!r)throw new Error("Unknown field "+e);var n=""===t||void 0===t?null:t,o=this.data[e]||[];return o=r.multiple?n?o.concat([n]):o:n?[n]:o,this.data[e]=o,this},e.prototype.ref=function(e){return this.set("ref",e)},e.prototype.query=function(e){if("string"==typeof e)return this.query([e]);if(e instanceof Array)return this.set("q","["+e.join("")+"]");throw new Error("Invalid query : "+e)},e.prototype.pageSize=function(e){return this.set("pageSize",e)},e.prototype.fetch=function(e){var t=e instanceof Array?e.join(","):e;return this.set("fetch",t)},e.prototype.fetchLinks=function(e){var t=e instanceof Array?e.join(","):e;return this.set("fetchLinks",t)},e.prototype.lang=function(e){return this.set("lang",e)},e.prototype.page=function(e){return this.set("page",e)},e.prototype.after=function(e){return this.set("after",e)},e.prototype.orderings=function(e){return e?this.set("orderings","["+e.join(",")+"]"):this},e.prototype.url=function(){var e=this.form.action;if(this.data){var t=e.indexOf("?")>-1?"&":"?";for(var r in this.data)if(this.data.hasOwnProperty(r)){var n=this.data[r];if(n)for(var o=0;o<n.length;o++)e+=t+r+"="+encodeURIComponent(n[o]),t="&"}}return e},e.prototype.submit=function(e){return this.api.request(this.url(),e)},e}();t.SearchForm=s;var f=function(){function e(e,t){var r=t||{};return this.accessToken=r.accessToken,this.url=e+(this.accessToken?(e.indexOf("?")>-1?"&":"?")+"access_token="+this.accessToken:""),this.req=r.req,this.apiCache=r.apiCache||new a.DefaultApiCache,this.requestHandler=r.requestHandler||new i.DefaultRequestHandler,this.apiCacheKey=this.url+(this.accessToken?"#"+this.accessToken:""),this.apiDataTTL=r.apiDataTTL||5,this}return e.prototype.get=function(e){var t=this,r=this.apiCacheKey;return new Promise(function(n,o){var i=function(t,r,i,a){e&&e(t,r,i,a),r&&n(r),t&&o(t)};t.apiCache.get(r,function(e,n){if(e||n)return void i(e,n);t.requestHandler.request(t.url,function(e,n,o,a){if(e)return void i(e,null,o,a);var u=t.parse(n);a=a||t.apiDataTTL,t.apiCache.set(r,u,a,function(e){i(e,u,o,a)})})})})},e.prototype.refresh=function(e){var t=this.apiCacheKey;return new Promise(function(r,n){var i=this,a=function(t,o,i){e&&e(t,o,i),o&&r(o),t&&n(t)};this.apiCache.remove(t,function(e){if(e)return void a(e);i.get(function(e,t){if(e)return void a(e);i.data=t,i.bookmarks=t.bookmarks,i.experiments=new o.Experiments(t.experiments),a()})})})},e.prototype.parse=function(e){var t=this,r=Object.keys(e.forms||[]).reduce(function(r,n,o){if(e.forms.hasOwnProperty(n)){var i=e.forms[n];return t.accessToken&&(i.fields.access_token={},i.fields.access_token.type="string",i.fields.access_token.default=t.accessToken),r[n]=i,r}return r},{}),n=e.refs||[],o=n.filter(function(e){return e.isMasterRef})[0],i=e.types,a=e.tags;if(!o)throw"No master ref.";return{bookmarks:e.bookmarks||{},refs:n,forms:r,master:o,types:i,tags:a,experiments:e.experiments,oauthInitiate:e.oauth_initiate,oauthToken:e.oauth_token,quickRoutes:e.quickRoutes}},e.prototype.form=function(e){var t=this.data.forms[e];return t?new s(this,t,{}):null},e.prototype.everything=function(){var e=this.form("everything");if(!e)throw new Error("Missing everything form");return e},e.prototype.master=function(){return this.data.master.ref},e.prototype.ref=function(e){for(var t=0;t<this.data.refs.length;t++)if(this.data.refs[t].label==e)return this.data.refs[t].ref;return null},e.prototype.currentExperiment=function(){return this.experiments.current()},e.prototype.quickRoutesEnabled=function(){return this.data.quickRoutes.enabled},e.prototype.getQuickRoutes=function(e){var t=this;return new Promise(function(r,n){t.requestHandler.request(t.data.quickRoutes.url,function(t,o,i){e&&e(t,o,i),t&&n(t),o&&r(o)})})},e.prototype.query=function(e,r,n){var o="function"==typeof r?{options:{},callback:r}:{options:r||{},callback:n},i=o.options,a=o.callback,s=i,f=this.everything();for(var c in s)f=f.set(c,s[c]);if(!s.ref){var h="";this.req?h=this.req.headers.cookie||"":"undefined"!=typeof window&&window.document&&(h=window.document.cookie||"");var d=u.default.parse(h),p=d[t.PreviewCookie],l=this.experiments.refFromCookie(d[t.ExperimentCookie]);f=f.ref(p||l||this.master())}return e&&f.query(e),f.submit(a)},e.prototype.queryFirst=function(e,t,r){var n="function"==typeof t?{options:{},callback:t}:{options:t||{},callback:r},o=n.options,i=n.callback,a=o;return a.page=1,a.pageSize=1,this.query(e,a,function(e,t){if(i){var r=t&&t.results&&t.results[0];i(e,r)}}).then(function(e){return e&&e.results&&e.results[0]}).catch(function(e){console.log(e)})},e.prototype.getByID=function(e,t,r){return t=t||{},t.lang||(t.lang="*"),this.queryFirst(n.default.at("document.id",e),t,r)},e.prototype.getByIDs=function(e,t,r){return t=t||{},t.lang||(t.lang="*"),this.query(n.default.in("document.id",e),t,r)},e.prototype.getByUID=function(e,t,r,o){return r=r||{},r.lang||(r.lang="*"),this.queryFirst(n.default.at("my."+e+".uid",t),r,o)},e.prototype.getSingle=function(e,t,r){return this.queryFirst(n.default.at("document.type",e),t,r)},e.prototype.getBookmark=function(e,t,r){var n=this;return new Promise(function(t,o){var i=n.bookmarks[e];if(i)t(i);else{var a=new Error("Error retrieving bookmarked id");r&&r(a),o(a)}}).then(function(e){return n.getByID(e,t,r)})},e.prototype.previewSession=function(e,t,r,o){var i=this;return new Promise(function(a,u){var s=function(e,t,r){o&&o(e,t,r),e?u(e):a(t)};i.requestHandler.request(e,function(o,a,u){if(o)return void s(o,r,u);try{var f=a.mainDocument;f?i.everything().query(n.default.at("document.id",f)).ref(e).lang("*").submit(function(e,n){e&&s(e);try{0===n.results.length?s(null,r,u):s(null,t(n.results[0]),u)}catch(e){s(e)}}):s(null,r,u)}catch(e){s(e,r,u)}})})},e.prototype.request=function(e,t){function r(t){i.get(o,function(r,a){if(r||a)return void t(r,a);n.requestHandler.request(e,function(e,r,n,a){if(e)return void t(e,null,n);a?i.set(o,r,a,function(e){t(e,r)}):t(null,r)})})}var n=this,o=e+(this.accessToken?"#"+this.accessToken:""),i=this.apiCache;return new Promise(function(e,n){r(function(r,o,i){t&&t(r,o,i),r&&n(r),o&&e(o)})})},e.prototype.getNextPage=function(e,t){return this.request(e+(this.accessToken?"&access_token="+this.accessToken:""),t)},e}();t.Api=f},function(e,t,r){"use strict";t.__esModule=!0;var n=r(7),o=function(){function e(e){this.lru=n.MakeLRUCache(e)}return e.prototype.isExpired=function(e){var t=this.lru.get(e,!1);return!!t&&0!==t.expiredIn&&t.expiredIn<Date.now()},e.prototype.get=function(e,t){var r=this.lru.get(e,!1);r&&!this.isExpired(e)?t(null,r.data):t()},e.prototype.set=function(e,t,r,n){this.lru.remove(e),this.lru.put(e,{data:t,expiredIn:r?Date.now()+1e3*r:0}),n()},e.prototype.remove=function(e,t){this.lru.remove(e),t()},e.prototype.clear=function(e){this.lru.removeAll(),e()},e}();t.DefaultApiCache=o},function(e,t,r){"use strict";function n(e,t){try{return t(e)}catch(t){return e}}function o(e,t){if("string"!=typeof e)throw new TypeError("argument str must be a string");var r={},o=t||{},a=o.decode||i;return e.split(/; */).forEach(function(e){var t=e.indexOf("=");if(!(t<0)){var o=e.substr(0,t).trim(),i=e.substr(++t,e.length).trim();'"'==i[0]&&(i=i.slice(1,-1)),void 0==r[o]&&(r[o]=n(i,a))}}),r}t.__esModule=!0;var i=decodeURIComponent;t.default={parse:o}},function(e,t,r){"use strict";function n(e){return new o(e)}function o(e){this.size=0,this.limit=e,this._keymap={}}t.__esModule=!0,t.MakeLRUCache=n,o.prototype.put=function(e,t){var r={key:e,value:t};if(this._keymap[e]=r,this.tail?(this.tail.newer=r,r.older=this.tail):this.head=r,this.tail=r,this.size===this.limit)return this.shift();this.size++},o.prototype.shift=function(){var e=this.head;return e&&(this.head.newer?(this.head=this.head.newer,this.head.older=void 0):this.head=void 0,e.newer=e.older=void 0,delete this._keymap[e.key]),console.log("purging ",e.key),e},o.prototype.get=function(e,t){var r=this._keymap[e];if(void 0!==r)return r===this.tail?t?r:r.value:(r.newer&&(r===this.head&&(this.head=r.newer),r.newer.older=r.older),r.older&&(r.older.newer=r.newer),r.newer=void 0,r.older=this.tail,this.tail&&(this.tail.newer=r),this.tail=r,t?r:r.value)},o.prototype.find=function(e){return this._keymap[e]},o.prototype.set=function(e,t){var r,n=this.get(e,!0);return n?(r=n.value,n.value=t):(r=this.put(e,t))&&(r=r.value),r},o.prototype.remove=function(e){var t=this._keymap[e];if(t)return delete this._keymap[t.key],t.newer&&t.older?(t.older.newer=t.newer,t.newer.older=t.older):t.newer?(t.newer.older=void 0,this.head=t.newer):t.older?(t.older.newer=void 0,this.tail=t.older):this.head=this.tail=void 0,this.size--,t.value},o.prototype.removeAll=function(){this.head=this.tail=void 0,this.size=0,this._keymap={}},"function"==typeof Object.keys?o.prototype.keys=function(){return Object.keys(this._keymap)}:o.prototype.keys=function(){var e=[];for(var t in this._keymap)e.push(t);return e},o.prototype.forEach=function(e,t,r){var n;if(!0===t?(r=!0,t=void 0):"object"!=typeof t&&(t=this),r)for(n=this.tail;n;)e.call(t,n.key,n.value,this),n=n.older;else for(n=this.head;n;)e.call(t,n.key,n.value,this),n=n.newer},o.prototype.toString=function(){for(var e="",t=this.head;t;)e+=String(t.key)+":"+t.value,(t=t.newer)&&(e+=" < ");return e}},function(e,t,r){"use strict";function n(e,t){return{name:"prismic-request-error",message:t,status:e}}function o(e,t,r){return fetch(e,{headers:{Accept:"application/json"}}).then(function(t){if(~~(t.status/100!=2))throw n(t.status,"Unexpected status code ["+t.status+"] on URL "+e);return t.json().then(function(e){return{response:t,json:e}})}).then(function(e){var r=e.response,n=e.json,o=r.headers.get("cache-control"),i=o?/max-age=(\d+)/.exec(o):null,a=i?parseInt(i[1],10):void 0;t({result:n,xhr:r,ttl:a})}).catch(function(e){r({error:e})})}function i(){if(!(0===s.length||u>=a)){u++;var e=s.shift();o(e.url,function(t){var r=t.result,n=t.xhr,o=t.ttl;u--,e.callback(null,r,n,o),i()},function(t){var r=t.error;e.callback(r),i()})}}t.__esModule=!0;var a=20,u=0,s=[],f=function(){function e(){}return e.prototype.request=function(e,t){s.push({url:e,callback:t}),i()},e}();t.DefaultRequestHandler=f},function(e,t,r){r(3),e.exports=r(2)}])});
},{"fetch-everywhere":2}],4:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}]},{},[1]);
