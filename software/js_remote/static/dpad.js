var dpads = [];
var vpads = [];
var hpads = [];
var bpads = [];

$(document).ready(function init() {
    function myLog(msg) {
    //	$('#log').append( $('<p>'+msg+'</p>') );
    }
    	
    function DPad(el) {
    	console.log('new');
    	this.X = 0.0;
    	this.Y = 0.0;
    	var self = this;
    	var clickX = 0;
    	var clickY = 0;
    	var drag=false;
    
    	var $el = $(el);
    	var width = $el.innerWidth();
    	var height = $el.innerHeight();
    	var $stick = $el.children('.stick');
    	var stickWidth = $stick.outerWidth();
    	var stickHeight = $stick.outerHeight();
    	var wDelta = width-stickWidth;
    	var hDelta = height-stickHeight;

    	var setXY = function(x, y) {
    		self.X = x;
    		self.Y = y;
    		if(self.X < -1.0)
    			self.X = -1.0;
    		if(self.X > 1.0)
    			self.X = 1.0;
    		if(self.Y < -1.0)
    			self.Y = -1.0;
    		if(self.Y > 1.0)
    			self.Y = 1.0;
    		$stick.css('left', Math.round( (self.X+1.0)*wDelta/2. ) + 'px');
    		$stick.css('top', Math.round( (1.0-self.Y)*hDelta/2. ) + 'px');
    	};
    	
    	$stick.on('mousedown', function(ev) {
    		myLog('down');
    		clickX = ev.screenX;
    		clickY = ev.screenY;
    		drag=true;
    	});
    	
    	$el.on('mousemove', function(ev) {
    		if(!drag) return;
    		myLog('move');
    		setXY(2.0*(ev.screenX-clickX)/wDelta, 2.0*(clickY-ev.screenY)/hDelta);
    	});
    
    	$stick.on('mouseup', function(ev) {
    		myLog('up');
    		drag=false;
    		setXY(0.0, 0.0);
    	});
    	
    	$stick.on('touchstart', function(ev) {
    		myLog('touchstart');
    		clickX = ev.originalEvent.targetTouches[0].screenX;
    		clickY = ev.originalEvent.targetTouches[0].screenY;
    		drag=true;
    	});
    	
    	$stick.on('touchmove', function(ev) {
    		myLog('touchmove');
    		var x = ev.originalEvent.targetTouches[0].screenX;
    		var y = ev.originalEvent.targetTouches[0].screenY;
    		setXY(2.0*(x-clickX)/wDelta, 2.0*(clickY-y)/hDelta);
    	});
    	
    	$stick.on('touchend', function(ev) {
    		myLog('touchend');
    		drag=false;
    		setXY(0.0, 0.0);
    	});
        
        setXY(0.0, 0.0);
    }

    function VPad(el) {
    	console.log('new');
    	this.Y = 0.0;
    	var self = this;
    	var clickY = 0;
    	var drag=false;
    
    	var $el = $(el);
    	var height = $el.innerHeight();
    	var $stick = $el.children('.stick');
    	var stickHeight = $stick.outerHeight();
    	var hDelta = height-stickHeight;
    	
    	var setY = function(y) {
    		self.Y = y;
    		if(self.Y < -1.0)
    			self.Y = -1.0;
    		if(self.Y > 1.0)
    			self.Y = 1.0;
    		$stick.css('top', Math.round( (1.0-self.Y)*hDelta/2. ) + 'px');
    	};
    	
    	$stick.on('mousedown', function(ev) {
    		myLog('down');
    		clickY = ev.screenY;
    		drag=true;
    	});
    	
    	$el.on('mousemove', function(ev) {
    		if(!drag) return;
    		myLog('move');
    		setY(2.0*(clickY-ev.screenY)/hDelta);
    	});
    
    	$stick.on('mouseup', function(ev) {
    		myLog('up');
    		drag=false;
    		setY(0.0);
    	});
    	
    	$stick.on('touchstart', function(ev) {
    		myLog('touchstart');
    		clickY = ev.originalEvent.targetTouches[0].screenY;
    		drag=true;
    	});
    	
    	$stick.on('touchmove', function(ev) {
    		myLog('touchmove');
    		var y = ev.originalEvent.targetTouches[0].screenY;
    		setY(2.0*(clickY-y)/hDelta);
    	});
    	
    	$stick.on('touchend', function(ev) {
    		myLog('touchend');
    		drag=false;
    		setY(0.0);
    	});
        
        setY(0.0);
    }

    function HPad(el) {
    	console.log('new');
    	this.X = 0.0;
    	var self = this;
    	var clickX = 0;
    	var drag=false;
    
    	var $el = $(el);
    	var width = $el.innerWidth();
    	var $stick = $el.children('.stick');
    	var stickWidth = $stick.outerWidth();
    	var wDelta = width-stickWidth;

    	var setX = function(x) {
    		self.X = x;
    		if(self.X < -1.0)
    			self.X = -1.0;
    		if(self.X > 1.0)
    			self.X = 1.0;
    		$stick.css('left', Math.round( (self.X+1.0)*wDelta/2. ) + 'px');
    	};
    	
    	$stick.on('mousedown', function(ev) {
    		myLog('down');
    		clickX = ev.screenX;
    		drag=true;
    	});
    	
    	$el.on('mousemove', function(ev) {
    		if(!drag) return;
    		myLog('move');
    		setX(2.0*(ev.screenX-clickX)/wDelta);
    	});
    
    	$stick.on('mouseup', function(ev) {
    		myLog('up');
    		drag=false;
    		setX(0.0);
    	});
    	
    	$stick.on('touchstart', function(ev) {
    		myLog('touchstart');
    		clickX = ev.originalEvent.targetTouches[0].screenX;
    		drag=true;
    	});
    	
    	$stick.on('touchmove', function(ev) {
    		myLog('touchmove');
    		var x = ev.originalEvent.targetTouches[0].screenX;
    		setX(2.0*(x-clickX)/wDelta);
    	});
    	
    	$stick.on('touchend', function(ev) {
    		myLog('touchend');
    		drag=false;
    		setX(0.0);
    	});
        
        setX(0.0);
    }

    function BPad(el) {
    	console.log('new');
    	this.X = 0.0;
    	var self = this;

    	var $el = $(el);
    	var $stick = $el.children('.stick');

    	var setX = function(x) {
    		self.X = x;
    		if(self.X < -1.0)
    			self.X = -1.0;
    		if(self.X > 1.0)
    			self.X = 1.0;
    	};
    	
    	$stick.on('mousedown', function(ev) {
    		myLog('down');
    		setX(1.0);
    	});
    
    	$stick.on('mouseup', function(ev) {
    		myLog('up');
    		setX(0.0);
    	});
    	
    	$stick.on('touchstart', function(ev) {
    		myLog('touchstart');
            setX(1.0);
    	});
    	
    	$stick.on('touchend', function(ev) {
    		myLog('touchend');
    		setX(0.0);
    	});
        
        setX(0.0);
    }

	$('.dpad').each(function(index, el) {
		dpads.push( new DPad(el) );
	});

	$('.vpad').each(function(index, el) {
		vpads.push( new VPad(el) );
	});

	$('.hpad').each(function(index, el) {
		hpads.push( new HPad(el) );
	});

	$('.bpad').each(function(index, el) {
		bpads.push( new BPad(el) );
	});

});
