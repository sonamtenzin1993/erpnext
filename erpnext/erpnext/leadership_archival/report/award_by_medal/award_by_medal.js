// // Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// // For license information, please see license.txt

// // frappe.query_reports["Award by Scarf"] = {
// // 	"filters": [

// // 	]
// // };

// // Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// // For license information, please see license.txt

// frappe.query_reports["Award By Medal"] = {
// 	"filters": [
//         {
//             fieldname: "title_medal",
//             label: "Title",
//             fieldtype: "Data"
//         },
//         {
//             fieldname: "cid",
//             label: "CID",
//             fieldtype: "Data"
//         },
//         {
//             fieldname: "start_date",
//             label: "Start Date",
//             fieldtype: "Date"
//         },
//         {
//             fieldname: "end_date",
//             label: "End Date",
//             fieldtype: "Date"
//         },
//         {
//             fieldname: "conferred_by",
//             label: "Conferred By",
//             fieldtype: "Link",
//             options: "Conferred By"
//         },
// 	],
    
//     // =====================================================
//     // FORMATTER
//     // =====================================================
//     formatter: function (value, row, column, data, default_formatter) {

//         value = default_formatter(value, row, column, data);

//         if (column.fieldname === "profile" && data && data.profile) {

//             return `
//                 <div style="text-align: center;">
//                     <span
//                         class="profile-link-icon"
//                         data-profile="${data.profile}"
//                         title="View Profile"
//                         style="cursor: pointer; font-size: 18px;"
//                     >
//                         <i class="fa fa-eye"></i>
//                     </span>
//                 </div>
//             `;
//         }

//         return value;
//     },

// 	onload: function (report) {
//         // =====================================================
//         // APPLY FILTER PASSED FROM NUMBER CARD
//         // =====================================================

//         const url_params = new URLSearchParams(window.location.search);
//         const title_medal = url_params.get("title_medal");

//         if (title_medal) {
//             report.set_filter_value("title_medal", title_medal);
//             report.refresh();
//         }
//          // =================================================
//         // PROFILE CLICK
//         // =================================================

//         report.page.wrapper.on(
//             "click",
//             ".profile-link-icon",
//             function (e) {
//                 e.stopPropagation();
//                 const profile_id = $(this).data("profile");
//                 if (profile_id) {
//                     // frappe.set_route(
//                     //     "leadership-profile",
//                     //     profile_id
//                     // );
//                     const url = `/app/leadership-profile/${profile_id}`;
//                     window.open(url, "_blank");
//                 }
//             }
//         );

//         function validate_dates() {
//             const start = report.get_filter_value("start_date");
//             const end = report.get_filter_value("end_date");

//             if (start && end && end < start) {
//                 frappe.msgprint({
//                     title: __("Invalid Date Range"),
//                     message: __("End Date must be greater than Start Date"),
//                     indicator: "red"
//                 });

//                 report.set_filter_value("end_date", null);
//                 return false;
//             }

//             return true;
//         }

//         function refresh_report() {
//             if (!validate_dates()) return;

//             // ✅ START PROGRESS BAR
//             frappe.show_progress(
//                 __("Loading Report"),
//                 50,
//                 100,
//                 __("Fetching data...")
//             );

//             report.refresh();

//             // ✅ STOP WHEN AJAX FINISHES (ERPNext standard way)
//             frappe.after_ajax(() => {
//                 frappe.show_progress(
//                     __("Loading Report"),
//                     100,
//                     100,
//                     __("Done")
//                 );

//                 setTimeout(() => {
//                     frappe.hide_progress();
//                 }, 300);
//             });
//         }

//         // Bind filters
//         // setTimeout(() => {
//         //     const start_filter = report.get_filter("start_date");
//         //     const end_filter = report.get_filter("end_date");

