/*
 * Copyright (c) 2013 by Neusoft
 */

MuleGIS = function () {
	/**
	 *  版本号
	 */
	version = "0.1";

	this.getVersion = function () {
		return version;
	};
};

/* Copyright (c) 2013 by Neusoft
 */

MuleGIS.Control = function () {
	
	MuleGIS.call(this);
	
	var instance = this;

	/**
	 * property:id
	 * {string}
	 */
	this.id = null;

	/**
	 * property:name
	 * {string}
	 */
	this.name = "control";
	
	/**
	 * property:div
	 * {string}
	 */
	this.div = null;
	
	/**
	 * property:map
	 * {OpenLayers.Map}
	 */
	this.map = null;
	
	this.setMap = function (map) {
		this.map = map;
	};

	CLASS_NAME = "MuleGIS.Control";
};

MuleGIS.Control.prototype = new OpenLayers.Control();


MuleGIS.Control.DrawFeature = function () {
	MuleGIS.Control.call(this);

	var visible = false;
	var isBeginDrag = false;
	var instance = this;

	var vectorLayer = new OpenLayers.Layer.Vector("动态标绘图层");
	vectorLayer.styleMap.styles.default.defaultStyle.strokeColor = "#0004EE";
	vectorLayer.styleMap.styles.default.defaultStyle.strokeWidth = 2;
	var pointControl = new OpenLayers.Control.DrawFeature(vectorLayer,MuleGIS.Handler.Point);
	var lineControl = new OpenLayers.Control.DrawFeature(vectorLayer,MuleGIS.Handler.Path);
	var polygonControl = new OpenLayers.Control.DrawFeature(vectorLayer,MuleGIS.Handler.Polygon);
	var modifyControl = new OpenLayers.Control.ModifyFeature(vectorLayer);

	this.clickFeature = function (feature) {
		vectorLayer.removeFeatures([feature]);
	};
	var featureHandler = new OpenLayers.Handler.Feature(
		this, vectorLayer, {click: this.clickFeature}
	);

	this.controls = [];
	this.elements = [];

	this.initilize = function () {
		this.controls.push(pointControl);
		this.controls.push(lineControl);
		this.controls.push(polygonControl);
		this.controls.push(modifyControl);
		//this.controls.push(featureHandler);
	};

	this.initilize();
	this.draw = function () {
		var topDiv = document.createElement('div');
		topDiv.id = OpenLayers.Util.createUniqueID(
			'drawFeature_');
		topDiv.className = "map-control panel panel-default";
		topDiv.style.position = "relative";
		topDiv.style.top = "0px";
		topDiv.style.left = "100px";
		topDiv.style.zIndex = "2001";
		topDiv.style.width = "300px";

		var head = document.createElement('div');
		head.className = "panel-heading";
		topDiv.appendChild(head);

		var panelTitle = document.createElement('span');
		panelTitle.className = "panel-title layer-tree-title";
		panelTitle.innerText = "动态标绘";
		head.appendChild(panelTitle);

		var closeSpan = document.createElement('span');
		closeSpan.className ="ui-button-icon-primary ui-icon ui-icon-close layer-tree-close";
		closeSpan.id = OpenLayers.Util.createUniqueID(
			'draw_feature_close_');
		head.appendChild(closeSpan);

		contentBody = document.createElement('div');
		contentBody.className = "panel-body draw-feature-body";

		var pointDiv = document.createElement('div');
		pointDiv.className = "draw-div draw-point-div";
		var innerPointDiv = document.createElement('div');
		innerPointDiv.className = "draw-point";
		innerPointDiv.title = "画点";
		pointDiv.appendChild(innerPointDiv);
		contentBody.appendChild(pointDiv);
		this.elements.pointDiv = pointDiv;
		
		var lineDiv = document.createElement('div');
		lineDiv.className = "draw-div draw-line-div";
		var innerLineDiv = document.createElement('div');
		innerLineDiv.className = "draw-line";
		innerLineDiv.title = "画线";
		lineDiv.appendChild(innerLineDiv);
		contentBody.appendChild(lineDiv);
		this.elements.lineDiv = lineDiv;

		var polygonDiv = document.createElement('div');
		polygonDiv.className = "draw-div draw-polygon-div";
		var innerPolygonDiv = document.createElement('div');
		innerPolygonDiv.className = "draw-polygon";
		innerPolygonDiv.title = "画多边形";
		polygonDiv.appendChild(innerPolygonDiv);
		contentBody.appendChild(polygonDiv);
		this.elements.polygonDiv = polygonDiv;

		var modifyDiv = document.createElement('div');
		modifyDiv.className = "draw-div modify-draw-div";
		var innerModifyDiv = document.createElement('div');
		innerModifyDiv.className = "modify-draw";
		innerModifyDiv.title = "修改图形";
		modifyDiv.appendChild(innerModifyDiv);
		contentBody.appendChild(modifyDiv);
		this.elements.modifyDiv = modifyDiv;

		var deleteDiv = document.createElement('div');
		deleteDiv.className = "draw-div delete-draw-div";
		var innerDeleteDiv = document.createElement('div');
		innerDeleteDiv.className = "delete-draw";
		innerDeleteDiv.title = "删除图形";
		deleteDiv.appendChild(innerDeleteDiv);
		this.elements.deleteDiv = deleteDiv;

		contentBody.appendChild(deleteDiv);
		topDiv.appendChild(contentBody);

		this.div = topDiv;
		this.events = new OpenLayers.Events(this,this.div,null,true);
		this.events.on({"click": this.onClick,
						"mousedown": this.onMouseDown,
						"mouseup": this.onMouseUp
		});
		this.div.style.display = "none";
		return this.div;
	};

	this.onClick = function () {
		var element = event.srcElement;
		if(!!element) {
			if (element.nodeName === "SPAN" && element.id.indexOf('draw_feature_close_') === 0) {
				this.toggle();
			} else if (element.className.indexOf("draw-point") >= 0) {
				this.removeSelectedClass();
				if (pointControl.active === true) {
					this.activeControl(null);
				} else {
					this.activeControl(pointControl);
					OpenLayers.Element.addClass(this.elements.pointDiv,"draw-div-selected");
				}
			} else if (element.className.indexOf("draw-line") === 0) {
				this.removeSelectedClass();
				if (lineControl.active === true) {
					this.activeControl(null);
				} else {
					this.activeControl(lineControl);
					OpenLayers.Element.addClass(this.elements.lineDiv,"draw-div-selected");
				}
			} else if (element.className.indexOf("draw-polygon") === 0) {
				this.removeSelectedClass();
				if (polygonControl.active === true) {
					this.activeControl(null);
				} else {
					this.activeControl(polygonControl);
					OpenLayers.Element.addClass(this.elements.polygonDiv,"draw-div-selected");
				}
			} else if (element.className.indexOf("modify-draw") === 0) {
				this.removeSelectedClass();
				if (modifyControl.active === true) {
					this.activeControl(null);
				} else {
					this.activeControl(modifyControl);
					OpenLayers.Element.addClass(this.elements.modifyDiv,"draw-div-selected");
				}
			} else if (element.className.indexOf("delete-draw") === 0) {
				this.removeSelectedClass();
				if (featureHandler.active === true) {
					this.activeControl(null);
					featureHandler.deactivate();
				} else {
					this.activeControl(null);
					featureHandler.activate();
					OpenLayers.Element.addClass(this.elements.deleteDiv,"draw-div-selected");
				}
			}
		}
	};

	this.activeControl = function (control) {
		for(var i = 0; i < this.controls.length; i++) {
			if (this.controls[i] === control) {
				this.controls[i].activate();
			} else {
				this.controls[i].deactivate();
			}
		}
	};

	this.removeSelectedClass = function () {
		for (var property in this.elements) {
			var value = this.elements[property]; 
			if (value !== undefined) {
				OpenLayers.Element.removeClass(value,"draw-div-selected");
			}
		}
	};

	this.setMap = function (map) {
		this.map = map;
		featureHandler.setMap(map);
		this.map.addControls(this.controls);
		this.map.addLayer(vectorLayer);
	};
	
	this.setFeatureAdded = function(fun) {
		pointControl.featureAdded = fun;
		lineControl.featureAdded = fun;
		polygonControl.featureAdded = fun;
		
	};
	this.toggle = function () {
		visible = !visible;
		if (visible) {
			instance.div.style.display = "";
		} else {
			this.activeControl(null);
			instance.div.style.display = "none";
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


MuleGIS.Control.FeatureManager = function () {
	MuleGIS.Control.call(this);
	var instance = this;
	this.div = "";

	this.version = "1.0.0";

	this.url = "http://localhost:8080/geoserver/wfs";

	this.srsName = "EPSG:4326";
	
	this.featureNS = "http://www.neusoft.com/china";

	this.featurePrefix = "china";

	this.featureType = "house";

	this.geometryName = "geom";

	this.layerName = "编辑图层";

	this.vectorLayer = null;

	this.autoSave = false;

	this.saveStrategy = new OpenLayers.Strategy.Save({auto: this.autoSave});

	this.refreshStrategy = new OpenLayers.Strategy.Refresh();
	this.schema = "http://192.168.196.189:8080/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=china:house";

	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

	var drawControl = null;
	var editControl = null;
	var deleteControl = null;

	this.initialize = function () {
		if (this.map) {
			this.vectorLayer = new OpenLayers.Layer.Vector(this.layerName, {
				projection: new OpenLayers.Projection(this.srsName),
				strategies: [new OpenLayers.Strategy.BBOX(),
					this.saveStrategy,
					this.refreshStrategy],
				protocol: new OpenLayers.Protocol.WFS({
					version: this.version,
					url:  this.url,
					featureType: this.featureType,
					featureNS: this.featureNS,
					srsName : this.srsName,
					isBaseLayer: false,
					geometryName : this.geometryName
				}),
				renderers: renderer
			});

			if (this.map && this.vectorLayer) {
				this.map.addLayer(this.vectorLayer);
			}
			this.schema = this.url + "/DescribeFeatureType?version=" + this.version + "&typename=" + this.featurePrefix + ":" + this.featureType;

			OpenLayers.Request.GET({
				url: this.schema,
				success: this.complete 
			});
		}
	};

	this.complete = function (req) {
		var format = new OpenLayers.Format.WFSDescribeFeatureType();
		var obj = format.read(req.responseXML || req.responseText);
		if (obj && obj.featureTypes && obj.featureTypes[0].properties) {
			for (var i = 0, j = obj.featureTypes[0].properties.length; i< j; i++) {
				var field = obj.featureTypes[0].properties[i];
				if (field && field.name === instance.geometryName) {
					var type = field.type;
					var handler = null;
					var multi = false;
					if (type.indexOf("Point") > 0) {
						handler = OpenLayers.Handler.Point;
					} else if (type.indexOf("Line") > 0) {
						handler = OpenLayers.Handler.Path;
					} else if (type.indexOf("Polygon") > 0) {
						handler = OpenLayers.Handler.Polygon;
					}

					if (type.indexOf("Multi") > 0) {
						multi = true;
					}

					instance.drawControl =  new OpenLayers.Control.DrawFeature(instance.vectorLayer, handler, {
						handlerOptions: {multi: multi},
						map: this.map
					});

					instance.editControl = new OpenLayers.Control.ModifyFeature(instance.vectorLayer, {map: this.map});
					instance.deleteControl = new MuleGIS.Control.DeleteFeature(instance.vectorLayer, this.map);
				}
			}
		}
	};

	this.draw = function () {
		this.initialize();
	};

	this.activate = function () {
		instance.cancel();
		if (this.drawControl) {
			this.drawControl.activate();
			return true;
		}

		return false;
	};

	this.activateModify = function () {
		instance.cancel();
		if (instance.editControl) {
			instance.editControl.activate();
		}
	};

	this.activateDelete = function () {
		instance.drawControl.deactivate();
		instance.editControl.deactivate();
		if (instance.deleteControl) {
			instance.deleteControl.activate();
		}
	};

	this.save = function () {
		this.cancel();
		var result = this.saveStrategy.save();
		this.refreshStrategy.refresh();
		return result;
	};

	this.cancel = function () {
		instance.drawControl.deactivate();
		instance.editControl.deactivate();
		instance.deleteControl.deactivate();
	};

	this.setMap = function (map) {
		this.map = map;

		if (this.vectorLayer) {
			map.addLayer(this.vectorLayer);
		}
	};
};

MuleGIS.Control.FeatureManager.prototype = new OpenLayers.Control();

MuleGIS.Control.DeleteFeature = function (layer, map) {
	MuleGIS.Control.call(this);

	this.layer = layer;

	this.clickFeature = function(feature) {
		if (feature.fid === undefined) {
			this.layer.destroyFeatures([feature]);
		} else {
			feature.state = OpenLayers.State.DELETE;
			this.layer.events.triggerEvent("afterfeaturemodified", {feature: feature});
			feature.renderIntent = "select";
			this.layer.drawFeature(feature);
		}
	};

	this.handler = new OpenLayers.Handler.Feature(
		this, layer, {click: this.clickFeature}
	);

	this.setMap = function (map){
		this.map = map;

		if (this.handler) {
			this.handler.setMap(this.map);
		}
	};

	this.setMap(map);
};

MuleGIS.Control.DeleteFeature.prototype = new OpenLayers.Control();

/**
 * 
 */

MuleGIS.Control.LayerTree = function () {
	MuleGIS.Control.call(this);
	var instance = this;
	
	var visible = false;

	var isBeginDrag = false;

	var layerDictionary = new MuleGIS.Dictionary();
	
	var dragX = 0;

	var dragY = 0;
	var contentBody = null;
	this.baseGroupLabel = "基础图层";

	this.normalGroupLabel = "业务图层";

	this.draw = function () {
		var topDiv = document.createElement('div');
		topDiv.id = OpenLayers.Util.createUniqueID(
			'layerTree_');
		topDiv.className = "map-control panel panel-default";
		topDiv.style.position = "relative";
		topDiv.style.top = "0px";
		topDiv.style.left = "100px";
		topDiv.style.zIndex = "2001";
		topDiv.style.width = "400px";

		var treeHead = document.createElement('div');
		treeHead.className = "panel-heading";
		topDiv.appendChild(treeHead);

		var panelTitle = document.createElement('span');
		panelTitle.className = "panel-title layer-tree-title";
		panelTitle.innerText = "图层管理";
		treeHead.appendChild(panelTitle);

		var closeSpan = document.createElement('span');
		closeSpan.className ="ui-button-icon-primary ui-icon ui-icon-close layer-tree-close";
		closeSpan.id = OpenLayers.Util.createUniqueID(
			'layer_tree_close_');
		treeHead.appendChild(closeSpan);

		contentBody = document.createElement('div');
		contentBody.className = "panel-body";

		topDiv.appendChild(contentBody);

		this.div = topDiv;
		this.events = new OpenLayers.Events(this,this.div,null,true);
		this.events.on({"click": this.onClick,
						"mousedown": this.onMouseDown,
						"mouseup": this.onMouseUp
		});
		//this.map.events.on("buttonclick", this, this.onButtonClick);
		this.div.style.display = "none";
		return this.div;
	};

	this.redraw = function () {
		var layers = this.map.layers.slice();
		
		var child = contentBody.children.item();
		while (child) {
			contentBody.removeChild(child);
			child = contentBody.children.item();
		}
		
		var layerDiv = document.createElement('div');
		var baseLayerDiv = document.createElement('div');
		baseLayerDiv.innerText = this.baseGroupLabel;
		var normalLayerDiv = document.createElement('div');
		normalLayerDiv.innerText = this.normalGroupLabel;

		for (var i =0,j = layers.length;i < j; i++) {
			var layer = layers[i];
			var baseLayer = layer.isBaseLayer;

			if (baseLayer) {
				var baseLayerEleDiv = document.createElement('div');
				baseLayerEleDiv.className = "layer-element";
				var inputEle = document.createElement('input');
				inputEle.id = OpenLayers.Util.createUniqueID(
					'layer_check_');
				inputEle.type = "radio";
				inputEle.name = "baseLayer";
				inputEle.checked = layer.visibility;
				inputEle.className = "layer-checkBox";
				var layerLabel = document.createElement('div');
				layerLabel.innerText = layer.name;
				layerLabel.id = OpenLayers.Util.createUniqueID(
					'layer_label_');
				layerLabel.className = "layer-label";

				layerDictionary.put(inputEle.id,layer);
				baseLayerEleDiv.appendChild(inputEle);
				baseLayerEleDiv.appendChild(layerLabel);
				baseLayerDiv.appendChild(baseLayerEleDiv);
			} else {
				var layerEleDiv = document.createElement('div');
				layerEleDiv.className = "layer-element";
				var checkEle = document.createElement('input');
				checkEle.id = OpenLayers.Util.createUniqueID(
					'layer_check_');
				checkEle.type ="checkbox";
				checkEle.checked = layer.visibility;
				checkEle.className = "layer-checkBox";
				var labelDiv = document.createElement('div');
				labelDiv.id = OpenLayers.Util.createUniqueID(
					'layer_label_');
				labelDiv.innerText = layer.name;
				labelDiv.className = "layer-label";

				layerDictionary.put(checkEle.id,layer);
				layerEleDiv.appendChild(checkEle);
				layerEleDiv.appendChild(labelDiv);
				normalLayerDiv.appendChild(layerEleDiv);
			}
		}
		contentBody.appendChild(baseLayerDiv);
		contentBody.appendChild(normalLayerDiv);
	};

	this.setMap = function (map) {
		this.map = map;

		this.map.events.on({
			addlayer: this.redraw,
			changelayer: this.redraw,
			removelayer: this.redraw,
			changebaselayer: this.redraw,
			scope: this
		});
	};

	this.onClick = function () {
		var element = event.srcElement;
		if(!!element) {
			if(element.nodeName === "INPUT") {
				switch (element.type) {
					case "checkbox":
						var layer = layerDictionary.get(element.id);
						layer.setVisibility(element.checked);
						break;
					case "radio":
						var baseLayer = layerDictionary.get(element.id);
						this.map.setBaseLayer(baseLayer, false);
						break;
				}
			} else if (element.nodeName === "SPAN" && element.id.indexOf('layer_tree_close_') === 0) {
				visible = false;
				this.div.style.display = "none";
			}
		}
	};
	
	this.showControl = function () {
		visible = true;
		this.div.style.display = "";
	};

	this.toggle = function () {
		visible = !visible;
		if (visible) {
			instance.div.style.display = "";
		} else {
			instance.div.style.display = "none";
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

MuleGIS.Control.LayerTree.prototype = new OpenLayers.Control();

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

/**
 * 
 */

MuleGIS.Control.Measure = function () {
	MuleGIS.Control.call(this);
	var points = [];
	var instance = this;

	var sketchSymbolizers = {
		"Point": {
			pointRadius: 5,
			graphicName: "circle",
			fillColor: "white",
			fillOpacity: 1,
			strokeWidth: 1,
			strokeOpacity: 1,
			strokeColor: "#FC7F43"
		},
		"Line": {
			strokeWidth: 2,
			strokeOpacity: 1,
			strokeColor: "#FC7F43",
			strokeDashstyle: "solid"
		},
		"Polygon": {
			strokeWidth: 2,
			strokeLinecap: "round",
			strokeOpacity: 1,
			strokeColor: "#FC7F43",
			fillColor: "white",
			fillOpacity: 0.3
		}
	};
	var style = new OpenLayers.Style();
	style.addRules([
		new OpenLayers.Rule({symbolizer: sketchSymbolizers})
	]);
	var styleMap = new OpenLayers.StyleMap({"default": style});
	
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

	measureControls = {
		line: new OpenLayers.Control.Measure(
			OpenLayers.Handler.Path, {
				persist: true,
				handlerOptions: {
					layerOptions: {
						renderers: renderer,
						styleMap: styleMap
					}
				}
			}
		),
		polygon: new OpenLayers.Control.Measure(
			OpenLayers.Handler.Polygon, {
				persist: true,
				handlerOptions: {
					layerOptions: {
						renderers: renderer,
						styleMap: styleMap
					}
				}
			}
		)
	};
	
	this.setMap = function (map) {
		this.map = map;

		measureControls.line.events.on({
			"measure": this.handleMeasurements,
			"measurepartial": this.handleAddPoint
		});
		this.map.addControl(measureControls.line);
		measureControls.polygon.events.on({
			"measure": this.handlePolygonMeasurements,
			"measurepartial": this.handlePolygonAddPoint
		});
		this.map.addControl(measureControls.polygon);
		this.map.events.register("moveend",this,this.onZoomEnd);
		this.map.events.register("move",this,this.onZoomEnd);
	};

	this.activeMeasureLine = function () {
		measureControls.polygon.deactivate();
		measureControls.line.deactivate();
		measureControls.line.activate();
	};

	this.activeMeasurePolygon = function () {
		measureControls.line.deactivate();
		measureControls.polygon.deactivate();
		measureControls.polygon.activate();
	};

	this.draw = function () {
	};

	this.onZoomEnd = function () {
		for(var i = 0; i < points.length; i++) {
			instance.movePoint(points[i]);
		}
	};
	
	this.handleMeasurements = function () {
		var feature = arguments[0];
		var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
		var point = feature.geometry.components[feature.geometry.components.length-1];
		instance.createPoint("line",point,feature.measure,feature.unit,true);
        for (var i=0, len=events.length; i<len; i++) {
			if (measureControls.polygon.handler[events[i]]) {
				measureControls.polygon.handler.unregister(events[i], measureControls.polygon.handler[events[i]]);
			}
		}
        for (i=0, len=events.length; i<len; i++) {
			if (measureControls.line.handler[events[i]]) {
				measureControls.line.handler.unregister(events[i], measureControls.line.handler[events[i]]);
			}
		}
	};

	this.handleAddPoint = function () {
		var feature = arguments[0];

		if (feature.geometry.components) {
			var point = feature.geometry.components[feature.geometry.components.length-2];
			instance.createPoint("line",point,feature.measure,feature.unit);
		}
	};

	this.handlePolygonMeasurements = function () {
		var feature = arguments[0];
		var events = OpenLayers.Events.prototype.BROWSER_EVENTS;
		var point = feature.geometry.components[0].components[feature.geometry.components[0].components.length - 2];
		instance.createPoint("polygon",point,feature.measure,feature.unit);
		var center = feature.geometry.getCentroid();
		var labelDiv = document.createElement('div');
		labelDiv.className = "measure-label";
		labelDiv.style.position = "absolute";
		var span  = document.createElement('span');
		labelDiv.appendChild(span);
		span.innerText = feature.measure.toFixed(2);
		if(feature.unit === "m") {
			span.innerText += "平方米";
		} else {
			span.innerText += "平方公里";
		}
		points.push({lonLat: new OpenLayers.LonLat(center.x,center.y), div: labelDiv ,lDiv: null});
		measureControls.polygon.handler.layer.div.appendChild(labelDiv);
		instance.movePoint(points[points.length-1]);

        for (var i=0, len=events.length; i<len; i++) {
			if (measureControls.polygon.handler[events[i]]) {
				measureControls.polygon.handler.unregister(events[i], measureControls.polygon.handler[events[i]]);
			}
		}
        for (i=0, len=events.length; i<len; i++) {
			if (measureControls.line.handler[events[i]]) {
				measureControls.line.handler.unregister(events[i], measureControls.line.handler[events[i]]);
			}
		}
	};

	this.handlePolygonAddPoint = function () {
		var feature = arguments[0];

		if (feature.geometry.components) {
			var point = feature.geometry.components[0].components[feature.geometry.components[0].components.length-2];
			instance.createPoint("polygon",point,feature.measure,feature.unit);
		}
	};
	
	this.createPoint = function (type,point,measure,unit,isTotal) {
		var lonlat = new OpenLayers.LonLat(point.x,point.y);
		var px = this.map.getLayerPxFromLonLat(lonlat);
		var imageDiv = document.createElement('div');
		imageDiv.className = "measure-point";
		imageDiv.style.position = "absolute";

		var labelDiv = document.createElement('div');
		if(type === "line") {
			labelDiv.className = "measure-label";
			labelDiv.style.position = "absolute";
			var span  = document.createElement('span');
			labelDiv.appendChild(span);

			if (measure === 0) {
				span.innerText = "起点";
			} else {
				span.innerText = measure.toFixed(2);
				if(unit === "m") {
					span.innerText += "米";
				} else {
					span.innerText += "公里";
				}

				if (!!isTotal) {
					span.innerText = "总计" + span.innerText;
				}
			}
		}
		points.push({lonLat: lonlat , div: imageDiv ,lDiv:labelDiv});
		
		if (measureControls.polygon.active) {
			measureControls.polygon.handler.layer.div.appendChild(imageDiv);
			measureControls.polygon.handler.layer.div.appendChild(labelDiv);
		} else {
			measureControls.line.handler.layer.div.appendChild(imageDiv);
			measureControls.line.handler.layer.div.appendChild(labelDiv);
		}
		this.movePoint(points[points.length-1]);
	};

	this.movePoint = function (obj) {
		var imageDiv = obj.div;
		var labelDiv = obj.lDiv;
		var px = instance.map.getLayerPxFromLonLat(obj.lonLat);
		var parentLeft = imageDiv.parentNode.style.left.replace("px","");
		var parentTop = imageDiv.parentNode.style.top.replace("px","");
		var pointLeft = px.x - 5.5 - parentLeft;
		var pointTop = px.y - 5.5 - parentTop;
		imageDiv.style.left = pointLeft + "px";
		imageDiv.style.top = pointTop + "px";
		if (labelDiv) {
			labelDiv.style.left = pointLeft + 8 + "px";
			labelDiv.style.top = pointTop + 8 + "px";
		}
	};
	
	this.clear = function () {
		measureControls.polygon.deactivate();
		measureControls.line.deactivate();
	};
};

/** Copyright (C) 2013 by Neusoft
 */

MuleGIS.Control.MousePosition = function () {
	MuleGIS.Control.call(this);

	this.option = arguments[0];

	/**
	 * property:numDigits
	 * {number} 小数点后个数
	 */
	this.numDigits = 3;

	if(this.option != "undefined" && this.option) {
		OpenLayers.Util.extend(MuleGIS.Control.MousePosition.prototype,this.option);
	}

	MuleGIS.Control.MousePosition.prototype.numDigits = this.numDigits;

	//格式化经纬度坐标字符串
	var formatLonlat = function (lonlat) {
		var digits = parseInt(this.numDigits,null);
		var newHtml =
			'经度:' +
			lonlat.lon.toFixed(digits) +
			' 纬度:' +
			lonlat.lat.toFixed(digits) +
			this.suffix;
		return newHtml;
	};

	MuleGIS.Control.MousePosition.prototype.formatOutput = formatLonlat;
};

MuleGIS.Control.MousePosition.prototype = new OpenLayers.Control.MousePosition();

/** Copyright (c) 2013 by Neusoft
 */

MuleGIS.Control.Navigation = function () {
	MuleGIS.Control.call(this);

	isCallOlNavigation = false;

	isSliderButtonMouseDown = false;

	sliderButtonY = 0;
	/** 
	 * APIProperty: slideFactor
	 * {Integer} Number of pixels by which we'll pan the map in any direction 
	 *     on clicking the arrow buttons.  If you want to pan by some ratio
	 *     of the map dimensions, use <slideRatio> instead.
	 */
	this.slideFactor = 50;

	this.position = new OpenLayers.Pixel(2,10);
	/** 
	 * APIProperty: slideRatio
	 * {Number} The fraction of map width/height by which we'll pan the map            
	 *     on clicking the arrow buttons.  Default is null.  If set, will
	 *     override <slideFactor>. E.g. if slideRatio is .5, then the Pan Up
	 *     button will pan up half the map height. 
	 */
	this.slideRatio = 0.2;

	this.mouseDown = false;

	var instance = this;

	var sliderBar = null;
	var sliderButton = null;
	var sliderBarBot = null;
	var sliderBarHeight = null;

	this.navigationHistory = new OpenLayers.Control.NavigationHistory();
	
	this.setMap = function (map) {
		OpenLayers.Control.prototype.setMap.apply(this, arguments);
		instance.navigationHistory.setMap(map);
		this.map.events.register("buttonclick", this, this.onButtonClick);
		this.map.events.register("moveend",this,this.onZoomEnd);
	};

	this.onButtonClick = function (evt) {
		var btn = evt.buttonElement;
		switch (btn.action) {
			case "PanNorth": 
				this.map.pan(0, -this.getSlideFactor("h"));
				break;
			case "PanSouth": 
				this.map.pan(0, this.getSlideFactor("h"));
				break;
			case "PanWest": 
				this.map.pan(-this.getSlideFactor("w"), 0);
				break;
			case "PanEast": 
				this.map.pan(this.getSlideFactor("w"), 0);
				break;
			case "Zoomin":
				this.map.zoomIn(); 
				break;
			case "Zoomout": 
				this.map.zoomOut(); 
				break;
			case "FullExtend": 
				this.map.zoomToMaxExtent(); 
				break;
			case "PanPrevious":
				instance.navigationHistory.previousTrigger();
				break;
			case "PanNext":
				instance.navigationHistory.nextTrigger();
				break;
		}
	};

	this.draw = function () {
		OpenLayers.Control.prototype.draw.apply(this.arguments);
		if (!isCallOlNavigation) {
			OpenLayers.Control.Navigation.prototype.draw.call(this);
			//this.dragPan.handler = new MuleGIS.Handler.Drag(this, {
			//		"move": this.panMap,
			//		"done": this.panMapDone,
			//		"down": this.panMapStart
			//	}, {
			//		interval: this.interval,
			//		documentDrag: this.documentDrag
			//	}
			//);
			isCallOlNavigation = true;
		}
		instance.navigationHistory.draw();
		this.div = document.createElement('div');
		this.div.className = "map-control";
		var directionElement = createDirection();
		var historyElement = createHistory();
		var sliderElement = this.createSlider();
		
		this.div.appendChild(directionElement);
		this.div.appendChild(historyElement);
		this.div.appendChild(sliderElement);
		
		instance.setSliderLevel();
		instance.navigationHistory.activate();
		this.events = new OpenLayers.Events(this,this.div,null,true);
		this.events.on({
			"touchstart": this.onMouseDown,
			"touchmove": this.onMouseMove,
			"touchend": this.onMouseUp,
			"mousedown": this.onMouseDown,
			"mousemove": this.x,
			"mouseup": this.onMouseUp
		});

		this.div.style.position = "absolute";
		this.div.style.top = this.position.x + "px";
		this.div.style.left = this.position.y + "px";
		this.rectify();
		return this.div;
	};

	this.rectify = function () {
	};

	createDirection = function () {
		var directionElement = document.createElement('div');
		directionElement.className = "map-pan";
		
		var panNorth = document.createElement('div');
		panNorth.id = "btnPanNorth";
		panNorth.action = "PanNorth";
		panNorth.className = "olButton map-button map-panN";
		panNorth.title = "向上平移";
		$(panNorth).panButton(1);
		directionElement.appendChild(panNorth);
		
		var panWest = document.createElement('div');
		panWest.id = "btnPanWest";
		panWest.action = "PanWest";
		panWest.className = "olButton map-button map-panW";
		$(panWest).panButton(4);
		panWest.title = "向左平移";
		directionElement.appendChild(panWest);
		
		var panEast = document.createElement('div');
		panEast.id = "btnPanEast";
		panEast.title = "向右平移";
		panEast.action = "PanEast";
		panEast.className = "olButton map-button map-panE";
		$(panEast).panButton(2);
		directionElement.appendChild(panEast);
		
		var panSouth = document.createElement('div');
		panSouth.id = "btnPanSouth";
		panSouth.title = "向下平移";
		panSouth.action = "PanSouth";
		panSouth.className = "olButton map-button map-panS";
		$(panSouth).panButton(3);
		directionElement.appendChild(panSouth);

		return directionElement;
	};
	
	createHistory = function () {
		var historyElement = document.createElement('div');
		historyElement.id = "mapHistoryElement";
		historyElement.className = "map-history";

		var previousButton = document.createElement('div');
		previousButton.id = "btnPrevious";
		previousButton.title = "前一视图";
		previousButton.action = "PanPrevious";
		previousButton.className = "olButton map-previous";
		historyElement.appendChild(previousButton);

		var fullExtendButton = document.createElement('div');
		fullExtendButton.id = "btnFullExtend";
		fullExtendButton.title = "全屏";
		fullExtendButton.action = "FullExtend";
		fullExtendButton.className = "olButton map-fullExtend";
		historyElement.appendChild(fullExtendButton);

		var nextButton = document.createElement('div');
		nextButton.id = "btnPrevious";
		nextButton.title = "后一视图";
		nextButton.action = "PanNext";
		nextButton.className = "olButton map-next";
		historyElement.appendChild(nextButton);
		
		return historyElement;
	};

	this.createSlider = function () {
		var sliderElement = document.createElement('div');
		sliderElement.id = "mapSlider";
		sliderElement.className = "map-slider";

		var zoominLevelButton = document.createElement('div');
		zoominLevelButton.id = "btnZoominLevel";
		zoominLevelButton.title = "放大一级";
		zoominLevelButton.className = "olButton map-zoominLevelButton";
		zoominLevelButton.action = "Zoomin";
		sliderElement.appendChild(zoominLevelButton);

		sliderBar = document.createElement('div');
		sliderBar.id = "sliderBar";
		sliderBar.className = "map-sliderBar";
		
		sliderButton = document.createElement('div');
		sliderButton.id="btnSlider";
		sliderButton.title = "拖动缩放";
		sliderButton.className = "olButton map-sliderButton";
		sliderButton.map = this.map;

		sliderButton.onmousedown = function () {
			instance.mouseDown = true;
			instance.events.on({"mouseup": instance.onMouseUp,
								"mousemove": instance.onMouseMove});
			instance.map.events.on({"mouseup": instance.onMouseUp,
								"mousemove": instance.onMouseMove});
			sliderButtonY = event.clientY;
		};
		sliderButton.onmouseup = instance.onMouseUp;
		sliderBar.appendChild(sliderButton);

		var sliderBarTop = document.createElement('div');
		sliderBarTop.id = "sliderBarTop";
		sliderBarTop.className = "map-sliderBarTop";
		sliderBar.appendChild(sliderBarTop);

		sliderBarBot = document.createElement('div');
		sliderBarBot.id = "sliderBarBot";
		sliderBarBot.className = "map-sliderBarBot";
		sliderBar.appendChild(sliderBarBot);
		sliderElement.appendChild(sliderBar);

		var zoomoutLevelButton = document.createElement('div');
		zoomoutLevelButton.id = "btnZoomoutLevel";
		zoomoutLevelButton.title = "缩小一级";
		zoomoutLevelButton.className = "olButton map-zoomoutLevelButton";
		zoomoutLevelButton.action = "Zoomout";
		sliderElement.appendChild(zoomoutLevelButton);

		$(document).bind("mouseup", this.onMouseUp);
		return sliderElement;
	};
	
	this.onMouseUp = function () {
		if (instance.mouseDown === true) {
			instance.mouseDown = false;
			instance.events.un({"mouseup": instance.onMouseUp,
								"mousemove": instance.onMouseMove});
			instance.map.events.un({"mouseup": instance.onMouseUp,
								"mousemove": instance.onMouseMove});

			var mSliderButtonY = event.clientY;
			var offsetSliderY = sliderButtonY - mSliderButtonY;
			var sTop = $("#btnSlider").css("top").replace("px","");
			var sHeight = $("#sliderBar").height();
			var resultTop = sTop - offsetSliderY - 1;
			resultTop = resultTop + 1 - (resultTop % 6);
			
			var level = (resultTop - 1) / 6;
			instance.map.zoomTo(instance.map.numZoomLevels - level - 1);
		}
	};

	this.onMouseMove = function () {
		if (instance.mouseDown === true) {
			var mSliderButtonY = event.clientY;
			var offsetSliderY = sliderButtonY - mSliderButtonY;
			sliderButtonY = mSliderButtonY;
			var sTop = $("#btnSlider").css("top").replace("px","");
			var sHeight = $("#sliderBar").height();
			var resultTop = sTop - offsetSliderY;
			if(resultTop > sHeight - 11){
				resultTop = sHeight - 11;
			} else if( resultTop < 1) {
				resultTop = 1;
			}
			$("#btnSlider").css("top", resultTop + "px");
			instance.setSliderBarBotStyle(resultTop);
		}
	};

	/**
	 * Method: getSlideFactor
	 *
	 * Parameters:
	 * dim - {String} "w" or "h" (for width or height).
	 *
	 * Returns:
	 * {Number} The slide factor for panning in the requested direction.
	 */
	this.getSlideFactor = function (dim) {
		return this.slideRatio ?
			this.map.getSize()[dim] * this.slideRatio :
			this.slideFactor;
	};

	this.setSliderLevel = function () {
		var numLevel = instance.map.numZoomLevels;
		sliderBarHeight = 12 + (numLevel - 1) * 6;
		$(sliderBar).css("height", sliderBarHeight + "px");
		this.onZoomEnd();
	};

	this.onZoomEnd = function () {
		var currentLevel = instance.map.getZoom();
		var maxLevel = instance.map.numZoomLevels;
		var currentTop = (maxLevel - currentLevel - 1) * 6 + 1;
		$(sliderButton).css("top", currentTop + "px");
		this.setSliderBarBotStyle(currentTop);
	};

	this.setSliderBarBotStyle = function (currentTop) {
		var currentLevel = instance.map.getZoom();
		var maxLevel = instance.map.numZoomLevels;
		$(sliderBarBot).css("top", currentTop + "px");
		$(sliderBarBot).css("height", sliderBarHeight - currentTop + 4 + "px");
	};
};

MuleGIS.Control.Navigation.prototype = new OpenLayers.Control.Navigation();

MuleGIS.Control.Navigation.prototype.defaultClick = function (evt) {
	if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
		if (evt.lastTouches && evt.lastTouches.length == 2) {
			this.map.zoomOut();
		}
	}
};

MuleGIS.Control.Navigation.prototype.defaultDblClick = function (evt) {
	if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
		this.map.zoomTo(this.map.zoom + 1, evt.xy);
	}
};

MuleGIS.Control.Navigation.prototype.defaultDblRightClick = function (evt) {
	if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
		this.map.zoomTo(this.map.zoom - 1, evt.xy);
	}
};

MuleGIS.Control.Navigation.prototype.wheelChange = function(evt, deltaZ) {
	if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
		if (!this.map.fractionalZoom) {
			deltaZ =  Math.round(deltaZ);
		}
		var currentZoom = this.map.getZoom(),
			newZoom = currentZoom + deltaZ;
		newZoom = Math.max(newZoom, 0);
		newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
		if (newZoom === currentZoom) {
			return;
		}
		this.map.zoomTo(newZoom, evt.xy);
	}
};

MuleGIS.Control.Navigation.prototype.wheelUp = function(evt, delta) {
	if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
		this.wheelChange(evt, delta || 1);
	}
};

MuleGIS.Control.Navigation.prototype.wheelDown = function(evt, delta) {
	if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
		this.wheelChange(evt, delta || -1);
	}
};

