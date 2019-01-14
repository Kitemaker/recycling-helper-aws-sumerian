'use strict';
	
// The sumerian object can be used to access Sumerian engine
// types.
//
/* global sumerian */
	
// Called when play mode starts.
//
function setup(args, ctx) {	
	
ctx.world.topLabelData = {
	"01": "Rinse & Insert Lid: Rinse your container out, and then stick the lid back inside the container. You can do this with all metal cans.",
	"02": "Empty & Replace Cap: Before recycling your item, make sure it's empty and then screw the cap back on. Always caps on!",
	"03": "Empty Before Recycling: Make sure your container is empty before you recycle it. No need to rinse.",
	"04": "Rinse Before Recycling: Just a quick rinse and recycle it!",
	"05": "Rinse & Replace Lid: Rinse the container but then be sure to put the lid back on!",
	"06": "Recycle If Clean & Dry: Before you recycle this item, throw away or compost any remaining product inside and make sure it isn't sticky or wet.",
	"07": "See Website for Cap/Bottles: Certain caps and small packaging are too small to make it through a recycling facility. Ask your drop-off location if they accept loose caps, or send your plastic caps to Terracycle or Gimme 5.",
	"08": "Remove Label Before Recycling: This means for this specific package, your container won't be recycled properly unless you remove the label first.",
	"09": "Empty & Discard Sprayer: This means before you recycle your bottle, make sure you remove the sprayer. This usually means the sprayer contains metal parts.",
	"10": "Empty & Reattach Sprayer: This means before you recycle the bottle, make sure it's empty and reattach the sprayer. For this packaging, the sprayer is recyclable!",
	"11": "Empty & Discard Pump: This means before you recycle your bottle, make sure you remove the pump. This usually means the pump contains metal parts.",
	"12": "Empty & Reattach Pump: This means before you recycle the bottle, make sure it's empty and reattach the pump. For this packaging, the pump is recyclable!"
};
	
ctx.world.centerLabelData = {
	"01": "Widely Recycled: At least 60% of Americans can recycle this package at curbside recycling or drop-off recycling.",
	"02": "Limited Recycling: Between 60% and 20% of Americans can recycle this package at curbside recycling or drop-off recycling. Check your local program.",
	"03": "Not Yet Recycled: Either less than 20% of Americans can recycle this package, or, it could cause a problem in a recycling facility.",
	"04": "Store Drop-Off: Anyone who lives near a store that accepts plastic bags and wraps for recycling can take this packaging to that store and recycle it there",
};
	
ctx.world.bottomLabelData = {
	
	"01": "Metal: In How2Recycle, metal encompasses both steel and aluminum. You don't have to worry about what's what!",
	"02": "Paper: There are many different kinds of paper. With How2Recycle, you don't have to worry which kind of paper something is in order to know how to recycle it.",
	"03": "Plastic: This helps you know exactly which part of the packaging we're telling you to recycle.",	
	"04": "Coated Paper: This helps you know exactly which part of the packaging we're telling you how to recycle.",
	"05" : "Glass: This helps you know exactly which part of the packaging we're telling you how to recycle.",
	"06" : "Multi-layer: This material is actually a mix of materials. Often it will be layers of different types of plastic, or layers of plastic with aluminum."
};
	
	ctx.world.footerLabelData = {
	"01": "Can: This helps you identify which part of the packaging we're referring to.",
	"02": "Bottle: This helps you identify which part of the packaging we're referring to.",
	"03": "Tray: This helps you identify which part of the packaging we're referring to.",
	"04": "Insert: This helps you identify which part of the packaging we're referring to.",
	"05": "Box: This helps you identify which part of the packaging we're referring to.",
	"06": "Bag: This helps you identify which part of the packaging we're referring to.",
	"07": "Wrap: This helps you identify which part of the packaging we're referring to.",	
	"08": "Film: This helps you identify which part of the packaging we're referring to.",
	"09": "Pounch: This helps you identify which part of the packaging we're referring to."
	};
	
	


ctx.labelDetectedCallback = (anchorId) => {  
        console.log("AWS:" + anchorId);       
		console.log('AWS: got channel labelDetected');
		console.log("AWS:" + ctx.world.centerLabelData);
		var labelArr = anchorId.split("_");
		console.log("AWS: " + labelArr);
		console.log('AWS: Update Top');
	
		var topLabel = document.getElementById('top');
	    topLabel.innerHTML = "check";
		topLabel.innerHTML = ctx.world.topLabelData[labelArr[1]];
	
		console.log('AWS: Update Center' + topLabel.innerHTML);
		var centerLabel = document.getElementById('center');
		centerLabel.innerHTML = ctx.world.centerLabelData[labelArr[2]];
	
		var bottomLabel = document.getElementById('bottom');
		console.log('AWS: Update Bottom');
		bottomLabel.innerHTML = ctx.world.bottomLabelData[labelArr[3]];
	
		console.log('AWS: Update Footer');
		var footerLabel = document.getElementById('footer');		
		footerLabel.innerHTML = ctx.world.footerLabelData[labelArr[4]];	  
       
    
};
	sumerian.SystemBus.addListener('labelDetected', ctx.labelDetectedCallback);
}
	


	
// Called when play mode stops.
//
function cleanup(args, ctx) {
	sumerian.SystemBus.removeListener('labelDetected', ctx.labelDetectedCallback);
}

// Defines script parameters.
//
var parameters = [];
