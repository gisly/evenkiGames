
var cardNum = 4;
var numOfCols = Math.floor(Game.width()/(CARD_WIDTH+PADDING));
var numOfRows = Math.ceil(cardNum/numOfCols);


var cardFieldHeight = numOfRows*(CARD_HEIGHT+PADDING);
var canvasCentre = Game.width()/2;


function displayCardsRandomly(cardClass){
	shuffledArray = createShuffledCardArray();   
    for(var curCardNum=1;curCardNum<=cardNum;++curCardNum){
      	    
   		var rowIndex = Math.ceil(curCardNum/numOfCols)-1;
   		var divResidue = (curCardNum % numOfCols);
   		if(divResidue ==0){
   			var colIndex = numOfCols - 1;	
   		}
   		else{
   			var colIndex = divResidue - 1;	
   		}

   		var curCardName = 'spr_card'+(shuffledArray[curCardNum-1]);
   		var curCard = createCardByIndex(curCardName, colIndex, rowIndex);
        curCard.addComponent(cardClass); 
        if(cardClass=='CardAudio'){
        	attachLabelToCard(curCard,canvasCentre, curCardNum*PADDING+cardFieldHeight);
        }
   }
}


function displayMemoryCardsRandomly(){
	shuffledArray = createMemoryArray();
	var numOfCards = shuffledArray.length;   
    for(var curCardNum=1;curCardNum<=numOfCards;++curCardNum){
      	    
   		var rowIndex = Math.ceil(curCardNum/numOfCols)-1;
   		var divResidue = (curCardNum % numOfCols);
   		if(divResidue ==0){
   			var colIndex = numOfCols - 1;	
   		}
   		else{
   			var colIndex = divResidue - 1;	
   		}
   		var curCardName = 'spr_card'+(shuffledArray[curCardNum-1]);
   		var curCard = createCardByIndex(curCardName, colIndex, rowIndex);
        curCard.addComponent('CardMemory'); 
   }
}

function displayBackToMenuButton(sceneTitle){
	displayButton('В меню', 'Menu', BUTTON_WIDTH+PADDING, Game.height()-BUTTON_HEIGHT-BUTTON_PADDING);  
}

function displayBackwardButton(sceneTitle){ 
	displayButton('<<Назад', sceneTitle, 2*(BUTTON_WIDTH+PADDING), Game.height()-BUTTON_HEIGHT-BUTTON_PADDING); 
}

function displayForwardButton(sceneTitle){
	displayButton('Вперед>>', sceneTitle, 3*(BUTTON_WIDTH+PADDING), Game.height()-BUTTON_HEIGHT-BUTTON_PADDING);  
}


function displayButtonArray(titleArray){
	//var buttonTotalHeight = (BUTTON_HEIGHT + BUTTON_PADDING) * titleArray.length; 
	for(var i=0;i<titleArray.length;++i){
		displayButton(titleArray[i]['title'], titleArray[i]['scene'], 
									BUTTON_WIDTH+PADDING, /*Game.height()-buttonTotalHeight + */
																		BUTTON_PADDING + (BUTTON_HEIGHT+BUTTON_PADDING)*i); 
	}
}

function displayButton(buttonLabel, sceneTitle, buttonX, buttonY){
	Crafty.e('Button').attr({x:buttonX, y:buttonY}).bind('Click', 
								function(){Crafty.scene(sceneTitle)}).setText(buttonLabel);
}



function createShuffledCardArray(){
	var shuffledArray = Array();
	for(var i=0; i<cardNum; ++i){
		shuffledArray[i] = i+1;	
	}
	shuffledArray.sort(function(a, b){
			return 0.5-Math.random();
		});
	return shuffledArray;	
}

function createMemoryArray(){
	var shuffledArray = Array();
	var j=0;
	for(var i=0; i<cardNum; ++i){
		shuffledArray[j] = i+1;	
		++j;
		shuffledArray[j] = i+1;	
		++j;
	}
	shuffledArray.sort(function(a, b){
			return 0.5-Math.random();
		});
	return shuffledArray;	
}

function createCardByIndex(curCardName, colIndex, rowIndex){
	return Crafty.e(curCardName+', 2D, DOM, Mouse')
                .setName(curCardName)
                .attr({x: colIndex*(CARD_WIDTH + PADDING), y: rowIndex*(CARD_HEIGHT + PADDING)
                	, w:CARD_WIDTH, h: CARD_HEIGHT});
}

function attachLabelToCard(curCard, labelX, labelY){
	var curLabel = Cards[curCard.getName()]['label'];
        Crafty.e('DraggableCardLabel')
                .CardLabel(curCard.x, curCard.y, curLabel, CARD_WIDTH, CARD_HEIGHT,
	             labelX, labelY)	
}


