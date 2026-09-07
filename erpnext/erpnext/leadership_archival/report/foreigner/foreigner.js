// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.query_reports["Foreigner"] = {
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

        // =================================================
        // PROFILE ICON
        // =================================================

        if (
            column.fieldname === "profile" &&
            data &&
            data.profile
        ) {

            return `
                <div style="
                    text-align: center;
                    width: 100%;
                ">

                    <span
                        class="profile-link-icon"
                        data-profile="${frappe.utils.escape_html(data.profile)}"
                        title="View Profile"
                        style="
                            cursor: pointer;
                            font-size: 18px;
                            display: inline-block;
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
            "[Award by Scarf] Report loaded"
        );


        // =================================================
        // APPLY URL FILTERS
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


        // =================================================
        // TITLE
        // =================================================

        if (title_medal) {

            console.log(
                "[Award by Scarf] URL title_medal:",
                title_medal
            );

            report.set_filter_value(
                "title_medal",
                title_medal
            );
        }


        // =================================================
        // CONFERRED BY
        // =================================================

        if (conferred_by) {

            console.log(
                "[Award by Scarf] URL conferred_by:",
                conferred_by
            );

            report.set_filter_value(
                "conferred_by",
                conferred_by
            );
        }


        // =================================================
        // CID
        // =================================================

        if (cid) {

            console.log(
                "[Award by Scarf] URL cid:",
                cid
            );

            report.set_filter_value(
                "cid",
                cid
            );
        }


        // =================================================
        // START DATE
        // =================================================

        if (start_date) {

            report.set_filter_value(
                "start_date",
                start_date
            );
        }


        // =================================================
        // END DATE
        // =================================================

        if (end_date) {

            report.set_filter_value(
                "end_date",
                end_date
            );
        }


        // =================================================
        // PROFILE CLICK
        // =================================================

        report.page.wrapper.off(
            "click.award_scarf_profile",
            ".profile-link-icon"
        );


        report.page.wrapper.on(
            "click.award_scarf_profile",
            ".profile-link-icon",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                const profile_id =
                    $(this).attr("data-profile");


                console.log(
                    "================================="
                );

                console.log(
                    "[Award by Scarf] PROFILE CLICK"
                );

                console.log(
                    "[Award by Scarf] Profile ID:",
                    profile_id
                );


                if (!profile_id) {

                    console.error(
                        "[Award by Scarf] Profile ID is missing"
                    );

                    frappe.msgprint({
                        title: __("Profile Not Found"),
                        message: __(
                            "The profile ID is not available for this record."
                        ),
                        indicator: "red"
                    });

                    return;
                }


                // =================================================
                // OPEN LEADERSHIP PROFILE
                // =================================================

                const url =
                    `/app/leadership-profile/${encodeURIComponent(profile_id)}`;


                console.log(
                    "[Award by Scarf] Opening:",
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

                    title: __(
                        "Invalid Date Range"
                    ),

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
                "[Award by Scarf] Refreshing with filters:",
                report.get_values()
            );


            frappe.show_progress(
                __("Loading Report"),
                50,
                100,
                __("Fetching data...")
            );


            report.refresh();


            frappe.after_ajax(function () {

                frappe.show_progress(
                    __("Loading Report"),
                    100,
                    100,
                    __("Done")
                );


                setTimeout(
                    function () {

                        frappe.hide_progress();

                    },
                    300
                );

            });

        }


        // =================================================
        // FILTER CHANGE EVENTS
        // =================================================

        setTimeout(
            function () {

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

                const title_filter =
                    report.get_filter(
                        "title_medal"
                    );

                const cid_filter =
                    report.get_filter(
                        "cid"
                    );


                // ---------------------------------------------
                // CONFERRED BY
                // ---------------------------------------------

                if (conferred_by_filter) {

                    conferred_by_filter.$input.on(
                        "change",
                        refresh_report
                    );
                }


                // ---------------------------------------------
                // START DATE
                // ---------------------------------------------

                if (start_filter) {

                    start_filter.$input.on(
                        "change",
                        refresh_report
                    );
                }


                // ---------------------------------------------
                // END DATE
                // ---------------------------------------------

                if (end_filter) {

                    end_filter.$input.on(
                        "change",
                        refresh_report
                    );
                }


                // ---------------------------------------------
                // TITLE
                // ---------------------------------------------

                if (title_filter) {

                    title_filter.$input.on(
                        "change",
                        refresh_report
                    );
                }


                // ---------------------------------------------
                // CID
                // ---------------------------------------------

                if (cid_filter) {

                    cid_filter.$input.on(
                        "change",
                        refresh_report
                    );
                }

            },
            500
        );


        // =================================================
        // INITIAL LOAD
        // =================================================

        setTimeout(
            function () {

                refresh_report();

            },
            700
        );

    }
};
