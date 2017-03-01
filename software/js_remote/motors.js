var b = require('octalbonescript');
var conf = {
    freq: 1200,
    engines: [
        { fwd: 'P9_11', bwd: 'P9_15', en: 'P9_14'},
        { fwd: 'P9_17', bwd: 'P9_18', en: 'P9_16'},
        { fwd: 'P8_08', bwd: 'P8_10', en: 'P8_13'},
        { fwd: 'P8_17', bwd: 'P8_18', en: 'P8_19'},
        { fwd: 'P8_27', bwd: 'P8_29', en: 'P9_22'},
        { fwd: 'P8_34', bwd: 'P8_36', en: 'P9_21'}
    ],    
    standby: 'P9_12'
};

// Set mode...
function init(newConf) {
    for(var k in newConf|{}) {
        conf[k] = newConf[k];
    }
    b.pinModeSync(conf.standby, b.OUTPUT);
    for( var i in conf.engines ) {
        var en = conf.engines[i];
        b.pinModeSync(en.fwd, b.OUTPUT);
    	b.pinModeSync(en.bwd, b.OUTPUT);
    	b.pinModeSync(en.en, b.ANALOG_OUTPUT);
    }
    b.digitalWriteSync(conf.standby, b.LOW);
    for( var i in conf.engines ) {
    	move(i, 0.0);
    }
    b.digitalWriteSync(conf.standby, b.HIGH);
}

function move( engineIndex, speed, callback ) {
	var en = conf.engines[engineIndex];
	var cb = mkCallback( 'move('+engineIndex+', '+speed+')', callback );
	try {
		if( speed>0.0 ) {
			b.digitalWriteSync( en.fwd, b.HIGH, cb );
			b.digitalWriteSync( en.bwd, b.LOW, cb );
		}
		else if( speed<0.0 ) {
			b.digitalWriteSync( en.fwd, b.LOW, cb );
			b.digitalWriteSync( en.bwd, b.HIGH, cb );
		}
		else {
			b.digitalWriteSync( en.fwd, b.LOW, cb );
			b.digitalWriteSync( en.bwd, b.LOW, cb );
		}
	}
	catch(e) {
		cb(e);
	}
	b.analogWrite( en.en, Math.abs(speed), conf.freq, cb );
}

function brake( engineIndex, callback ) {
	var en = conf.engines[engineIndex];
	var cb = mkCallback( 'brake('+engineIndex+')', callback );
	try {
		b.digitalWrite( en.fwd, b.HIGH, cb );
		b.digitalWrite( en.bwd, b.HIGH, cb );
	}
	catch(e){
		cb(e);
	}
	b.analogWrite( en.en, 1.0, conf.freq, cb );
}

function mkCallback( msg, callback, count ) {
	if(!count) count=1;
	return function(err, resp) {
		if( err ) {
			console.warn( '!!'+msg+': '+err );
			if( callback ) callback(err, resp);
		}
		else if( --count<=0 ){
			//console.log( '++'+msg+': '+resp );
			if( callback ) callback(err, resp);
		}
	};
}

module.exports = {
  init: init,
  move: move,
  brake: brake
};
