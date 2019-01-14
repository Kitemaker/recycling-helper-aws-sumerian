'use strict';
	
// The sumerian object can be used to access Sumerian engine
// types.
//
/* global sumerian */
	
// Called when play mode starts.
//
function setup(args, ctx) {
	console.log('setting lex response');
	
	ctx.onLexResponse = (data) => {	
		
		if(data.dialogState === "Fulfilled" && data.intentName === 'FindCenterIntent'){
			console.log("Received response from FindCenterIntent");					   
			sumerian.SystemBus.emit('searchOnMap', data.sessionAttributes.Address );
			console.log("AWS: showing on map = " +  data.sessionAttributes.Address);	
		}
		if(data.dialogState === "Fulfilled" && data.intentName === 'LabelInfoIntent'){
		   
			console.log("Received response from LabelInfoIntent");		
			sumerian.SystemBus.emit('updateLabelMain', data );		
		}
		if(data.dialogState === "Fulfilled" && data.intentName === 'LabelPartIntent'){		   
			
			sumerian.SystemBus.emit('updateLabelPart', data.slots.part );		
		}
		if(data.dialogState === "Fulfilled" && data.intentName === 'HowToRecycleIntent'){		   
			
			sumerian.SystemBus.emit('updateWebLink',  data.sessionAttributes.link );		
	}
	};
	
	sumerian.SystemBus.addListener( `${sumerian.SystemBusMessage.LEX_RESPONSE}.${ctx.entity.id}`, ctx.onLexResponse);

}
	
// Called when play mode stops.
//
function cleanup(args, ctx) {
	sumerian.SystemBus.removeListener( `${sumerian.SystemBusMessage.LEX_RESPONSE}.${ctx.entity.id}`, ctx.onLexResponse);
}

// Defines script parameters.
//
var parameters = [];

