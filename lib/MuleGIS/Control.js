/* Copyright (c) 2013 by Neusoft
 */

MuleGIS.Control = function () {
	
	MuleGIS.call(this);
	
	var instance = this;

	/**
	 * property:id
	 * {string}
	 */
	this.id = null;

	/**
	 * property:name
	 * {string}
	 */
	this.name = "control";
	
	/**
	 * property:div
	 * {string}
	 */
	this.div = null;
	
	/**
	 * property:map
	 * {OpenLayers.Map}
	 */
	this.map = null;
	
	this.setMap = function (map) {
		this.map = map;
	};

	CLASS_NAME = "MuleGIS.Control";
};

MuleGIS.Control.prototype = new OpenLayers.Control();
