(function() {
    $.getPluralForm = function (endings, n) {
        if(!endings.length || endings.length != 3) {
            return endings[0] || endings;
        }

        var cases = [2, 0, 1, 1, 1, 2];
        return endings[ (n%100>4 && n%100<20) ? 2 : cases[Math.min(n%10, 5)] ];
    }

    $.parseTemplate = function(str, valuesObj) {
        valuesObj = valuesObj || {};
        return (str || '').replace(/\{\{(.+?)\}\}/g, function (i, match) {
            return valuesObj[match] !== undefined ? valuesObj[match] : '';
        });
    }
})();
