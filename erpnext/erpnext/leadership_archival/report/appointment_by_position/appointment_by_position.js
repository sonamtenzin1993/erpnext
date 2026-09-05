// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.query_reports["Appointment by Position"] = {
	"filters": [
		{
			fieldname: "conferred_by",
			label: "Conferred By",
			fieldtype: "Link",
			options: "Conferred By"
		}
	]
};
