frappe.pages["apex-test"].on_page_load = function(wrapper) {

    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "ApexCharts Test",
        single_column: true
    });

    $(wrapper).find(".layout-main-section").html(`
        <div id="apex-test-chart" style="width: 100%;"></div>
    `);

    const chart_options = {
        chart: {
            type: "pie",
            height: 350
        },

        series: [44, 55, 13, 43, 22],

        labels: [
            "Award",
            "Scarf",
            "Certificate",
            "Medal",
            "Other"
        ],

        legend: {
            position: "bottom"
        }
    };

    const chart_element = document.querySelector("#apex-test-chart");

    const chart = new ApexCharts(
        chart_element,
        chart_options
    );

    chart.render();
};
