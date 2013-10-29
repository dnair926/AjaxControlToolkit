(function (window, $) {
    VisibilityControlType = {
        DropdownList: 0,
        RadiobuttonList: 1,
        CheckBox: 2,
        Panel: 3,
        TextBox: 4,
        Label: 5,
        LinkButton: 6,
        TableRow: 7,
        TableCell: 8,
        Table: 9,
        CheckBoxList: 10,
        Radiobutton: 11
    };
    VisibilityMode = {
        Hide: 0,
        Show: 1
    };

    $act.createWidget('visibilityExtender', {

        _create: function () {
            var self = this,
                el = self.element[0],
                opt = self.config;

            if (opt.disableClientEvent == "false") {

                if (!opt.parentControlID) {
                    throw Error.arguments('ParentControlID', String.Format('{0} control not found', opt.parentControlID));
                } else {
                    switch (parseInt(opt.parentControlType)) {
                        case VisibilityControlType.DropdownList:
                            $('#' + opt.parentControlID).change(function (ev) {
                                self.onToggle();
                            });
                            break;
                        case VisibilityControlType.TextBox:
                            $('#' + opt.parentControlID).blur(function (ev) {
                                self.onToggle();
                            });
                            break;
                        case VisibilityControlType.RadiobuttonList:
                        case VisibilityControlType.Radiobutton:
                        case VisibilityControlType.CheckBox:
                            $('#' + opt.parentControlID).click(function (ev) {
                                self.onToggle();
                            });
                            break;
                    }
                }
            }
        },

        onToggle: function () {
            var self = this;
            self.changeControlMode();
            self.raiseValueChanged(new Sys.EventArgs());
        },

        changeControlMode: function () {
            var self = this,
                el = self.element[0],
                opt = self.config;

            var valueSelected = self.isValueSelected();
            var showOnValueSelected = opt.actionOnValueSelected == VisibilityMode.Show;
            var showControl = (valueSelected && showOnValueSelected) || (!valueSelected && !showOnValueSelected)

            if (showControl) {
                $(el).css({ display: '' });
                self.setFocus(opt.focusControlID);
            } else {
                self.clearValueAndRaiseValueChangedEvent(el);
                $(el).css({ display: 'none' });
            }
        },

        isValueSelected: function () {
            var self = this,
                el = self.element[0];
            opt = self.config;

            var valueList = opt.valuesToCheck;
            var values = '';
            if (valueList) {
                values = valueList.split(',');
            }
            var valueFound = false;

            var selectedValue;
            if (opt.parentControlType == VisibilityControlType.CheckBox) {
                selectedValue = $('#' + opt.parentControlID + ':checked').val();
                valueFound = selectedValue ? selectedValue.trim().length > 0 : false;
            } else if (opt.parentControlType == VisibilityControlType.RadiobuttonList) {
                selectedValue = $('#' + opt.parentControlID + ' input[type=radio]:checked').val();
                valueFound = $.inArray(selectedValue, values) >= 0;
            } else {
                selectedValue = $('#' + opt.parentControlID).val();
                valueFound = $.inArray(selectedValue, values) >= 0;
            }

            return valueFound;
        },

        clearValueAndRaiseValueChangedEvent: function (element) {
            /// <summary>
            /// Clear Textboxes, Dropdowns, Multiline Textboxes, Checkboxes.
            /// </summary>

            var self = this;

            switch (element.tagName.toLowerCase()) {
                case 'table':
                case 'div':
                case 'span':
                    $(element).find(":input").each(function () {
                        self.clearValueAndRaiseValueChangedEvent(this);
                    });
                    break;
                case 'input':
                    switch (element.type.toLowerCase()) {
                        case 'checkbox':
                        case 'radio':
                            //Uncheck the control, and raise the click event. 
                            //These controls have click event handlers which do not run automatically
                            if (element.checked) {
                                element.checked = false;
                                self.raiseValueChangedEvent(element);
                            }
                            break;
                        case 'text':
                        case 'password':
                            //Just clear the value. No need to raise any event. 
                            //If this control is getting cleared that means some other control was clicked or changed 
                            //and the focus shifted to that control and the blur event of this contol will run automatically.
                            if (element.value.trim() !== '') {
                                element.value = '';
                            }
                            break;
                    }
                    break;
                case 'textarea':
                    //Just clear the value. No need to raise any event. 
                    //If this control is getting cleared that means some other control was clicked or changed 
                    //and the focus shifted to that control and the blur event of this contol will run automatically.
                    if (element.value.trim() !== '') {
                        element.value = '';
                    }
                    break;
                case 'select':
                    //Select the first item from the list. No need to raise any event. 
                    //The "change" event of this control will run automatically after the index is changed to the first item.
                    //Should not touch the dropdowns on the calendar extender, it will cause the calendar to show. (CalendarExtender was modified to add Year and Month dropdowns)
                    if (element.selectedIndex !== 0) {
                        element.selectedIndex = 0;
                        this.raiseValueChangedEvent(element);
                    }
                    break;
            }
        },

        // ToDo: This has to be moved to utility file.
        raiseValueChangedEvent: function (control) {
            switch (control.type) {
                case 'password':
                case 'text':
                case 'textarea':
                    $common.tryFireEvent(control, "blur");
                    break;
                case 'select-one':
                case 'select-multiple':
                    $common.tryFireEvent(control, "change");
                    break;
                case 'checkbox':
                case 'radio':
                    $common.tryFireEvent(control, "click");
                    break;
            }
        },

        setFocus: function (controlId) {
            if (controlId !== null) {
                $('#' + controlId).focus();
            }
        },

        raiseValueChanged: function (eventArgs) {
            /// <summary>
            /// Raise the valueChanged event
            /// </summary>
            /// <param name="eventArgs" type="Sys.Extended.UI.AutoCompleteItemEventArgs" mayBeNull="false">
            /// Event arguments for the itemSelected event
            /// </param>
            /// <returns />

            //var handler = this.get_events().getHandler('valueChanged');
            //if (handler) {
            //    handler(this, eventArgs);
            //}
        }
    });

})(window, jQuery);