function resized(){
	
	var pSection = document.getElementById("projectSection");
	var style = pSection.currentStyle || window.getComputedStyle(pSection);
	var width= parseInt(style.getPropertyValue('width'));
	console.log(width);
	var projectWidthMin = 300;
	var count = Math.floor(width/projectWidthMin);
	var extraSpace = width%projectWidthMin;
	var extraSpacePerProject = extraSpace/count-10;
	console.log(extraSpacePerProject);
	
	var allProjects = document.getElementsByClassName("project");
	for(i=0;i<allProjects.length;i++){
		p = allProjects[i];
		var style = p.currentStyle || window.getComputedStyle(p);
		console.log(p.width);
		console.log(projectWidthMin+extraSpacePerProject);
		p.width=projectWidthMin+extraSpacePerProject-parseInt(style.marginLeft)-parseInt(style.marginRight);
		p.height=p.width;
	}
}