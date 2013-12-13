
MuleGIS.Control.FeatureManager = function () {
	MuleGIS.Control.call(this);
	var instance = this;
	this.div = "";

	this.version = "1.0.0";

	this.url = "http://localhost:8080/geoserver/wfs";

	this.srsName = "EPSG:4326";
	
	this.featureNS = "http://www.neusoft.com/china";

	this.featurePrefix = "china";

	this.featureType = "house";

	this.geometryName = "geom";

	this.layerName = "编辑图层";

	this.vectorLayer = null;

	this.autoSave = false;

	this.saveStrategy = new OpenLayers.Strategy.Save({auto: this.autoSave});

	this.refreshStrategy = new OpenLayers.Strategy.Refresh();
	this.schema = "http://192.168.196.189:8080/geoserver/wfs/DescribeFeatureType?version=1.1.0&typename=china:house";

	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

	var drawControl = null;
	var editControl = null;
	var deleteControl = null;

	this.initialize = function () {
		if (this.map) {
			this.vectorLayer = new OpenLayers.Layer.Vector(this.layerName, {
				projection: new OpenLayers.Projection(this.srsName),
				strategies: [new OpenLayers.Strategy.BBOX(),
					this.saveStrategy,
					this.refreshStrategy],
				protocol: new OpenLayers.Protocol.WFS({
					version: this.version,
					url:  this.url,
					featureType: this.featureType,
					featureNS: this.featureNS,
					srsName : this.srsName,
					isBaseLayer: false,
					geometryName : this.geometryName
				}),
				renderers: renderer
			});

			if (this.map && this.vectorLayer) {
				this.map.addLayer(this.vectorLayer);
			}
			this.schema = this.url + "/DescribeFeatureType?version=" + this.version + "&typename=" + this.featurePrefix + ":" + this.featureType;

			OpenLayers.Request.GET({
				url: this.schema,
				success: this.complete 
			});
		}
	};

	this.complete = function (req) {
		var format = new OpenLayers.Format.WFSDescribeFeatureType();
		var obj = format.read(req.responseXML || req.responseText);
		if (obj && obj.featureTypes && obj.featureTypes[0].properties) {
			for (var i = 0, j = obj.featureTypes[0].properties.length; i< j; i++) {
				var field = obj.featureTypes[0].properties[i];
				if (field && field.name === instance.geometryName) {
					var type = field.type;
					var handler = null;
					var multi = false;
					if (type.indexOf("Point") > 0) {
						handler = OpenLayers.Handler.Point;
					} else if (type.indexOf("Line") > 0) {
						handler = OpenLayers.Handler.Path;
					} else if (type.indexOf("Polygon") > 0) {
						handler = OpenLayers.Handler.Polygon;
					}

					if (type.indexOf("Multi") > 0) {
						multi = true;
					}

					instance.drawControl =  new OpenLayers.Control.DrawFeature(instance.vectorLayer, handler, {
						handlerOptions: {multi: multi},
						map: this.map
					});

					instance.editControl = new OpenLayers.Control.ModifyFeature(instance.vectorLayer, {map: this.map});
					instance.deleteControl = new MuleGIS.Control.DeleteFeature(instance.vectorLayer, this.map);
				}
			}
		}
	};

	this.draw = function () {
		this.initialize();
	};

	this.activate = function () {
		instance.cancel();
		if (this.drawControl) {
			this.drawControl.activate();
			return true;
		}

		return false;
	};

	this.activateModify = function () {
		instance.cancel();
		if (instance.editControl) {
			instance.editControl.activate();
		}
	};

	this.activateDelete = function () {
		instance.drawControl.deactivate();
		instance.editControl.deactivate();
		if (instance.deleteControl) {
			instance.deleteControl.activate();
		}
	};

	this.save = function () {
		this.cancel();
		var result = this.saveStrategy.save();
		this.refreshStrategy.refresh();
		return result;
	};

	this.cancel = function () {
		instance.drawControl.deactivate();
		instance.editControl.deactivate();
		instance.deleteControl.deactivate();
	};

	this.setMap = function (map) {
		this.map = map;

		if (this.vectorLayer) {
			map.addLayer(this.vectorLayer);
		}
	};
};

MuleGIS.Control.FeatureManager.prototype = new OpenLayers.Control();

MuleGIS.Control.DeleteFeature = function (layer, map) {
	MuleGIS.Control.call(this);

	this.layer = layer;

	this.clickFeature = function(feature) {
		if (feature.fid === undefined) {
			this.layer.destroyFeatures([feature]);
		} else {
			feature.state = OpenLayers.State.DELETE;
			this.layer.events.triggerEvent("afterfeaturemodified", {feature: feature});
			feature.renderIntent = "select";
			this.layer.drawFeature(feature);
		}
	};

	this.handler = new OpenLayers.Handler.Feature(
		this, layer, {click: this.clickFeature}
	);

	this.setMap = function (map){
		this.map = map;

		if (this.handler) {
			this.handler.setMap(this.map);
		}
	};

	this.setMap(map);
};

MuleGIS.Control.DeleteFeature.prototype = new OpenLayers.Control();
