//.*(BEGIN\sELEM_1482071966106)(.+)(END\sELEM_1482071966106).*

function saveJs(theElem, script){


	id = $(theElem).attr("id")

	re = new RegExp('<!-- BEGIN\\s'+id+'\\s//-->([\\s\\S]+)<!-- END\\s'+id+'//-->','img')

	
	console.log("Entering save JS with id " + id)


	//theFunction = "<!-- BEGIN " + id + " //-->\n\n$(document).ready(\n\tfunction(){\n" + script.trim() + "\n})<!-- END "+ id + "//-->";
	theFunction = "<!-- BEGIN " + id + " //-->\n" + script.trim() + "\n<!-- END "+ id + "//-->";
	//eval(theFunction)

	//test to see if style is not found, add it.  If found, replace it
	if($("script.default").html().match(re) == null){
		console.log("Did not find match ")
		$("script.default").append(theFunction);
	}else {
		$("script.default").html($("script.default").html().replace(re,theFunction))
	}

	//localStorage.setItem("javaScript_"+id,script)

	log.debug("SAVJS.js: Leaving save JS with id " + id)

}

function getJs(theElem){

	id = $(theElem).attr("id")

	re = new RegExp('<!-- BEGIN\\s'+id+'\\s//-->([\\s\\S]+)<!-- END\\s'+id+'//-->','img')

	script = $("script.default").html();

	groups = re.exec($("script.default").html())

	log.debug("SAVJS.js: After applying regex " + re + " groups is " + groups);

	var exampleFunc = "$(\"#"+theElem.attr("id") + "\").on(\"click\",\n\tfunction(event){\n\t\t\/\/Enter Code Below\n\n\t}\n)";

	if(groups != null){
		//old format
		if(groups[1].trim().indexOf("$(document).ready(\n\tfunction(){") > -1){
			content = groups[1].trim().replace("$(document).ready(\n\tfunction(){\n","");
			lastBrace = content.lastIndexOf("})");
			content = content.substring(0,lastBrace);
		} else {
			content = groups[1]
		}
		

		

		log.debug("SAVJS.js: Really Returning " + content)

		return content.trim().length > 0 ? content : exampleFunc;

	} else {
		//try to read from localStorage		
		return exampleFunc;
		
	}

}

function loadAllJs(){
	console.log("loadAllJs called but this method should be deprecated")
	$(".dropped-object,.plugin").each(function(index,elem){

		thejs = getJs(elem);
		log.debug("SAVJS.js: The JS is " + thejs)
		if(thejs != null && thejs.length > 0){
			//eval(thejs)
			//saveJs(elem,thejs);
		}
	})

}