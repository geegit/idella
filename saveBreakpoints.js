//.*(BEGIN\sELEM_1482071966106)(.+)(END\sELEM_1482071966106).*
//var breakPointRegex = /(@media\s+\(max-width:\s\d+px\)\s+\{)([^]+)(\})/img;
//var breakPointRegex = /(@media\s+\(min-width:\s\d+px\) and \(max-width:\s\d+px\)\s+\{)([^]+)(\})|(@media\s+\(max-width:\s\d+px\)\s+\{)([^]+)(\})/img;
var breakPointRegex = /(@media\s+\(min-width:\s*\d+px\) and \(max-width:\s*\d+px\)\s*\{)([^]+)(\})|(@media\s+\(max-width:\s*\d+px\)\s*\{)([^]+)(\})/;
var BREAKPOINTS = []

var boost =   function( a , b ){
	
  return a-b;
}

var currentBreakPoint = 0;

var breakingEnabled = true;


function isBreakPoint(){

	var isBreaking = false;

	var width = $("body").width()

	log.debug("Body width " + $("body").width())

	var sorted = BREAKPOINTS.sort(boost)

	log.debug("Sorted ")
	log.debug(sorted)

	if(BREAKPOINTS.length == 0 || width > BREAKPOINTS[BREAKPOINTS.length-1]){

		currentBreakPoint = 0;

		return isBreaking;
	}
	//width = 610
	for(idx in sorted){
		if(width <= BREAKPOINTS[idx] ){
			currentBreakPoint = BREAKPOINTS[idx]
			isBreaking = true;
			break;
		}
	}

	return isBreaking;
}

/* UI and Populate breakpoint array
*/
function makeOrBreakpoint(event){
	log.debug("We in here")
	var dims = $(event.target).text().split(",")
	var bp = parseInt(dims[0])

	if($(event.target).parents(".mini-responsive-design-tab").length > 0 ){
		event.target = $(".mini-responsive-design-tab");
	}
	
	$(event.target).animate({
          backgroundColor: "#F16B0A",
          //color: "#000",
          //width: 240
        }, 1000).promise().done(function(){
        	setTimeout(drawResponsiveTab,500)
        	//drawResponsiveTab()
        })

  
	if(!BREAKPOINTS.includes(bp)){
		BREAKPOINTS.push(bp)
		currentBreakPoint = bp;	
		BREAKPOINTS = BREAKPOINTS.sort(boost);
		rewriteAllBreakpointQueries();
	}

}

function rewriteAllBreakpointQueries() {

	var initialBreakPoint = currentBreakPoint;

	//1. loop all breakpoints
	for(i = 0; i < BREAKPOINTS.length; i++){
		log.warn("Breakpoints " + BREAKPOINTS[i])
		currentBreakPoint = BREAKPOINTS[i]
		log.warn("Generated Query for stylesheet should be " + generateMediaQueryString());
		var query = generateMediaQueryString();
		log.warn("Query is "+ query)
		var thescript = $("style.max-width-"+currentBreakPoint)
		
		//2. if new script tag, write it
		if(thescript.length == 0){
			log.warn("Writing new script for query [" + query  + "]")
			thescript = $("<style>").addClass("max-width-"+currentBreakPoint).html(query)
			$("head").append(thescript)
		//3. Else modify the media query within
		} else {
			groups = breakPointRegex.exec(thescript.html());
			query = query.substring(0,query.length-1)
			if(groups){
				// if min syntax only found in file, Regex will define groups[1]
				if(groups[1]){
					log.warn("replacing groups 1 [" + groups[1] + "] with [" + query  + "]")
					thescript.html(thescript.html().replace(groups[1],query))
					//if min and max syntax in file, Regex will define groups[4]
				}else if(groups[4]){
					//remove last brace
					log.warn("replacing groups 4 [" + groups[4] + "] with [" + query  + "]")
					thescript.html(thescript.html().replace(groups[4],query))
				}
			} else {
				log.error("No groups found while creating stylesheet for query " + query)
				log.error("The script html is " + thescript.html())
			}
		}
	}

	currentBreakPoint = initialBreakPoint;
}

