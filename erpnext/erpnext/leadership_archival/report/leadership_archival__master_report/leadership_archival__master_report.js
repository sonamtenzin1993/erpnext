// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
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
	onload: function (report) {

        function validate_dates() {
            const start = report.get_filter_value("start_date");
            const end = report.get_filter_value("end_date");

            if (start && end && end < start) {
                frappe.msgprint({
                    title: __("Invalid Date Range"),
                    message: __("End Date must be greater than Start Date"),
                    indicator: "red"
                });

                report.set_filter_value("end_date", null);
                return false;
            }

            return true;
        }

        function refresh_report() {
            if (!validate_dates()) return;

            // ✅ START PROGRESS BAR
            frappe.show_progress(
                __("Loading Report"),
                50,
                100,
                __("Fetching data...")
            );

            report.refresh();

            // ✅ STOP WHEN AJAX FINISHES (ERPNext standard way)
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

        // Bind filters
        setTimeout(() => {
            const start_filter = report.get_filter("start_date");
            const end_filter = report.get_filter("end_date");

            if (start_filter && end_filter) {
                start_filter.$input.on("change", refresh_report);
                end_filter.$input.on("change", refresh_report);
            }
        }, 500);

        // Initial load
        refresh_report();
    }
};
