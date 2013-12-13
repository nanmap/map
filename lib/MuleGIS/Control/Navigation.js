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

