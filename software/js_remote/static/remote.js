function initRemote(config) {
    var defaultConfig = {
        url: location.origin+'/remote',
        controlFunction: function() { return [0.,0.,0.,0.,0.,0.]; },
        delayMs: 0
    };

    for( var k in defaultConfig ) {
        if( typeof(config[k]) === 'undefined' )
            config[k] = defaultConfig[k];
    }

    var doRequest;
    var delayRequest = function() {
        setTimeout(doRequest, config.delayMs);
    };
    doRequest = function() {
        $.ajax({
            url: config.url,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(config.controlFunction()),
            contentType: 'application/json; charset=utf-8'
        }).always(delayRequest);
    }
    doRequest();
};
