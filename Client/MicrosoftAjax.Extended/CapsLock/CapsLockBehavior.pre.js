


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />
/// <reference path="../PopupExtender/PopupBehavior.js" />
// http://www.4guysfromrolla.com/articles/051408-1.aspx


(function () {
    var scriptName = "CapsLock";

    function execute() {

        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.CapsLockBehavior = function (element) {

            Sys.Extended.UI.CapsLockBehavior.initializeBase(this, [element]);

            this._warningIconImageUrl = null;
            this._closeImageUrl = null;
            this._cssClass = "ajax__capsLock";
            this._width = "200px";
            this._popupTable = null;
            this._errorMessageCell = null;
            this._calloutArrowCell = null;
            this._warningIconImage = null;
            this._closeImage = null;
            this._closeCellInnerDiv = null;
            this._popupBehavior = null;
            this._onShowJson = null;
            this._onHideJson = null;
            this._keypressAttached = false;
            this._blurAttached = false;
            this._isOpen = false;
            this._isBuilt = false;
            this._timer = null;

            this._keypressHandler = null;
            this._blurHandler = null;
            this._closeClickHandler = null;
            this._oncomplete$delegate = Function.createDelegate(this, this.hide);
        }
        Sys.Extended.UI.CapsLockBehavior.prototype = {
            initialize: function () {
                Sys.Extended.UI.CapsLockBehavior.callBaseMethod(this, 'initialize');

                var elt = this.get_element();

                this._keypressHandler = Function.createDelegate(this, this._onkeypress);
                this._blurHandler = Function.createDelegate(this, this._onblur);
                this._closeClickHandler = Function.createDelegate(this, this._oncloseClick);

                if (!this._keypressAttached) {
                    $addHandler(elt, "keypress", this._keypressHandler); //has to be keypress, the charCodes are same on keydown for Capital and small letters.
                    this._keypressAttached = true;
                }
                if (!this._blurAttached) {
                    $addHandler(elt, "blur", this._blurHandler);
                    this._blurAttached = true;
                }
            },

            _ensureCallout: function () {
                if (!this._isBuilt) {
                    var elt = this.get_element();
                    //
                    // create the DOM elements
                    //
                    var popupTable = this._popupTable = document.createElement("table");
                    var popupTableBody = document.createElement("tbody");
                    var popupTableRow = document.createElement("tr");
                    var calloutCell = document.createElement("td");
                    var calloutTable = document.createElement("table");
                    var calloutTableBody = document.createElement("tbody");
                    var calloutTableRow = document.createElement("tr");
                    var iconCell = document.createElement("td");
                    var closeCell = document.createElement("td");
                    var closeCellInnerDiv = this._closeCellInnerDiv = document.createElement("div");
                    var calloutArrowCell = this._calloutArrowCell = document.createElement("td");
                    var warningIconImage = this._warningIconImage = document.createElement("img");
                    var closeImage = this._closeImage = document.createElement("img");
                    var errorMessageCell = this._errorMessageCell = document.createElement("td");
                    //
                    // popupTable
                    //
                    popupTable.id = this.get_id() + "_popupTable";
                    popupTable.cellPadding = 0;
                    popupTable.cellSpacing = 0;
                    popupTable.border = 0;
                    popupTable.width = this.get_width();
                    popupTable.className = this._cssClass;
                    //
                    // popupTableRow
                    //
                    popupTableRow.className = "ajax__capsLock_popup_table_row";
                    //
                    // calloutCell
                    //
                    calloutCell.className = "ajax__capsLock_callout_cell";
                    //
                    // calloutTable
                    //
                    calloutTable.cellPadding = 0;
                    calloutTable.cellSpacing = 0;
                    calloutTable.border = 0;
                    calloutTable.className = "ajax__capsLock_callout_table";
                    //
                    // calloutTableRow
                    //
                    calloutTableRow.className = "ajax__capsLock_callout_table_row";
                    //
                    // calloutArrowCell
                    //
                    calloutArrowCell.className = "ajax__capsLock_callout_arrow_cell";
                    //
                    // iconCell
                    //
                    iconCell.className = "ajax__capsLock_icon_cell";
                    //
                    // _warningIconImage
                    //
                    warningIconImage.border = 0;
                    warningIconImage.src = this.get_warningIconImageUrl();
                    //
                    // _errorMessageCell
                    //
                    errorMessageCell.className = "ajax__capsLock_error_message_cell";
                    errorMessageCell.innerHTML = this._getErrorMessage();
                    //
                    // closeCell
                    //
                    closeCell.className = "ajax__capsLock_close_button_cell";
                    //
                    // closeImage
                    //
                    closeCellInnerDiv.className = "ajax__capsLock_innerdiv";
                    closeImage.src = this.get_closeImageUrl();
                    //
                    // Create the DOM tree
                    //
                    elt.parentNode.appendChild(popupTable);
                    popupTable.appendChild(popupTableBody);
                    popupTableBody.appendChild(popupTableRow);
                    popupTableRow.appendChild(calloutCell);
                    calloutCell.appendChild(calloutTable);
                    calloutTable.appendChild(calloutTableBody);
                    calloutTableBody.appendChild(calloutTableRow);
                    calloutTableRow.appendChild(calloutArrowCell);
                    popupTableRow.appendChild(iconCell);
                    iconCell.appendChild(warningIconImage);
                    popupTableRow.appendChild(errorMessageCell);
                    popupTableRow.appendChild(closeCell);
                    closeCellInnerDiv.appendChild(closeImage);
                    closeCell.appendChild(closeCellInnerDiv);
                    //
                    // initialize callout arrow
                    //
                    var div = document.createElement("div");
                    div.className = "ajax__capsLock_innerdiv";
                    calloutArrowCell.appendChild(div);
                    for (var i = 14; i > 0; i--) {
                        var line = document.createElement("div");
                        line.style.width = i.toString() + "px";
                        div.appendChild(line);
                    }
                    //
                    // initialize behaviors
                    //
                    this._popupBehavior = $create(
                Sys.Extended.UI.PopupBehavior,
                {
                    positioningMode: Sys.Extended.UI.PositioningMode.Absolute,
                    parentElement: elt
                },
                {},
                null,
                this._popupTable);

                    // Create the animations (if they were set before initialize was called)
                    if (this._onShowJson) {
                        this._popupBehavior.set_onShow(this._onShowJson);
                    }
                    if (this._onHideJson) {
                        this._popupBehavior.set_onHide(this._onHideJson);
                    }
                    $addHandler(this._closeCellInnerDiv, "click", this._closeClickHandler);
                    this._isBuilt = true;
                }
            },

            dispose: function () {

                if (this._isBuilt) {
                    this.hide();

                    var elt = this.get_element();

                    if (this._keypressAttached) {
                        $removeHandler(elt, "keypress", this._keypressHandler);
                        this._keypressAttached = false;
                    }
                    if (this._blurAttached) {
                        $removeHandler(elt, "blur", this._blurHandler);
                        this._blurAttached = false;
                    }
                    $removeHandler(this._closeCellInnerDiv, "click", this._closeClickHandler);

                    this._onShowJson = null;
                    this._onHideJson = null;
                    if (this._popupBehavior) {
                        this._popupBehavior.dispose();
                        this._popupBehavior = null;
                    }
                    if (this._closeBehavior) {
                        this._closeBehavior.dispose();
                        this._closeBehavior = null;
                    }
                    if (this._popupTable) {
                        this._popupTable.parentNode.removeChild(this._popupTable);
                        this._popupTable = null;
                        this._errorMessageCell = null;
                        this._calloutArrowCell = null;
                        this._warningIconImage = null;
                        this._closeImage = null;
                        this._closeCellInnerDiv = null;
                    }
                    this._isBuilt = false;
                }
                Sys.Extended.UI.CapsLockBehavior.callBaseMethod(this, 'dispose');
            },

            _getErrorMessage: function () {
                //        return this.get_element().errormessage || Sys.Extended.UI.Resources.CapsLock_DefaultErrorMessage;
                return "<span style='white-space:nowrap;font-size:9pt;'>Caps Lock key on your keyboard is on.</span><br /><span style='font-weight:normal;'>(If this is in error then turn Caps Lock key off and enter password again.)</span>";
            },

            show: function (force) {
                if (force || !this._isOpen) {
                    this._isOpen = true;
                    if (force && Sys.Extended.UI.CapsLockBehavior._currentCallout) {
                        Sys.Extended.UI.CapsLockBehavior._currentCallout.hide();
                    }
                    //            if(Sys.Extended.UI.CapsLockBehavior._currentCallout !== null) {
                    //                alert(Sys.Extended.UI.CapsLockBehavior._currentCallout);
                    //                return;
                    //            }
                    Sys.Extended.UI.CapsLockBehavior._currentCallout = this;
                    this._popupBehavior.set_x($common.getSize(this.get_element()).width);
                    this._popupBehavior.show();
                }
            },

            hide: function () {
                if (Sys.Extended.UI.CapsLockBehavior._currentCallout == this) {
                    Sys.Extended.UI.CapsLockBehavior._currentCallout = null;
                }
                if (this._isOpen || $common.getVisible(this._popupTable)) {
                    this._isOpen = false;
                    this._popupBehavior.hide();
                }
            },

            checkCapsLock: function (ev) {
                /* Based on script created by: John G. Wang | http://www.csua.berkeley.edu/~jgwang/ */
                /* Script online at: http://javascript.internet.com/forms/check-cap-locks.html */
                if (this._timer) {
                    clearTimeout(this._timer);
                    this._timer = null;
                }
                var myKeyCode = ev.keyCode ? ev.keyCode : ev.rawEvent.keyCode;
                var myShiftKey = ev.shiftKey;

                // Upper case letters are seen without depressing the Shift key, therefore Caps Lock is on
                //||
                // Lower case letters are seen while depressing the Shift key, therefore Caps Lock is on
                if ((myKeyCode >= 65 && myKeyCode <= 90) || (myKeyCode >= 97 && myKeyCode <= 122)) {
                    if (((myKeyCode >= 65 && myKeyCode <= 90) && !myShiftKey) || ((myKeyCode >= 97 && myKeyCode <= 122) && myShiftKey)) {
                        this._ensureCallout();
                        this.show(true);
                        this._timer = setTimeout(this._oncomplete$delegate, 2000);
                    } else {
                        this.hide();
                    }
                } else {
                    if (myKeyCode == 20) {
                        this.hide();
                    }
                }
            },

            _onkeypress: function (ev) {
                return this.checkCapsLock(ev);
            },

            _onblur: function (ev) {
                this.hide();
            },

            _oncloseClick: function (ev) {
                this.hide();
            },

            get_onShow: function () {
                /// <value type="String" mayBeNull="true">
                /// Generic OnShow Animation's JSON definition
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
            },
            set_onShow: function (value) {
                if (this._popupBehavior) {
                    this._popupBehavior.set_onShow(value);
                } else {
                    this._onShowJson = value;
                }
                this.raisePropertyChanged('onShow');
            },
            get_onShowBehavior: function () {
                /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
                /// Generic OnShow Animation's behavior
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
            },
            onShow: function () {
                /// <summary>
                /// Play the OnShow animation
                /// </summary>
                /// <returns />
                if (this._popupBehavior) {
                    this._popupBehavior.onShow();
                }
            },

            get_onHide: function () {
                /// <value type="String" mayBeNull="true">
                /// Generic OnHide Animation's JSON definition
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
            },
            set_onHide: function (value) {
                if (this._popupBehavior) {
                    this._popupBehavior.set_onHide(value);
                } else {
                    this._onHideJson = value;
                }
                this.raisePropertyChanged('onHide');
            },
            get_onHideBehavior: function () {
                /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
                /// Generic OnHide Animation's behavior
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
            },
            onHide: function () {
                /// <summary>
                /// Play the OnHide animation
                /// </summary>
                /// <returns />
                if (this._popupBehavior) {
                    this._popupBehavior.onHide();
                }
            },
            get_warningIconImageUrl: function () {
                return this._warningIconImageUrl;
            },
            set_warningIconImageUrl: function (value) {

                if (this._warningIconImageUrl != value) {
                    this._warningIconImageUrl = value;
                    if (this.get_isInitialized()) {
                        this._warningIconImage.src = value;
                    }
                    this.raisePropertyChanged("warningIconImageUrl");
                }
            },
            get_closeImageUrl: function () {
                return this._closeImageUrl;
            },
            set_closeImageUrl: function (value) {

                if (this._closeImageUrl != value) {
                    this._closeImageUrl = value;
                    if (this.get_isInitialized()) {
                        this._closeImage.src = value;
                    }
                    this.raisePropertyChanged("closeImageUrl");
                }
            },

            get_width: function () {
                return this._width;
            },
            set_width: function (value) {

                if (this._width != value) {
                    this._width = value;
                    if (this.get_isInitialized()) {
                        this._popupTable.style.width = _width;
                    }
                    this.raisePropertyChanged("width");
                }
            },

            get_cssClass: function () {
                return this._cssClass;
            },
            set_cssClass: function (value) {

                if (this._cssClass != value) {
                    this._cssClass = value;
                    this.raisePropertyChanged("cssClass");
                }
            },

            get_isOpen: function () {
                return this._isOpen;
            }
        }
        Sys.Extended.UI.CapsLockBehavior.registerClass('Sys.Extended.UI.CapsLockBehavior', Sys.Extended.UI.BehaviorBase);
    }

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);
    }
    else {
        execute();
    }

})();