(function () {

    "use strict";


    // =============================================================
    // APEX DASHBOARD RENDERER
    // ERPNext / Frappe v15
    // =============================================================

    window.ApexDashboardRenderer = {

        render: function (container, config) {

            // =========================================================
            // NORMALIZE CONFIG FIRST
            // =========================================================

            config = config || {};
            // =========================================================
            // CHART TYPE
            // =========================================================

            const chartType =
                String(
                    config.type || "bar"
                ).toLowerCase();


            // =========================================================
            // CHECK CONTAINER
            // =========================================================

            if (!container) {

                console.error(
                    "[Apex Dashboard] Container not found."
                );

                return;
            }


            // =========================================================
            // CHECK APEXCHARTS
            // =========================================================

            if (
                typeof window.ApexCharts === "undefined"
            ) {

                console.error(
                    "[Apex Dashboard] ApexCharts is not loaded."
                );

                return;
            }


            // =========================================================
            // CLEAR EXISTING CONTENT
            // =========================================================

            container.innerHTML = "";


            // =========================================================
            // CREATE CHART ELEMENT
            // =========================================================

            const chartElement =
                document.createElement("div");

            chartElement.style.width =
                "100%";

            chartElement.style.height =
                String(
                    config.height || 500
                ) + "px";
            
            chartElement.style.overscrollBehavior =
                "auto";

            chartElement.style.touchAction =
                "pan-y";

            container.appendChild(
                chartElement
            );

            // =========================================================
            // ALLOW PAGE/DASHBOARD SCROLL THROUGH APEX CHART
            // =========================================================
            //
            // ApexCharts can capture mouse-wheel events, especially
            // on line/area charts. This manually passes vertical
            // scrolling to the nearest scrollable dashboard container.
            //

            function getScrollableParent(element) {

                let parent =
                    element.parentElement;

                while (parent) {

                    const style =
                        window.getComputedStyle(parent);

                    const overflowY =
                        style.overflowY;

                    const canScroll =
                        (
                            (overflowY === "auto" ||
                            overflowY === "scroll" ||
                            overflowY === "overlay")
                            &&
                            parent.scrollHeight > parent.clientHeight
                        );

                    if (canScroll) {

                        return parent;
                    }

                    parent =
                        parent.parentElement;
                }

                return null;
            }


    chartElement.addEventListener(
        "wheel",
        function (event) {

            // Only handle vertical scrolling
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
                return;
            }

            const scrollParent =
                getScrollableParent(chartElement);

            if (scrollParent) {

                scrollParent.scrollTop +=
                    event.deltaY;

                event.preventDefault();

                return;
            }

            // Fallback: scroll the browser window
            window.scrollBy(
                0,
                event.deltaY
            );

            event.preventDefault();

        },
        {
            passive: false,
            capture: true
        }
    );


            // =========================================================
            // INITIAL DATA
            // =========================================================

            let series = [];

            let labels = [];


            // =========================================================
            // READ LABELS
            // =========================================================

            if (
                config.data &&
                Array.isArray(
                    config.data.labels
                )
            ) {

                labels =
                    config.data.labels.slice();

            }
            else if (
                Array.isArray(
                    config.labels
                )
            ) {

                labels =
                    config.labels.slice();
            }


            // =========================================================
            // READ DATASETS
            // =========================================================

            if (
                config.data &&
                Array.isArray(
                    config.data.datasets
                ) &&
                config.data.datasets.length
            ) {

                series =
                    config.data.datasets.map(
                        function (
                            dataset,
                            datasetIndex
                        ) {

                            dataset =
                                dataset || {};
                            let values = [];


                            // =================================================
                            // FRAPPE FORMAT
                            // =================================================

                            if (
                                Array.isArray(
                                    dataset.values
                                )
                            ) {

                                values =
                                    dataset.values.slice();
                            }


                            // =================================================
                            // APEX FORMAT
                            // =================================================

                            else if (
                                Array.isArray(
                                    dataset.data
                                )
                            ) {

                                values =
                                    dataset.data.slice();
                            }


                            // =================================================
                            // OBJECT VALUES
                            // =================================================

                            else if (
                                dataset.values &&
                                typeof dataset.values === "object"
                            ) {

                                values =
                                    Object.values(
                                        dataset.values
                                    );
                            }


                            // =================================================
                            // OBJECT DATA
                            // =================================================

                            else if (
                                dataset.data &&
                                typeof dataset.data === "object"
                            ) {

                                values =
                                    Object.values(
                                        dataset.data
                                    );
                            }


                            // =================================================
                            // SINGLE VALUE
                            // =================================================

                            else if (
                                dataset.value !== undefined &&
                                dataset.value !== null
                            ) {

                                values = [
                                    dataset.value
                                ];
                            }

                            return {

                                name:
                                    dataset.name ||
                                    dataset.label ||
                                    "Value",

                                data:
                                    values

                            };

                        }
                    );
            }


            // =========================================================
            // SIMPLE DATA.VALUES
            // =========================================================

            else if (
                config.data &&
                Array.isArray(
                    config.data.values
                )
            ) {

                series = [
                    {
                        name:
                            "Value",

                        data:
                            config.data.values.slice()
                    }
                ];
            }


            // =========================================================
            // SIMPLE DATA.DATA
            // =========================================================

            else if (
                config.data &&
                Array.isArray(
                    config.data.data
                )
            ) {

                series = [
                    {
                        name:
                            "Value",

                        data:
                            config.data.data.slice()
                    }
                ];
            }


            // =========================================================
            // FALLBACK SERIES
            // =========================================================

            if (
                !series.length &&
                Array.isArray(
                    config.series
                )
            ) {

                series =
                    config.series.slice();
            }


            // =========================================================
            // FALLBACK LABELS
            // =========================================================

            if (
                !labels.length &&
                Array.isArray(
                    config.labels
                )
            ) {

                labels =
                    config.labels.slice();
            }


            // =========================================================
            // NORMALIZE SERIES
            // =========================================================

            if (
                !Array.isArray(series)
            ) {

                series = [];
            }


            // =========================================================
            // CARTESIAN CHARTS
            // bar / line / area
            // =========================================================

            if (
                chartType !== "pie" &&
                chartType !== "donut"
            ) {

                // -----------------------------------------------------
                // Convert simple numeric array
                // -----------------------------------------------------

                if (
                    series.length &&
                    typeof series[0] !== "object"
                ) {

                    series = [
                        {
                            name:
                                "Value",

                            data:
                                series.slice()
                        }
                    ];
                }


                // -----------------------------------------------------
                // Normalize each dataset
                // -----------------------------------------------------

                series =
                    series.map(
                        function (item) {

                            if (
                                item &&
                                typeof item === "object"
                            ) {

                                let itemData =
                                    item.data;


                                if (
                                    !Array.isArray(
                                        itemData
                                    )
                                ) {

                                    if (
                                        Array.isArray(
                                            item.values
                                        )
                                    ) {

                                        itemData =
                                            item.values.slice();

                                    }
                                    else {

                                        itemData = [];
                                    }
                                }


                                return {

                                    name:
                                        item.name ||
                                        item.label ||
                                        "Value",

                                    data:
                                        itemData

                                };
                            }


                            return {

                                name:
                                    "Value",

                                data:
                                    [item]

                            };

                        }
                    );
            }


            // =========================================================
            // PIE / DONUT
            //
            // IMPORTANT:
            //
            // Your reports return RAW RECORDS.
            //
            // Example:
            //
            // labels:
            //
            // Gold
            // Gold
            // Gold
            // Silver
            // Silver
            //
            // We therefore COUNT labels.
            //
            // We DO NOT use the supplied values for grouping because
            // those values are not aligned with the raw labels.
            // =========================================================

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                // =====================================================
                // COUNT EACH LABEL
                // =====================================================

                const counts =
                    Object.create(null);


                labels.forEach(
                    function (label) {

                        if (
                            label === undefined ||
                            label === null
                        ) {

                            return;
                        }


                        const cleanLabel =
                            String(label).trim();


                        if (!cleanLabel) {

                            return;
                        }


                        if (
                            counts[cleanLabel] === undefined
                        ) {

                            counts[cleanLabel] = 0;
                        }


                        counts[cleanLabel] += 1;

                    }
                );


                // =====================================================
                // UNIQUE LABELS
                // =====================================================

                const uniqueLabels =
                    Object.keys(counts);


                // =====================================================
                // GROUPED VALUES
                // =====================================================

                let groupedLabels =
                    uniqueLabels.slice();


                let groupedValues =
                    groupedLabels.map(
                        function (label) {

                            return counts[label];

                        }
                    );

                // =====================================================
                // REMOVE ZERO VALUES
                //
                // Normally count values cannot be zero, but this keeps
                // the chart clean.
                // =====================================================

                const filteredLabels = [];

                const filteredValues = [];


                groupedLabels.forEach(
                    function (
                        label,
                        index
                    ) {

                        const value =
                            Number(
                                groupedValues[index]
                            );


                        if (
                            Number.isFinite(value) &&
                            value > 0
                        ) {

                            filteredLabels.push(
                                label
                            );

                            filteredValues.push(
                                value
                            );
                        }

                    }
                );


                groupedLabels =
                    filteredLabels;

                groupedValues =
                    filteredValues;


                // =====================================================
                // MAX SLICES
                //
                // If maxSlices is 6 and there are 8 categories:
                //
                // first 6 are shown
                // remaining 2 become "Other"
                // =====================================================

                const maxSlices =
                    Number(
                        config.maxSlices
                    );


                if (
                    Number.isFinite(maxSlices) &&
                    maxSlices > 0 &&
                    groupedLabels.length > maxSlices
                ) {

                    const limitedLabels =
                        groupedLabels.slice(
                            0,
                            maxSlices
                        );

                    const limitedValues =
                        groupedValues.slice(
                            0,
                            maxSlices
                        );


                    const otherValue =
                        groupedValues
                            .slice(maxSlices)
                            .reduce(
                                function (
                                    total,
                                    value
                                ) {

                                    return (
                                        total +
                                        Number(value || 0)
                                    );

                                },
                                0
                            );


                    if (
                        otherValue > 0
                    ) {

                        limitedLabels.push(
                            "Other"
                        );

                        limitedValues.push(
                            otherValue
                        );
                    }


                    groupedLabels =
                        limitedLabels;

                    groupedValues =
                        limitedValues;
                }


                // =====================================================
                // ASSIGN FINAL PIE DATA
                // =====================================================

                labels =
                    groupedLabels;

                series =
                    groupedValues;


                // =====================================================
                // FINAL PIE DEBUG
                // =====================================================
            }

            // =========================================================
            // GLOBAL CONFERRED BY
            // =========================================================

            function getGlobalConferredBy() {

                const element =
                    document.querySelector(
                        "#leadership-conferred-by"
                    );


                if (!element) {

                    return null;
                }


                const value =
                    element.value;


                if (
                    !value ||
                    value === "All"
                ) {

                    return null;
                }


                return value;
            }


            // =========================================================
            // OPEN NEW TAB
            // =========================================================

            function openInNewTab(url) {

                const newWindow =
                    window.open(
                        url,
                        "_blank"
                    );


                if (!newWindow) {

                    console.warn(
                        "[Apex Dashboard] Browser blocked the new tab."
                    );

                    return;
                }


                try {

                    newWindow.opener =
                        null;

                }
                catch (e) {

                    console.warn(
                        "[Apex Dashboard] Could not clear opener.",
                        e
                    );
                }
            }


            // =========================================================
            // OPEN REPORT
            // =========================================================

            function openReport(
                reportName,
                filters
            ) {

                if (!reportName) {

                    console.error(
                        "[Apex Dashboard] Report name is missing."
                    );

                    return;
                }


                const params =
                    new URLSearchParams();


                Object.keys(
                    filters || {}
                ).forEach(
                    function (field) {

                        const value =
                            filters[field];


                        if (
                            value !== undefined &&
                            value !== null &&
                            String(value).trim() !== ""
                        ) {

                            params.set(
                                field,
                                String(value)
                            );
                        }

                    }
                );


                let reportUrl =
                    "/app/query-report/" +
                    encodeURIComponent(
                        reportName
                    );


                const queryString =
                    params.toString();


                if (queryString) {

                    reportUrl +=
                        "?" +
                        queryString;
                }
                openInNewTab(
                    reportUrl
                );
            }


            // =========================================================
            // OPEN LIST
            // =========================================================

            function openList(
                doctype,
                field,
                value
            ) {

                if (!doctype) {

                    console.error(
                        "[Apex Dashboard] Doctype is missing."
                    );

                    return;
                }


                if (!field) {

                    console.error(
                        "[Apex Dashboard] List field is missing."
                    );

                    return;
                }


                const filters = {};


                filters[field] =
                    value;


                // -----------------------------------------------------
                // GLOBAL CONFERRED BY
                // -----------------------------------------------------

                const conferredBy =
                    getGlobalConferredBy();


                if (conferredBy) {

                    filters.conferred_by =
                        conferredBy;
                }


                const params =
                    new URLSearchParams();


                Object.keys(
                    filters
                ).forEach(
                    function (key) {

                        const filterValue =
                            filters[key];


                        if (
                            filterValue !== undefined &&
                            filterValue !== null &&
                            String(filterValue).trim() !== ""
                        ) {

                            params.set(
                                key,
                                String(filterValue)
                            );
                        }

                    }
                );


                // =====================================================
                // DOCTYPE SLUG
                // =====================================================

                let doctypeSlug;


                if (
                    window.frappe &&
                    frappe.router &&
                    typeof frappe.router.slug === "function"
                ) {

                    doctypeSlug =
                        frappe.router.slug(
                            doctype
                        );

                }
                else {

                    doctypeSlug =
                        String(
                            doctype
                        )
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-+|-+$/g,
                                ""
                            );
                }


                let listUrl =
                    "/app/" +
                    doctypeSlug;


                const queryString =
                    params.toString();


                if (queryString) {

                    listUrl +=
                        "?" +
                        queryString;
                }
                openInNewTab(
                    listUrl
                );
            }


            // =========================================================
            // GET CLICK VALUE
            // =========================================================

            function getClickValue(
                index
            ) {

                if (
                    index === undefined ||
                    index === null ||
                    index < 0
                ) {

                    return null;
                }


                const clickAction =
                    config.clickAction;


                // -----------------------------------------------------
                // Explicit click values
                // -----------------------------------------------------

                if (
                    clickAction &&
                    Array.isArray(
                        clickAction.values
                    ) &&
                    clickAction.values[index] !== undefined
                ) {

                    return clickAction.values[index];
                }


                // -----------------------------------------------------
                // Pie / donut
                //
                // After grouping, labels[index] is the actual category.
                // -----------------------------------------------------

                if (
                    chartType === "pie" ||
                    chartType === "donut"
                ) {

                    return labels[index];
                }


                // -----------------------------------------------------
                // Normal chart
                // -----------------------------------------------------

                return labels[index];
            }


            // =========================================================
            // REPORT CLICK
            // =========================================================

            function handleReportClick(
                index
            ) {

                const clickAction =
                    config.clickAction;


                if (!clickAction) {
                    return;
                }


                if (
                    clickAction.type !== "report"
                ) {

                    return;
                }


                const reportName =
                    clickAction.report;


                const filterField =
                    clickAction.field;


                if (!reportName) {

                    console.error(
                        "[Apex Dashboard] Report name missing."
                    );

                    return;
                }


                if (!filterField) {

                    console.error(
                        "[Apex Dashboard] Report filter field missing."
                    );

                    return;
                }


                const filterValue =
                    getClickValue(
                        index
                    );


                if (
                    filterValue === undefined ||
                    filterValue === null ||
                    String(filterValue).trim() === ""
                ) {

                    console.warn(
                        "[Apex Dashboard] Click value is empty."
                    );

                    return;
                }


                const filters = {};


                filters[
                    filterField
                ] =
                    filterValue;


                // -----------------------------------------------------
                // Global Conferred By
                // -----------------------------------------------------

                const conferredBy =
                    getGlobalConferredBy();


                if (conferredBy) {

                    filters.conferred_by =
                        conferredBy;
                }
                openReport(
                    reportName,
                    filters
                );
            }


            // =========================================================
            // LIST CLICK
            // =========================================================

            function handleListClick(
                index
            ) {

                const clickAction =
                    config.clickAction;


                if (!clickAction) {
                    return;
                }


                if (
                    clickAction.type !== "list"
                ) {

                    return;
                }


                const doctype =
                    clickAction.doctype;


                const field =
                    clickAction.field;


                if (!doctype) {

                    console.error(
                        "[Apex Dashboard] List doctype missing."
                    );

                    return;
                }


                if (!field) {

                    console.error(
                        "[Apex Dashboard] List field missing."
                    );

                    return;
                }


                const filterValue =
                    getClickValue(
                        index
                    );


                if (
                    filterValue === undefined ||
                    filterValue === null ||
                    String(filterValue).trim() === ""
                ) {

                    console.warn(
                        "[Apex Dashboard] List click value is empty."
                    );

                    return;
                }


                openList(
                    doctype,
                    field,
                    filterValue
                );
            }


            // =========================================================
            // HANDLE CLICK
            // =========================================================

            function handleClick(
                index
            ) {

                const clickAction =
                    config.clickAction;


                if (!clickAction) {
                    return;
                }


                if (
                    clickAction.type === "report"
                ) {

                    handleReportClick(
                        index
                    );

                    return;
                }


                if (
                    clickAction.type === "list"
                ) {

                    handleListClick(
                        index
                    );

                    return;
                }


                console.warn(
                    "[Apex Dashboard] Unsupported clickAction:",
                    clickAction.type
                );
            }


            // =========================================================
            // BUILD APEX OPTIONS
            // =========================================================

            const options = {

                chart: {

                    type:
                        chartType,

                    height:
                        config.height || 500,

                    toolbar: {

                        show:
                            false
                    },

                    events: {

                        // =================================================
                        // DATA POINT CLICK
                        // =================================================

                        dataPointSelection:
                            function (
                                event,
                                chartContext,
                                chartConfig
                            ) {

                                const index =
                                    chartConfig.dataPointIndex;
                                if (
                                    index === undefined ||
                                    index === null ||
                                    index < 0
                                ) {

                                    return;
                                }


                                handleClick(
                                    index
                                );
                            },


                        // =================================================
                        // MARKER CLICK
                        // =================================================

                        markerClick:
                            function (
                                event,
                                chartContext,
                                data
                            ) {

                                const index =
                                    data.dataPointIndex;


                                if (
                                    chartType === "line" ||
                                    chartType === "area"
                                ) {
                                    handleClick(
                                        index
                                    );
                                }
                            }

                    }
                },


                // =====================================================
                // MARKERS
                // =====================================================

                markers: {

                    size:
                        (
                            chartType === "line" ||
                            chartType === "area"
                        )
                            ? 6
                            : 0,

                    hover: {

                        size:
                            (
                                chartType === "line" ||
                                chartType === "area"
                            )
                                ? 9
                                : 0
                    }
                },


                // =====================================================
                // SERIES
                // =====================================================

                series:
                    series,


                // =====================================================
                // LABELS
                // =====================================================

                labels:
                    labels,


                // =====================================================
                // COLORS
                //
                // IMPORTANT:
                // If config.colors contains [null], do NOT use it.
                // Use the default colors instead.
                // =====================================================

                colors:
                    (
                        Array.isArray(
                            config.colors
                        )
                            ? config.colors.filter(
                                function (color) {

                                    return (
                                        typeof color === "string" &&
                                        color.trim() !== ""
                                    );
                                }
                            )
                            : []
                    ).length > 0

                        ? config.colors.filter(
                            function (color) {

                                return (
                                    typeof color === "string" &&
                                    color.trim() !== ""
                                );
                            }
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


                // =====================================================
                // STROKE
                // =====================================================

                stroke: {

                    show:
                        chartType === "line" ||
                        chartType === "area",

                    width:
                        (
                            chartType === "line" ||
                            chartType === "area"
                        )
                            ? 3
                            : 0,

                    curve:
                        "straight"
                },


                // =====================================================
                // X AXIS
                // =====================================================

                xaxis: {

                    categories:
                        labels
                },


                // =====================================================
                // DATA LABELS
                // =====================================================

                dataLabels: {

                    enabled:
                        config.dataLabels !== false
                },


                // =====================================================
                // LEGEND
                // =====================================================

                legend: {

                    show:
                        config.legend !== false,

                    position:
                        config.legendPosition ||
                        "right"
                },


                // =====================================================
                // TOOLTIP
                // =====================================================

                tooltip: {

                    enabled:
                        true
                }

            };


            // =========================================================
            // BAR CHART
            // =========================================================

            if (
                chartType === "bar"
            ) {

                options.plotOptions = {

                    bar: {

                        horizontal:
                            false,

                        columnWidth:
                            "55%",

                        borderRadius:
                            1
                    }
                };
            }


            // =========================================================
            // PIE
            // =========================================================

            if (
                chartType === "pie"
            ) {

                options.chart.type =
                    "pie";
            }


            // =========================================================
            // DONUT
            // =========================================================

            if (
                chartType === "donut"
            ) {

                options.chart.type =
                    "donut";


                options.plotOptions = {

                    pie: {

                        donut: {

                            size:
                                "60%"
                        }
                    }
                };
            }


            // =========================================================
            // PIE / DONUT TOOLTIP
            // =========================================================

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                options.tooltip = {

                    enabled:
                        true,

                    y: {

                        formatter:
                            function (
                                value
                            ) {

                                return String(
                                    value
                                );
                            }
                    }
                };
            }
            // =========================================================
            // CREATE CHART
            // =========================================================

            let chart;


            try {

                chart =
                    new window.ApexCharts(
                        chartElement,
                        options
                    );

            }
            catch (error) {

                console.error(
                    "[Apex Dashboard] Failed to create ApexCharts:",
                    error
                );

                return;
            }


            // =========================================================
            // RENDER CHART
            // =========================================================

            try {

                chart.render();

            }
            catch (error) {

                console.error(
                    "[Apex Dashboard] Failed to render chart:",
                    error
                );

                return;
            }


            // =========================================================
            // RETURN CHART
            // =========================================================

            return chart;
        }
    };
})();