jQuery.fn.panButton = function (index) {
	this.mouseover (function () {
		$(this).parent().css("backgroundPosition"," 0px -" + 44 * index + "px" );
	});
	this.mouseout (function () {
		$(this).parent().css("backgroundPosition"," 0px 0px");
	});
};


/* Copyright (c) 2013 by Neusoft
 */

MuleGIS.Control.Overview = function () {
	MuleGIS.Control.call(this);

	this.option = arguments[0];

	if (this.option != "undefined" && this.option) {
		OpenLayers.Util.extend(MuleGIS.Control.Overview.prototype,this.option);
	}

	/**
	 * property:width
	 * {number} 鹰眼窗口的宽度
	 */
	this.width = 160;
	
	/**
	 * property:height
	 * {number} 鹰眼窗口的高度
	 */
	this.height = 160;
};

MuleGIS.Control.Overview.prototype = new OpenLayers.Control.OverviewMap();

/**
 * 
 * 重写OpenLayers.Control.OverviewMap的draw方法，增加可以设置鹰眼窗口大小
 * 属性
 */
MuleGIS.Control.Overview.prototype.draw = function () {
	OpenLayers.Control.prototype.draw.apply(this, arguments);
	if (this.layers.length === 0) {
		if (this.map.baseLayer) {
			var layer = this.map.baseLayer.clone();
			this.layers = [layer];
		} else {
			this.map.events.register("changebaselayer", this, this.baseLayerDraw);
			return this.div;
		}
	}

	this.element = document.createElement('div');
	this.element.className = "map-control";
	this.element.style.display = 'none';

	this.mapDiv = document.createElement('div');
	this.mapDiv.style.width = this.width + 'px';
	this.mapDiv.style.height = this.height + 'px';
	this.mapDiv.style.position = 'relative';
	this.mapDiv.style.overflow = 'hidden';
	this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');
	
	this.extentRectangle = document.createElement('div');
	this.extentRectangle.style.position = 'absolute';
	this.extentRectangle.style.zIndex = 1000;
	this.extentRectangle.className = this.displayClass+'ExtentRectangle';

	this.element.appendChild(this.mapDiv);

	this.div.appendChild(this.element);

	// Optionally add min/max buttons if the control will go in the
	// map viewport.
	if (!this.outsideViewport) {
		this.div.className += " map-control " + this.displayClass + 'Container';
		// maximize button div
		var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
		this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
									this.displayClass + 'MaximizeButton', 
									null, 
									null, 
									img, 
									'absolute');
		this.maximizeDiv.style.display = 'none';
		this.maximizeDiv.className = this.displayClass + 'MaximizeButton olButton';
		if (this.maximizeTitle) {
			this.maximizeDiv.title = this.maximizeTitle;
		}
		this.div.appendChild(this.maximizeDiv);

		img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
		this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
									'OpenLayers_Control_minimizeDiv', 
									null, 
									null, 
									img, 
									'absolute');
		this.minimizeDiv.style.display = 'none';
		this.minimizeDiv.className = this.displayClass + 'MinimizeButton olButton';
		if (this.minimizeTitle) {
			this.minimizeDiv.title = this.minimizeTitle;
		}
		this.div.appendChild(this.minimizeDiv);
		this.minimizeControl();
	} else {
		// show the overview map
		this.element.style.display = '';
	}
	if (this.map.getExtent()) {
		this.update();
	}
	
	this.map.events.on({
		buttonclick: this.onButtonClick,
		moveend: this.update,
		scope: this
	});
	
	if (this.maximized) {
		this.maximizeControl();
	}
	return this.div;
};

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

