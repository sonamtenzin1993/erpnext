// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.query_reports["Award Master Report"] = {
	"filters": [
		{
            "fieldname": "cid",
            "label": "CID",
            "fieldtype": "Data",
            "placeholder": "Enter CID"
        },
        {
            "fieldname": "position",
            "label": "Positon",
            "fieldtype": "Link",
            "options": "Position",
            "placeholder": "Select position"
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
    formatter: function (value, row, column, data, default_formatter) {

        value = default_formatter(value, row, column, data);

        if (column.fieldname === "profile" && data && data.profile) {

            return `
                <div style="text-align: center;">
                    <span
                        class="profile-link-icon"
                        data-profile="${data.profile}"
                        title="View Profile"
                        style="cursor: pointer; font-size: 18px;"
                    >
                        <i class="fa fa-eye"></i>
                    </span>
                </div>
            `;
        }

        return value;
    },

        
	onload: function (report) {
         // =================================================
        // PROFILE CLICK
        // =================================================

       //$(report.page.wrapper).on(
          //  "click",
         //   ".leadership-profile-link",
         //   function(e) {

         //       e.preventDefault();
         //       e.stopPropagation();

         //       const profile =
         //           $(this).attr("data-profile");
         //       frappe.set_route(
        //            "leadership-profile",
        //             profile
         //       );
        //    }
        //);

        report.page.wrapper.on(
            "click",
            ".profile-link-icon",
            function (e) {
                e.stopPropagation();
                const profile_id = $(this).data("profile");
                console.log("Profile ID:", profile_id);
                if (profile_id) {
                    frappe.set_route(
                        "leadership-profile",
                        profile_id
                    );
                }
            }
        );

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
