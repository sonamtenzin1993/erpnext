(function () {

    console.log("Apex Dashboard Renderer loading...");

    window.ApexDashboardRenderer = {

        render: function (container, config) {

            console.log("Apex Dashboard Renderer started");
            console.log("Config:", config);
            console.log("Chart type:", config.type);
            console.log("Chart data:", config.data);
            console.log("Chart colors:", config.colors);

            /*
             * =====================================================
             * NORMALIZE CHART TYPE
             * =====================================================
             */

            const chartType =
                String(config.type || "bar").toLowerCase();

            console.log(
                "Normalized chart type:",
                chartType
            );

            /*
             * =====================================================
             * CHECK CONTAINER
             * =====================================================
             */

            if (!container) {

                console.error(
                    "ApexCharts container not found"
                );

                return;
            }

            /*
             * =====================================================
             * CHECK APEXCHARTS
             * =====================================================
             */

            if (
                typeof window.ApexCharts ===
                "undefined"
            ) {

                console.error(
                    "ApexCharts library is not loaded"
                );

                return;
            }

            /*
             * =====================================================
             * CLEAR CONTAINER
             * =====================================================
             */

            container.innerHTML = "";

            const chart_element =
                document.createElement("div");

            chart_element.style.width =
                "100%";

            chart_element.style.height =
                (config.height || 500) + "px";

            container.appendChild(
                chart_element
            );

            let series = [];
            let labels = [];

            /*
             * =====================================================
             * GET DATA FROM FRAPPE DASHBOARD CHART
             * =====================================================
             */

            if (config.data) {

                console.log(
                    "Frappe chart data:",
                    config.data
                );

                labels =
                    config.data.labels || [];

                /*
                 * =================================================
                 * DATASETS FORMAT
                 * =================================================
                 *
                 * datasets: [
                 *     {
                 *         name: "Total",
                 *         values: [10, 20, 30]
                 *     }
                 * ]
                 *
                 */

                if (
                    config.data.datasets &&
                    config.data.datasets.length
                ) {

                    series =
                        config.data.datasets.map(
                            dataset => {

                                return {
                                    name:
                                        dataset.name ||
                                        "Value",

                                    data:
                                        dataset.values ||
                                        []
                                };

                            }
                        );

                }

                /*
                 * =================================================
                 * SIMPLE VALUES FORMAT
                 * =================================================
                 *
                 * {
                 *     labels: [],
                 *     values: []
                 * }
                 *
                 */

                else if (
                    config.data.values
                ) {

                    series = [
                        {
                            name: "Value",

                            data:
                                config.data.values
                        }
                    ];

                }

            }

            /*
             * =====================================================
             * FALLBACK SERIES
             * =====================================================
             */

            if (
                !series.length &&
                config.series
            ) {

                series =
                    config.series;

            }

            /*
             * =====================================================
             * FALLBACK LABELS
             * =====================================================
             */

            if (
                !labels.length &&
                config.labels
            ) {

                labels =
                    config.labels;

            }

            /*
             * =====================================================
             * PIE / DONUT
             * =====================================================
             */

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                /*
                 * ApexCharts Pie/Donut expects:
                 *
                 * series: [10, 20, 30]
                 *
                 * NOT:
                 *
                 * series: [
                 *     {
                 *         name: "Value",
                 *         data: [10,20,30]
                 *     }
                 * ]
                 */

                if (
                    config.data &&
                    config.data.datasets &&
                    config.data.datasets.length
                ) {

                    series =
                        config.data
                            .datasets[0]
                            .values || [];

                }

                else if (
                    config.data &&
                    config.data.values
                ) {

                    series =
                        config.data.values;

                }

            }

            /*
             * =====================================================
             * BAR / LINE / AREA
             * =====================================================
             */

            else {

                /*
                 * ApexCharts Cartesian charts expect:
                 *
                 * series: [
                 *     {
                 *         name: "Total",
                 *         data: [...]
                 *     }
                 * ]
                 */

                if (
                    Array.isArray(series) &&
                    series.length &&
                    typeof series[0] !==
                        "object"
                ) {

                    series = [
                        {
                            name: "Value",

                            data: series
                        }
                    ];

                }

            }

            /*
 * =====================================================
 * GROUP PIE CHART BY TITLE
 * =====================================================
 */

if (
    chartType === "pie" ||
    chartType === "donut"
) {

    const grouped = {};

    labels.forEach(
        (label, index) => {

            if (!label) {
                return;
            }

            const value =
                Number(series[index] || 0);

            if (
                grouped[label] === undefined
            ) {

                grouped[label] = 0;

            }

            grouped[label] += value;
        }
    );

    labels =
        Object.keys(grouped);

    series =
        labels.map(
            label => grouped[label]
        );

    console.log(
        "Grouped labels:",
        labels
    );

    console.log(
        "Grouped series:",
        series
    );
}

            /*
             * =====================================================
             * DEBUG DATA
             * =====================================================
             */

            console.log(
                "Apex labels:",
                labels
            );

            console.log(
                "Apex series:",
                series
            );

            /*
             * =====================================================
             * APEXCHARTS OPTIONS
             * =====================================================
             */

            const options = {

                /*
                 * =================================================
                 * CHART
                 * =================================================
                 */

                // chart: {

                //     type:
                //         chartType,
                //     height:
                //         config.height || 500,

                //     toolbar: {
                //         show: false
                //     }

                // },
                chart: {

    type: chartType,

    height: config.height || 500,

    toolbar: {
        show: false
    },

    events: {

    dataPointSelection: function (
        event,
        chartContext,
        chartConfig
    ) {

        // Only handle pie/donut
        if (
            chartType !== "pie" &&
            chartType !== "donut"
        ) {
            return;
        }

        // Get clicked slice index
        const index =
            chartConfig.dataPointIndex;

        if (index < 0) {
            return;
        }

        // Get label from renderer variables
        const label =
            labels[index];

        // Get value from renderer variables
        const value =
            series[index];

        console.log(
            "========== PIE CLICK =========="
        );

        console.log(
            "Index:",
            index
        );

        console.log(
            "Label:",
            label
        );

        console.log(
            "Value:",
            value
        );

        // Get click configuration
        // const clickAction =
        //     config.clickAction;

        // if (!clickAction) {

        //     console.log(
        //         "No clickAction configured"
        //     );

        //     return;
        // }

        // =====================================================
        // OPEN LEADERSHIP ARCHIVAL SCRIPT REPORT
        // =====================================================

        // =====================================================
// DYNAMIC REPORT CLICK
// =====================================================

const clickAction = config.clickAction;

if (!clickAction) {
    console.log("No clickAction configured");
    return;
}

console.log(
    "Click Action:",
    clickAction
);
if (clickAction.type === "report") {

    const reportName =
        clickAction.report;

    const filterField =
        clickAction.field;

    const filterValue =
        clickAction.values
            ? clickAction.values[index]
            : label;

    console.log(
        "Opening Report:",
        reportName
    );

    console.log(
        "Filter:",
        filterField,
        "=",
        filterValue
    );

    // Open the report first
    frappe.set_route(
        "query-report",
        reportName
    );

    // Wait for the Query Report to load
    setTimeout(() => {

        if (!frappe.query_report) {

            console.error(
                "frappe.query_report not available"
            );

            return;
        }

        console.log(
            "Applying filter:",
            filterField,
            "=",
            filterValue
        );

        // Apply clicked group as report filter
        frappe.query_report.set_filter_value(
            filterField,
            filterValue
        );

        // Refresh report using the filter
        frappe.query_report.refresh();

    }, 1000);

    return;
}



        console.log(
            "Click Action:",
            clickAction
        );

        // Get database filter value
        const filterValue =
            clickAction.values
                ? clickAction.values[index]
                : label;

        // console.log(
        //     "Filter Value:",
        //     filterValue
        // );

        // // ==========================================
        // // OPEN LIST
        // // ==========================================

        // if (
        //     clickAction.type === "list"
        // ) {

        //     console.log(
        //         "Opening DocType:",
        //         clickAction.doctype
        //     );

        //     console.log(
        //         "Filter:",
        //         clickAction.field,
        //         "=",
        //         filterValue
        //     );

        //     frappe.set_route(
        //         "List",
        //         clickAction.doctype,
        //         "List",
        //         {
        //             [clickAction.field]:
        //                 filterValue
        //         }
        //     );

        //     return;
        // }

        // // ==========================================
        // // OPEN QUERY REPORT
        // // ==========================================

        // if (
        //     clickAction.type === "report"
        // ) {

        //     console.log(
        //         "Opening Report:",
        //         clickAction.report
        //     );

        //     console.log(
        //         "Filter:",
        //         clickAction.field,
        //         "=",
        //         filterValue
        //     );

        //     frappe.set_route(
        //         "query-report",
        //         clickAction.report,
        //         {
        //             [clickAction.field]:
        //                 filterValue
        //         }
        //     );

        //     return;
        // }

    }

},

},
                /*
                 * =================================================
                 * SERIES
                 * =================================================
                 */

                series:
                    series,

                /*
                 * =================================================
                 * LABELS
                 * =================================================
                 */

                labels:
                    labels,

                /*
                 * =================================================
                 * COLORS
                 * =================================================
                 */

                colors:

                    Array.isArray(
                        config.colors
                    ) &&
                    config.colors.length

                        ? config.colors.filter(
                            color =>
                                typeof color ===
                                    "string" &&
                                color.trim()
                        )

                        : [

                            "#F683AE",
                            "#318AD8",
                            "#48BB74",
                            "#FFA500",
                            "#8B0000",
                            "#6A5ACD",
                            "#20B2AA",
                            "#D2691E"
                        ],

                /*
                 * =================================================
                 * WHITE PIE / DONUT BORDER
                 * =================================================
                 */

                stroke: {
                    // show: false
                    show: chartType === "line",
                            width: chartType === "line" ? 3 : 0,
                            curve:"straight"
                },

                /*
                 * =================================================
                 * X AXIS
                 * =================================================
                 */

                xaxis: {

                    categories:
                        labels

                },

                /*
                 * =================================================
                 * DATA LABELS
                 * =================================================
                 */

                dataLabels: {

                    enabled:
                        config.dataLabels !== false

                },

                /*
                 * =================================================
                 * LEGEND
                 * =================================================
                 */

                legend: {

                    show:
                        config.legend !== false,

                    position:
                        config.legendPosition ||
                        "right"

                },

                /*
                 * =================================================
                 * TOOLTIP
                 * =================================================
                 */

                tooltip: {

                    enabled: true

                }

            };

            /*
             * =====================================================
             * BAR
             * =====================================================
             */

            if (
    chartType === "bar"
) {

    options.plotOptions = {

        bar: {

            horizontal: false,

            columnWidth:
                "55%",

            borderRadius: 1

        }

    };

}

            /*
             * =====================================================
             * PIE
             * =====================================================
             */

            if (
                chartType === "pie"
            ) {

                options.chart.type =
                    "pie";

            }

            /*
             * =====================================================
             * DONUT
             * =====================================================
             */

            if (
                chartType === "donut"
            ) {

                options.chart.type =
                    "donut";

            }

            /*
             * =====================================================
             * DEBUG FINAL OPTIONS
             * =====================================================
             */

            console.log(
                "ApexCharts final options:",
                options
            );

            /*
             * =====================================================
             * CREATE APEXCHART
             * =====================================================
             */

            const chart =
                new window.ApexCharts(
                    chart_element,
                    options
                );

            /*
             * =====================================================
             * RENDER
             * =====================================================
             */

            chart.render();

            return chart;

        }

    };

    /*
     * =========================================================
     * LOADED
     * =========================================================
     */

    console.log(
        "Apex Dashboard Renderer loaded"
    );

    console.log(
        "Tested"
    );

})();