
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("CapsLock.CapsLockBehavior.js", "text/javascript")]
[assembly: WebResource("CapsLock.CapsLock_resource.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("CapsLock.alert-large.gif", "image/gif")]
[assembly: WebResource("CapsLock.alert-small.gif", "image/gif")]
[assembly: WebResource("CapsLock.close.gif", "image/gif")]

namespace AjaxControlToolkit {
    [Designer("AjaxControlToolkit.CapsLockDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts), 0)]
    [RequiredScript(typeof(PopupExtender), 1)]
    [RequiredScript(typeof(ThreadingScripts), 2)]
    [TargetControlType(typeof(TextBox))]
    [ClientCssResource("CapsLock.CapsLock_resource.css")]
    [ClientScriptResource("Sys.Extended.UI.CapsLockBehavior", "CapsLock.CapsLockBehavior.js")]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(CapsLockExtender), "CapsLock.CapsLock.ico")]
    public class CapsLockExtender : ExtenderControlBase {
        /// <summary>
        /// Constructs a new CapsLockExtender.
        /// </summary>
        public CapsLockExtender() {
            EnableClientState = true;
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("warningIconImageUrl")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string WarningIconImageUrl {
            get { return GetPropertyValue("WarningIconImageUrl", (string)null) ?? (DesignMode ? "" : Page.ClientScript.GetWebResourceUrl(typeof(CapsLockExtender), "CapsLock.alert-large.gif")); }
            set { SetPropertyValue("WarningIconImageUrl", value); }
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("closeImageUrl")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string CloseImageUrl {
            get { return GetPropertyValue("CloseImageUrl", (string)null) ?? (DesignMode ? "" : Page.ClientScript.GetWebResourceUrl(typeof(CapsLockExtender), "CapsLock.close.gif")); }
            set { SetPropertyValue("CloseImageUrl", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public string CssClass {
            get { return GetPropertyValue("CssClass", string.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("width")]
        public Unit Width {
            get { return GetPropertyValue("Width", Unit.Empty); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// Convert server IDs into ClientIDs for animations
        /// </summary>
        protected override void OnPreRender(EventArgs e) {
            // Get the associated BaseValidator and set ClientState accordingly
            BaseValidator baseValidator = TargetControl as BaseValidator;
            if ((null != baseValidator) && !baseValidator.IsValid) {
                ClientState = "INVALID";
            } else {
                ClientState = "";
            }

            base.OnPreRender(e);
        }
    }
}
