/**
 * 
 */

MuleGIS.LabelMarker = function () {
	/** 
	 * Property: icon 
	 * {<OpenLayers.Icon>} The icon used by this marker.
	 */
	this.label = null;

	/** 
	 * Property: lonlat 
	 * {<OpenLayers.LonLat>} location of object
	 */
	this.lonlat = null;

	/** 
	 * Property: events 
	 * {<OpenLayers.Events>} the event handler.
	 */
	this.events = null;

	/** 
	 * Property: map 
	 * {<OpenLayers.Map>} the map this marker is attached to
	 */
	this.map = null;

	
	/** 
	 * Constructor: OpenLayers.Marker
	 *
	 * Parameters:
	 * lonlat - {<OpenLayers.LonLat>} the position of this marker
	 * icon - {<OpenLayers.Icon>}  the icon for this marker
	 */
	this.initialize = function(lonlat, label) {
		this.lonlat = lonlat;
		
		var newLabel = (label) ? label : new MuleGIS.Label();
		if (this.label === null) {
			this.label = newLabel;
		} else {
			this.label = label;
		}
		this.events = new OpenLayers.Events(this, this.label.div);
	};

	this.initialize(arguments[0],arguments[1]);
	/**
	 * APIMethod: destroy
	 * Destroy the marker. You must first remove the marker from any 
	 * layer which it has been added to, or you will get buggy behavior.
	 * (This can not be done within the marker since the marker does not
	 * know which layer it is attached to.)
	 */
	this.destroy = function() {
		// erase any drawn features
		this.erase();

		this.map = null;

		this.events.destroy();
		this.events = null;

		if (this.label !== null) {
			this.label.destroy();
			this.label = null;
		}
	};

	/** 
	* Method: draw
	* Calls draw on the icon, and returns that output.
	* 
	* Parameters:
	* px - {<OpenLayers.Pixel>}
	* 
	* Returns:
	* {DOMElement} A new DOM Image with this marker's icon set at the 
	* location passed-in
	*/
	this.draw = function(px) {
		return this.label.draw(px);
	}; 

	/** 
	* Method: erase
	* Erases any drawn elements for this marker.
	*/
	this.erase = function() {
		if (this.label !== null) {
			this.label.erase();
		}
	}; 

	/**
	* Method: moveTo
	* Move the marker to the new location.
	*
	* Parameters:
	* px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
	* An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
	*/
	this.moveTo = function (px) {
		if ((px !== null) && (this.label !== null)) {
			this.label.moveTo(px);
		}           
		this.lonlat = this.map.getLonLatFromLayerPx(px);
	};

	/**
	 * APIMethod: isDrawn
	 * 
	 * Returns:
	 * {Boolean} Whether or not the marker is drawn.
	 */
	this.isDrawn = function() {
		var isDrawn = (this.label && this.label.isDrawn());
		return isDrawn;   
	};

	/**
	 * Method: onScreen
	 *
	 * Returns:
	 * {Boolean} Whether or not the marker is currently visible on screen.
	 */
	this.onScreen = function() {
		var onScreen = false;
		if (this.map) {
			var screenBounds = this.map.getExtent();
			onScreen = screenBounds.containsLonLat(this.lonlat);
		}    
		return onScreen;
	};

	/**
	 * Method: inflate
	 * Englarges the markers icon by the specified ratio.
	 *
	 * Parameters:
	 * inflate - {float} the ratio to enlarge the marker by (passing 2
	 *                   will double the size).
	 */
	this.inflate = function(inflate) {
		if (this.label) {
			this.label.setSize({
				w: this.icon.size.w * inflate,
				h: this.icon.size.h * inflate
			});
		}        
	};

	/** 
	 * Method: display
	 * Hide or show the icon
	 * 
	 * display - {Boolean} 
	 */
	this.display = function(display) {
		this.label.display(display);
	};
};

