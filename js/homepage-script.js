// Homepage Carousel function wk20
$.fn.initCarousel = function(){
    var $window = $(window),
        $this = new carouselComponents($(this));

    $this.update();

    function doneResizing() {
        if ($this.currentWidth > 667 && window.innerWidth < 667 || $this.currentWidth < 667 && window.innerWidth > 667) {
            $this.currentWidth = window.innerWidth;
            $this.update();
        }
    }

    $window.resize(function() {
        clearTimeout(this.id);
        this.id = setTimeout(doneResizing, 500);
    });
};

var carouselComponents = function(el){
    this.el = $(el);
    this.carouselName = this.el.attr('data-carousel-container');
    this.hiddenElement = document.getElementById(this.carouselName).parentNode;
    this.carouselElement = $(this.hiddenElement).html();
    this.currentWidth = window.innerWidth;
};

carouselComponents.prototype.update = function(){
    var $this = this,
        $width = $this.currentWidth;

    $this.el.css('opacity', '0')
        .html($this.carouselElement);

    $($this.el).find('div:first-child').flexslider({
        slideshow: ($width <= 667),
        animation: 'slide',
        itemWidth: 210,
        itemMargin: 5,
        minItems: ($width < 667) ? 1 : 4,
        maxItems: ($width < 667) ? 1 : 4,
        slideshowSpeed: ($width < 667) ? 2000 : 5000,
        controlNav: false,
        directionNav: ($width <= 667),
        start: function() {
            $this.el.css('opacity', '1');
            $('[data-locale]').localizeText();
        }
    });
};

// Homepage Parallax function wk20
$.fn.moveIt = function(){
    var $window = $(window);
    var instances = [];

    $(this).each(function(){
        instances.push(new moveItItem($(this)));
    });

    window.onscroll = function(){
        var scrollTop = $window.scrollTop();
        instances.forEach(function(inst){
            inst.update(scrollTop);
        });
    }
};

var moveItItem = function(el){
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed'));
};

moveItItem.prototype.update = function(scrollTop){
    this.el.css('transform', 'translateY(' + -(scrollTop / this.speed) + 'px)');
};

// Get locale JSON file
$.fn.localeJSON = function(){
    var $this = new getLocaleJSON($(this));
    return $this.url;
};

var getLocaleJSON = function(el){
    this.url = $(el).attr('data-jsonurl');
};

// Localization of a tags
$.fn.localizeText = function(){
    var data = locale_translations,
        // $locale_json = $('[data-jsonurl]').localizeText(),
        $instances = [];

    $(this).each(function(){
        $instances.push(new anchorAttrs($(this)));
    });

    // function XHR(file, callback){
    //     var xhr = new XMLHttpRequest();
    //     xhr.onreadystatechange = function(){
    //         if(xhr.readyState === 4 && xhr.status === 200){
    //             callback(xhr.responseText);
    //         }
    //     };
    //     xhr.open('GET', file, true);
    //     xhr.send();
    // }

    // XHR($locale_json, function(data){
    //     data = $.parseJSON(data);

        $instances.forEach(function($this){
            var $text = "Shop Now";

            if (digitalData.site) {
                var locale = digitalData.site.language;
                if (data.hasOwnProperty($this.text)) {
                    if (data[$this.text].hasOwnProperty(locale)) {
                        $text = data[$this.text][locale];
                    } else {
                        $text = data[$this.text]["en_GB"];
                    }
                }
            }

            $this.el.html($text).css('opacity', 1);

            if ($(window).width() > 667) {
                var clock = $('.clock_div');
                if (clock.length > 0) {
                    setTimeout(function() {
                        clock.initializeClock();
                    }, 500);
                }
            }
        });
    // });
};

var anchorAttrs = function(el) {
    this.el = $(el);
    this.text = this.el.data('locale');
};

$(function(){
    $('[data-locale]').localizeText();
    if ($(window).width() < 668) {
        $('.denim .video > div').click(function () {
            if($(this).children("video").get(0).paused){
                $(this).children("video").get(0).play();
            }else{
                $(this).children("video").get(0).pause();
            }
        });
    }
});

// Clock ticker functionality
$.fn.initializeClock = function(){
    var $this = new updateClock($(this)),
        time_intervals = setInterval(updateTime, 1000);

    function updateTime() {
        var time = $this.getTimeRemaining();

        if (time.total <= 0) {
            clearInterval(time_intervals);
        }
        $this.update(time);
    }
};

var updateClock = function(el) {
    this.el = $(el);
    this.unix = this.el.data('end-date');
    this.end_date = new Date(this.unix*1000);
    this.days = this.el.find('.days');
    this.hours = this.el.find('.hours');
    this.minutes = this.el.find('.minutes');
    this.seconds = this.el.find('.seconds');
};

updateClock.prototype.getTimeRemaining = function() {
    var t = this.end_date - Date.parse(new Date());
    return {
        'total': t,
        'days': Math.floor(t / (1000 * 60 * 60 * 24)),
        'hours': Math.floor((t / (1000 * 60 * 60)) % 24),
        'minutes': Math.floor((t / 1000 / 60) % 60),
        'seconds': Math.floor((t / 1000) % 60)
    };
};

updateClock.prototype.update = function(time) {
    this.days[0].innerHTML = time.days >= 0 ? time.days : '0';
    this.hours[0].innerHTML = time.hours >= 0 ? ('0' + time.hours).slice(-2) : '00';
    this.minutes[0].innerHTML = time.minutes >= 0 ? ('0' + time.minutes).slice(-2) : '00';
    this.seconds[0].innerHTML = time.seconds >= 0 ? ('0' + time.seconds).slice(-2) : '00';
};
