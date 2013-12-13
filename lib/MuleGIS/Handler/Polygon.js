
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
