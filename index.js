
OpenLayers.ProxyHost = "cgi/proxy.cgi?url=";
var vectorLayer = null;
var saveStrategy = null;
var layerTree = null;
var lonlatLocation = null;
var measureControl = new MuleGIS.Control.Measure();
var printControl = null;
var queryControl = null;
var drawFeatureControl = null;
var featureManagerControl = null;
var map = null;

$.fn.setHeight = function (control) {
	var $w = $(window);
	$title = control;
	$this = $(this);
	var init = function () {
		var wH = $w.height(),
		wW = $w.width(),
		tW = $title.width(),
		tH = $title.height();
		$this.css({height:(wH - tH - 3) + 'px'});
	};

	init();
	$w.resize(init);
};
var initMap = function () {
	var initilize = new MuleGIS.Initilize();
	var bounds = initilize.bounds;
	var options = initilize.options;
	map = new OpenLayers.Map('map',options);
	var save = new OpenLayers.Strategy.Save();
	save.events.on({
			'success': function () {
				alert("add")
			}
	});
	
	map.addLayers(initilize.layers);

	layerTree = initilize.layerTree;
	printControl = initilize.printControl;
	lonlatLocation = initilize.lonlatLocation;
	measureControl = initilize.measureControl;
	queryControl = initilize.queryControl;
	drawFeatureControl = initilize.drawFeatureControl;
	featureManagerControl = initilize.featureManager;
	queryControl.callback = this.handleResult;
	
	map.addControls(initilize.controls);
	
	bounds.transform(map.displayProjection,map.projection);
	map.zoomToExtent(bounds);
};

this.handleResult = function (features) {
	for (var i = 0; i < features.length; i++) {
		var feature = features[i];
		for (var source in feature.attributes) {
			if(source === "NAME99") {
				var value = feature.attributes[source];
				var point = feature.geometry.getCentroid();
				point.transform(map.displayProjection,map.projection);
				map.addPopup(new OpenLayers.Popup.FramedCloud(
					"chicken", 
					new OpenLayers.LonLat(point.x,point.y),
					null,
					"名称:" + value,
					null,
					true
				));
			}
		}
	}
};

$('#layer-manage').click(function () {
	layerTree.toggle();
});
$('#lonlat-location').click(function () {
	lonlatLocation.toggle();
});
$(function(){
	$('#map').setHeight($('#headDiv'));
	$(window).resize($('#map').setHeight($('#headDiv')));
	initMap();
});

$("#measureLine").click(function () {
	measureControl.activeMeasureLine();
});
$("#measurePolygon").click(function () {
	measureControl.activeMeasurePolygon();
});

$("#clearMeasure").click(function () {
	measureControl.clear();
});
$('#mapPrint').click(function () {
	printControl.print();
});
$('#drawGraphic').click(function () {
	drawFeatureControl.toggle();
});
$('#btnSearch').click(function () {
	var value = $('#searchText').val();
	if (value !== "" && value !=="查询" ) {
		queryControl.value = value;
		queryControl.query();
	}
});
$('#drawFeature').click(function () {
	featureManagerControl.activate();
})
$('#saveFeature').click(function () {
	featureManagerControl.save();
})
$('#modifyFeature').click(function () {
	featureManagerControl.activateModify();
})
$('#deleteFeature').click(function () {
	featureManagerControl.activateDelete();
})
$('#cancelFeature').click(function () {
	featureManagerControl.cancel();
})