/**
 * 
 */

MuleGIS.Control.Query = function () {
	MuleGIS.Control.call(this);
	var instance = this;
	this.properName = "NAME99";
	this.typeName = "china:liaoning";
	this.url = "http://localhost:8080/geoserver/wfs?";
	this.isLike = true;
	this.value = "沈阳";
	this.callback = null;

	handlerReponse = function (req) {
		var format = new OpenLayers.Format.GML();
		var features = format.read(req.responseText);

		if(instance.callback !== null && typeof instance.callback === "function" ) {
			instance.callback(features);
		}

		OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
	};

	this.draw = function () {
	};

	this.query = function () {
		OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
		var xmlPara = "<?xml version='1.0' encoding='UTF-8'?>" +
			"<wfs:GetFeature  service='WFS' version='1.0.0' " +
			"xmlns:wfs='http://www.opengis.net/wfs' " +
			"xmlns:gml='http://www.opengis.net/gml' " +
			"xmlns:ogc='http://www.opengis.net/ogc' " +
			"xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
			"xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd'>" +

			"<wfs:Query typeName='" + this.typeName+ "'>" ;
			if (this.isLike === true) {
				xmlPara += "<ogc:Filter>" +
					"<ogc:PropertyIsLike wildCard='*' singleChar='.' escape='!'>" +
					"<ogc:PropertyName>" + this.properName + "</ogc:PropertyName>" +
					"<ogc:Literal>*" + this.value + "*</ogc:Literal>" +
					"</ogc:PropertyIsLike>" +
					"</ogc:Filter>" ;
			} else {
				xmlPara += "<ogc:Filter>" +
					"<ogc:PropertyIsEqualTo>" +
					"<ogc:PropertyName>" + this.properName + "</ogc:PropertyName>" +
					"<ogc:Literal>" + this.value + "</ogc:Literal>" +
					"</ogc:PropertyIsEqualTo>" +
					"</ogc:Filter>" ;
			}

			xmlPara += "</wfs:Query>" +
				"</wfs:GetFeature>";

		var request = OpenLayers.Request.POST( {
			url : this.url,
			outputFormat: "JSON",
			//async: false,
			callback : handlerReponse
		});

		request.send(xmlPara);
	};
};

