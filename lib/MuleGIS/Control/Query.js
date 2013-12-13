/**
 * 
 */

MuleGIS.Control.Query = function () {
	MuleGIS.Control.call(this);
	var instance = this;
	this.properName = "NAME99";
	this.typeName = "china:liaoning";
	this.url = "http://localhost:8080/geoserver/wfs?";
	this.isLike = true;
	this.value = "沈阳";
	this.callback = null;

	handlerReponse = function (req) {
		var format = new OpenLayers.Format.GML();
		var features = format.read(req.responseText);

		if(instance.callback !== null && typeof instance.callback === "function" ) {
			instance.callback(features);
		}

		OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
	};

	this.draw = function () {
	};

	this.query = function () {
		OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
		var xmlPara = "<?xml version='1.0' encoding='UTF-8'?>" +
			"<wfs:GetFeature  service='WFS' version='1.0.0' " +
			"xmlns:wfs='http://www.opengis.net/wfs' " +
			"xmlns:gml='http://www.opengis.net/gml' " +
			"xmlns:ogc='http://www.opengis.net/ogc' " +
			"xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
			"xsi:schemaLocation='http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd'>" +

			"<wfs:Query typeName='" + this.typeName+ "'>" ;
			if (this.isLike === true) {
				xmlPara += "<ogc:Filter>" +
					"<ogc:PropertyIsLike wildCard='*' singleChar='.' escape='!'>" +
					"<ogc:PropertyName>" + this.properName + "</ogc:PropertyName>" +
					"<ogc:Literal>*" + this.value + "*</ogc:Literal>" +
					"</ogc:PropertyIsLike>" +
					"</ogc:Filter>" ;
			} else {
				xmlPara += "<ogc:Filter>" +
					"<ogc:PropertyIsEqualTo>" +
					"<ogc:PropertyName>" + this.properName + "</ogc:PropertyName>" +
					"<ogc:Literal>" + this.value + "</ogc:Literal>" +
					"</ogc:PropertyIsEqualTo>" +
					"</ogc:Filter>" ;
			}

			xmlPara += "</wfs:Query>" +
				"</wfs:GetFeature>";

		var request = OpenLayers.Request.POST( {
			url : this.url,
			outputFormat: "JSON",
			//async: false,
			callback : handlerReponse
		});

		request.send(xmlPara);
	};
};
