
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
