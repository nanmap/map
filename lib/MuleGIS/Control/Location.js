/**
 * 
 */

MuleGIS.Control.Location = function () {
	MuleGIS.Control.apply(this);
	var lonInput;
	var latInput;
	var locationButton;
	var visible = false;
	var isBeginDrag = false;
	var labels = [];
	var markerLayer = new OpenLayers.Layer.Markers("坐标定位图层");
	var instance = this;

	var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
	for (var i=0, len=events.length; i<len; i++) {
		if (this[events[i]]) {
			this.unregister(events[i], this[events[i]]); 
		}
	}
	
	this.draw = function () {
		var topDiv = document.createElement('div');
		topDiv.id = "lonLatLocation";
		topDiv.className = "map-control panel panel-default";
		topDiv.style.position = "relative";
		topDiv.style.top = "0px";
		topDiv.style.left = "100px";
		topDiv.style.zIndex = "2001";
		topDiv.style.width = "220px";

		var treeHead = document.createElement('div');
		treeHead.className = "panel-heading";
		topDiv.appendChild(treeHead);

		var panelTitle = document.createElement('span');
		panelTitle.className = "panel-title layer-tree-title";
		panelTitle.innerText = "坐标定位";
		treeHead.appendChild(panelTitle);

		var closeSpan = document.createElement('span');
		closeSpan.className ="ui-button-icon-primary ui-icon ui-icon-close layer-tree-close";
		closeSpan.id = OpenLayers.Util.createUniqueID(
			'location_');
		treeHead.appendChild(closeSpan);

		var lonDiv = document.createElement('div');
		lonDiv.id = "lonDiv";
		lonDiv.className = "location-content";
		var lonSpan = document.createElement('span');
		lonSpan.innerText = "经度:";
		lonSpan.style.margin = "0px 5px";
		lonInput = document.createElement('input');
		lonInput.type = "text";
		lonInput.tabIndex = 1;
		lonDiv.appendChild(lonSpan);
		lonDiv.appendChild(lonInput);

		var latDiv = document.createElement('div');
		var latSpan = document.createElement('span');
		latDiv.className = "location-content";
		latSpan.innerText = "纬度:";
		latSpan.style.margin = "0px 5px";
		latInput = document.createElement('input');
		latInput.type = "text";
		latInput.tabIndex = 2;
		latDiv.appendChild(latSpan);
		latDiv.appendChild(latInput);

		var buttonDiv = document.createElement('div');
		locationButton = document.createElement('input');
		locationButton.type = "button";
		locationButton.className = "location-button";
		locationButton.value = "定位";
		buttonDiv.appendChild(locationButton);
		locationButton.id = OpenLayers.Util.createUniqueID(
			'location_button_');

		topDiv.appendChild(treeHead);
		topDiv.appendChild(lonDiv);
		topDiv.appendChild(latDiv);
		topDiv.appendChild(buttonDiv);

		this.div = topDiv;
		this.div.style.display = "none";

		this.events = new OpenLayers.Events(this,this.div,null,true);
		this.events.on({"click": this.onClick,
						"mousedown": this.onMouseDown,
						"mouseup": this.onMouseUp
		});
		return this.div;
	};

	this.onZoomEnd = function () {
		for(var i = 0; i < labels.length; i++){
			var obj = labels[i].lonLat;
			var label = labels[i].div;
			var px = this.map.getLayerPxFromLonLat(obj);
			label.style.left = (px.x - label.clientWidth/2) + "px";
			label.style.top = px.y + "px";
		}
	};
	
	this.onClick = function () {
		var element = event.srcElement;
		if (element.nodeName === "SPAN" && element.id.indexOf('location_') === 0) {
			visible = false;
			this.div.style.display = "none";
		} else if (element.nodeName === "INPUT" && element.id.indexOf("location_button_") === 0) {
			var lon = lonInput.value;
			var lat = latInput.value;
			
			var size = new OpenLayers.Size(19,29);
			var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
			var icon = new OpenLayers.Icon('img/red-marker.png',size,offset);
			var srcLonlat = new OpenLayers.LonLat(lon,lat);
			
			var label = document.createElement('div');
			label.className = "marker-label";
			label.innerText = srcLonlat.lon + "," + srcLonlat.lat;

			var destLonlat = srcLonlat.transform(this.map.displayProjection,this.map.projection);
			var marker = new OpenLayers.Marker(destLonlat,icon);
			markerLayer.addMarker(marker);

			var px = this.map.getLayerPxFromLonLat(marker.lonlat);
			label.style.position = "absolute";
			markerLayer.div.appendChild(label);
			label.style.left = (px.x - label.clientWidth/2) + "px";
			label.style.top = px.y + "px";
			labels.push({lonLat:marker.lonlat,div:label});
			
			//var labelMarker = new MuleGIS.LabelMarker(new OpenLayers.LonLat(lon,lat),new MuleGIS.Label(lon + "," + lat));
			//markerLayer.addMarker(labelMarker);
			
			this.map.panTo(destLonlat);
		} else if (element === lonInput) {
			lonInput.select();
		} else if (element === latInput) {
			latInput.select();
		}
	};

	this.setMap = function (map) {
		this.map = map;

		this.map.addLayer(markerLayer);
		this.map.events.register("moveend",this,this.onZoomEnd);
	};

	this.toggle = function () {
		visible = !visible;
		if (visible) {
			this.div.style.display = "";
		} else {
			this.div.style.display = "none";
		}
	};
	this.onMouseDown = function () {
		isBeginDrag = true;
		this.events.on({"mousemove": this.onMouseMove});
		dragX = event.clientX;
		dragY = event.clientY;
	};
	
	this.onMouseUp = function () {
		isBeginDrag = false;
		this.events.un({"mousemove": this.onMouseMove});
	};

	this.onMouseMove = function () {
		if (isBeginDrag) {
			var moveX = event.clientX - dragX;
			var moveY = event.clientY - dragY;
			dragX = event.clientX;
			dragY = event.clientY;
			var top = parseInt(this.div.style.top.replace('px',''),0);
			var left = parseInt(this.div.style.left.replace('px',''),0);
			left = left + moveX;
			top = top + moveY;
			this.div.style.top = top +"px";
			this.div.style.left = left +"px";
		}
	};
};