/** Copyright (C) 2013 by Neusoft
 */

MuleGIS.Control.ScaleLine = function () {
	MuleGIS.Control.call(this);

	this.topOutUnitsLabel = "公里";
	this.topInUnitsLabel = "米";
	//MuleGIS.Control.ScaleLine.prototype.topOutUnits = "公里";
	//MuleGIS.Control.ScaleLine.prototype.topInUnits = "米";
};

MuleGIS.Control.ScaleLine.prototype = new OpenLayers.Control.ScaleLine();

MuleGIS.Control.ScaleLine.prototype.eLeft = null;

MuleGIS.Control.ScaleLine.prototype.eRight = null;

MuleGIS.Control.ScaleLine.prototype.draw = function () {
	OpenLayers.Control.prototype.draw.apply(this, arguments);
	if (!this.eTop) {
		// stick in the top bar
		this.eTop = document.createElement("div");
		this.eTop.className = this.displayClass + "Top";
		var theLen = this.topInUnits.length;
		this.div.appendChild(this.eTop);
		if((this.topOutUnits === '') || (this.topInUnits === '')) {
			this.eTop.style.visibility = "hidden";
		} else {
			this.eTop.style.visibility = "visible";
		}

		// and the bottom bar
		this.eBottom = document.createElement("div");
		this.eBottom.className = this.displayClass + "Bottom";
		this.div.appendChild(this.eBottom);
		if ((this.bottomOutUnits === "") || (this.bottomInUnits === "")) {
			this.eBottom.style.visibility = "hidden";
		} else {
			this.eBottom.style.visibility = "visible";
		}

		this.eLeft = document.createElement("div");
		this.eLeft.className = this.displayClass + "Left";
		this.div.appendChild(this.eLeft);

		this.eRight = document.createElement("div");
		this.eRight.className = this.displayClass + "Right";
		this.div.appendChild(this.eRight);

	}
	this.map.events.register('moveend', this, this.update);
	this.update();
	return this.div;
};