function generateMediaQueryString(){


	var points = BREAKPOINTS

	var minWidth = 0;

	var media = "@media "

	var minStr = "(min-width:";

	var conjuction = " and ";

	var maxStr = "(max-width:";

	var px = "px)";

	var mediaQueryString = "";

	var maxWidth = currentBreakPoint > 0 ? currentBreakPoint : 5000;

	if( ( currentBreakPoint == points[0] && points.length == 1) || points.length == 1 && currentBreakPoint == points[points.length-1]){
			mediaQueryString =  media + maxStr + maxWidth + px;

	} else {
			//find current breakpoint and value just before
			for(idx  in points){
				pt = points[idx];
				if(currentBreakPoint == pt){
					minWidth = points[idx-1] +1 ? points[idx-1] + 1 : 0;
					mediaQueryString =  media + minStr + minWidth + px + conjuction + maxStr +maxWidth + px;
					break;
				}

			}
	}
	

	log.debug("Media Query is String is " + mediaQueryString + " {\n }");

	return mediaQueryString + "{\n }";

	//determine where current break point falls in list of breakpoints
	

}


function getStyleSheetForElement(elementStyleSheetId){

	var myCSSLookupKey = "\\." + elementStyleSheetId

	var theExp = new RegExp(myCSSLookupKey+'\\s+(\\{[^}]+\\})','im')

	var thescript = "";

	if(isBreakPoint()){
		thescript = $("style.max-width-"+currentBreakPoint)
	} else {
		thescript = $("style.generated");
	}

	groups = thescript.html().match(theExp)

	log.debug(groups)

	if(groups[1]){

		return (groups[1])

	} else {

		return {};
	}

}


/* persist breakpoint
*/
function saveBreakPoint(moveMe, theClassObj){

	isBreakPoint()

	drawResponsiveTab()

	log.debug("Attempting to save website " + website)

	//var myId = $(moveMe).attr("id");

	//var myCSSLookupKey = "." + $(moveMe).attr("id")

	//var re = new RegExp(myCSSLookupKey+'\\s+\\{[^}]+\\}','img')

	log.debug("Sites is ")

	log.debug(theSiteObj)


	CSS_TEXT_saveCss(moveMe, theClassObj)

	//writeClassToBreakPointCSSFile(moveMe, myCSSLookupKey,theClassObj);

	/*
	var thescript = $("style.max-width-"+currentBreakPoint)


	//temp remove last Brace.  Will add back after append
	thescript.html(thescript.html().substring(0,thescript.html().lastIndexOf("}") ) );

	styleCss = thescript.html();
	//test to see if style is not found, add it.  If found, replace it
	if(styleCss.indexOf(myId) == -1){
		thescript.append(theClassObj.cssRule);
	}else {
		thescript.html(thescript.html().replace(re,theClassObj.cssRule))
	}

	thescript.html(thescript.html() + "\n}")
		
	log.debug("Almost done " + website)

	theSiteObj.bp = BREAKPOINTS; 

	for(points in BREAKPOINTS){

		var cbp = BREAKPOINTS[points]

		log.debug("Retrieving site at breakpoint " + cbp);

		theSiteObj["@media-"+cbp] = $("style.max-width-"+cbp).html()
	} */

	//saveCurrentSite(theSiteObj)

	//localStorage.setItem("sites",JSON.stringify(theSiteObj))

	log.debug("Leaving save saveBreakPoint ")

	log.debug(theSiteObj)

}

function getBreakpoint(bp){

	//Nothing to do here.  Never case to load just one breakpoint

}


function drawResponsiveTab(){

	log.debug("Drawing Tab")

	if(isBreakPoint()){
		$(".responsive-design-tab").css("background-color","green")
		$(".mini-responsive-design-tab").css({"background-color":"green",color:"white"})
	} else {
		$(".responsive-design-tab").css("background-color","initial")
		$(".mini-responsive-design-tab").css({"background-color":"black",color:"yellow"})
	}
	$(".responsive-design-tab,.mini-responsive-design-tab").text($("body").width() + ", ["+currentBreakPoint + "]")
}

function loadAllBreakPoints(){

	log.debug("Breakpoints called")

	bp = theSiteObj.bp

	log.debug("BREAKPOINTS is " + bp)

	if(bp){

		BREAKPOINTS = bp;
	}



	//$("head").append($("style").addClass("generated").html(theSiteObj.style))

	if(bp){

		for(idx in bp){
			//mediaQueryCSS = getBreakpoint(bp[idx])

			breakpointWidth = bp[idx]

			mediaQueryCSS = theSiteObj["@media-"+breakpointWidth]

			$("head").append($("<style>").addClass("max-width-"+breakpointWidth).html(mediaQueryCSS))
		}
	}

	drawResponsiveTab()

}