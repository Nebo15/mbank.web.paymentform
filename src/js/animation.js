(function() {
    $.fn.shake = function (duration) {
        var $this = $(this);
        var timeout = $this.data('shake-animation-timeout');

        if(timeout) {
            clearTimeout(timeout);
        }

        $this.addClass('shake');
        timeout = setTimeout(function () {
            $this.removeClass('shake');
        }, duration || 600);

        $this.data('shake-animation-timeout', timeout);
    };
})();