MuleGIS.Control.ScaleLine.prototype.update = function () {
	var res = this.map.getResolution();
	if (!res) {
		return;
	}

	var curMapUnits = this.map.getUnits();
	var inches = OpenLayers.INCHES_PER_UNIT;

	// convert maxWidth to map units
	var maxSizeData = this.maxWidth * res * inches[curMapUnits];
	var geodesicRatio = 1;
	if (this.geodesic === true) {
		var maxSizeGeodesic = (this.map.getGeodesicPixelSize().w ||
			0.000001) * this.maxWidth;
		var maxSizeKilometers = maxSizeData / inches.km;
		geodesicRatio = maxSizeGeodesic / maxSizeKilometers;
		maxSizeData *= geodesicRatio;
	}

	// decide whether to use large or small scale units     
	var topUnits;
	var topUnitsLabel;
	var bottomUnits;
	if (maxSizeData > 100000) {
		topUnits = this.topOutUnits;
		topUnitsLabel = this.topOutUnitsLabel;
		bottomUnits = this.bottomOutUnits;
	} else {
		topUnits = this.topInUnits;
		topUnitsLabel = this.topInUnitsLabel;
		bottomUnits = this.bottomInUnits;
	}

	// and to map units units
	var topMax = maxSizeData / inches[topUnits];
	var bottomMax = maxSizeData / inches[bottomUnits];

	// now trim this down to useful block length
	var topRounded = this.getBarLen(topMax);
	var bottomRounded = this.getBarLen(bottomMax);

	// and back to display units
	topMax = topRounded / inches[curMapUnits] * inches[topUnits];
	bottomMax = bottomRounded / inches[curMapUnits] * inches[bottomUnits];

	// and to pixel units
	var topPx = topMax / res / geodesicRatio;
	var bottomPx = bottomMax / res / geodesicRatio;
	
	// now set the pixel widths
	// and the values inside them
	
	if (this.eBottom.style.visibility == "visible") {
		this.eBottom.style.width = Math.round(bottomPx) + "px"; 
		this.eBottom.innerHTML = bottomRounded + " " + bottomUnits;
	}
		
	if (this.eTop.style.visibility == "visible") {
		this.eTop.style.width = Math.round(topPx) + "px";
		this.eTop.innerHTML = topRounded + " " + topUnitsLabel;
	}
};

