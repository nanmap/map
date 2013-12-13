
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
