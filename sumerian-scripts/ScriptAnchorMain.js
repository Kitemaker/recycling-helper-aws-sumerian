'use strict';
	
// The sumerian object can be used to access Sumerian engine
// types.
//
/* global sumerian */
	
// Called when play mode starts.
//
function setup(args, ctx) {
	
//Declare list of images for Top Label
const images = [
"Image_01_01_01_01","Image_01_01_01_02","Image_01_01_01_05","Image_02_01_04_07",
"Image_02_02_02_06","Image_02_02_03_02","Image_02_02_05_02","Image_03_03_01_07",
"Image_03_03_03_07","Image_03_03_04_02","Image_03_03_04_05","Image_03_03_06_01",
"Image_03_03_06_05","Image_04_04_02_02","Image_04_04_02_04","Image_04_04_02_05",
"Image_04_04_02_07","Image_05_02_05_02","Image_06_02_01_04","Image_06_02_01_06"  ];
	
ctx.entity.setComponent(new sumerian.ArAnchorComponent());

const arSystem = ctx.world.getSystem('ArSystem');
if (!arSystem) {
    return;
}
ctx.imageAnchorTopCallback = function(anchorId) {
    if (anchorId) {
        console.log("AWS:" + anchorId);       
		console.log('AWS: calling label change');
		sumerian.SystemBus.emit('labelDetected', anchorId);	
		sumerian.SystemBus.emit('playlabelSound');	
		ctx.entity.getComponent('ArAnchorComponent').anchorId = anchorId;
        ctx.entity.show();	
    }
};

var i;
	for(i=0;i<images.length;i++){
		arSystem.registerImage(images[i], ctx.imageAnchorTopCallback);
		console.log("AWS: Registering : " + images[i]);
	}
}
	


	
// When used in a ScriptAction, called when a state is exited.
//
function exit(args, ctx) {
}
	
// Called when play mode stops.
//
function cleanup(args, ctx) {
}

// Defines script parameters.
//
var parameters = [];
