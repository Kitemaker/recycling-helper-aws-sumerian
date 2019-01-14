
'use strict';
	
function setup(args, ctx) {
	
  ctx.world.intro = false;
	// Called when play mode starts.
  ctx.entity.setComponent(new sumerian.ArAnchorComponent());
  ctx.world.map = ctx.world.entityManager.getEntityByName('map');
	
  ctx.world.map.setComponent(new sumerian.ArAnchorComponent());
  const arSystem = ctx.world.getSystem('ArSystem');
  if (!arSystem) {
    return;
  }

  // Touch handler. Performs a hit test at the currrent screen location.
  ctx.performHitTest = function(evt) {
    var pixelRatio = ctx.world.sumerianRunner.renderer.devicePixelRatio;
    var normalizedX = evt.changedTouches[0].pageX * pixelRatio / ctx.viewportWidth;
    var normalizedY = evt.changedTouches[0].pageY * pixelRatio / ctx.viewportHeight;

    arSystem.hitTest(normalizedX, normalizedY, ctx.hitTestCallback);
  };

  // Hit test callback. If the hit test was successful (i.e., detected a
  // point in the real world), registers an anchor with that point.
  ctx.hitTestCallback = function(anchorTransform) {
    if (anchorTransform) {
      arSystem.registerAnchor(anchorTransform, ctx.registerAnchorCallback);
    }
  };

  // Anchor registration callback. Sets the anchor ID of the entity's
  // ArAnchorComponent. The engine's ArSystem will automatically update
  // the world position and orientation of entities with a valid anchor ID.
  ctx.registerAnchorCallback = function(anchorId) {
    if (anchorId) {
		console.log(anchorId);		
		
      ctx.entity.getComponent('ArAnchorComponent').anchorId = anchorId;
	  console.log("AWS: showing Host");
	  ctx.entity.show();
	  sumerian.SystemBus.emit('introduction');
	  console.log('AWS: setting anchor for map');
	//  ctx.world.map.getComponent('ArAnchorComponent').anchorId = anchorId;
		
	  console.log('AWS: setting coordinates for map');
	//  ctx.world.map.addTranslation(-2,0,0);		
	  ctx.world.map.show();
	  
    }
  };	

// event listener for hit test
  ctx.domElement.addEventListener('touchend', ctx.performHitTest);
	
}


//
function cleanup(args, ctx) {
	 // Called when play mode stops.
    ctx.domElement.removeEventListener('touchend', ctx.performHitTest);
	
}


// Defines script parameters.
//
var parameters = [];