/*
 * 实现类似C#中Dictionary对象
 *
 * 接口：
 * size()     获取Dictionary元素个数
 * isEmpty()    判断Dictionary是否为空
 * clear()     删除Dictionary所有元素
 * put(key, value)   向Dictionary中增加元素（key, value) 
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断Dictionary中是否含有指定KEY的元素
 * containsValue(value) 判断Dictionary中是否含有指定VALUE的元素
 * values()    获取Dictionary中所有VALUE的数组（ARRAY）
 * keys()     获取Dictionary中所有KEY的数组（ARRAY）
 *
 * 例子：
 * var dictionary = new Dictionary();
 *
 * dictionary.put("key", "value");
 * var val = dictionary.get("key")
 * ……
 *
 */
MuleGIS.Dictionary = function () {
	this.elements = [];

	//获取Dictionary元素个数
	this.size = function() {
		return this.elements.length;
	};

	//判断Dictionary是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	};

	//删除Dictionary所有元素
	this.clear = function() {
		this.elements = [];
	};

	//向Dictionary中增加元素（key, value) 
	this.put = function(_key, _value) {
		this.elements.push( {
			key : _key,
			value : _value
		});
	};

	//删除指定KEY的元素，成功返回True，失败返回False
	this.removeByKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	//删除指定VALUE的元素，成功返回True，失败返回False
	this.removeByValue = function(_value) {//removeByValueAndKey
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	//删除指定VALUE的元素，成功返回True，失败返回False
	this.removeByValueAndKey = function(_key,_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value && this.elements[i].key == _key) {
					this.elements.splice(i, 1);
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	//获取指定KEY的元素值VALUE，失败返回NULL
	this.get = function(_key) {
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		} catch (e) {
			return false;
		}
		return false;
	};

	//获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length) {
			return null;
		}
		return this.elements[_index];
	};

	//判断Dictionary中是否含有指定KEY的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	//判断Dictionary中是否含有指定VALUE的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	//判断Dictionary中是否含有指定VALUE的元素
	this.containsObj = function(_key,_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value && this.elements[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	};

	//获取Dictionary中所有VALUE的数组（ARRAY）
	this.values = function() {
		var arr = [];
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].value);
		}
		return arr;
	};

	//获取Dictionary中所有VALUE的数组（ARRAY）
	this.valuesByKey = function(_key) {
		var arr = [];
		for (i = 0; i < this.elements.length; i++) {
			if (this.elements[i].key == _key) {
				arr.push(this.elements[i].value);
			}
		}
		return arr;
	};

	//获取Dictionary中所有KEY的数组（ARRAY）
	this.keys = function() {
		var arr = [];
		for (i = 0; i < this.elements.length; i++) {
			arr.push(this.elements[i].key);
		}
		return arr;
	};

	//获取key通过value
	this.keysByValue = function(_value) {
		var arr = [];
		for (i = 0; i < this.elements.length; i++) {
			if(_value == this.elements[i].value){
				arr.push(this.elements[i].key);
			}
		}
		return arr;
	};

	//获取Dictionary中所有KEY的数组（ARRAY）
	this.keysRemoveDuplicate = function() {
		var arr = [];
		for (i = 0; i < this.elements.length; i++) {
			var flag = true;
			for(var j=0;j<arr.length;j++){
				if(arr[j] == this.elements[i].key){
					flag = false;
					break;
				} 
			}
			if(flag){
				arr.push(this.elements[i].key);
			}
		}
		return arr;
	};
};



