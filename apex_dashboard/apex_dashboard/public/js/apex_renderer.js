(function () {


    window.ApexDashboardRenderer = {

        render: function (container, config) {
            /*
             * =====================================================
             * NORMALIZE CHART TYPE
             * =====================================================
             */

            const chartType =
                String(
                    config.type || "bar"
                ).toLowerCase();


            /*
             * =====================================================
             * CHECK CONTAINER
             * =====================================================
             */

            if (!container) {

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

                return;
            }


            /*
             * =====================================================
             * CLEAR CONTAINER
             * =====================================================
             */

            container.innerHTML = "";


            /*
             * =====================================================
             * CREATE CHART ELEMENT
             * =====================================================
             */

            const chart_element =
                document.createElement("div");

            chart_element.style.width =
                "100%";

            chart_element.style.height =
                (config.height || 500) + "px";

            container.appendChild(
                chart_element
            );


            /*
             * =====================================================
             * INITIAL DATA
             * =====================================================
             */

            let series = [];

            let labels = [];


            /*
             * =====================================================
             * GET DATA FROM FRAPPE DASHBOARD CHART
             * =====================================================
             */

            if (config.data) {


                /*
                 * =================================================
                 * LABELS
                 * =================================================
                 */

                labels =
                    config.data.labels || [];


                /*
                 * =================================================
                 * DATASETS FORMAT
                 * =================================================
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
                 */

                else if (
                    config.data.values
                ) {

                    series = [

                        {

                            name:
                                "Value",

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
             *
             * IMPORTANT:
             *
             * The Script Report returns individual records.
             *
             * Example:
             *
             * Red Scarf
             * Red Scarf
             * White Scarf
             * Red Scarf
             * Lungmar Scarf
             *
             * Frappe is currently generating incorrect chart
             * values such as:
             *
             * [4, 4, 0, 0, 0, ...]
             *
             * Therefore, for PIE/DONUT we DO NOT use
             * Frappe's dataset values.
             *
             * Instead:
             *
             * EACH REPORT RECORD = 1
             *
             * Then the grouping code below counts records
             * for each title.
             *
             * =====================================================
             */

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                /*
                 * Create one value for every report record.
                 */

                series =
                    labels.map(
                        () => 1
                    );
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

                            name:
                                "Value",

                            data:
                                series

                        }

                    ];

                }

            }


            /*
             * =====================================================
             * DEBUG BEFORE GROUPING
             * =====================================================
             */

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

            }


            /*
             * =====================================================
             * GROUP PIE / DONUT BY LABEL
             * =====================================================
             *
             * Example:
             *
             * Red Scarf
             * Red Scarf
             * White Scarf
             * Red Scarf
             *
             * becomes:
             *
             * Red Scarf      3
             * White Scarf    1
             *
             * =====================================================
             */

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                const grouped = {};


                /*
                 * Loop through every individual record.
                 */

                labels.forEach(
                    (label, index) => {

                        /*
                         * Ignore empty labels.
                         */

                        if (
                            label === undefined ||
                            label === null ||
                            String(label).trim() === ""
                        ) {

                            return;

                        }


                        /*
                         * Each report row is ONE record.
                         *
                         * Therefore its value is 1.
                         */

                        const value =
                            Number(
                                series[index]
                            ) || 0;


                        /*
                         * Create group if
                         * it does not exist.
                         */

                        if (
                            grouped[label] === undefined
                        ) {

                            grouped[label] = 0;

                        }


                        /*
                         * Add record to group.
                         */

                        grouped[label] +=
                            value;

                    }
                );


                /*
                 * Replace labels with
                 * grouped labels.
                 */

                labels =
                    Object.keys(
                        grouped
                    );


                /*
                 * Replace series with
                 * grouped totals.
                 */

                series =
                    labels.map(
                        label =>
                            grouped[label]
                    );


                /*
                 * =================================================
                 * DEBUG AFTER GROUPING
                 * =================================================
                 */
            }


            /*
             * =====================================================
             * FINAL DEBUG DATA
             * =====================================================
             */



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

                chart: {

                    type:
                        chartType,

                    height:
                        config.height || 500,

                    toolbar: {

                        show:
                            false

                    },


                    /*
                     * =================================================
                     * CLICK EVENT
                     * =================================================
                     */

                    events: {

                        dataPointSelection:
                            function (
                                event,
                                chartContext,
                                chartConfig
                            ) {


                                /*
                                 * Only handle
                                 * PIE/DONUT.
                                 */

                                if (
                                    chartType !== "pie" &&
                                    chartType !== "donut"
                                ) {

                                    return;

                                }


                                /*
                                 * Get clicked
                                 * slice index.
                                 */

                                const index =
                                    chartConfig
                                        .dataPointIndex;


                                if (
                                    index < 0
                                ) {

                                    return;

                                }


                                /*
                                 * Get clicked label.
                                 */

                                const label =
                                    labels[index];


                                /*
                                 * Get clicked value.
                                 */

                                const value =
                                    series[index];
                                /*
                                 * =================================================
                                 * CLICK ACTION
                                 * =================================================
                                 */

                                const clickAction =
                                    config.clickAction;


                                if (!clickAction) {
                                    return;

                                }
                                /*
                                 * =================================================
                                 * REPORT CLICK
                                 * =================================================
                                 */

                                if (
                                    clickAction.type ===
                                    "report"
                                ) {

                                    const reportName =
                                        clickAction.report;


                                    const filterField =
                                        clickAction.field;


                                    /*
                                     * If explicit values
                                     * are provided, use them.
                                     *
                                     * Otherwise use
                                     * clicked label.
                                     */

                                    const filterValue =
                                        clickAction.values
                                            ? clickAction.values[index]
                                            : label;
                                    /*
                                     * Open report.
                                     */

                                    frappe.set_route(
                                        "query-report",
                                        reportName
                                    );


                                    /*
                                     * Wait for Query Report
                                     * to load.
                                     */

                                    setTimeout(
                                        () => {

                                            if (
                                                !frappe.query_report
                                            ) {
                                                return;

                                            }


                                            /*
                                             * Apply filter.
                                             */

                                            frappe.query_report
                                                .set_filter_value(
                                                    filterField,
                                                    filterValue
                                                );


                                            /*
                                             * Refresh report.
                                             */

                                            frappe.query_report
                                                .refresh();

                                        },
                                        1000
                                    );


                                    return;

                                }


                                /*
                                 * =================================================
                                 * LIST CLICK
                                 * =================================================
                                 */

                                if (
                                    clickAction.type ===
                                    "list"
                                ) {

                                    const filterValue =
                                        clickAction.values
                                            ? clickAction.values[index]
                                            : label;
                                    frappe.set_route(
                                        "List",
                                        clickAction.doctype,
                                        "List",
                                        {

                                            [
                                                clickAction.field
                                            ]:
                                                filterValue

                                        }
                                    );


                                    return;

                                }


                                /*
                                 * =================================================
                                 * UNKNOWN ACTION
                                 * =================================================
                                 */
                            }

                    }

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
                 * PIE / DONUT BORDER
                 * =================================================
                 *
                 * No border for PIE/DONUT.
                 *
                 * LINE gets width 3.
                 *
                 */

                stroke: {

                    show:
                        chartType === "line",

                    width:
                        chartType === "line"
                            ? 3
                            : 0,

                    curve:
                        "straight"

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

                    enabled:
                        true

                }

            };


            /*
             * =====================================================
             * BAR CHART
             * =====================================================
             */

            if (
                chartType === "bar"
            ) {

                options.plotOptions = {

                    bar: {

                        /*
                         * Vertical bar chart.
                         */

                        horizontal:
                            false,

                        columnWidth:
                            "55%",

                        borderRadius:
                            1

                    }

                };

            }


            /*
             * =====================================================
             * PIE CHART
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
             * DONUT CHART
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


            /*
             * =====================================================
             * RETURN CHART
             * =====================================================
             */

            return chart;

        }

    };

})();