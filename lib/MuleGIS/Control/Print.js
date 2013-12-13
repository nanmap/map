/**
 * 
 */

MuleGIS.Control.Print = function () {
	MuleGIS.Control.call(this);
	var visible = false;
	var isBeginDrag = false;
	var titleInput = null;
	var subTitleInput = null;
	var instance = this;
	this.title = "标题";

	this.subTitle = "副标题";

	this.mapWidth = 640;
	this.draw = function () {
		//var topDiv = document.createElement('div');
		//topDiv.id = "lonLatLocation";
		//topDiv.className = "map-control panel panel-default";
		//topDiv.style.position = "relative";
		//topDiv.style.top = "0px";
		//topDiv.style.left = "100px";
		//topDiv.style.zIndex = "2001";
		//topDiv.style.width = "320px";

		//var head = document.createElement('div');
		//head.className = "panel-heading";
		//topDiv.appendChild(head);

		//var panelTitle = document.createElement('span');
		//panelTitle.className = "panel-title layer-tree-title";
		//panelTitle.innerText = "地图打印";
		//head.appendChild(panelTitle);

		//var closeSpan = document.createElement('span');
		//closeSpan.className ="ui-button-icon-primary ui-icon ui-icon-close layer-tree-close";
		//closeSpan.id = OpenLayers.Util.createUniqueID(
		//	'location_');
		//head.appendChild(closeSpan);

		//var titleDiv = document.createElement('div');
		//titleDiv.id = "titleDiv";
		//titleDiv.className = "location-content";
		//var titleSpan = document.createElement('span');
		//titleSpan.innerHTML = "标&nbsp;&nbsp;&nbsp;&nbsp;题:";
		//titleSpan.style.margin = "0px 5px";
		//titleInput = document.createElement('input');
		//titleInput.size = 32;
		//titleInput.type = "text";
		//titleInput.tabIndex = 1;
		//titleDiv.appendChild(titleSpan);
		//titleDiv.appendChild(titleInput);

		//var subTitleDiv = document.createElement('div');
		//var subTitleSpan = document.createElement('span');
		//subTitleInput = document.createElement('input');
		//subTitleDiv.className = "location-content";
		//subTitleInput.size = 32;
		//subTitleSpan.innerText = "副标题:";
		//subTitleSpan.style.margin = "0px 5px";
		//subTitleInput.type = "text";
		//subTitleInput.tabIndex = 2;
		//subTitleDiv.appendChild(subTitleSpan);
		//subTitleDiv.appendChild(subTitleInput);

		//var buttonDiv = document.createElement('div');
		//locationButton = document.createElement('input');
		//locationButton.type = "button";
		//locationButton.className = "print-button";
		//locationButton.value = "打印";
		//buttonDiv.appendChild(locationButton);
		//locationButton.id = OpenLayers.Util.createUniqueID(
		//	'location_button_');

		//topDiv.appendChild(head);
		//topDiv.appendChild(titleDiv);
		////topDiv.appendChild(subTitleDiv);
		//topDiv.appendChild(buttonDiv);

		//this.div = topDiv;
		//this.events = new OpenLayers.Events(this,this.div,null,true);
		//this.events.on({"click": this.onClick,
		//				"mousedown": this.onMouseDown,
		//				"mouseup": this.onMouseUp
		//});
		//return this.div;
	};

	//this.toggle = function () {
	//	visible = !visible;
	//	this.display(visible);
	//};

	//this.onClick = function () {
	//	var element = event.srcElement;
	//	if (element.nodeName === "SPAN" && element.id.indexOf('location_') === 0) {
	//		visible = false;
	//		this.display(visible);
	//	} else if (element.nodeName === "INPUT" && element.id.indexOf("location_button_") === 0) {
	//		var title = titleInput.value;
	//		var lat = subTitleInput.value;
	//		
	//		var printPage = window.open("print.html");
	//		printPage.document.body.onload = function () {
	//			var div = printPage.document.getElementById('map');
	//			div.id = "map";
	//			div.className = "map";
	//			div.innerHTML = instance.map.div.innerHTML;
	//		};
	//		//printPage.document.write("<!DOCTYPE html>");
	//		//printPage.document.write("<title>地图打印</title>");
	//		//printPage.document.write("<link href='css/printmap.css' rel='stylesheet' media='screen'>");
	//		//printPage.document.write("<link rel='stylesheet' type='text/css' href='theme/default/style.css'>");
	//		//printPage.document.write("<link href='css/mulegis.css' rel='stylesheet' media='screen'>");
	//		//printPage.document.write(div.outerHTML);
	//	} else if (element === titleInput) {
	//		titleInput.select();
	//	} else if (element === subTitleInput) {
	//		subTitleInput.select();
	//	}
	//};

	this.print = function () {
		var printPage = window.open("print.html");
		printPage.document.body.onload = function () {
			var div = printPage.document.getElementById('map');
			var initilize = new MuleGIS.Initilize();
			//div.style.width = instance.mapWidth + "px";
			//div.style.height = instance.map.div.clientHeight * instance.mapWidth / instance.map.div.clientWidth + "px";
			var bounds = instance.map.getExtent();
			var options = initilize.options;
			var map = new OpenLayers.Map(div,options);
			map.addLayers(initilize.layers);
			map.addControls(initilize.controls);
			
			//bounds.transform(map.projection,map.displayProjection);
			//bounds.transform(map.displayProjection,map.projection);
			div.className = "map olmap";
			map.setCenter(instance.map.center,instance.map.zoom);
			//map.zoomToExtent(bounds);
		};
	};

	this.display = function (visiblity) {
		if (visiblity) {
			this.div.style.display = "";
		} else {
			this.div.style.display = "none";
		}
	};
};

MuleGIS.Control.Print.prototype = new OpenLayers.Control();
