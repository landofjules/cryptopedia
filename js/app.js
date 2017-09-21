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
    
    $(".banner__slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        prevArrow: '<div class="banner__slider-arrow-wrapper"><img src="images/slider-arrow.svg" class="banner__slider-arrow banner__slider-arrow--prev"></div>',
        nextArrow: '<div class="banner__slider-arrow-wrapper"><img src="images/slider-arrow.svg" class="banner__slider-arrow banner__slider-arrow--next"></div>'
    });

});