//         //     if (start_filter && end_filter) {
//         //         start_filter.$input.on("change", refresh_report);
//         //         end_filter.$input.on("change", refresh_report);
//         //     }
//         // }, 500);
//         setTimeout(() => {
//             const conferred_by_filter = report.get_filter("conferred_by");
//             const start_filter = report.get_filter("start_date");
//             const end_filter = report.get_filter("end_date");

//             if (conferred_by_filter) {
//                 conferred_by_filter.$input.on("change", refresh_report);
//             }

//             if (start_filter) {
//                 start_filter.$input.on("change", refresh_report);
//             }

//             if (end_filter) {
//                 end_filter.$input.on("change", refresh_report);
//             }
//         }, 500);

//         // Initial load
//         refresh_report();
//     }
// };

// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.query_reports["Award By Medal"] = {

    // =====================================================
    // FILTERS
    // =====================================================

    filters: [
        {
            fieldname: "title_medal",
            label: "Title",
            fieldtype: "Data"
        },
        {
            fieldname: "cid",
            label: "CID",
            fieldtype: "Data"
        },
        {
            fieldname: "start_date",
            label: "Start Date",
            fieldtype: "Date"
        },
        {
            fieldname: "end_date",
            label: "End Date",
            fieldtype: "Date"
        },
        {
            fieldname: "conferred_by",
            label: "Conferred By",
            fieldtype: "Link",
            options: "Conferred By"
        }
    ],


    // =====================================================
    // FORMATTER
    // =====================================================

    formatter: function (
        value,
        row,
        column,
        data,
        default_formatter
    ) {

        value = default_formatter(
            value,
            row,
            column,
            data
        );

        // -------------------------------------------------
        // PROFILE COLUMN
        // -------------------------------------------------

        if (
            column.fieldname === "profile" &&
            data &&
            data.profile
        ) {

            const profile_id =
                String(data.profile);

            return `
                <div style="
                    text-align: center;
                    width: 100%;
                ">
                    <span
                        class="profile-link-icon"
                        data-profile="${frappe.utils.escape_html(profile_id)}"
                        title="View Profile"
                        style="
                            cursor: pointer;
                            font-size: 18px;
                            display: inline-block;
                            padding: 3px 8px;
                        "
                    >
                        <i class="fa fa-eye"></i>
                    </span>
                </div>
            `;
        }

        return value;
    },


    // =====================================================
    // ONLOAD
    // =====================================================

    onload: function (report) {

        console.log(
            "[Award By Medal] Report loaded"
        );


        // =================================================
        // URL PARAMETERS
        // =================================================

        const url_params =
            new URLSearchParams(
                window.location.search
            );

        const title_medal =
            url_params.get("title_medal");

        const conferred_by =
            url_params.get("conferred_by");

        const cid =
            url_params.get("cid");

        const start_date =
            url_params.get("start_date");

        const end_date =
            url_params.get("end_date");


        console.log(
            "[Award By Medal] URL parameters:",
            {
                title_medal,
                conferred_by,
                cid,
                start_date,
                end_date
            }
        );


        // =================================================
        // SET URL FILTERS
        // =================================================

        let has_url_filters = false;


        if (title_medal) {

            report.set_filter_value(
                "title_medal",
                title_medal
            );

            has_url_filters = true;
        }


        if (conferred_by) {

            report.set_filter_value(
                "conferred_by",
                conferred_by
            );

            has_url_filters = true;
        }


        if (cid) {

            report.set_filter_value(
                "cid",
                cid
            );

            has_url_filters = true;
        }


        if (start_date) {

            report.set_filter_value(
                "start_date",
                start_date
            );

            has_url_filters = true;
        }


        if (end_date) {

            report.set_filter_value(
                "end_date",
                end_date
            );

            has_url_filters = true;
        }


        // =================================================
        // PROFILE CLICK
        //
        // IMPORTANT:
        // Event delegation is used because Frappe
        // recreates the report table after refresh.
        // =================================================

        report.page.wrapper
            .off(
                "click.awardByMedalProfile",
                ".profile-link-icon"
            )
            .on(
                "click.awardByMedalProfile",
                ".profile-link-icon",
                function (e) {

                    e.preventDefault();

                    e.stopPropagation();

                    const profile_id =
                        $(this).attr(
                            "data-profile"
                        );


                    console.log(
                        "[Award By Medal] Profile clicked:",
                        profile_id
                    );


                    if (!profile_id) {

                        frappe.msgprint({
                            title: __("Profile Not Found"),
                            message: __(
                                "No profile was associated with this row."
                            ),
                            indicator: "red"
                        });

                        return;
                    }


                    // -------------------------------------
                    // OPEN PROFILE IN NEW TAB
                    // -------------------------------------

                    const url =
                        `/app/leadership-profile/${encodeURIComponent(profile_id)}`;


                    console.log(
                        "[Award By Medal] Opening:",
                        url
                    );


                    window.open(
                        url,
                        "_blank"
                    );
                }
            );


        // =================================================
        // DATE VALIDATION
        // =================================================

        function validate_dates() {

            const start =
                report.get_filter_value(
                    "start_date"
                );

            const end =
                report.get_filter_value(
                    "end_date"
                );


            if (
                start &&
                end &&
                end < start
            ) {

                frappe.msgprint({
                    title: __("Invalid Date Range"),
                    message: __(
                        "End Date must be greater than Start Date"
                    ),
                    indicator: "red"
                });


                report.set_filter_value(
                    "end_date",
                    null
                );


                return false;
            }


            return true;
        }


        // =================================================
        // REFRESH REPORT
        // =================================================

        function refresh_report() {

            if (!validate_dates()) {
                return;
            }


            console.log(
                "[Award By Medal] Refreshing report..."
            );


            frappe.show_progress(
                __("Loading Report"),
                50,
                100,
                __("Fetching data...")
            );


            report.refresh();


            frappe.after_ajax(
                () => {

                    frappe.show_progress(
                        __("Loading Report"),
                        100,
                        100,
                        __("Done")
                    );


                    setTimeout(
                        () => {
                            frappe.hide_progress();
                        },
                        300
                    );
                }
            );
        }


        // =================================================
        // BIND FILTER EVENTS
        // =================================================

        setTimeout(
            () => {

                const title_filter =
                    report.get_filter(
                        "title_medal"
                    );

                const conferred_by_filter =
                    report.get_filter(
                        "conferred_by"
                    );

                const start_filter =
                    report.get_filter(
                        "start_date"
                    );

                const end_filter =
                    report.get_filter(
                        "end_date"
                    );


                // -----------------------------------------
                // TITLE
                // -----------------------------------------

                if (title_filter) {

                    title_filter.$input
                        .off(
                            "change.awardByMedal"
                        )
                        .on(
                            "change.awardByMedal",
                            refresh_report
                        );
                }


                // -----------------------------------------
                // CONFERRED BY
                // -----------------------------------------

                if (conferred_by_filter) {

                    conferred_by_filter.$input
                        .off(
                            "change.awardByMedal"
                        )
                        .on(
                            "change.awardByMedal",
                            refresh_report
                        );
                }


                // -----------------------------------------
                // START DATE
                // -----------------------------------------

                if (start_filter) {

                    start_filter.$input
                        .off(
                            "change.awardByMedal"
                        )
                        .on(
                            "change.awardByMedal",
                            refresh_report
                        );
                }


                // -----------------------------------------
                // END DATE
                // -----------------------------------------

                if (end_filter) {

                    end_filter.$input
                        .off(
                            "change.awardByMedal"
                        )
                        .on(
                            "change.awardByMedal",
                            refresh_report
                        );
                }

            },
            500
        );


        // =================================================
        // INITIAL REPORT LOAD
        //
        // Only refresh ONCE.
        // =================================================

        setTimeout(
            () => {

                console.log(
                    "[Award By Medal] Initial refresh"
                );

                refresh_report();

            },
            300
        );
    }
};