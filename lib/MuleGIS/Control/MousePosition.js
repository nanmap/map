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
