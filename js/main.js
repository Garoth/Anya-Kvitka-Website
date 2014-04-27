var OrderingError = function() {
    console.log("DEV SCREWED UP LOADING ORDER! BEAT HIM IMMEDIATELY!");
};

var Anya = {
    Debug: OrderingError,
    Util: OrderingError,
    Parts: OrderingError,
    ScrollNav: OrderingError,
    Load: OrderingError,
    Main: OrderingError
};

Anya.DEF = {
    // FIXME SET TO FALSE
    NoLoad: false
};

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0,
                (($(window).height() - this.outerHeight()) / 2) +
                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0,
                (($(window).width() - this.outerWidth()) / 2) +
                $(window).scrollLeft()) + "px");
    return this;
};

Anya.Util = function() {
    var me = {};

    me.isFirefox = function() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

    return me;
}();

Anya.Parts = function() {
    var me = {};

    me.FadeSpeed = 500;

    $(function() {
        /* List of javascript-interacting objects */
        me.Logo = $(".logo");
        me.Main = $("#main");
        me.Pages = {
            slideshow: $("#slideshow"),
            about: $("#about"),
            music: $("#music")
        };

        me.Pages.slideshow.showsList = $("#shows-list", me.Pages.slideshow);

        me.PageLinks = {
            slideshow: $("#slideshow-link"),
            about: $("#about-link"),
            music: $("#music-link")
        };
        me.ScrollNav = $("#scrollnav");

        /* Particular page abilities */
        me.Pages.slideshow.Load = function() {
            var img1 = $(".image1", me.Pages.slideshow);
            var img2 = $(".image2", me.Pages.slideshow);
            var img3 = $(".image3", me.Pages.slideshow);
            var img4 = $(".image4", me.Pages.slideshow);

            Anya.ScrollNav.Add(img1);
            Anya.ScrollNav.Add(img2);
            Anya.ScrollNav.Add(img3);
            Anya.ScrollNav.Add(img4);
            Anya.ScrollNav.Start();
        };

        me.Pages.slideshow.Unload = function() {
            Anya.ScrollNav.Stop();
            Anya.ScrollNav.Clear();
        };

        me.Pages.about.Load = function() {
        };

        me.Pages.about.Unload = function() {
        };

        me.Pages.music.Load = function() {
            var topLine = $(".top", me.Pages.music);
            var botLine = $(".bottom", me.Pages.music);

            // Transition on the divider lines
            topLine.delay(Anya.Parts.FadeSpeed * 1.3).animate({
                top: "0px"
            }, 500);
            botLine.delay(Anya.Parts.FadeSpeed * 1.3).animate({
                bottom: "0px"
            }, 500);

            var showDetails = function(albumid) {
                $('.details', me.Pages.music).each(function(i, detail) {
                    $(detail).fadeOut(Anya.Parts.FadeSpeed / 2);
                });

                $('.album', me.Pages.music).each(function(i, album) {
                    $(album).removeClass("active");
                });

                var details = $('.details.' + albumid, me.Pages.music);
                details.fadeIn(Anya.Parts.FadeSpeed / 2);
                var albumName = $('.album.' + albumid, me.Pages.music);
                albumName.addClass("active");
            };

            $('.album', me.Pages.music).each(function(i, albumLink) {
                $(albumLink).click(function() {
                    showDetails(albumLink.classList[1]);
                });
            });

            var firstAlbum = $('.details', me.Pages.music).first();
            showDetails(firstAlbum[0].classList[1]);
        };

        me.Pages.music.Unload = function() {
            var topLine = $(".top", me.Pages.music);
            var botLine = $(".bottom", me.Pages.music);

            $('.album', me.Pages.music).each(function(i, albumLink) {
                $(albumLink).off();
            });

            topLine.delay(Anya.Parts.FadeSpeed).css('top', '');
            botLine.delay(Anya.Parts.FadeSpeed).css('bottom', '');
        };
    });

    return me;
}();

