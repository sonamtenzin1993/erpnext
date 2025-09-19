// Copyright (c) 2024, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Kidu Registration", {
// 	refresh(frm) {
// 	},
    
// });

frappe.ui.form.on('Kidu Registration', {
    refresh(frm) {
        if (frm.doc.workflow_state == "Draft") {
            // Hide the phone number field
            frm.toggle_display('phone_no', false);
        } else {
            // Show the phone number field when it's not in Draft state
            frm.toggle_display('phone_no', true);
        }
    },
    

    validate: function(frm) {
        // Get the length of the field value
        var name_length = frm.doc.name1 ? frm.doc.name1.length : 0;

        // Check if the length is less than the required length (e.g., minimum 5 characters)
        if (name_length < 5) {
            frappe.msgprint(__('The name must be at least 4 characters long.'));
            frappe.validated = false; // Prevent form submission
        }
    }
});

