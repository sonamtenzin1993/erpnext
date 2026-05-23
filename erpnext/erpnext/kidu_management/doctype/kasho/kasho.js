
frappe.ui.form.on("Kasho", {
	refresh(frm) {
        toggle_child_tables(frm);
	},
    kasho_type: function(frm) {
        toggle_child_tables(frm);
    },
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

frappe.ui.form.on("Award and Appointment", {

    cid: function(frm, cdt, cdn) {

        let row = locals[cdt][cdn];

        if (row.cid && row.cid.length === 11 || row.cid && row.cid.length === 12) {

            frappe.call({
                method: "erpnext.kidu_management.doctype.kasho.kasho.get_award_profile",
                args: {
                    cid: row.cid
                },
                callback: function(r) {

                        if (!r.message) {
                            frappe.msgprint({
                                title: "Not Found",
                                message: `No data found for CID: ${row.cid}, kindly add profile`,
                                indicator: "red"
                            });
                            return;
                        }

                        frappe.msgprint({
                            title: "Found",
                            message: `Record of ${r.message.registry_name} with cid: ${row.cid} is found in the system.`,
                            indicator: "green"
                        });

                        }
                    });
                }
            }

});


function toggle_child_tables(frm) {
    // For Appointment and Award
    if (frm.doc.kasho_type === "Appointment" || frm.doc.kasho_type === "Award") {
        // Show Appointment table
        frm.set_df_property('awardappointment', 'hidden', 0);

        // Make Appointment mandatory
        frm.set_df_property('awardappointment', 'reqd', 1);

        // Hide Kidu Recipient table
        frm.set_df_property('kidu_recipient', 'hidden', 1);

        // Remove mandatory from Kidu Recipient
        frm.set_df_property('kidu_recipient', 'reqd', 0);

        // Hide Kidu Recipient table
        frm.set_df_property('kidu_recipient', 'hidden', 1);

        // Remove mandatory from Kidu Recipient
        frm.set_df_property('kidu_recipient', 'reqd', 0);
        
        // Hide Kidu Recipient table
        frm.set_df_property('registration_no', 'hidden', 1);

        frm.set_df_property('dzongkhag', 'hidden', 1);
        frm.set_df_property('dzongkhag', 'reqd', 0);

        if(frm.doc.kasho_type === "Appointment"){
            frm.set_df_property('agency', 'reqd', 1);
            frm.set_df_property('agency', 'hidden', 0);
            frm.set_df_property('medal_title', 'reqd', 0);
            frm.set_df_property('medal_title', 'hidden', 1);
        }else {
            frm.set_df_property('medal_title', 'reqd', 1);
            frm.set_df_property('medal_title', 'hidden', 0);
            frm.set_df_property('agency', 'reqd', 0);
            frm.set_df_property('agency', 'hidden', 1);
        }

    } else {
        // Hide Appointment table
        frm.set_df_property('awardappointment', 'hidden', 1);

        // Remove mandatory from Appointment
        frm.set_df_property('awardappointment', 'reqd', 0);

        // Show Kidu Recipient table
        frm.set_df_property('kidu_recipient', 'hidden', 0);

        // Make Kidu Recipient mandatory
        frm.set_df_property('kidu_recipient', 'reqd', 1);

         // Hide Kidu Recipient table
        frm.set_df_property('registration_no', 'hidden', 0);

        frm.set_df_property('dzongkhag', 'hidden', 0);

        frm.set_df_property('dzongkhag', 'reqd', 1);
        
        frm.set_df_property('medal_title', 'hidden', 1);
        
        frm.set_df_property('agency', 'hidden', 1);
    }

    frm.refresh_fields();
}

