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
