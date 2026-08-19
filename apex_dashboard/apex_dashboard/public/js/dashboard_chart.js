frappe.provide("apex_dashboard");

console.log("========== DASHBOARD CHART CONFIG ==========");
console.log("CLICK ACTION SHOULD BE HERE");

apex_dashboard.test_chart = function (wrapper) {

    const container = document.createElement("div");

    container.style.width = "100%";
    container.style.minHeight = "400px";

    wrapper.appendChild(container);

    ApexDashboardRenderer.render(container, {

        type: "pie",

        series: [
            258,
            35, 
            7, 
            6,
            3, 
            1
        ],

        labels: [
            "Waiting for Approval",
            "Kidu Received",
            "Waiting for Profile", 
            "Case Closed",
            "Waiting for NLCS",
            "Disapproved"
        ],

        clickAction: {
        type: "list",
        doctype: "Kidu Profile",
        field: "workflow_state"
    },

        height: 400,

        legendPosition: "right"
    });
};