MuleGIS.Handler = function () {
};



MuleGIS.Handler.Drag = function () {
	if(arguments.length === 3) {
		var obj = new OpenLayers.Handler.Drag(arguments[0],arguments[1],arguments[2]);
		MuleGIS.Handler.Drag.prototype = obj;

		MuleGIS.Handler.Drag.prototype.mousedown = function (evt) {
			if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
				return this.down(evt);
			}
		};

		return new MuleGIS.Handler.Drag(arguments[0],arguments[1],arguments[2],null);
	}
};


MuleGIS.Handler.Path = function () {
	if(arguments.length === 3) {
		var obj = new OpenLayers.Handler.Path(arguments[0],arguments[1],arguments[2]);
		MuleGIS.Handler.Path.prototype = obj;

		MuleGIS.Handler.Path.prototype.mousedown = function (evt) {
			if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
				return this.down(evt);
			}
		};

		return new MuleGIS.Handler.Path(arguments[0],arguments[1],arguments[2],null);
	}
};


MuleGIS.Handler.Point = function () {
	if(arguments.length === 3) {
		var obj = new OpenLayers.Handler.Point(arguments[0],arguments[1],arguments[2]);
		MuleGIS.Handler.Point.prototype = obj;

		MuleGIS.Handler.Point.prototype.mousedown = function (evt) {
			if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
				return this.down(evt);
			}
		};

		return new MuleGIS.Handler.Point(arguments[0],arguments[1],arguments[2],null);
	}
};


MuleGIS.Handler.Polygon = function () {
	if(arguments.length === 3) {
		var obj = new OpenLayers.Handler.Polygon(arguments[0],arguments[1],arguments[2]);
		MuleGIS.Handler.Polygon.prototype = obj;

		MuleGIS.Handler.Polygon.prototype.mousedown = function (evt) {
			if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
				return this.down(evt);
			}
		};

		return new MuleGIS.Handler.Polygon(arguments[0],arguments[1],arguments[2],null);
	}
};


MuleGIS.Initilize = function () {
	var format = 'image/png';
	this.bounds = new OpenLayers.Bounds(
		119.757, 40.368,
		127.156, 42.757
	);

	this.options = {
		controls: [],
		maxExtent: this.bounds,
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		units: 'degrees'
	};

	this.layers = [];

	this.controls = [];

	var tiled = new OpenLayers.Layer.WMS(
		"本地底图", "http://192.168.196.189:8080/geoserver/china/wms",
		{
			LAYERS: 'china',
			STYLES: '',
			format: format,
			tiled: true,
			tilesOrigin : this.bounds.left + ',' + this.bounds.bottom
		},
		{
			buffer: 0,
			displayOutsideMaxExtent: true,
			isBaseLayer: true,
			yx : {'EPSG:4326' : true}
		}
	);

	var liaoning = new OpenLayers.Layer.WMS(
		"辽宁省", "http://localhost:8080/geoserver/china/wms",
		{
			LAYERS: 'china:liaoning_postgre',
			STYLES: '',
			format: format,
			tiled: true,
			transparent: "true",
			tilesOrigin : this.bounds.left + ',' + this.bounds.bottom
		},
		{
			buffer: 0,
			displayOutsideMaxExtent: true,
			isBaseLayer: false,
			yx : {'EPSG:4326' : true}
		}
	);
	var beijing = new OpenLayers.Layer.WMS(
		"北京", "http://192.168.196.189:8080/geoserver/china/wms",
		{
			LAYERS: 'china:beijing',
			STYLES: '',
			format: format,
			tiled: true,
			transparent: "true",
			tilesOrigin : this.bounds.left + ',' + this.bounds.bottom
		},
		{
			buffer: 0,
			displayOutsideMaxExtent: true,
			isBaseLayer: false,
			yx : {'EPSG:4326' : true}
		}
	);

	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	this.vectorLayer = new OpenLayers.Layer.Vector("辽宁", {
		projection: new OpenLayers.Projection("EPSG:4326"),
		strategies: [new OpenLayers.Strategy.Fixed(),
			new OpenLayers.Strategy.Save({auto: true}),
			new OpenLayers.Strategy.Refresh()],
		protocol: new OpenLayers.Protocol.WFS({
			url:  "http://192.168.196.189:8080/geoserver/wfs",
			version: "1.0.0",
			featurePrefix: "china",
			featureType: "liaoning",
			featureNS: "http://www.neusoft.com/china",
			srsName : "EPSG:4326",
			isBaseLayer: false,
			geometryType: "OpenLayers.Geometry.Polygon",
			geometryName : "geom"
		}),
		renderers: renderer
	});
	var gmap = new OpenLayers.Layer.Google("谷歌底图", {sphericalMercator:true});
	//this.layers.push(tiled);
	this.layers.push(gmap);
	this.layers.push(beijing);
	//this.layers.push(liaoning);
	this.layers.push(this.vectorLayer);
	
	this.layerTree = new MuleGIS.Control.LayerTree();
	var positionControl = new MuleGIS.Control.MousePosition({element: $('#location').get(0)});
	var overView = new MuleGIS.Control.Overview({
		maximizeTitle: '展开鹰眼图',
		minimizeTitle: '折叠鹰眼图'
	});
	var navigation = new MuleGIS.Control.Navigation({
		position: new OpenLayers.Pixel(2, 15)
	});
	//navigation.zoomWheelEnabled = false;
	navigation.pinchZoom = false;
	this.printControl = new MuleGIS.Control.Print();
	this.lonlatLocation = new MuleGIS.Control.Location();
	this.measureControl = new MuleGIS.Control.Measure();
	this.queryControl = new MuleGIS.Control.Query();
	this.drawFeatureControl = new MuleGIS.Control.DrawFeature();
	this.controls.push(this.layerTree);
	this.controls.push(overView);

	this.featureManager = new MuleGIS.Control.FeatureManager();
	this.featureManager.url = "http://localhost:8080/geoserver/wfs";
	this.featureManager.srsName = "EPSG:4326";
	this.featureManager.featureNS = "http://www.neusoft.com/china";
	this.featureManager.featurePrefix = "china";
	this.featureManager.featureType = "house";
	this.featureManager.geometryName = "geom";
	this.featureManager.layerName = "编辑图层";
	this.featureManager.autoSave = false;
	this.controls.push(this.featureManager);

	this.controls.push(navigation);
	this.controls.push(new MuleGIS.Control.ScaleLine());
	this.controls.push(positionControl);
	this.controls.push(this.lonlatLocation);
	this.controls.push(this.printControl);
	this.controls.push(this.queryControl);
	this.controls.push(this.measureControl);
	this.controls.push(this.drawFeatureControl);

	this.drawFeatureControl.setFeatureAdded(function (feature) {
		var geoJson = new OpenLayers.Format.GeoJSON();
		var str = geoJson.write(feature);
		alert("图形序列化信息:\r\b" + str);
	});

	OpenLayers.Request.GET({
		url: "http://localhost:8080/geoserver/styles/liaoning.sld",
        success: complete
    });

	function complete(req) {
		var format = new OpenLayers.Format.SLD();
		var sld = format.read(req.responseXML || req.responseText);
	}
};

