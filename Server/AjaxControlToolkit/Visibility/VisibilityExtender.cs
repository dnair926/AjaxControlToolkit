// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

[assembly: System.Web.UI.WebResource("Visibility.VisibilityBehavior.js", "text/javascript")]

namespace AjaxControlToolkit {
    /// <summary>
    /// An extender class which adds collapse/expand behavior to an ASP.NET Panel control.
    /// 
    /// The panel that is extended can then be collapsed or expanded by the user of the page, which is handy
    /// for doing things like showing or hiding content or maximizing available space.
    /// </summary>
    [Designer("AjaxControlToolkit.VisibilityDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.VisibilityBehavior", "Visibility.VisibilityBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [DefaultProperty("ParentControlID")]
    public class VisibilityExtender : ExtenderControlBase {

        /// <summary>
        /// Specify if Client Actions should be ignored. Use this instead of disabling this control so that the TargetControl will be rendered based on the ParentControl value
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool DisableClientEvent {
            get { return GetPropertyValue("DisableClientEvent", false); }
            set { SetPropertyValue("DisableClientEvent", value); }
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(VisibilityControlType.Panel)]
        [ExtenderControlProperty]
        public VisibilityControlType TargetControlType {
            get { return GetPropertyValue("TargetControlType", VisibilityControlType.Panel); }
            set { SetPropertyValue("TargetControlType", value); }
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(VisibilityControlType.DropdownList)]
        [ExtenderControlProperty]
        public VisibilityControlType ParentControlType {
            get { return GetPropertyValue("ParentControlType", VisibilityControlType.DropdownList); }
            set {
                if (value == VisibilityControlType.CheckBox |
                    value == VisibilityControlType.DropdownList |
                    value == VisibilityControlType.RadiobuttonList |
                    value == VisibilityControlType.RadioButton) {
                    SetPropertyValue("ParentControlType", value);
                } else {
                    throw new InvalidEnumArgumentException(string.Format("ParentControlType value specified for VisibilityExtender with ID {0} is invalid. Allowed values are: CheckBox, DropdownList, Radiobutton, or RadiobutonList.", this.ID));
                }
            }
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(VisibilityMode.Show)]
        [ExtenderControlProperty]
        public VisibilityMode ActionOnValueSelected {
            get { return GetPropertyValue("ActionOnValueSelected", VisibilityMode.Show); }
            set { SetPropertyValue("ActionOnValueSelected", value); }
        }

        /// <summary>
        /// Comma delimited Values to check to make the target control visible/hidden. 
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ValuesToCheck {
            get { return GetPropertyValue("ValuesToCheck", ""); }
            set { SetPropertyValue("ValuesToCheck", value); }
        }

        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty]
        public string ParentControlID {
            get { return GetPropertyValue("ParentControlID", ""); }
            set { SetPropertyValue("ParentControlID", value); }
        }

        /// <summary>
        /// ID of the textbox control to set focus to when showing a panel.
        /// </summary>
        [IDReferenceProperty(typeof(TextBox))]
        [DefaultValue("")]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty]
        public string FocusControlID {
            get { return GetPropertyValue("FocusControlID", ""); }
            set { SetPropertyValue("FocusControlID", value); }
        }
        /// <summary>
        /// Handler to attach to the client-side itemSelected event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("valueChanged")]
        public string OnValueChanged {
            get { return GetPropertyValue("OnValueChanged", string.Empty); }
            set { SetPropertyValue("OnValueChanged", value); }
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            SetControlVisibility();
        }

        private void SetControlVisibility() {
            bool collapse = true;
            if (this.Enabled) {
                string valueList = this.ValuesToCheck;
                List<string> valueArray = new List<string>();
                if (valueList != null && valueList.Trim().Length > 0) {
                    valueArray = new List<string>(valueList.Split(",".ToCharArray()));
                }
                bool valueSelected = false;
                using (Control parentControl = this.FindControl(this.ParentControlID)) {
                    using (CheckBox cb = parentControl as CheckBox) {
                        if (cb != null) {
                            valueSelected = cb.Checked;
                        } else if (valueArray.Count > 0) {
                            using (ListControl listControl = parentControl as ListControl) {
                                if (listControl != null) {
                                    valueSelected = valueArray.Contains(listControl.SelectedValue);
                                }
                            }
                        }
                        collapse = (valueSelected && ActionOnValueSelected == VisibilityMode.Hide) || (!valueSelected && ActionOnValueSelected == VisibilityMode.Show);
                    }
                }
            } else {
                collapse = true;
            }

            using (WebControl webControl = this.TargetControl as WebControl) {
                if (webControl != null) {
                    if (collapse) {
                        webControl.Style.Add("display", "none");
                    } else {
                        webControl.Style.Remove("display");
                    }
                } else {
                    using (HtmlControl htmlControl = this.TargetControl as HtmlControl) {
                        if (collapse) {
                            htmlControl.Style.Add("display", "none");
                        } else {
                            htmlControl.Style.Remove("display");
                        }
                    }
                }
            }
        }
    }
}