/* Generic slideshow thing that switches between a bunch of
 * jQuery objects. Runs on a timer to do so automatically.
 */
Anya.ScrollNav = function() {
    var me = {};

    var elements = [];
    var intervalId = null;
    var currentElement = 0;
    var pageWidth = 960;
    var pageHeight = 640;

    me.Add = function(element, callback) {
        elements.push([element, callback]);
        element.css("position", "absolute");
        element.css("width", pageWidth + "px");
        element.css("height", pageHeight + "px");
        element.css("top", "0px");

        if (elements.length === 1) {
            element.css('opacity', '1');
        } else {
            element.css('opacity', '0');
        }
    };

    me.Clear = function() {
        elements = [];
        currentElement = 0;
        running = false;
    };

    me.Next = function() {
        if (elements.length < 2) {
            return;
        }

        var oldElem = elements[currentElement][0];
        currentElement = (currentElement + 1) % elements.length;
        var newElem = elements[currentElement][0];

        oldElem.animate({
            opacity: 0
        }, 500);

        newElem.animate({
            opacity: 1
        }, 500);
    };

    me.Start = function() {
        intervalId = setInterval(function() {
            me.Next();
        }, 10000);
    };

    me.Stop = function() {
        clearInterval(intervalId);
        intervalId = null;
    };

    return me;
}();

Anya.Load = function() {
    var me = {};
    var currentPage = 'slideshow';

    me.GetSearchPage = function() {
        var uripage = URI(window.location).search(true).page;

        if (uripage == null || typeof uripage !== 'string' ||
                Object.keys(Anya.Parts.Pages).indexOf(uripage) === -1) {
            return null;
        } else {
            return uripage;
        }
    };

    me.PageByURI = function() {
        if (me.GetSearchPage() == null) {
            currentPage = Object.keys(Anya.Parts.Pages)[0];
        } else {
            currentPage = me.GetSearchPage();
        }

        Anya.Load.Page(currentPage);
    };

    me.StartSite = function() {
        Anya.Parts.Logo.center();
        Anya.Parts.Main.center();

        if (me.GetSearchPage() != null) {
            Anya.DEF.NoLoad = true;
        }

        if (Anya.DEF.NoLoad === true) {
            Anya.Parts.Main.show();
        } else {
            Anya.Parts.Logo.fadeIn(Anya.Parts.FadeSpeed * 3, function() {
                Anya.Parts.Main.fadeIn(Anya.Parts.FadeSpeed, function() {
                    Anya.Parts.Logo.hide();
                });
            });
        }

        me.PageByURI();
    };

    me.GenericTransition = function(oldElement, newElement) {
        oldElement.fadeOut(Anya.Parts.FadeSpeed);
        newElement.fadeIn(Anya.Parts.FadeSpeed);
    };

    me.Page = function(pageid) {
        var curPage = Anya.Parts.Pages[currentPage];
        var newPage = Anya.Parts.Pages[pageid];

        me.GenericTransition(curPage, newPage);
        curPage.Unload();
        newPage.Load();
        currentPage = pageid;

        history.pushState(null, null, URI(window.location).removeSearch('page')
            .addSearch('page', currentPage));
    };

    return me;
}();

Anya.Main = function() {
    var me = {};

    $(function() {
        Anya.Load.StartSite();

        Object.keys(Anya.Parts.PageLinks).forEach(function(element) {
            Anya.Parts.PageLinks[element].click(function() {
                Anya.Load.Page(element);
            });
        });

        /* Show / hide shows list if CSS transitions are supported well */
        if (Anya.Util.isFirefox() === true) {
            Anya.Parts.Pages.slideshow.showsList.removeClass("hidden");
        } else {
            Anya.Parts.Pages.slideshow.showsList.hover(function() {
                Anya.Parts.Pages.slideshow.showsList.removeClass("hidden");
            }, function() {
                Anya.Parts.Pages.slideshow.showsList.addClass("hidden");
            });
        }
    });

    return me;
}();
