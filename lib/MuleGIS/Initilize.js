
MuleGIS.Initilize = function () {
	var format = 'image/png';
	this.bounds = new OpenLayers.Bounds(
		119.757, 40.368,
		127.156, 42.757
	);

	this.options = {
		controls: [],
		maxExtent: this.bounds,
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326"),
		units: 'degrees'
	};

	this.layers = [];

	this.controls = [];

	var tiled = new OpenLayers.Layer.WMS(
		"本地底图", "http://192.168.196.189:8080/geoserver/china/wms",
		{
			LAYERS: 'china',
			STYLES: '',
			format: format,
			tiled: true,
			tilesOrigin : this.bounds.left + ',' + this.bounds.bottom
		},
		{
			buffer: 0,
			displayOutsideMaxExtent: true,
			isBaseLayer: true,
			yx : {'EPSG:4326' : true}
		}
	);

	var liaoning = new OpenLayers.Layer.WMS(
		"辽宁省", "http://localhost:8080/geoserver/china/wms",
		{
			LAYERS: 'china:liaoning_postgre',
			STYLES: '',
			format: format,
			tiled: true,
			transparent: "true",
			tilesOrigin : this.bounds.left + ',' + this.bounds.bottom
		},
		{
			buffer: 0,
			displayOutsideMaxExtent: true,
			isBaseLayer: false,
			yx : {'EPSG:4326' : true}
		}
	);
	var beijing = new OpenLayers.Layer.WMS(
		"北京", "http://192.168.196.189:8080/geoserver/china/wms",
		{
			LAYERS: 'china:beijing',
			STYLES: '',
			format: format,
			tiled: true,
			transparent: "true",
			tilesOrigin : this.bounds.left + ',' + this.bounds.bottom
		},
		{
			buffer: 0,
			displayOutsideMaxExtent: true,
			isBaseLayer: false,
			yx : {'EPSG:4326' : true}
		}
	);

	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	this.vectorLayer = new OpenLayers.Layer.Vector("辽宁", {
		projection: new OpenLayers.Projection("EPSG:4326"),
		strategies: [new OpenLayers.Strategy.Fixed(),
			new OpenLayers.Strategy.Save({auto: true}),
			new OpenLayers.Strategy.Refresh()],
		protocol: new OpenLayers.Protocol.WFS({
			url:  "http://192.168.196.189:8080/geoserver/wfs",
			version: "1.0.0",
			featurePrefix: "china",
			featureType: "liaoning",
			featureNS: "http://www.neusoft.com/china",
			srsName : "EPSG:4326",
			isBaseLayer: false,
			geometryType: "OpenLayers.Geometry.Polygon",
			geometryName : "geom"
		}),
		renderers: renderer
	});
	var gmap = new OpenLayers.Layer.Google("谷歌底图", {sphericalMercator:true});
	//this.layers.push(tiled);
	this.layers.push(gmap);
	this.layers.push(beijing);
	//this.layers.push(liaoning);
	this.layers.push(this.vectorLayer);
	
	this.layerTree = new MuleGIS.Control.LayerTree();
	var positionControl = new MuleGIS.Control.MousePosition({element: $('#location').get(0)});
	var overView = new MuleGIS.Control.Overview({
		maximizeTitle: '展开鹰眼图',
		minimizeTitle: '折叠鹰眼图'
	});
	var navigation = new MuleGIS.Control.Navigation({
		position: new OpenLayers.Pixel(2, 15)
	});
	//navigation.zoomWheelEnabled = false;
	navigation.pinchZoom = false;
	this.printControl = new MuleGIS.Control.Print();
	this.lonlatLocation = new MuleGIS.Control.Location();
	this.measureControl = new MuleGIS.Control.Measure();
	this.queryControl = new MuleGIS.Control.Query();
	this.drawFeatureControl = new MuleGIS.Control.DrawFeature();
	this.controls.push(this.layerTree);
	this.controls.push(overView);

	this.featureManager = new MuleGIS.Control.FeatureManager();
	this.featureManager.url = "http://localhost:8080/geoserver/wfs";
	this.featureManager.srsName = "EPSG:4326";
	this.featureManager.featureNS = "http://www.neusoft.com/china";
	this.featureManager.featurePrefix = "china";
	this.featureManager.featureType = "house";
	this.featureManager.geometryName = "geom";
	this.featureManager.layerName = "编辑图层";
	this.featureManager.autoSave = false;
	this.controls.push(this.featureManager);

	this.controls.push(navigation);
	this.controls.push(new MuleGIS.Control.ScaleLine());
	this.controls.push(positionControl);
	this.controls.push(this.lonlatLocation);
	this.controls.push(this.printControl);
	this.controls.push(this.queryControl);
	this.controls.push(this.measureControl);
	this.controls.push(this.drawFeatureControl);

	this.drawFeatureControl.setFeatureAdded(function (feature) {
		var geoJson = new OpenLayers.Format.GeoJSON();
		var str = geoJson.write(feature);
		alert("图形序列化信息:\r\b" + str);
	});

	OpenLayers.Request.GET({
		url: "http://localhost:8080/geoserver/styles/liaoning.sld",
        success: complete
    });

	function complete(req) {
		var format = new OpenLayers.Format.SLD();
		var sld = format.read(req.responseXML || req.responseText);
	}
};
