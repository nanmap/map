/**
 * 
 */

MuleGIS.Label = function () {

	this.label = "";
	/** 
	 * Property: offset 
	 * {<OpenLayers.Pixel>|Object} distance in pixels to offset the
	 * image when being rendered. An OpenLayers.Pixel or an object
	 * with a 'x' and 'y' properties.
	 */
	this.offset = null;    

	/** 
	 * Property: imageDiv 
	 * {DOMElement} 
	 */
	this.div = null;

	/** 
	 * Property: px 
	 * {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object
	 * with a 'x' and 'y' properties.
	 */
	this.px = null;

	/** 
	 * Constructor: OpenLayers.Icon
	 * Creates an icon, which is an image tag in a div.  
	 *
	 * offset - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
	 *                                      object with a 'x' and 'y'
	 *                                      properties.
	 */
	this.initialize = function(label, offset) {
		this.label = label;
		this.offset = offset || {x: 0, y:0};

		var id = OpenLayers.Util.createUniqueID("MuleGIS_Lable_");
		this.div = OpenLayers.Util.createDiv(id);
		var labelDiv = document.createElement("a");
		labelDiv.innerText = label;
		this.div.appendChild(labelDiv);
	};

	this.initialize(arguments[0],arguments[1]);
	/** 
	 * Method: destroy
	 * Nullify references and remove event listeners to prevent circular 
	 * references and memory leaks
	 */
	this.destroy = function() {
		// erase any drawn elements
		this.erase();

		OpenLayers.Event.stopObservingElement(this.div.firstChild); 
		this.div.innerHTML = "";
		this.div = null;
	};

	/** 
	 * Method: clone
	 * 
	 * Returns:
	 * {<OpenLayers.Icon>} A fresh copy of the icon.
	 */
	this.clone = function() {
		return new MuleGIS.Lable(this.label, 
									this.offset);
	};

	/** 
	 * Method: draw
	 * Move the div to the given pixel.
	 * 
	 * Parameters:
	 * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
	 *                                  object with a 'x' and 'y' properties.
	 * 
	 * Returns:
	 * {DOMElement} A new DOM Image of this icon set at the location passed-in
	 */
	this.draw = function(px) {
		OpenLayers.Util.modifyAlphaImageDiv(this.div, 
											null, 
											null, 
											null, 
											null, 
											"absolute");
		this.moveTo(px);
		return this.div;
	};

	/** 
	 * Method: erase
	 * Erase the underlying image element.
	 */
	this.erase = function() {
		if (this.div !== null && this.div.parentNode !== null) {
			OpenLayers.Element.remove(this.div);
		}
	};

	/**
	 * Method: moveTo
	 * move icon to passed in px.
	 *
	 * Parameters:
	 * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
	 * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
	 */
	this.moveTo = function (px) {
		//if no px passed in, use stored location
		if (px !== null) {
			this.px = px;
		}

		if (this.div !== null) {
			if (this.px === null) {
				this.display(false);
			} else {
				OpenLayers.Util.modifyAlphaImageDiv(this.div, null, {
					x: this.px.x + this.offset.x,
					y: this.px.y + this.offset.y
				});
			}
		}
	};

	this.display = function(display) {
		this.div.style.display = (display) ? "" : "none"; 
	};


	/**
	 * APIMethod: isDrawn
	 * 
	 * Returns:
	 * {Boolean} Whether or not the icon is drawn.
	 */
	this.isDrawn = function() {
		// nodeType 11 for ie, whose nodes *always* have a parentNode
		// (of type document fragment)
		var isDrawn = (this.div && this.div.parentNode && 
						(this.div.parentNode.nodeType != 11));    

		return isDrawn;   
	};
};
