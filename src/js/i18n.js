(function() {
    $.localize = function (strings) {
        strings = $.extend({}, strings || {});
        var $all = $('*:not(script,meta,br,ul,form,head,body,link,style)');

        // Replace all placeholder texts
        $all.find('[placeholder]').each(function() {
            var $this = $(this);
            var placeholder = $this.attr('placeholder');
            if(placeholder && strings[placeholder]) {
                $this.attr('placeholder', strings[placeholder]);
            }
        });

        // Replace all text nodes
        $all.contents().filter(function(){
            return this.nodeType === 3;
        }).filter(function(){
            return $.trim(this.nodeValue);
        }).each(function(){
            for(string in strings) {
                if(string.indexOf($.trim(this.nodeValue)) === 0) {
                    this.nodeValue = this.nodeValue.replace(string, strings[string]);
                    break;
                }
            }
        });

        return this;
    }
})();
