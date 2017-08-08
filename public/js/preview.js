
function PREVIEW_makeSaveableView(page){

	$(page).find(".dropped-object").not(".tool").removeClass("debug-border-style").removeClass("squarepeg");
		$(page).find(".dropped-object,[class=submenu]").removeClass("submenu")
		try {$(page).find(".dropped-object").resizable("destroy");}catch(e){
			
			log.info("PREVIEW.js: " + e.stack)
		}
		
		$(page).find(".dropped-object").is(function(){
			log("border is " + $(this).css("border"))
			hasDefaultBorder = $(this).css("border-top-style").indexOf("dashed") != -1
			if(hasDefaultBorder){
				$(this).addClass("noborder");
			}
			return hasDefaultBorder;
		})

		$(page).find("#drawSpace").css("background-image","none");
		//editing = false;
		//hide breakpoint indicator
		$(page).find(".responsive-design-tab").hide();

		//hide extended menu
		$(page).find("#extended-editing").hide();
		//Make Div hoverable but hide it until user hovers
		$(page).find("[overlay-for]").hide();
		//Anything with an overlay can not be resized in review mode
		//existence of resize anchors make onhover logic not work correctly
		//$(page).find("[overlay]").resizable("destroy")
		
		//DRAW_SPACE_deleteWorkspaceFromBody();
		$(page).find(".ui-icon").hide();

	
}


function PREVIEW_togglePreview(showPreview){


	if(showPreview){
					
		$(".dropped-object").not(".tool").removeClass("debug-border-style").removeClass("squarepeg");
		$(".dropped-object,[class=submenu]").removeClass("submenu")
		try {$(".dropped-object").resizable("destroy");}catch(e){
			
			log.info("PREVIEW.js: " + e.stack)
		}
		
		$(".dropped-object").is(function(){
			log("border is " + $(this).css("border"))
			hasDefaultBorder = $(this).css("border-top-style").indexOf("dashed") != -1
			if(hasDefaultBorder){
				$(this).addClass("noborder");
			}
			return hasDefaultBorder;
		})

		$("#drawSpace").css("background-image","none");
		editing = false;
		//hide breakpoint indicator
		$(".responsive-design-tab").hide();

		//hide extended menu
		$("#extended-editing").hide();
		//Make Div hoverable but hide it until user hovers
		$("[overlay-for]").hide();
		//Anything with an overlay can not be resized in review mode
		//existence of resize anchors make onhover logic not work correctly
		try {
			$("[type=OVERLAY]").resizable("destroy")
		}catch(e){
			console.log("ignoring resize for overlays")
		}
		
		DRAW_SPACE_deleteWorkspaceFromBody();
		$(".ui-icon").hide();
		$(".ghost").hide();

	}else {
		$(".dropped-object").not(".tool,[type=MENU-ITEM]").addClass("debug-border-style").addClass("squarepeg").removeClass("noborder");
		$(".dropped-object").resizable().on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC);
		$(".ui-droppable").resizable({disabled:false})
		$(".dropped-object").is(function(){
			$(this).css("border-top-width") == "0" ? $(this).css({"border":"3px dashed black"}) : "";
			return true;
		})
		//$(".dropped-object").removeClass("noborder")
		$(".responsive-design-tab").show()
		editing = true;
		DRAW_SPACE_addWorkSpaceToBody();
		$(".ui-icon").show();
		$(".ghost").show();

	}
}