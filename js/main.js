var Anya = {};

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0,
                (($(window).height() - this.outerHeight()) / 2) +
                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0,
                (($(window).width() - this.outerWidth()) / 2) +
                $(window).scrollLeft()) + "px");
    return this;
}

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
        me.Logo = $(".logo");
        me.Main = $("#main");
    });

    return me;
}();

Anya.Load = function() {
    var me = {};

    me.StartSite = function() {
        Anya.Parts.Logo.center();
        Anya.Parts.Main.center();

        Anya.Parts.Logo.fadeIn(Anya.Parts.FadeSpeed, function() {
            setTimeout(function() {
                Anya.Parts.Main.fadeIn(Anya.Parts.FadeSpeed);
            }, Anya.Parts.FadeSpeed);
        });
    };

    return me;
}();

Anya.Main = function() {
    var me = {};

    $(function() {
        Anya.Load.StartSite();
    });

    return me;
}();
