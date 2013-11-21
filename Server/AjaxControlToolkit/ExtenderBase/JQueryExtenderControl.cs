using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// Base class to build extender control using jQuery.
    /// </summary>
    [RequiredScript(typeof(JQueryToolkitScripts))]
    public abstract class JQueryExtenderControl : ExtenderControlBase {

        /// <summary>
        /// Control name in lower case
        /// </summary>
        private readonly string _attrControlName;

        /// <summary>
        /// The name of jQuery widget function 
        /// </summary>
        private readonly string _widgetFunctionName;

        private Type _targetControlType;

        private const string DataOptionPrefix = "data-act-";

        /// <summary>
        /// JQueryExtenderControl constructor.
        /// </summary>
        protected JQueryExtenderControl() {
            var name = this.GetType().Name;
            _attrControlName = name.ToLower();
            _widgetFunctionName = name.Substring(0, 1).ToLower() + name.Substring(1);
        }


        /// <summary>
        /// Overridden OnInit method. Build data-options and add it into extender target as an data-options attribute.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            
            if (DesignMode)
                return;

        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            if (!Enabled || !TargetControl.Visible)
                return;

            var dataOptions = BuildDataOptionsAttribute();
            var targetControl = this.TargetControl as WebControl;
            var htmlTargetControl = this.TargetControl as HtmlControl;
            if (targetControl == null && htmlTargetControl == null)
                throw new Exception("Target control type must be WebControl or HtmlControl");

            _targetControlType = TargetControl.GetType();

            TargetControl.Parent.SetRenderMethodDelegate(RenderTargetControl);
            var attrs = (targetControl != null)
                            ? (targetControl is CheckBox)
                                ? (targetControl as CheckBox).InputAttributes
                                    : targetControl.Attributes
                            : (htmlTargetControl != null)
                                ? htmlTargetControl.Attributes
                                    : null;

            if (attrs != null) {
                attrs.Add(DataOptionPrefix + _attrControlName, dataOptions);
            }
        }
        
        /// <summary>
        /// Delegate method for extender target control parent SetRenderMethodDelegate method
        /// </summary>
        private void RenderTargetControl(HtmlTextWriter writer, Control parent) {
            foreach (Control control in parent.Controls) {
                if (control.GetType() == _targetControlType) {
                    DecodeAttributeValues(writer, control);
                }
                control.RenderControl(writer);
            }
        }


        /// <summary>
        /// Replace data-act-* attribute with un-encoded values
        /// </summary>
        /// <param name="writer">Html text writer</param>
        /// <param name="control">Control to evaluate</param>
        private void DecodeAttributeValues(HtmlTextWriter writer, Control control) {
            var targetControl = control as WebControl;
            var htmlTargetControl = control as HtmlControl;
            var attrs = (targetControl != null)
                            ? (targetControl is CheckBox)
                                ? (targetControl as CheckBox).InputAttributes
                                    : targetControl.Attributes
                            : (htmlTargetControl != null)
                                ? htmlTargetControl.Attributes
                                    : null;
            if (attrs != null) {
                var keys = new string[attrs.Keys.Count];
                attrs.Keys.CopyTo(keys, 0);

                foreach (string attrKey in keys) {
                    if (attrKey.StartsWith(DataOptionPrefix)) {
                        var attrVal = attrs[attrKey];
                        attrs.Remove(attrKey);
                        writer.AddAttribute(attrKey, attrVal, false);
                    }
                }
            }
        }

        /// <summary>
        /// Build data options attribute by parsing extender control properties
        /// </summary>
        /// <returns>Formatted string data options</returns>
        private string BuildDataOptionsAttribute() {
            var properties = this.GetType().GetProperties(BindingFlags.Public
                                                          | BindingFlags.Instance
                                                          | BindingFlags.DeclaredOnly);

            var dataOptions = new List<string>();

            foreach (var property in properties) {

                var extenderCtlPropAttr = property
                    .GetCustomAttributes(typeof (ExtenderControlPropertyAttribute), false)
                    .FirstOrDefault();

                if (extenderCtlPropAttr != null) {
                    var propType = property.PropertyType;

                    // Determine default property value
                    var defaultValueAttr =
                        (DefaultValueAttribute)
                            property.GetCustomAttributes(typeof (DefaultValueAttribute), false).FirstOrDefault();

                    var defaultValue = defaultValueAttr != null
                        ? defaultValueAttr.Value
                        : (propType.IsValueType ? Activator.CreateInstance(propType) : null);

                    // Determine property value
                    var value = property.GetValue(this, null);

                    // Only add non-default property values
                    if (value != defaultValue) {
                        var formatedValue = value.ToString();

                        var idReferenceProperty =
                            (IDReferencePropertyAttribute)
                                property.GetCustomAttributes(typeof(IDReferencePropertyAttribute), false).FirstOrDefault();

                        if (idReferenceProperty != null) {
                            formatedValue = GetClientID(formatedValue);
                        }

                        if (propType.IsEnum) {
                            formatedValue = Convert.ToInt32(Enum.Parse(propType, formatedValue)).ToString();
                        }

                        // Encode and quotize if value is string
                        if (propType.Equals(typeof(string)))
                            formatedValue = "'" + Page.Server.HtmlEncode(formatedValue) + "'";
                        else if (propType.Equals(typeof(bool)))
                            formatedValue = formatedValue.ToLower();
                        dataOptions.Add(string.Format("{0}:{1}", CamelCaseFormat(property.Name), formatedValue));
                    }
                }
            }

            // Returns generated data options
            return string.Join(",", dataOptions.ToArray());
        }

        /// <summary>
        /// Format string in camel-case style.
        /// </summary>
        /// <param name="value">string to format</param>
        /// <returns></returns>
        private string CamelCaseFormat(string value) {
            return Char.ToLowerInvariant(value[0]) + value.Substring(1);
        }

        /// <summary>
        /// Overridden GetScriptDescriptors method avoid any other operations except standard GetScriptDescriptors operation.
        /// </summary>
        /// <param name="targetControl"></param>
        /// <returns></returns>
        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors(Control targetControl) {
            return null;
        }

        /// <summary>
        /// Overridden GetScriptReferences to avoid script references to be use.
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<ScriptReference> GetScriptReferences() {
            return null;
        }
    }
}