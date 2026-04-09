// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kasho", {
	refresh(frm) {
        //  frappe.after_grid_render(frm, "kidu_recipient", function() {
        //     toggle_landsize_column(frm);
        // });
	},
    // kidu_type(frm) {
    //     frappe.after_grid_render(frm, "kidu_recipient", function() {
    //         toggle_landsize_column(frm);
    //     });
    // },
    registration_no: function(frm) {
        if (!frm.doc.registration_no) return;

        frappe.call({
            method: "erpnext.kidu_management.doctype.kasho.kasho.get_kasho_member_data",
            args: {
                registration_no: frm.doc.registration_no  // must match Python parameter
            },
            callback: function(r) {
                if (r.message) {
                    if (r.message.error) {
                        frappe.msgprint(r.message.error);
                        return;
                    }

                    // Clear existing child table
                    frm.clear_table("kidu_recipient");

                    frappe.msgprint(r.message);

                    // Populate child table with member data
                    r.message.forEach((row,index) => {
                        let child = frm.add_child("kidu_recipient");
                        child.no = index + 1;
                        child.cid = row.cid;
                        child.full_name = row.full_name;
                        child.dzongkhag = row.dzongkhag;
                    });
                    // Hide default No column
                    frm.fields_dict["kidu_recipient"].grid.wrapper.find(".row-index").hide();

                    // Refresh the child table field
                    frm.refresh_field("kidu_recipient");

                    // Run toggle after the table is populated
                    frappe.after_grid_render(frm, "kidu_recipient", function() {
                        toggle_landsize_column(frm);
                    });
                 }
            }
            });
    }
});


// function toggle_landsize_column(frm) {
//     if (!frm.fields_dict.kidu_recipient || !frm.fields_dict.kidu_recipient.grid) return;

//     let grid = frm.fields_dict.kidu_recipient.grid;
//     let field = grid.get_field("land_size_acres");

//     if (!field) {
//         console.warn("Field 'land_size_acres' not found yet");
//         return; // safe exit
//     }

//     // Show only if parent type is Land
//     field.df.hidden = frm.doc.kasho_type !== "Land";
//     grid.refresh();
// }