Crafty.scene('Menu', function() {
	var titleArray = [{'title': 'Выучить слова', 
					    'scene': 'ShowCards'},
					  {'title': 'Упражнение1', 
					    'scene': 'AddLabel'},
					   {'title': 'Упражнение2', 
					    'scene': 'ClickCard'},
					   {'title': 'Memory', 
					    'scene': 'Memory'}  
	
	
	];
	Crafty.audio.stop();
    displayButtonArray(titleArray);
});

/**
 *shows the cards and adds their labels on click 
 */

Crafty.scene('ShowCards', function() {
    displayCardsRandomly('CardAudioLabel');
    displayForwardButton('AddLabel');
    displayBackToMenuButton();
});

/**
 *the player should match a label with a card 
 */


Crafty.scene('AddLabel', function() {    
    displayCardsRandomly('CardAudio');
    
    displayBackwardButton('ShowCards');  
    displayForwardButton('ClickCard'); 
    displayBackToMenuButton();
    
    this.labelsNotFound = cardNum;
    this.bind('LabelFound', function(){
    	--this.labelsNotFound;
    	if(this.labelsNotFound<=0){
    		this.unbind('LabelFound');
    	}	
    });	
    
});


/**
 *the player should match the word being pronounced with a card 
 */



Crafty.scene('ClickCard', function() {
	  
    displayCardsRandomly('CardClickBySound');
    displayBackwardButton('AddLabel');
    displayForwardButton('Memory');
    displayBackToMenuButton();
    
    //play the first word
    var i=0;
    this.curCardName = 'spr_card'+(i+1);
    Crafty.audio.play(this.curCardName+'_audio');
    
    this.bind('CardClicked', function(curCard){
    	var cardName = curCard._entityName; 
    	if(cardName==this.curCardName){
    		attachLabelToCard(curCard, curCard.x, curCard.y+CARD_HEIGHT);
    		
    		++i;
    		if(i==cardNum){
    			alert('you win!');
    			this.unbind('CardClicked');
    		}
    		this.curCardName = 'spr_card'+(i+1);
    		Crafty.audio.play(this.curCardName+'_audio');
    	}
    })
});

/**
 *the Memory game 
 */


Crafty.scene('Memory', function() {
	this.unbind('CardClicked');  
	
	Crafty.audio.stop();
    displayMemoryCardsRandomly();
    displayBackwardButton('ClickCard'); 
    displayBackToMenuButton();
    
    this.cardsLeft = cardNum;
    this.card1 = null;
    this.card2 = null;
    this.bind('CardClicked', function(curCard){
    	//two cards are already shown
    	//close them
    	if(this.card2){
    		this.card1.hide();
			this.card2.hide();
			
			this.card1 = null;
			this.card2 = null;
    	}
    	Crafty.audio.stop();
    	Crafty.audio.play(curCard._entityName+'_audio');
    	//no cards shown
    	if(!this.card1){
    		this.card1  = curCard;
    		this.card1.reveal();
    	}
    	//one card is shown and its name is the same as the new card's name
    	else if(this.card1._entityName == curCard._entityName){
	    	if(this.card1!=curCard){
	    		//it's not the same card
		    	this.card1.showForever();
		    	curCard.showForever();
		    	this.card1 = null;
		    	--this.cardsLeft;
		    	if(this.cardsLeft<=0){
		    		alert('you win!');
    				this.unbind('CardClicked');
		    	}
	    	}
		}
		//one card is shown, but it's different
		else{
			this.card2 = curCard;
			this.card1.reveal();
			this.card2.reveal();
			this.card1.hideAfterTimeout(this.card2, TIMEOUT_LAPSE);
		}
    })
});



Crafty.scene('Loading', function(){
        try{
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .text('Loading; please wait...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .css($text_css);

    // Load our sprite map image

            var toLoadArr=Array();
            var i =0;
            for (var key in Cards){
                toLoadArr[i]='assets/'+Cards[key]['pict'];                
                
                ++i;
                toLoadArr[i]='assets/'+Cards[key]['audio']
                ++i;
            }
            
            
            Crafty.load(toLoadArr, function(){
        // Once the images are loaded...

        // Define the individual sprites in the image
        // Each one (spr_tree, etc.) becomes a component
        // These components' names are prefixed with "spr_"
        //  to remind us that they simply cause the entity
        //  to be drawn with a certain sprite
           var audioArr={};
           for (var key in Cards){
               var curCard={};
               curCard[key]=[0, 0, 4, 4];
               Crafty.sprite('assets/'+Cards[key]['pict'], curCard, 0, 2);
               audioArr[key+'_audio']=['assets/'+Cards[key]['audio']];
           }
           Crafty.audio.add(audioArr);
           
           var curCard={};
           curCard[key]=[0, 0, 4, 4];


        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Menu');
    }


    )


}
        catch(e){
            alert(e);
        }
    }
);





