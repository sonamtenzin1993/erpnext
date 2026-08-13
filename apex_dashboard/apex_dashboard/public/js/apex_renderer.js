(function () {

    console.log("Apex Dashboard Renderer loading...");

    window.ApexDashboardRenderer = {

        render: function (container, config) {

            console.log("Apex Dashboard Renderer started");
            console.log("Config:", config);
            console.log("Chart type:", config.type);
            console.log("Chart data:", config.data);
            console.log("Chart colors:", config.colors);

            if (!container) {
                console.error("ApexCharts container not found");
                return;
            }

            if (typeof window.ApexCharts === "undefined") {
                console.error("ApexCharts library is not loaded");
                return;
            }

            container.innerHTML = "";

            const chart_element = document.createElement("div");

            chart_element.style.width = "100%";
            chart_element.style.height =
                (config.height || 400) + "px";

            container.appendChild(chart_element);

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

                labels = config.data.labels || [];

                /*
                 * Frappe format:
                 *
                 * datasets: [
                 *     {
                 *         name: "Total",
                 *         values: [10, 20, 30]
                 *     }
                 * ]
                 */

                if (
                    config.data.datasets &&
                    config.data.datasets.length
                ) {

                    series = config.data.datasets.map(
                        dataset => {

                            return {
                                name: dataset.name || "Value",
                                data: dataset.values || []
                            };

                        }
                    );

                }

                /*
                 * Alternative format:
                 *
                 * {
                 *     labels: [],
                 *     values: []
                 * }
                 */

                else if (config.data.values) {

                    series = [
                        {
                            name: "Value",
                            data: config.data.values
                        }
                    ];

                }
            }

            /*
             * =====================================================
             * FALLBACK
             * =====================================================
             */

            if (!series.length && config.series) {
                series = config.series;
            }

            if (!labels.length && config.labels) {
                labels = config.labels;
            }

            /*
             * =====================================================
             * PIE / DONUT
             * =====================================================
             */

            if (
                config.type === "pie" ||
                config.type === "donut"
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
                        config.data.datasets[0].values || [];

                }

                else if (
                    config.data &&
                    config.data.values
                ) {

                    series = config.data.values;

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
                    typeof series[0] !== "object"
                ) {

                    series = [
                        {
                            name: "Value",
                            data: series
                        }
                    ];

                }

            }

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

                chart: {
                    type: config.type || "bar",
                    height: config.height || 400,

                    toolbar: {
                        show: true
                    }
                },

                series: series,

                labels: labels,

                colors:
                    Array.isArray(config.colors) &&
                    config.colors.length
                        ? config.colors.filter(
                            color =>
                                typeof color === "string" &&
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
                 * X AXIS
                 * =================================================
                 */

                xaxis: {
                    categories: labels
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
                        config.legendPosition || "right"
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
             * DONUT
             * =====================================================
             */

            if (config.type === "donut") {
                options.chart.type = "donut";
            }

            /*
             * =====================================================
             * PIE
             * =====================================================
             */

            if (config.type === "pie") {
                options.chart.type = "pie";
            }

            /*
             * =====================================================
             * BAR
             * =====================================================
             */

            if (config.type === "bar") {

                options.plotOptions = {

                    bar: {

                        horizontal:
                            config.horizontal === true,

                        columnWidth: "55%",

                        borderRadius: 4

                    }

                };

            }

            console.log(
                "ApexCharts final options:",
                options
            );

            /*
             * =====================================================
             * CREATE CHART
             * =====================================================
             */

            const chart =
                new window.ApexCharts(
                    chart_element,
                    options
                );

            chart.render();

            return chart;

        }

    };

    console.log(
        "Apex Dashboard Renderer loaded"
    );

    console.log(
        "Tested"
    );
    

})();