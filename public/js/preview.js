function PREVIEW_togglePreview(showPreview){


	if(showPreview){
					
		$(".dropped-object").not(".tool").removeClass("debug-border-style").removeClass("squarepeg");
		$(".dropped-object,[class=submenu]").removeClass("submenu")
		try {$(".dropped-object").resizable("destroy");}catch(e){
			console.log("object ")
			console.log(e)
		}
		$(".dropped-object").is(function(){
			log("border is " + $(this).css("border"))
			hasDefaultBorder = $(this).css("border").indexOf("dashed") != -1
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
		$("[overlay]").resizable("destroy")

		DRAW_SPACE_deleteWorkspaceFromBody();
		$(".ui-icon").hide();

	}else {
		$(".dropped-object").not(".tool,[type=MENU-ITEM]").addClass("debug-border-style").addClass("squarepeg");
		$(".dropped-object").resizable().on( "resizestop", CUSTOM_ON_RESIZE_STOP_LOGIC);
		$(".ui-droppable").resizable({disabled:false})
		$(".dropped-object").removeClass("noborder")
		$(".responsive-design-tab").show()
		editing = true;
		DRAW_SPACE_addWorkSpaceToBody();
		$(".ui-icon").show();

	}

}