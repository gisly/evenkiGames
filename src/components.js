Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});


Crafty.c('CardLabel', {
    CardLabel: function(imgX, imgY, newText, imgWidth, imgHeight, initX, initY) {
    	this.requires('2D, DOM, span');
    	this.saveInitialParameters(imgX, imgY, imgWidth, imgHeight, initX, initY);
    	this.locateMe(imgWidth);
    	this.addTextLabel(newText);
    	
    },
    
    
    saveInitialParameters: function(imgX, imgY, imgWidth, imgHeight, initX, initY){
    	this._imgStartX = imgX;
    	this._imgStartY = imgY;
    	this._imgEndX= imgX + imgWidth;
    	this._imgEndY = imgY +imgHeight;
    	this._imgHeight = imgHeight;
    	this._initX = initX;
    	this._initY = initY;
    	
    },
    
    locateMe: function(imgWidth){
    	this.x = this._initX;
    	this.y = this._initY;
    	
    	this.h = this.LABEL_HEIGHT;
    	this.w = imgWidth;
    },
    
    addTextLabel: function(newText){
    	this.attach(Crafty.e('CardLabelText').attr({ x: this.x, y: this.y}).text(newText));	
    },
    //the x-coordinate of the left side of the picture
    _imgStartX:0,
    //the y-coordinate of the upper side of the picture
    _imgStartY:0,
    //the x-coordinate of the right side of the picture
    _imgEndX:0,
    //the x-coordinate of the lower side of the picture
	_imgEndY:0,
	//the height of the picture
	_imgHeight:0,
	//my initial x
	_initX:0,
	//my initial y
	_initY:0,
	LABEL_HEIGHT:50
});

Crafty.c('DraggableCardLabel', {

    init: function() {
        this.requires('CardLabel, Draggable');
        this.enableDrag();
        this.bind('StopDrag', function(){
        	if(this.isRightPicture()){
        		this.disableDrag();
        		this.placeOnPicture();
        		Crafty.trigger('LabelFound');
        	}
        	else{
        		this.placeInitialLocation();	
        	}
        });
        
    },
    
    isRightPicture: function(){
    	myStartX = this.x;
    	myStartY = this.y;
    	myEndX = this.x + this.w;
    	myEndY = this.y + this.h;
    	
    	return ((myStartX >= this._imgStartX && myStartX <= this._imgEndX)||
    			(myEndX >= this._imgStartX && myEndX <= this._imgEndX)) &&
    			
    		((myStartY >= this._imgStartY && myStartY <= this._imgEndY)||
    			(myEndY >= this._imgStartY && myEndY <= this._imgEndY))
    
    },
    
    placeOnPicture: function(){
    	this.x = this._imgStartX;
    	this.y = this._imgStartY + this._imgHeight;
    },
    
    placeInitialLocation: function(){
    	this.x = this._initX;
    	this.y = this._initY;
    }
    
    
});



Crafty.c('CardLabelText', {
    init: function() {
        this.requires('2D, DOM, Text');
        this.textColor('#FF0000');
        this.textFont({family:'Cambria', size: '20px'});
        this.css({
            "background-color": "#fbec5d",  
            "cursor":"pointer",
            "display":"inline-block"
        });
        this.attr({h: 30, w: 150});

    }
});



Crafty.c('Card', {
    init: function() {
        this.css({
            "cursor":"pointer"
        });
    },
    
    getName: function(){
    	return this._entityName;
    }

});





Crafty.c('CardAudio', {
    init: function() {
    	this.requires('Card');
        this.bind('Click', function(){
            this.playAudio();
        })
    },

    

    playAudio:function(){
        Crafty.audio.stop();
        Crafty.audio.play(this._entityName+'_audio')
    },
    
    z:-1

});



Crafty.c('CardAudioLabel', {
    init: function() {
    	this.requires('CardAudio');
        this.bind('Click', function(){
            this.showLabel();
        })
    },

    showLabel:function(){
        try{
            if(!this.isLabelShown){
                Crafty.e('CardLabel')
	                .CardLabel(this.x, this.y, Cards[this._entityName]['label'], this.w, this.h,
	                this.x, this.y + this.h);
                this.isLabelShown = true
            }

        }
        catch(e){
            alert(e);
        }

    },
    
    isLabelShown:false

});

Crafty.c('CardClickBySound', {
	init: function() {
		this.requires('Card');
        this.bind('Click', function(){
            //Crafty.trigger('CardClicked', [this._entityName, this]);
            Crafty.trigger('CardClicked', this);
        })
    }
});


Crafty.sprite(100, 'assets/card_back.jpg', {FlippedCard: [0, 0]});
Crafty.c('CardMemory', {
    init: function() {
        this.requires('Card');
        this.flippedCardEn = Crafty.e('2D, DOM, FlippedCard')
			.attr({x: this._x, y: this._y, w: this._w, h: this._h, z: this._z+1})
		;
        this.bind('Click', function(){
            Crafty.trigger('CardClicked', this);
        })
    },
    
    reveal: function() {
    	this.flippedCardEn.visible = false;
  	},
  	hide: function() {
    	this.flippedCardEn.visible = true;
  	},
  	showForever: function(){
  		this.flippedCardEn.visible = false;
  		this.unbind('Click');
  		this.hide = function(){}
  	},
  	hideAfterTimeout: function(card2, timeoutLapse){
  		this.timeout(function(){
  			this.hide();
  			card2.hide();	
  		}, timeoutLapse);
  	}
});


//===================================CONTROLS
Crafty.c("Button", {
    init: function(){
        this.requires('DOM, 2D, Mouse, Hoverable, Text');
        this.css({
            "border": "solid thin white",
            "cursor":"pointer"
        });
        this.attr({h: BUTTON_HEIGHT, w: BUTTON_WIDTH});
        
        this.textFont({family:'Cambria', size: '20px'});
    },
    setText: function(buttonLabel){
    	this.text(buttonLabel);
    }
})