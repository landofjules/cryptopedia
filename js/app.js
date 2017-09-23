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

                /* asign data to scope */

                // main article
                $scope.bannerTitle = article.heading[0].text;
                $scope.bannerText = article.description[0].text;

                // right side aditional content
                var sidebarContent = article.sidebar_content;
                $scope.additionalContentTitle = sidebarContent[0].text;
                $scope.additionalContentText = sidebarContent[1].text;
                $scope.additionalContentParagraph = "";

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