/* ============================================================
   LEADERSHIP ARCHIVAL WORKSPACE
   ERPNext / Frappe v15

   PURPOSE
   ------------------------------------------------------------
   - Use EXISTING native ERPNext Number Cards
   - Do NOT create new Number Cards
   - Do NOT modify Number Card documents
   - Dynamically update displayed Number Card values
   - Filter by "Conferred By"
   - All / Third King / Fourth King / Fifth King
   - Preserve native Number Card click
   - Automatically add conferred_by to Query Report URL
   ============================================================ */

;(function () {

    "use strict";


    /* ============================================================
       CONFIGURATION
       ============================================================ */

    const WORKSPACE_NAME = "Leadership Archival";

    const LOGO_URL =
        "/assets/apex/image/test.jpeg";


    /* ============================================================
       EXISTING ERPNext NUMBER CARDS
       ============================================================ */

    const AWARD_CARDS = [

        /* ========================================================
           MEDALS
           ======================================================== */

        {
            card: "NOM GOLD",
            report: "Award By Medal",
            filter_field: "title_medal",
            filter_value: "NOM – Gold"
        },

        {
            card: "NOM SILVER",
            report: "Award By Medal",
            filter_field: "title_medal",
            filter_value: "NOM – Silver"
        },

        {
            card: "NOM BRONZE",
            report: "Award By Medal",
            filter_field: "title_medal",
            filter_value: "NOM – Bronze"
        },


        /* ========================================================
           SCARVES
           ======================================================== */

        {
            card: "RED SCARF",
            report: "Award by Scarf",
            filter_field: "title_medal",
            filter_value: "Red Scarf"
        },

        {
            card: "LUNGMAR SCARF",
            report: "Award by Scarf",
            filter_field: "title_medal",
            filter_value: "Lungmar Scarf"
        },

        {
            card: "WHITE SCARF",
            report: "Award by Scarf",
            filter_field: "title_medal",
            filter_value: "White Scarf"
        }

    ];


    /* ============================================================
       CONFERRED BY OPTIONS
       ============================================================ */

    const CONFERRED_BY_OPTIONS = [

        {
            value: "All",
            label: "All"
        },

        {
            value: "His Majesty The 3rd Druk Gyalpo",
            label: "His Majesty The 3rd Druk Gyalpo"
        },

        {
            value: "His Majesty The 4th Druk Gyalpo",
            label: "His Majesty The 4th Druk Gyalpo"
        },

        {
            value: "His Majesty The Fifth Druk Gyalpo",
            label: "His Majesty The Fifth Druk Gyalpo"
        }

    ];


    /* ============================================================
       INTERNAL STATE
       ============================================================ */

    let requestSequence = 0;

    window.__leadershipConferredBy = "All";

    window.__leadershipChartWidgets =
        window.__leadershipChartWidgets ||
        new Set();

    let workspaceObserver = null;

    let observerTimer = null;

    let updateTimer = null;

    let observerMutationTimer = null;


    /* ============================================================
       CHECK CURRENT WORKSPACE
       ============================================================ */

    function isLeadershipWorkspace() {

        if (
            typeof frappe === "undefined" ||
            typeof frappe.get_route !== "function"
        ) {
            return false;
        }

        const route = frappe.get_route();

        if (
            !route ||
            route.length < 2
        ) {
            return false;
        }

        return (
            route[0] === "Workspaces" &&
            route[1] === WORKSPACE_NAME
        );
    }


    /* ============================================================
       REMOVE CUSTOM UI
       ============================================================ */

    function removeCustomUI() {

        const hero =
            document.querySelector(
                ".leadership-custom-hero"
            );

        const filter =
            document.querySelector(
                ".leadership-conferred-filter"
            );

        if (hero) {
            hero.remove();
        }

        if (filter) {
            filter.remove();
        }

        document.body.classList.remove(
            "leadership-workspace"
        );
    }


    /* ============================================================
       CREATE HERO
       ============================================================ */

    function createHero() {

        if (!isLeadershipWorkspace()) {
            return;
        }

        const container =
            document.querySelector(
                ".layout-main-section"
            );

        if (!container) {
            return;
        }

        if (
            container.querySelector(
                ".leadership-custom-hero"
            )
        ) {
            return;
        }

        const hero =
            document.createElement("div");

        hero.className =
            "leadership-custom-hero";

        hero.innerHTML =
            '<div class="leadership-hero-inner">' +

                '<div class="leadership-hero-logo">' +

                    '<img ' +
                        'src="' + LOGO_URL + '" ' +
                        'alt="Leadership Archival">' +

                '</div>' +

            '</div>';

        container.prepend(hero);
    }


    /* ============================================================
       FIND NATIVE ERPNext NUMBER CARD
       ============================================================ */

    function findNumberCard(cardName) {

        const searchName =
            String(cardName || "")
                .trim()
                .toUpperCase();

        if (!searchName) {
            return null;
        }


        const selectors = [

            ".number-card",

            ".widget.number-card",

            ".widget",

            ".dashboard-card",

            ".workspace-card"

        ];


        const found =
            new Set();


        for (
            let s = 0;
            s < selectors.length;
            s++
        ) {

            const elements =
                document.querySelectorAll(
                    selectors[s]
                );


            for (
                let i = 0;
                i < elements.length;
                i++
            ) {

                found.add(
                    elements[i]
                );
            }
        }


        const candidates =
            Array.from(found);


        /* --------------------------------------------------------
           First attempt:
           Find widget containing card name.
           -------------------------------------------------------- */

        for (
            let i = 0;
            i < candidates.length;
            i++
        ) {

            const element =
                candidates[i];

            const text =
                (
                    element.innerText ||
                    element.textContent ||
                    ""
                )
                    .trim()
                    .toUpperCase();


            if (
                text.includes(searchName)
            ) {

                return element;
            }
        }


        /* --------------------------------------------------------
           Second attempt:
           Find exact title anywhere in DOM.
           -------------------------------------------------------- */

        const allElements =
            document.querySelectorAll("*");


        for (
            let i = 0;
            i < allElements.length;
            i++
        ) {

            const element =
                allElements[i];


            if (
                element.children.length > 20
            ) {
                continue;
            }


            const text =
                (
                    element.textContent ||
                    ""
                )
                    .trim()
                    .toUpperCase();


            if (
                text === searchName
            ) {

                let parent =
                    element.parentElement;


                for (
                    let level = 0;
                    level < 6 && parent;
                    level++
                ) {

                    const className =
                        String(
                            parent.className || ""
                        )
                            .toLowerCase();


                    if (
                        className.includes(
                            "number-card"
                        ) ||

                        className.includes(
                            "widget"
                        ) ||

                        className.includes(
                            "dashboard-card"
                        ) ||

                        className.includes(
                            "workspace-card"
                        )
                    ) {

                        return parent;
                    }


                    parent =
                        parent.parentElement;
                }
            }
        }


        return null;
    }


    /* ============================================================
       FIND NUMBER VALUE ELEMENT
       ============================================================ */

    function findNumberValueElement(card) {

        if (!card) {
            return null;
        }


        const selectors = [

            ".number-card-number",

            ".number-card-value",

            ".widget-number",

            ".widget-number .number",

            ".widget-number .value",

            ".number",

            ".value",

            ".card-body .number",

            ".card-body .value"

        ];


        for (
            let i = 0;
            i < selectors.length;
            i++
        ) {

            const element =
                card.querySelector(
                    selectors[i]
                );


            if (element) {
                return element;
            }
        }


        /* --------------------------------------------------------
           Fallback:
           Find an element containing only a number.
           -------------------------------------------------------- */

        const possible =
            card.querySelectorAll(
                "div, span, p, strong"
            );


        for (
            let i = 0;
            i < possible.length;
            i++
        ) {

            const element =
                possible[i];


            const text =
                (
                    element.textContent ||
                    ""
                )
                    .trim()
                    .replace(/,/g, "");


            if (
                /^\d+(\.\d+)?$/.test(text)
            ) {

                if (
                    element.children.length === 0
                ) {
                    return element;
                }
            }
        }


        return null;
    }


    /* ============================================================
       UPDATE EXISTING NATIVE ERPNext NUMBER CARD
       ============================================================ */

    function updateNumberCard(
        cardName,
        value
    ) {

        const card =
            findNumberCard(
                cardName
            );


        if (!card) {

            console.warn(
                "[Leadership Archival] " +
                "Native Number Card not found:",
                cardName
            );

            return false;
        }


        const valueElement =
            findNumberValueElement(
                card
            );


        if (!valueElement) {

            console.warn(
                "[Leadership Archival] " +
                "Number value element not found:",
                cardName
            );

            return false;
        }


        const numericValue =
            Number(value);


        const finalValue =
            Number.isFinite(
                numericValue
            )
                ? numericValue
                : 0;


        valueElement.textContent =
            finalValue.toLocaleString();


        return true;
    }


    /* ============================================================
       SET CARD LOADING
       ============================================================ */

    function setCardLoading(cardName) {

        const card =
            findNumberCard(
                cardName
            );


        if (!card) {
            return;
        }


        const valueElement =
            findNumberValueElement(
                card
            );


        if (valueElement) {

            valueElement.textContent =
                "...";
        }
    }


    /* ============================================================
       EXTRACT COUNT FROM REPORT RESULT
       ============================================================ */

    function calculateReportTotal(
        result
    ) {

        if (
            !Array.isArray(result)
        ) {
            return 0;
        }


        let total = 0;


        result.forEach(
            function (row) {

                if (!row) {
                    return;
                }


                /* ------------------------------------------------
                   Explicit count_value
                   ------------------------------------------------ */

                if (
                    row.count_value !==
                    undefined &&

                    row.count_value !==
                    null
                ) {

                    const number =
                        Number(
                            row.count_value
                        );


                    if (
                        Number.isFinite(
                            number
                        )
                    ) {

                        total += number;
                    }


                    return;
                }


                /* ------------------------------------------------
                   Common aggregate fields
                   ------------------------------------------------ */

                const fields = [

                    "total",

                    "count",

                    "total_scarf",

                    "total_medal",

                    "count_scarf",

                    "count_medal",

                    "value"

                ];


                for (
                    let i = 0;
                    i < fields.length;
                    i++
                ) {

                    const field =
                        fields[i];


                    if (
                        row[field] !==
                        undefined &&

                        row[field] !==
                        null
                    ) {

                        const number =
                            Number(
                                row[field]
                            );


                        if (
                            Number.isFinite(
                                number
                            )
                        ) {

                            total += number;
                        }


                        break;
                    }
                }

            }
        );


        return total;
    }


    /* ============================================================
       LOAD ONE CARD COUNT
       ============================================================ */

    function loadReportCount(
        cardConfig,
        conferredBy,
        currentRequest
    ) {

        const filters = {};


        /* --------------------------------------------------------
           Medal / scarf filter
           -------------------------------------------------------- */

        filters[
            cardConfig.filter_field
        ] =
            cardConfig.filter_value;


        /* --------------------------------------------------------
           Conferred By filter
           -------------------------------------------------------- */

        if (
            conferredBy &&
            conferredBy !== "All"
        ) {

            filters.conferred_by =
                conferredBy;
        }
        frappe.call({

            method:
                "frappe.desk.query_report.run",


            args: {

                report_name:
                    cardConfig.report,

                filters:
                    JSON.stringify(
                        filters
                    ),

                ignore_prepared_report:
                    true

            },


            callback:
                function (response) {

                    /* --------------------------------------------
                       Ignore old AJAX responses
                       -------------------------------------------- */

                    if (
                        currentRequest !==
                        requestSequence
                    ) {
                        return;
                    }


                    let total = 0;


                    if (
                        response &&
                        response.message &&
                        Array.isArray(
                            response.message.result
                        )
                    ) {

                        total =
                            calculateReportTotal(
                                response.message.result
                            );
                    }
                    updateNumberCard(
                        cardConfig.card,
                        total
                    );

                },


            error:
                function (error) {

                    if (
                        currentRequest !==
                        requestSequence
                    ) {
                        return;
                    }


                    console.error(
                        "[Leadership Archival] " +
                        "Report failed:",
                        cardConfig.card,
                        error
                    );


                    updateNumberCard(
                        cardConfig.card,
                        0
                    );
                }

        });
    }


    /* ============================================================
       LOAD ALL CARD COUNTS
       ============================================================ */

    function loadAwardCounts(
        conferredBy
    ) {

        requestSequence++;


        const currentRequest =
            requestSequence;


        const selected =
            conferredBy || "All";
        /* --------------------------------------------------------
           Loading state
           -------------------------------------------------------- */

        AWARD_CARDS.forEach(
            function (cardConfig) {

                setCardLoading(
                    cardConfig.card
                );

            }
        );


        /* --------------------------------------------------------
           Load every card
           -------------------------------------------------------- */

        AWARD_CARDS.forEach(
            function (cardConfig) {

                loadReportCount(
                    cardConfig,
                    selected,
                    currentRequest
                );

            }
        );
    }



    /* ============================================================
       CREATE CONFERRED BY FILTER
       ============================================================ */

    function createConferredByFilter() {

        if (!isLeadershipWorkspace()) {
            return;
        }


        const container =
            document.querySelector(
                ".layout-main-section"
            );


        if (!container) {

            console.warn(
                "[Leadership Archival] " +
                "Workspace container not found"
            );

            return;
        }


        /* --------------------------------------------------------
           Already exists
           -------------------------------------------------------- */

        let wrapper =
            container.querySelector(
                ".leadership-conferred-filter"
            );


        if (wrapper) {

            /*
             * Make sure the event listener has not
             * been lost because of ERPNext rerendering.
             */
            return;
        }


        /* --------------------------------------------------------
           Create wrapper
           -------------------------------------------------------- */

        wrapper =
            document.createElement("div");


        wrapper.className =
            "leadership-conferred-filter";


        /* --------------------------------------------------------
           Create HTML
           -------------------------------------------------------- */

        // wrapper.innerHTML = `
        //     <div class="leadership-filter-content">

        //         <label
        //             for="leadership-conferred-by"
        //             class="leadership-filter-label"
        //         >
        //             Conferred By
        //         </label>

        //         <select
        //             id="leadership-conferred-by"
        //             class="form-control"
        //         >

        //             <option value="All">
        //                 All
        //             </option>

        //             <option value="His Majesty The 3rd Druk Gyalpo">
        //                 Third King
        //             </option>

        //             <option value="His Majesty The 4th Druk Gyalpo">
        //                 Fourth King
        //             </option>

        //             <option value="His Majesty The Fifth Druk Gyalpo">
        //                 Fifth King
        //             </option>

        //         </select>

        //     </div>
        // `;

         wrapper.innerHTML = `
            <div class="leadership-filter-content">

                <label
                    for="leadership-conferred-by"
                    class="leadership-filter-label"
                >
                    Conferred By
                </label>

                <select
                    id="leadership-conferred-by"
                    class="form-control"
                >
                    <option value="All">All</option>
                </select>

            </div>
        `;

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Conferred By",
                fields: ["conferred_by"],
                filters: {
                    conferred_by: ["is", "set"]
                },
                order_by: "conferred_by asc",
                limit_page_length: 0
            },
            callback: function (r) {

                if (!r.message) {
                    return;
                }

                const select = wrapper.querySelector(
                    "#leadership-conferred-by"
                );

                // Remove duplicate values
                const values = [
                    ...new Set(
                        r.message
                            .map(row => row.conferred_by)
                            .filter(value => value)
                    )
                ];

                values.forEach(value => {

                    const option = document.createElement("option");

                    option.value = value;
                    option.textContent = value;

                    select.appendChild(option);
                });
            }
        });


        /* --------------------------------------------------------
           Insert at top
           -------------------------------------------------------- */

        container.insertBefore(
            wrapper,
            container.firstChild
        );


        /* --------------------------------------------------------
           Get select
           -------------------------------------------------------- */

        const filter =
            wrapper.querySelector(
                "#leadership-conferred-by"
            );


        if (!filter) {

            console.error(
                "[Leadership Archival] " +
                "Dropdown element could not be created"
            );

            return;
        }


        /* --------------------------------------------------------
           Change event
           -------------------------------------------------------- */

        // filter.addEventListener(
        //     "change",
        //     function () {

        //         const value =
        //             this.value || "All";

        //         /*
        //          * Update the native Number Card
        //          * displayed values.
        //          */
        //         loadAwardCounts(
        //             value
        //         );

        //     }
        // );
        
        filter.addEventListener(
        "change",
        function () {

            const value =
                this.value || "All";

            console.log(
                "[Leadership Archival] " +
                "Conferred By changed:",
                value
            );

            /*
            * Update Number Cards
            */
            loadAwardCounts(
                value
            );

            /*
            * Update ALL Dashboard Charts
            */
            refreshAllDashboardCharts(
                value
            );
        }
    );
}


    /* ============================================================
       GET CURRENT CONFERRED BY
       ============================================================ */

        function getCurrentConferredBy() {

            const filter =
                document.querySelector(
                    "#leadership-conferred-by"
                );


            if (!filter) {
                return "All";
            }


            return (
                filter.value ||
                "All"
            );
        }

        function refreshAllDashboardCharts(conferredBy) {

            if (!isLeadershipWorkspace()) {
                return;
            }

            /*
            * Store global filter.
            *
            * ChartWidget reads this value.
            */
            window.__leadershipConferredBy =
                conferredBy || "All";

            const widgets =
                window.__leadershipChartWidgets;

            if (
                !widgets ||
                !widgets.size
            ) {
                console.warn(
                    "[Leadership Archival] " +
                    "No ChartWidget instances registered."
                );

                return;
            }

            console.log(
                "[Leadership Archival] " +
                "Refreshing ALL Dashboard Charts:",
                window.__leadershipConferredBy
            );

            widgets.forEach(
                function (chartWidget) {

                    if (!chartWidget) {
                        return;
                    }

                    /*
                    * Only refresh widgets that are
                    * currently inside the workspace.
                    */
                    const widgetElement =
                        chartWidget.widget?.[0];

                    if (!widgetElement) {
                        return;
                    }

                    if (
                        !document.body.contains(
                            widgetElement
                        )
                    ) {
                        return;
                    }

                    /*
                    * Make sure it is actually a
                    * Dashboard Chart widget.
                    */
                    if (
                        !widgetElement.classList.contains(
                            "dashboard-widget-box"
                        )
                    ) {
                        return;
                    }

                    /*
                    * Refresh using the native
                    * ChartWidget lifecycle.
                    */
                    if (
                        typeof chartWidget
                            .refresh_leadership_global_filter ===
                        "function"
                    ) {

                        chartWidget
                            .refresh_leadership_global_filter();

                    }

                }
            );
        }


    /* ============================================================
       FIND NATIVE QUERY REPORT LINK
       ============================================================ */

    function getNativeQueryReportLink(
        target
    ) {

        if (!target) {
            return null;
        }


        /*
         * Walk up to the nearest anchor.
         */
        const link =
            target.closest
                ? target.closest("a")
                : null;


        if (!link) {
            return null;
        }


        const href =
            link.getAttribute("href");


        if (!href) {
            return null;
        }


        /*
         * Only process ERPNext Query Report URLs.
         */
        if (
            !href.includes(
                "/app/query-report/"
            )
        ) {
            return null;
        }


        return link;
    }


    /* ============================================================
       INSTALL NATIVE NUMBER CARD GLOBAL FILTER
       ------------------------------------------------------------
       THIS IS THE IMPORTANT PART.

       Native Number Card:

           /app/query-report/Award%20by%20Scarf
           ?title_medal=White+Scarf

       becomes:

           /app/query-report/Award%20by%20Scarf
           ?title_medal=White+Scarf
           &conferred_by=His+Majesty+The+4th+Druk+Gyalpo

       Existing native URL parameters are preserved.
       ============================================================ */

    // function installNativeCardGlobalFilter() {

    //     /*
    //      * Prevent duplicate installation.
    //      */
    //     if (
    //         window.__leadershipNativeCardFilterInstalled
    //     ) {

    //         return;
    //     }


    //     window.__leadershipNativeCardFilterInstalled =
    //         true;


    //     document.addEventListener(
    //         "click",
    //         function (event) {

    //             /*
    //              * Only operate inside Leadership Archival.
    //              */
    //             if (
    //                 !isLeadershipWorkspace()
    //             ) {

    //                 return;
    //             }


    //             /*
    //              * Find native ERPNext Query Report link.
    //              */
    //             const link =
    //                 getNativeQueryReportLink(
    //                     event.target
    //                 );


    //             if (!link) {
    //                 return;
    //             }


    //             /*
    //              * Get current Conferred By.
    //              */
    //             const conferredBy =
    //                 getCurrentConferredBy();


    //             /*
    //              * If All is selected:
    //              *
    //              * DO NOT interfere with native ERPNext.
    //              */
    //             if (
    //                 !conferredBy ||
    //                 conferredBy === "All"
    //             ) {
    //                 return;
    //             }


    //             /*
    //              * Get native URL.
    //              */
    //             const href =
    //                 link.getAttribute(
    //                     "href"
    //                 );


    //             /*
    //              * Convert native URL to URL object.
    //              */
    //             const url =
    //                 new URL(
    //                     href,
    //                     window.location.origin
    //                 );


    //             /*
    //              * IMPORTANT:
    //              *
    //              * Preserve all existing native filters.
    //              *
    //              * Example:
    //              *
    //              * title_medal=White+Scarf
    //              *
    //              * remains untouched.
    //              */
    //             url.searchParams.set(
    //                 "conferred_by",
    //                 conferredBy
    //             );


    //             /*
    //              * Build final URL.
    //              */
    //             const finalURL =
    //                 url.pathname +
    //                 url.search +
    //                 url.hash;
    //             /*
    //              * Stop native navigation.
    //              *
    //              * We navigate to the SAME native
    //              * Query Report URL with one additional
    //              * filter.
    //              */
    //             event.preventDefault();

    //             event.stopImmediatePropagation();


    //             /*
    //              * Navigate to final native report URL.
    //              */
    //             window.location.href =
    //                 finalURL;

    //         },
    //         true
    //     );
    // }

    function installNativeCardGlobalFilter() {

    if (
        window.__leadershipNativeCardFilterInstalled
    ) {
        return;
    }

    window.__leadershipNativeCardFilterInstalled = true;

    document.addEventListener(
        "click",
        function (event) {

            if (!isLeadershipWorkspace()) {
                return;
            }

            const conferredBy =
                getCurrentConferredBy();

            /*
             * "All" means normal native behavior.
             */
            if (
                !conferredBy ||
                conferredBy === "All"
            ) {
                return;
            }

            /*
             * Find which configured card was clicked.
             */
            let clickedCard = null;

            for (
                let i = 0;
                i < AWARD_CARDS.length;
                i++
            ) {

                const config =
                    AWARD_CARDS[i];

                const card =
                    findNumberCard(
                        config.card
                    );

                if (!card) {
                    continue;
                }

                /*
                 * Check whether clicked element
                 * belongs to this Number Card.
                 */
                if (
                    card.contains(
                        event.target
                    )
                ) {

                    clickedCard =
                        config;

                    break;
                }
            }

            if (!clickedCard) {
                return;
            }

            console.log(
                "[Leadership Archival] " +
                "Number Card clicked:",
                clickedCard.card
            );

            console.log(
                "[Leadership Archival] " +
                "Conferred By:",
                conferredBy
            );

            /*
             * Build native Query Report URL.
             */
            const params =
                new URLSearchParams();

            /*
             * Preserve the card's existing
             * report filter.
             */
            params.set(
                clickedCard.filter_field,
                clickedCard.filter_value
            );

            /*
             * Add global Conferred By.
             */
            params.set(
                "conferred_by",
                conferredBy
            );

            /*
             * Encode report name.
             */
            const reportURL =
                "/app/query-report/" +
                encodeURIComponent(
                    clickedCard.report
                ) +
                "?" +
                params.toString();

            console.log(
                "[Leadership Archival] " +
                "Final Number Card URL:",
                reportURL
            );

            /*
             * Stop ERPNext's native navigation.
             */
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            /*
             * Navigate to Query Report.
             */
            window.location.href =
                reportURL;

        },
        true
    );
}


    /* ============================================================
       WAIT FOR NATIVE ERPNext NUMBER CARDS
       ============================================================ */

    function waitForNumberCards(
        attempts
    ) {

        if (
            !isLeadershipWorkspace()
        ) {

            return;
        }


        const firstCard =
            AWARD_CARDS.length
                ? findNumberCard(
                    AWARD_CARDS[0].card
                )
                : null;


        if (firstCard) {


            /*
             * Load counts using current dropdown.
             */
            loadAwardCounts(
                getCurrentConferredBy()
            );


            return;
        }


        if (
            attempts <= 0
        ) {

            return;
        }


        setTimeout(
            function () {

                waitForNumberCards(
                    attempts - 1
                );

            },
            500
        );
    }


    /* ============================================================
       APPLY WORKSPACE
       ============================================================ */

    function applyWorkspace() {

        if (
            !isLeadershipWorkspace()
        ) {

            removeCustomUI();

            return;
        }

        document.body.classList.add(
            "leadership-workspace"
        );


        const container =
            document.querySelector(
                ".layout-main-section"
            );


        if (!container) {

            console.warn(
                "[Leadership Archival] " +
                ".layout-main-section not ready"
            );


            setTimeout(
                applyWorkspace,
                500
            );


            return;
        }


        /* --------------------------------------------------------
           Create dropdown
           -------------------------------------------------------- */

        createConferredByFilter();


        /* --------------------------------------------------------
           Create hero
           -------------------------------------------------------- */

        createHero();


        /* --------------------------------------------------------
           Wait for native cards
           -------------------------------------------------------- */

        clearTimeout(
            updateTimer
        );


        updateTimer =
            setTimeout(
                function () {

                    if (
                        !isLeadershipWorkspace()
                    ) {

                        return;
                    }


                    /*
                     * ERPNext may have rerendered.
                     */
                    createConferredByFilter();

                    createHero();


                    waitForNumberCards(
                        20
                    );

                },
                800
            );
    }


    /* ============================================================
       WORKSPACE DOM OBSERVER
       ============================================================ */

    function startWorkspaceObserver() {

        if (
            workspaceObserver
        ) {

            return;
        }


        const target =
            document.querySelector(
                ".layout-main-section"
            );


        if (!target) {

            clearTimeout(
                observerTimer
            );


            observerTimer =
                setTimeout(
                    startWorkspaceObserver,
                    1000
                );


            return;
        }


        workspaceObserver =
            new MutationObserver(
                function () {

                    if (
                        !isLeadershipWorkspace()
                    ) {

                        return;
                    }


                    clearTimeout(
                        observerMutationTimer
                    );


                    observerMutationTimer =
                        setTimeout(
                            function () {

                                if (
                                    !document.querySelector(
                                        ".leadership-custom-hero"
                                    )
                                ) {

                                    createHero();
                                }


                                if (
                                    !document.querySelector(
                                        "#leadership-conferred-by"
                                    )
                                ) {

                                    createConferredByFilter();
                                }

                            },
                            150
                        );

                }
            );


        workspaceObserver.observe(
            target,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* ============================================================
       ROUTE CHANGE
       ============================================================ */

    if (
        typeof frappe !== "undefined" &&
        frappe.router
    ) {

        frappe.router.on(
            "change",
            function () {

                setTimeout(
                    function () {

                        applyWorkspace();

                    },
                    300
                );


                setTimeout(
                    function () {

                        startWorkspaceObserver();

                    },
                    1000
                );

            }
        );
    }


    /* ============================================================
       DOCUMENT READY
       ============================================================ */

    $(document).ready(
        function () {
            /*
             * IMPORTANT:
             *
             * Actually install the native Number Card
             * click handler.
             */
            installNativeCardGlobalFilter();


            setTimeout(
                function () {

                    applyWorkspace();

                },
                500
            );


            setTimeout(
                function () {

                    startWorkspaceObserver();

                },
                1500
            );

        }
    );


})();

