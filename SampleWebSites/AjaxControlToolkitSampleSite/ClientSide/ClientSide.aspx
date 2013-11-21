<%@ Page Title="" Language="C#" MasterPageFile="~/DefaultMaster.master" Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<script runat="server">
    void Page_Load(object sender, EventArgs e) {
        List<string> jsonValues = new List<string>();
        jsonValues.Add("Test");
        jsonValues.Add("Test2");
        var jsonSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        var json = jsonSerializer.Serialize(jsonValues);
        cseTest.ArgumentValues = string.Format("{0},{1}", "Test","Test2");
    }
</script>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <script language="javascript" type="text/javascript">
        function TestScript(obj, event) {
            if (obj.ArgumentValues) {
                var values = obj.ArgumentValues.split(",");
                for (var i = 0; i < values.length; i++) {
                    var div = $get('result');
                    if (div) {
                        div.innerHTML += values[i];
                    }
                }
            }
        }
    </script>
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
        EnableScriptLocalization="true" ID="ScriptManager1" >
    </ajaxToolkit:ToolkitScriptManager>
    <asp:CheckBox ID="cbTest" Text="Click" runat="server" />
    <div id="result"></div>
    <ajaxToolkit:ClientSideExtender ID="cseTest" TargetControlID="cbTest" TargetControlType="CheckBox" runat="server" OnPageInit="TestScript" OnUserAction="TestScript" />
</asp:Content>

