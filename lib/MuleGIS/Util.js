
MuleGIS.Util = {
	isLayerDivChild: function (element) {
		if (element.id.indexOf("OpenLayers_Container") > 0) {
			return true;
		} else if (!element.parentElement) {
			return false;
		} else {
			return MuleGIS.Util.isLayerDivChild(element.parentElement);
		}
	}
};
