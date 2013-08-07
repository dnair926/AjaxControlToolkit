Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.CharCountBehavior = function(element) {
    /// <summary>
    /// A behavior that attaches character count to a textbox
    /// </summmary>
    /// <param name="element" type="Sys.UI.DomElement">The element to attach to</param>
    
    Sys.Extended.UI.CharCountBehavior.initializeBase(this, [element]);
            
    this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);
    this._dataFormatString = "{5} total characters allowed. {1} characters entered.";
    this._treatCarriageReturnsAsOneCharacter = false;
    this._maxWordLength = null;
    this._maxCharLength = null;
    this._warningPercentage = 0;
    this._toolTipCssClass = "ToolTipDefault";
    this._toolTipCssClassForMax = "ToolTipDefaultMax";
    this._toolTipCssClassForWarning = "ToolTipDefaultWarning";
    this._popupMouseDown = false;
    this._timer = null;
    this._enabled = true;
    this._showDelay = 2000;
    this._container = null;
    this._popupDiv = null;
    this._popupPosition = Sys.Extended.UI.CharCountPosition.BottomLeft;

    this._popupBehavior = null;
    this._isOpen = false;
    this._blur = new Sys.Extended.UI.DeferredOperation(1, this, this.blur);

    this._oncomplete$delegate = Function.createDelegate(this, this._element_onblur);

    this._element$delegates = {
        keyup : Function.createDelegate(this, this._element_onevent),
        focus : Function.createDelegate(this, this._element_onevent),
        blur : Function.createDelegate(this, this._element_onblur)
    }
}
Sys.Extended.UI.CharCountBehavior.prototype = {

    get_showDelay: function () {
        return this._showDelay;
    },
    set_showDelay: function (value) {
        if (this._showDelay != value) {
            this._showDelay = value;
            this.raisePropertyChanged("showDelay");
        }
    },
    get_dataFormatString: function () {
        return this._dataFormatString;
    },
    set_dataFormatString: function (value) {
        if (this._dataFormatString != value) {
            this._dataFormatString = value;
            this.raisePropertyChanged("dataFormatString");
        }
    },
    get_treatCarriageReturnsAsOneCharacter: function () {
        return this._treatCarriageReturnsAsOneCharacter;
    },
    set_treatCarriageReturnsAsOneCharacter: function (value) {
        if (this._treatCarriageReturnsAsOneCharacter != value) {
            this._treatCarriageReturnsAsOneCharacter = value;
            this.raisePropertyChanged("treatCarriageReturnsAsOneCharacter");
        }
    },
    get_maxWordLength: function () {
        return this._maxWordLength;
    },
    set_maxWordLength: function (value) {
        if (this._maxWordLength != value) {
            this._maxWordLength = value;
            this.raisePropertyChanged("maxWordLength");
        }
    },
    get_maxCharLength: function () {
        return this._maxCharLength;
    },
    set_maxCharLength: function (value) {
        if (this._maxCharLength != value) {
            this._maxCharLength = value;
            this.raisePropertyChanged("maxCharLength");
        }
    },
    get_warningPercentage: function () {
        return this._warningPercentage;
    },
    set_warningPercentage: function (value) {
        if (this._warningPercentage != value) {
            this._warningPercentage = value;
            this.raisePropertyChanged("warningPercentage");
        }
    },
    get_toolTipCssClass: function () {
        return this._toolTipCssClass;
    },
    set_toolTipCssClass: function (value) {
        if (this._toolTipCssClass != value) {
            this._toolTipCssClass = value;
            this.raisePropertyChanged("toolTipCssClass");
        }
    },
    get_toolTipCssClassForMax: function () {
        return this._toolTipCssClassForMax;
    },
    set_toolTipCssClassForMax: function (value) {
        if (this._toolTipCssClassForMax != value) {
            this._toolTipCssClassForMax = value;
            this.raisePropertyChanged("toolTipCssClassForMax");
        }
    },
    get_toolTipCssClassForWarning: function () {
        return this._toolTipCssClassForWarning;
    },
    set_toolTipCssClassForWarning: function (value) {
        if (this._toolTipCssClassForWarning != value) {
            this._toolTipCssClassForWarning = value;
            this.raisePropertyChanged("toolTipCssClassForWarning");
        }
    },

    get_enabled: function () {
        /// <value type="Boolean">
        /// Whether this behavior is available for the current element
        /// </value>

        return this._enabled;
    },
    set_enabled: function (value) {
        if (this._enabled != value) {
            this._enabled = value;
            this.raisePropertyChanged("enabled");
        }
    },
    get_popupPosition: function () {
        /// <value type="Sys.Extended.UI.CharCountPosition">
        /// Where the popup should be positioned relative to the target control.
        /// Can be BottomLeft (Default), BottomRight, TopLeft, TopRight.
        /// </value>

        return this._popupPosition;
    },
    set_popupPosition: function (value) {
        if (this._popupPosition != value) {
            this._popupPosition = value;
            this.raisePropertyChanged('popupPosition');
        }
    },
    get_isOpen: function () {
        /// <value type="Boolean">
        /// Whether the charcount is open
        /// </value>
        return this._isOpen;
    },
    initialize: function () {
        /// <summary>
        /// Initializes the components and parameters for this behavior
        /// </summary>

        Sys.Extended.UI.CharCountBehavior.callBaseMethod(this, "initialize");

        var elt = this.get_element();
        if (!elt.readOnly) {
            $addHandlers(elt, this._element$delegates);
        }
    },
    dispose: function () {
        /// <summary>
        /// Disposes this behavior's resources
        /// </summary>

        if (this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }

        if (this._container) {
            if (this._container.parentNode) { // added this check before calling removeChild WI: 8486
                this._container.parentNode.removeChild(this._container);
            }
            this._container = null;
        }
        var elt = this.get_element();
        $common.removeHandlers(elt, this._element$delegates);
        Sys.Extended.UI.CharCountBehavior.callBaseMethod(this, "dispose");
    },
    show: function () {
        /// <summary>
        /// Shows the popup
        /// </summary>

        this._ensurePopup();

        // Note: Moved to _countChar() to reset the popup position based on the text size and length.
        //if (!this._isOpen) {
        //this._isOpen = true;
        //this._popupBehavior.show();
        //}
        this._countChar();
    },
    hide: function () {
        /// <summary>
        /// Hides the popup
        /// </summary>

        if (this._isOpen) {
            if (this._container) {
                this._popupBehavior.hide();
            }
            this._isOpen = false;
        }
    },
    focus: function () {
        this.get_element().focus();
    },
    blur: function (force) {
        if (!force && Sys.Browser.agent === Sys.Browser.Opera) {
            this._blur.post(true);
        } else {
            this.hide();
        }
    },
    suspendLayout: function () {
        /// <summary>
        /// Suspends layout of the behavior while setting properties
        /// </summary>

        this._layoutSuspended++;
    },
    resumeLayout: function () {
        /// <summary>
        /// Resumes layout of the behavior and performs any pending layout requests
        /// </summary>

        this._layoutSuspended--;
        if (this._layoutSuspended <= 0) {
            this._layoutSuspended = 0;
            if (this._layoutRequested) {
                this._performLayout();
            }
        }
    },
    invalidate: function () {
        /// <summary>
        /// Performs layout of the behavior unless layout is suspended
        /// </summary>

        if (this._layoutSuspended > 0) {
            this._layoutRequested = true;
        } else {
            this._performLayout();
        }
    },
    _ensurePopup: function () {
        if (!this._container) {
            var elt = this.get_element();
            var id = this.get_id();

            this._container = $common.createElementFromTemplate({
                nodeName: "div",
                properties: { id: id + "_container" }
            }, elt.parentNode);

            this._popupDiv = $common.createElementFromTemplate({
                nodeName: "div",
                properties: { id: id + "_popupDiv" },
                visible: false
            }, this._container);

            this._popupBehavior = new $create(Sys.Extended.UI.PopupBehavior, { parentElement: elt }, {}, {}, this._popupDiv);
            if (this._popupPosition == Sys.Extended.UI.CharCountPosition.TopLeft) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.TopLeft);
            } else if (this._popupPosition == Sys.Extended.UI.CharCountPosition.TopRight) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.TopRight);
            } else if (this._popupPosition == Sys.Extended.UI.CharCountPosition.BottomRight) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.BottomRight);
            } else if (this._popupPosition == Sys.Extended.UI.CharCountPosition.Right) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.Right);
            } else if (this._popupPosition == Sys.Extended.UI.CharCountPosition.Left) {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.Left);
            } else {
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.PositioningMode.BottomLeft);
            }
        }
    },
    _element_onfocus: function (e) {
        /// <summary> 
        /// Handles the focus event of the element
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">The arguments for the event</param>
        if (!this._enabled) return;
        this.show();
    },
    _element_onblur: function (e) {
        /// <summary> 
        /// Handles the blur event of the element
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">The arguments for the event</param>        
        if (!this._enabled) return;
        this.blur();
    },
    _element_onevent: function (e) {
        if (!this._enabled) return;
        this.show();
    },
    _countChar: function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        var tbText = this._textbox.get_Value();
        var totalWords = 0, wordsRemaining = 0;
        var totalChars = 0, charsRemaining = 0;

        // Count the total number of words...    
        var uniformSpaces = tbText.replace(/\s/g, ' ');
        var pieces = uniformSpaces.split(' ');

        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].length > 0) { totalWords++; }
        }

        // Count the total number of characters...
        if (this._treatCarriageReturnsAsOneCharacter) {
            var removedExtraChar = tbText.replace('\r\n', '\n');
            totalChars = removedExtraChar.length;
        }
        else
            totalChars = tbText.length;

        // Compute chars/words remaining    
        if (this._maxCharLength > 0 && (this._maxCharLength - totalChars > 0))
            charsRemaining = this._maxCharLength - totalChars;
        if (this._maxWordLength > 0 && (this._maxWordLength - totalWords > 0))
            wordsRemaining = this._maxWordLength - totalWords;


        // Output the message, replacing the placeholders as needed
        var currentLen = this._popupDiv.innerHTML.length;
        this._popupDiv.innerHTML = this._dataFormatString.replace('{0}', totalWords).replace('{1}', totalChars).replace('{2}', wordsRemaining).replace('{3}', charsRemaining).replace('{4}', this._maxWordLength).replace('{5}', this._maxCharLength);
        var newLen = this._popupDiv.innerHTML.length;
        var currentClass = this._popupDiv.className;
        this._popupDiv.className = this._toolTipCssClass;

        // Apply the appropriate CSS class, if needed
        if ((this._toolTipCssClass !== '' || this._toolTipCssClassForWarning !== '' || this._toolTipCssClassForMax !== '') && (this._maxCharLength > 0 || this._maxWordLength > 0) && (this._warningPercentage > 0)) {
            // Only apply the CSS classes if they have a value to apply
            // and if at least one of the max variables is set
            if (((totalChars > this._maxCharLength && this._maxCharLength > 0) || (totalWords > this._maxWordLength && this._maxWordLength > 0)) && (this._toolTipCssClassForMax !== '')) {
                this._popupDiv.className = this._popupDiv.className.replace(this._toolTipCssClass, '');
                this._popupDiv.className = this._popupDiv.className.replace(this._toolTipCssClassForWarning, '');

                if (this._popupDiv.className.search(this._toolTipCssClassForMax) == -1) {
                    this._popupDiv.className = this._popupDiv.className + ' ' + this._toolTipCssClassForMax;
                }
            }
            else if (((totalChars >= this._warningPercentage / 100 * this._maxCharLength && this._maxCharLength > 0) || (totalWords >= this._warningPercentage / 100 * this._maxWordLength && this._maxWordLength > 0)) && (this._toolTipCssClassForWarning !== '')) {
                this._popupDiv.className = this._popupDiv.className.replace(this._toolTipCssClass, '');
                this._popupDiv.className = this._popupDiv.className.replace(this._toolTipCssClassForMax, '');

                if (this._popupDiv.className.search(this._toolTipCssClassForWarning) == -1) {
                    this._popupDiv.className = this._popupDiv.className + ' ' + this._toolTipCssClassForWarning;
                }
            }
            else {
                this._popupDiv.className = this._popupDiv.className.replace(this._toolTipCssClassForWarning, '');
                this._popupDiv.className = this._popupDiv.className.replace(this._toolTipCssClassForMax, '');

                if (this._popupDiv.className.search(this._toolTipCssClass) == -1) {
                    this._popupDiv.className = this._popupDiv.className + ' ' + this._toolTipCssClass;
                }
            }
        }
        this._timer = setTimeout(this._oncomplete$delegate, this.get_showDelay());

        //If popup not open, open it. If Open and Text or Text style changed "re-open" so that the popup can adjust based on the new text length or size.
        if (!this._isOpen) {
            this._isOpen = true;
            this._popupBehavior.show();
        } else if (this._popupDiv.className != currentClass || currentLen != newLen) {
            //Hide and show so that the popup adjusts the position based on the new class and text length.
            this._popupBehavior.hide();
            this._popupBehavior.show();
        }
    }
}
Sys.Extended.UI.CharCountBehavior.registerClass("Sys.Extended.UI.CharCountBehavior", Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.CharCountPosition = function() {
    /// <summary>
    /// Position of the popup relative to the target control
    /// </summary>
    /// <field name="BottomLeft" type="Number" integer="true" />
    /// <field name="BottomRight" type="Number" integer="true" />
    /// <field name="TopLeft" type="Number" integer="true" />
    /// <field name="TopRight" type="Number" integer="true" />
    /// <field name="Right" type="Number" integer="true" />
    /// <field name="Left" type="Number" integer="true" />
    throw Error.invalidOperation();
}
Sys.Extended.UI.CharCountPosition.prototype = {
    BottomLeft: 0,
    BottomRight: 1,
    TopLeft: 2,
    TopRight: 3,
    Right: 4,
    Left: 5
}
Sys.Extended.UI.CharCountPosition.registerEnum('Sys.Extended.UI.CharCountPosition');
