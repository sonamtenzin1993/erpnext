// Copyright (c) 2026, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.query_reports["Leadership Archival  Master Report"] = {

    "filters": [
        {
            "fieldname": "cid",
            "label": "CID",
            "fieldtype": "Data",
            "placeholder": "Enter CID"
        },
        {
            "fieldname": "title_medal",
            "label": "Title or Medal",
            "fieldtype": "Link",
            "options": "Title",
            "placeholder": "Select title or Medal"
        },
        {
            "fieldname": "start_date",
            "label": "Start Date",
            "fieldtype": "Date",
            "placeholder": "Start Date"
        },
        {
            "fieldname": "end_date",
            "label": "End Date",
            "fieldtype": "Date",
            "placeholder": "End Date"
        }
    ],


    // =====================================================
    // FORMATTER
    // =====================================================

    formatter: function(value, row, column, data, default_formatter) {

        value = default_formatter(
            value,
            row,
            column,
            data
        );

        // Only Profile column
        if (
            column.fieldname === "profile" &&
            data &&
            data.profile
        ) {
            value = `
                <a
                    href="/app/leadership-profile?profile=${encodeURIComponent(data.profile)}"
                    class="leadership-profile-link"
                    data-profile="${frappe.utils.escape_html(data.profile)}"
                >
                    ${frappe.utils.escape_html(data.profile)}
                </a>
            `;
        }
        return value;
    },


    // =====================================================
    // ONLOAD
    // =====================================================

    onload: function(report) {


        // =================================================
        // PROFILE CLICK
        // =================================================

        $(report.page.wrapper).on(
            "click",
            ".leadership-profile-link",
            function(e) {

                e.preventDefault();
                e.stopPropagation();

                const profile =
                    $(this).attr("data-profile");

                console.log("================================");
                console.log("PROFILE CLICKED");
                console.log("Profile:", profile);
                console.log("================================");


                frappe.set_route(
                    "leadership-profile",
                     profile
                );

            }
        ); // <-- THIS WAS MISSING


        // =================================================
        // DATE VALIDATION
        // =================================================

        function validate_dates() {

            const start =
                report.get_filter_value("start_date");

            const end =
                report.get_filter_value("end_date");


            if (
                start &&
                end &&
                end < start
            ) {

                frappe.msgprint({
                    title: __("Invalid Date Range"),
                    message: __("End Date must be greater than Start Date"),
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
            frappe.show_progress(
                __("Loading Report"),
                50,
                100,
                __("Fetching data...")
            );
            report.refresh();
            frappe.after_ajax(() => {
                frappe.show_progress(
                    __("Loading Report"),
                    100,
                    100,
                    __("Done")
                );
                setTimeout(() => {

                    frappe.hide_progress();

                }, 300);
            });
        }

        // =================================================
        // BIND FILTERS
        // =================================================

        setTimeout(() => {
            const start_filter =
                report.get_filter("start_date");
            const end_filter =
                report.get_filter("end_date");
            if (
                start_filter &&
                end_filter
            ) {

                start_filter.$input.on(
                    "change",
                    refresh_report
                );

                end_filter.$input.on(
                    "change",
                    refresh_report
                );
            }
        }, 500);
        // =================================================
        // INITIAL LOAD
        // =================================================

        refresh_report();
    }
};