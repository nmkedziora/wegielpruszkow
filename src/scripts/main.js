document.addEventListener('DOMContentLoaded', function() {
    smoothScroll.init({
        offset: 25
    });

    window.addEventListener('scroll', function() {
        var waiting = false;

        if (waiting) {
            return;
        }

        waiting = true;

        onScroll();

        // wait to optimize scroll events
        setTimeout(function() {
            waiting = false;
        }, 200);
    });

    function onScroll() {
        var scrollTopIcon = document.querySelector('.wpr-icon--scroll-top');

        if (window.scrollY > window.innerHeight) {
            scrollTopIcon.classList.remove('fade-out');
            scrollTopIcon.classList.add('fade-in');
        } else {
            scrollTopIcon.classList.remove('fade-in');
            scrollTopIcon.classList.add('fade-out');
        }
    }
});
