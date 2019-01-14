'use strict';
	
// Called when play mode starts.
//
function setup(args, ctx) {
	const labelImageMain = "https://s3.amazonaws.com/aws-sumerian-ar/Lex/Recycling_Label_Main_For_Lex.png";
	var labelPartImages = ["","","",""];
	labelPartImages[0] = "https://s3.amazonaws.com/aws-sumerian-ar/Lex/Label_Page1.png";
	labelPartImages[1] = "https://s3.amazonaws.com/aws-sumerian-ar/Lex/Label_Page2.png";
	labelPartImages[2] = "https://s3.amazonaws.com/aws-sumerian-ar/Lex/Label_Page3.png";
	labelPartImages[3] = "https://s3.amazonaws.com/aws-sumerian-ar/Lex/Label_Page4.png";
	
	const mapIframeCode = '<iframe width="1680" height="1080" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?key=AIzaSyDKfFQStruF8z9wuvuTiv_74OL-vaC0cIU&q=SEARCH_TERM" allowfullscreen></iframe>';
	const mapElement = document.getElementById('map');
	
	ctx.onSearchOnMap = (searchTerm) => {
		console.log('AWS: Searching for' + searchTerm);
		const mapInnerHtml = mapIframeCode.replace('SEARCH_TERM', searchTerm);
		mapElement.innerHTML = mapInnerHtml;		
		
	};
	
	ctx.onUpdateLabelMain = (data) => {			
		
			const mapElement = document.getElementById('map');	
			var frameElement = mapElement.getElementsByTagName('iframe')[0];	
			frameElement.setAttribute("src", labelImageMain );
		
	};
	
	
	ctx.onUpdateLabelPart = (part) => {
		console.log("AWS: part number is = " + part);
		if( part > 0  && part < 5){
			const mapElement = document.getElementById('map');	
			var frameElement = mapElement.getElementsByTagName('iframe')[0];	
			frameElement.setAttribute("src", labelPartImages[part -1] );
		}
		
	}
	
	ctx.onUpdateWibLink = (link) => {
		
		if( link != ""){
			const mapElement = document.getElementById('map');	
			var frameElement = mapElement.getElementsByTagName('iframe')[0];	
			frameElement.setAttribute("src", link);
		}
		
	}
	
	console.log('AWS: Adding events searchOnMap');
	sumerian.SystemBus.addListener('searchOnMap', ctx.onSearchOnMap);
	sumerian.SystemBus.addListener('updateLabelMain', ctx.onUpdateLabelMain);
	sumerian.SystemBus.addListener('updateLabelPart', ctx.onUpdateLabelPart);
	sumerian.SystemBus.addListener('updateWebLink', ctx.onUpdateWibLink);
	
	// update map on opening to no search term
	const mapInnerHtml = mapIframeCode.replace('SEARCH_TERM', 'Seattle,US');
	mapElement.innerHTML = mapInnerHtml;
}
	

//
function exit(args, ctx) {
}
	
// Called when play mode stops.
//
function cleanup(args, ctx) {
	sumerian.SystemBus.removeListener('searchOnMap', ctx.onSearchOnMap);
	sumerian.SystemBus.removeListener('updateLabelMain', ctx.onUpdateLabelMain);
	sumerian.SystemBus.removeListener('updateLabelPart', ctx.onUpdateLabelPart);
	sumerian.SystemBus.removeListener('updateWebLink', ctx.onUpdateWibLink);
	
}

// Defines script parameters.
//
var parameters = [];

