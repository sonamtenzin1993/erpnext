frappe.provide("apex_dashboard");

apex_dashboard.test_chart = function (wrapper) {

    const container = document.createElement("div");

    container.style.width = "100%";
    container.style.minHeight = "400px";

    wrapper.appendChild(container);

    ApexDashboardRenderer.render(container, {

        type: "pie",

        series: [
            50,
            30,
            20
        ],

        labels: [
            "Approved",
            "Pending",
            "Rejected"
        ],

        height: 400,

        legendPosition: "right"
    });
};