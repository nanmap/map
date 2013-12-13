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