/**
 * 
 */

MuleGIS.Label = function () {

	this.label = "";
	/** 
	 * Property: offset 
	 * {<OpenLayers.Pixel>|Object} distance in pixels to offset the
	 * image when being rendered. An OpenLayers.Pixel or an object
	 * with a 'x' and 'y' properties.
	 */
	this.offset = null;    

	/** 
	 * Property: imageDiv 
	 * {DOMElement} 
	 */
	this.div = null;

	/** 
	 * Property: px 
	 * {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object
	 * with a 'x' and 'y' properties.
	 */
	this.px = null;

	/** 
	 * Constructor: OpenLayers.Icon
	 * Creates an icon, which is an image tag in a div.  
	 *
	 * offset - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
	 *                                      object with a 'x' and 'y'
	 *                                      properties.
	 */
	this.initialize = function(label, offset) {
		this.label = label;
		this.offset = offset || {x: 0, y:0};

		var id = OpenLayers.Util.createUniqueID("MuleGIS_Lable_");
		this.div = OpenLayers.Util.createDiv(id);
		var labelDiv = document.createElement("a");
		labelDiv.innerText = label;
		this.div.appendChild(labelDiv);
	};

	this.initialize(arguments[0],arguments[1]);
	/** 
	 * Method: destroy
	 * Nullify references and remove event listeners to prevent circular 
	 * references and memory leaks
	 */
	this.destroy = function() {
		// erase any drawn elements
		this.erase();

		OpenLayers.Event.stopObservingElement(this.div.firstChild); 
		this.div.innerHTML = "";
		this.div = null;
	};

	/** 
	 * Method: clone
	 * 
	 * Returns:
	 * {<OpenLayers.Icon>} A fresh copy of the icon.
	 */
	this.clone = function() {
		return new MuleGIS.Lable(this.label, 
									this.offset);
	};

	/** 
	 * Method: draw
	 * Move the div to the given pixel.
	 * 
	 * Parameters:
	 * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
	 *                                  object with a 'x' and 'y' properties.
	 * 
	 * Returns:
	 * {DOMElement} A new DOM Image of this icon set at the location passed-in
	 */
	this.draw = function(px) {
		OpenLayers.Util.modifyAlphaImageDiv(this.div, 
											null, 
											null, 
											null, 
											null, 
											"absolute");
		this.moveTo(px);
		return this.div;
	};

	/** 
	 * Method: erase
	 * Erase the underlying image element.
	 */
	this.erase = function() {
		if (this.div !== null && this.div.parentNode !== null) {
			OpenLayers.Element.remove(this.div);
		}
	};

	/**
	 * Method: moveTo
	 * move icon to passed in px.
	 *
	 * Parameters:
	 * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
	 * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
	 */
	this.moveTo = function (px) {
		//if no px passed in, use stored location
		if (px !== null) {
			this.px = px;
		}

		if (this.div !== null) {
			if (this.px === null) {
				this.display(false);
			} else {
				OpenLayers.Util.modifyAlphaImageDiv(this.div, null, {
					x: this.px.x + this.offset.x,
					y: this.px.y + this.offset.y
				});
			}
		}
	};

	this.display = function(display) {
		this.div.style.display = (display) ? "" : "none"; 
	};


	/**
	 * APIMethod: isDrawn
	 * 
	 * Returns:
	 * {Boolean} Whether or not the icon is drawn.
	 */
	this.isDrawn = function() {
		// nodeType 11 for ie, whose nodes *always* have a parentNode
		// (of type document fragment)
		var isDrawn = (this.div && this.div.parentNode && 
						(this.div.parentNode.nodeType != 11));    

		return isDrawn;   
	};
};

/**
 * 
 */

MuleGIS.LabelMarker = function () {
	/** 
	 * Property: icon 
	 * {<OpenLayers.Icon>} The icon used by this marker.
	 */
	this.label = null;

	/** 
	 * Property: lonlat 
	 * {<OpenLayers.LonLat>} location of object
	 */
	this.lonlat = null;

	/** 
	 * Property: events 
	 * {<OpenLayers.Events>} the event handler.
	 */
	this.events = null;

	/** 
	 * Property: map 
	 * {<OpenLayers.Map>} the map this marker is attached to
	 */
	this.map = null;

	
	/** 
	 * Constructor: OpenLayers.Marker
	 *
	 * Parameters:
	 * lonlat - {<OpenLayers.LonLat>} the position of this marker
	 * icon - {<OpenLayers.Icon>}  the icon for this marker
	 */
	this.initialize = function(lonlat, label) {
		this.lonlat = lonlat;
		
		var newLabel = (label) ? label : new MuleGIS.Label();
		if (this.label === null) {
			this.label = newLabel;
		} else {
			this.label = label;
		}
		this.events = new OpenLayers.Events(this, this.label.div);
	};

	this.initialize(arguments[0],arguments[1]);
	/**
	 * APIMethod: destroy
	 * Destroy the marker. You must first remove the marker from any 
	 * layer which it has been added to, or you will get buggy behavior.
	 * (This can not be done within the marker since the marker does not
	 * know which layer it is attached to.)
	 */
	this.destroy = function() {
		// erase any drawn features
		this.erase();

		this.map = null;

		this.events.destroy();
		this.events = null;

		if (this.label !== null) {
			this.label.destroy();
			this.label = null;
		}
	};

	/** 
	* Method: draw
	* Calls draw on the icon, and returns that output.
	* 
	* Parameters:
	* px - {<OpenLayers.Pixel>}
	* 
	* Returns:
	* {DOMElement} A new DOM Image with this marker's icon set at the 
	* location passed-in
	*/
	this.draw = function(px) {
		return this.label.draw(px);
	}; 

	/** 
	* Method: erase
	* Erases any drawn elements for this marker.
	*/
	this.erase = function() {
		if (this.label !== null) {
			this.label.erase();
		}
	}; 

	/**
	* Method: moveTo
	* Move the marker to the new location.
	*
	* Parameters:
	* px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
	* An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
	*/
	this.moveTo = function (px) {
		if ((px !== null) && (this.label !== null)) {
			this.label.moveTo(px);
		}           
		this.lonlat = this.map.getLonLatFromLayerPx(px);
	};

	/**
	 * APIMethod: isDrawn
	 * 
	 * Returns:
	 * {Boolean} Whether or not the marker is drawn.
	 */
	this.isDrawn = function() {
		var isDrawn = (this.label && this.label.isDrawn());
		return isDrawn;   
	};

	/**
	 * Method: onScreen
	 *
	 * Returns:
	 * {Boolean} Whether or not the marker is currently visible on screen.
	 */
	this.onScreen = function() {
		var onScreen = false;
		if (this.map) {
			var screenBounds = this.map.getExtent();
			onScreen = screenBounds.containsLonLat(this.lonlat);
		}    
		return onScreen;
	};

	/**
	 * Method: inflate
	 * Englarges the markers icon by the specified ratio.
	 *
	 * Parameters:
	 * inflate - {float} the ratio to enlarge the marker by (passing 2
	 *                   will double the size).
	 */
	this.inflate = function(inflate) {
		if (this.label) {
			this.label.setSize({
				w: this.icon.size.w * inflate,
				h: this.icon.size.h * inflate
			});
		}        
	};

	/** 
	 * Method: display
	 * Hide or show the icon
	 * 
	 * display - {Boolean} 
	 */
	this.display = function(display) {
		this.label.display(display);
	};
};


/**
 * 
 */

MuleGIS.Map = function () {
	
};

MuleGIS.Map.prototype = new OpenLayers.Map();



MuleGIS.Util = {
	isLayerDivChild: function (element) {
		if (element.id.indexOf("OpenLayers_Container") > 0) {
			return true;
		} else if (!element.parentElement) {
			return false;
		} else {
			return MuleGIS.Util.isLayerDivChild(element.parentElement);
		}
	}
};
