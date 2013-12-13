
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
