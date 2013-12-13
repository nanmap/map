
MuleGIS.Handler.Drag = function () {
	if(arguments.length === 3) {
		var obj = new OpenLayers.Handler.Drag(arguments[0],arguments[1],arguments[2]);
		MuleGIS.Handler.Drag.prototype = obj;

		MuleGIS.Handler.Drag.prototype.mousedown = function (evt) {
			if (MuleGIS.Util.isLayerDivChild(evt.srcElement) === true) {
				return this.down(evt);
			}
		};

		return new MuleGIS.Handler.Drag(arguments[0],arguments[1],arguments[2],null);
	}
};
