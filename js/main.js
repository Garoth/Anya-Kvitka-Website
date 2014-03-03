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
    NoLoad: true
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

Anya.Debug = function(message) {
    console.log(message);
};

Anya.Util = function() {
    var me = {};

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
            about: $("#about")
        };
        me.Pages.slideshow.showsList = $("#shows-list", me.Pages.slideshow);
        me.PageLinks = {
            about: $("#about-link")
        };
        me.ScrollNav = $("#scrollnav");

        /* Particular page abilities */
        me.Pages.slideshow.Load = function() {
            img1 = $(".image1", me.Pages.slideshow);
            img2 = $(".image2", me.Pages.slideshow);
            img3 = $(".image3", me.Pages.slideshow);

            Anya.ScrollNav.Add(img1);
            Anya.ScrollNav.Add(img2);
            Anya.ScrollNav.Add(img3);
            console.log("starting slideshow");
            Anya.ScrollNav.Start();

            Anya.Debug("Loaded slideshow page");
        };

        me.Pages.slideshow.Unload = function() {
            Anya.ScrollNav.Stop();
            Anya.Debug("Unloaded slideshow page");
        };

        me.Pages.about.Load = function() {
            Anya.Debug("Loaded about page");
        };

        me.Pages.about.Unload = function() {
            Anya.Debug("Unloaded about page");
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

        console.log('Running next slide');

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
        }, 5000);
    };

    me.Stop = function() {
        clearInterval(intervalId);
        intervalId = null;
    };

    return me;
}();

Anya.Load = function() {
    var me = {};
    var currentPage = "slideshow";

    me.StartSite = function() {
        Anya.Parts.Logo.center();
        Anya.Parts.Main.center();

        if (Anya.DEF.NoLoad === true) {
            Anya.Parts.Main.show();
            return;
        }

        Anya.Parts.Logo.fadeIn(Anya.Parts.FadeSpeed * 3, function() {
            Anya.Parts.Main.fadeIn(Anya.Parts.FadeSpeed, function() {
                Anya.Parts.Logo.hide();
            });
        });
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
    };

    return me;
}();

Anya.Main = function() {
    var me = {};

    $(function() {
        Anya.Load.StartSite();

        Anya.Parts.PageLinks.about.click(function() {
            Anya.Load.Page("about");
        });

        /* Show / hide shows list */
        Anya.Parts.Pages.slideshow.showsList.hover(function() {
            Anya.Parts.Pages.slideshow.showsList.removeClass("hidden");
        }, function() {
            Anya.Parts.Pages.slideshow.showsList.addClass("hidden");
        });

        Anya.Load.Page("slideshow");
    });

    return me;
}();
