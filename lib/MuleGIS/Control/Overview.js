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
