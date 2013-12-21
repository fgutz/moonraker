
var PageTransitions = (function() {
    
    var isAnimating = false,
        outClass = "",
        inClass = "",
        animEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        },
        animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
        support = Modernizr.cssanimations;

    function go($currPage, $nextPage, direction) {

        if( isAnimating ) {
            return false;
        }
        isAnimating = true;

        $currPage.addClass('page-current');
        $nextPage.addClass('page-current');

        switch( direction ) {
            case "up":
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case "down":
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
        }

        $currPage.addClass( outClass ).on( animEndEventName, function() {
            $currPage.off( animEndEventName ).removeClass('page-current ' + outClass);
        } );

        $nextPage.addClass( inClass ).on( animEndEventName, function() {
            $nextPage.off( animEndEventName ).removeClass( inClass );
            isAnimating = false;
        } );

        if (!support) {
            isAnimating = false;
        }

    }

    return { go : go };

});
