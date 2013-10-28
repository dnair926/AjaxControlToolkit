<%@ Page Title="Visibility Sample" Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true" CodeFile="Visibility.aspx.cs" Inherits="Visibility_Visibility"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
        EnableScriptLocalization="true" ID="ScriptManager1" >
    </ajaxToolkit:ToolkitScriptManager>

    <div class="demoarea">
        <div class="demoheading">
            Visibility Demonstration</div>
        <br />
        <br />
        1. Do you want to see a textbox?
        <asp:RadioButtonList ID="rblTest" runat="server" RepeatLayout="Flow" RepeatDirection="Horizontal">
            <asp:ListItem Text="Yes" Value="Yes" />
            <asp:ListItem Text="No" Value="No" />
        </asp:RadioButtonList>
        <br /><asp:TextBox ID="tbRBLTest" TextMode="MultiLine" Rows="3" Columns="50" runat="server" />
        <ajaxToolkit:VisibilityExtender ID="veTestRBL" ActionOnValueSelected="Show" FocusControlID="tbRBLTest" TargetControlID="tbRBLTest" TargetControlType="TextBox"
            ParentControlID="rblTest" ParentControlType="RadiobuttonList" ValuesToCheck="Yes" runat="server" />
       <br /><br />2. What type of control you want to see?
       <asp:DropDownList ID="ddlTest" runat="server">
            <asp:ListItem Text="None" Value="none" />
            <asp:ListItem Text="Panel" Value="pnl" />
            <asp:ListItem Text="Dropdownlist" Value="ddl" />
            <asp:ListItem Text="RadiobuttonList" Value="rbl" />
            <asp:ListItem Text="Label" Value="lbl" />
       </asp:DropDownList>
        <ajaxToolkit:VisibilityExtender ID="veDDL" ActionOnValueSelected="Show" TargetControlID="pnlTest" TargetControlType="Panel"
            ParentControlID="ddlTest" ParentControlType="DropdownList" ValuesToCheck="pnl" runat="server" />
        <ajaxToolkit:VisibilityExtender ID="veDDL2" ActionOnValueSelected="Show" TargetControlID="ddlTestControl" TargetControlType="DropdownList"
            ParentControlID="ddlTest" ParentControlType="DropdownList" ValuesToCheck="ddl" runat="server" />
        <ajaxToolkit:VisibilityExtender ID="veDDL3" ActionOnValueSelected="Show" TargetControlID="rblTestControl" TargetControlType="RadiobuttonList"
            ParentControlID="ddlTest" ParentControlType="DropdownList" ValuesToCheck="rbl" runat="server" />
        <ajaxToolkit:VisibilityExtender ID="veDDL4" ActionOnValueSelected="Show" TargetControlID="lblTest" TargetControlType="Label"
            ParentControlID="ddlTest" ParentControlType="DropdownList" ValuesToCheck="lbl" runat="server" />
        <ajaxToolkit:VisibilityExtender ID="veDDL5" ActionOnValueSelected="Show" TargetControlID="lblNested" TargetControlType="Label"
            ParentControlID="RadioButtonList1" ParentControlType="RadiobuttonList" ValuesToCheck="Yes" runat="server" />
       <asp:Panel ID="pnlTest" runat="server" style="display:none;border:solid 1px #000000;">
        Would you like to see nested controls?
        <asp:RadioButtonList ID="RadioButtonList1" runat="server" RepeatLayout="Flow" RepeatDirection="Horizontal">
            <asp:ListItem Text="Yes" Value="Yes" />
            <asp:ListItem Text="No" Value="No" />
        </asp:RadioButtonList>
           <asp:Label ID="lblNested" Text="This is a nested label that depends on the previous radio button list." runat="server" />
       </asp:Panel>
       <asp:DropDownList ID="ddlTestControl" runat="server">
            <asp:ListItem Text="You see the droddown" Value="pnl" />
            <asp:ListItem Text="Some Value" Value="ddl" />
            <asp:ListItem Text="Another value" Value="rbl" />
       </asp:DropDownList>
        <asp:RadioButtonList ID="rblTestControl" runat="server" RepeatLayout="Table" RepeatDirection="Horizontal">
            <asp:ListItem Text="You see radiobutton" Value="Yes" />
            <asp:ListItem Text="I am happy" Value="No" />
        </asp:RadioButtonList>
        <asp:Label ID="lblTest" Text="<br />This is a label with some text, and if you are seeing it, the test succeeded." runat="server" />
        <br /><br /><asp:Button ID="btnPostbackTest" Text="Test Postback" runat="server" />
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            Visibility Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            Visibility is an ASP.NET AJAX extender that can be attached to any ASP.NET control. It can show/ hide a control based on the value selected on another control.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            Visibility Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <pre>&lt;ajaxToolkit:VisibilityExtender runat="server" 
        <em>TargetControlID</em>="tbTest"
        <em>TargetControlType</em>="TextBox"
        <em>ParentControlID</em>="rblTest"
        <em>ParentControlType</em>="RadiobuttonList"
        <em>ActionOnValueSelected</em>="Show"
        <em>ValuesToCheck</em>="1,2"
        <em>FocusControlID</em>="tbTest" /&gt;</pre>

        <ul>
            <li><strong>TargetControlID</strong> - The ID of the Control to extend with the Visibility.</li>
            <li><strong>TargetControlType</strong> - The Type of the Control to extend with the Visibility.</li>
            <li><strong>ParentControlID</strong> - The ID of the control to get values to show/hide the target control.</li>
            <li><strong>ParentControlType</strong> - The Type of the control to get values to show/hide the target control</li>
            <li><strong>ActionOnValueSelected</strong> - Show/Hide target control on values selected in parent control. e.g. if showing a control when any 6 of the values selected out of 10 in a dropdown, set Hide and set the </li>
            <li><strong>ValuestoCheck</strong> - The values for which to show/hide the target control.</li>
            <li><strong>FocusControlID</strong> - ID of control to set the focus to when showing control. </li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel" 
        Collapsed="False" ImageControlID="Description_ToggleImage" SuppressPostBack="false" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" SuppressPostBack="false" />
</asp:Content>

