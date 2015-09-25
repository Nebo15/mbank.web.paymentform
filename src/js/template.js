(function() {
    $.parseTemplate = function(str, valuesObj) {
        valuesObj = valuesObj || {};
        return (str || '').replace(/\{\{(.+?)\}\}/g, function (i, match) {
            return valuesObj[match] || '';
        });
    }
})();
