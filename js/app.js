var Prismic = require('prismic-javascript');
var PrismicDom = require('prismic-dom');
var apiEndpoint = "https://cryptopedia.cdn.prismic.io/api/v2";

var app = angular.module("cryptopedia", []);

app.config(function() {
    initSlickCarousel();
    $('.slick-dots').hide();
});

// header
app.controller('headerController', function($scope) {

    $scope.backArrowClicked = function() {
        // handle view change
        $('.wrapper__sidebar').removeClass('view-change');
        $('.wrapper__main').removeClass('view-change');

        // hide back arrow
        $('.header__arrow').css('width', '0');
        $('.header__arrow').css('opacity', '0.0');
        $('.header__arrow').css('margin', '0');

        // remove active status
        $(".tokens__list .tokens__item").removeClass("tokens__item-active");
    };

});

app.controller('landingPageController', function($scope) {

    $scope.landingText = "";

    // load landing page content
    Prismic.getApi(apiEndpoint, {})
        .then(function(api) {
            return api.query(Prismic.Predicates.at('document.type', 'welcome_page'));
        }).then(function(response) {
            console.log("landing page content loaded::", response);

            // set landing page text
            $scope.landingText = response.results[0].data.value_prop;
            $scope.$apply();
            
        }, function(err) {
            console.log("API error: ", err);
        });

});

// article list
app.controller('articleListController', function($scope, $rootScope, $window) {

    $scope.articles = [];

    // when article item is clicked
    $scope.articleSelected = function($event, article) {
        // emit article selected event
        $rootScope.$emit("ArticleSelected", { "articleId": article.id });

        // set active item
        $(".tokens__list .tokens__item").removeClass("tokens__item-active");
        $($event.target).parents(".tokens__item").addClass('tokens__item-active');
    };

    // load list of articles
    Prismic.getApi(apiEndpoint, {})
        .then(function(api) {
            return api.query(Prismic.Predicates.at('document.type', 'token'));
        }).then(function(response) {
            console.log("articles loaded::", response);
            $scope.articles = response.results;
            $scope.$apply();
        }, function(err) {
            console.log("API error: ", err);
        });

});

// article
app.controller('articleController', function($scope, $rootScope, $sce) {

    // article data
    $scope.bannerTitle = "";
    $scope.bannerText = "";
    $scope.sidebarContent = "";
    $scope.socialLinks = [];
    $scope.carousel = [];
    $scope.currentCarouselImage = null;

    $rootScope.$on("ArticleSelected", function(event, data) {

        // handle view change
        $('.wrapper__sidebar').addClass('view-change');
        $('.wrapper__main').addClass('view-change');

        // show back arrow
        $('.header__arrow').css('width', '22px');
        $('.header__arrow').css('opacity', '1.0');
        $('.header__arrow').css('margin', '0 0 0 1.66em');

        // hide landing page 
        $('.landingPage').hide();

        // show slick carousel dots
        $('.slick-dots').show();

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

                // add images to carousel
                $scope.carousel = article.carousel;
                $scope.currentCarouselImage = $scope.carousel[0];
                article.carousel.forEach(function(image) {
                    addImageToCarousel(image)
                });

                $(".banner__slider").on('afterChange', function(event, slick, currentSlide, nextSlide){
                    var currentSlideIndex = $(".banner__slider").slick('slickCurrentSlide');
                    $scope.currentCarouselImage = $scope.carousel[currentSlideIndex];
                    $scope.$apply();
                });

                // main article body
                $scope.bannerTitle = article.heading[0].text;
                $scope.bannerText = article.description[0].text;

                // right sidebar content
                $scope.sidebarContent = $sce.trustAsHtml(PrismicDOM.RichText.asHtml(article.sidebar_content, null));

                // social links
                $scope.socialLinks = article.social_links;
                
                $scope.$apply();

            }, 
            function(err) {
                console.log("API error: ", err);
            });

    });

});

// about
app.controller('aboutController', function($scope, $sce) {

    $scope.aboutContent = "";

    // load list of articles
    Prismic.getApi(apiEndpoint, {})
        .then(function(api) {
            return api.query(Prismic.Predicates.at('document.type', 'about'));
        }).then(function(response) {
            console.log("about loaded::", response);

            // get about popup content
            $scope.aboutContent = $sce.trustAsHtml(PrismicDOM.RichText.asHtml(response.results[0].data.about, null));
            $scope.$apply();
        }, 
        function(err) {
            console.log("API error: ", err);
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