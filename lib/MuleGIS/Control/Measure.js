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
