// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kidu Registration", {
    application_mode: function(frm) {
        toggle_fields(frm);
    },
	refresh(frm) {
        toggle_fields(frm);

        if (frm.doc.kidu_type === 'Land') {
            frm.set_df_property('kidu_sub_type', 'hidden', 0);
             frm.set_df_property('kidu_sub_type', 'reqd', 1);
        } else {
            frm.set_df_property('kidu_sub_type', 'hidden', 1);
            frm.set_df_property('kidu_sub_type', 'reqd', 0);
        }
	},
    onload(frm){
       if (frm.doc.kidu_type === 'Land') {
            frm.set_df_property('kidu_sub_type', 'hidden', 0);
            frm.set_df_property('kidu_sub_type', 'reqd', 1);
        } else {
            frm.set_df_property('kidu_sub_type', 'hidden', 1);
            frm.set_df_property('kidu_sub_type', 'reqd', 0);
}

    },
    cid:function(frm){
        if(frm.doc.cid.length==11){
            frappe.call({
                method: "erpnext.api_setting.get_citizen_detail",
                args: {
                    cid: frm.doc.cid
                },
                callback: function(r) {
                    if (r.message) {
                        let name= [r.message.firstName, r.message.middleName, r.message.lastName]
                        .filter(Boolean) // removes null, undefined, and empty strings
                        .join(" ");
                        frm.set_value('full_name',name);
                        let dob=r.message.dob;
                        let parts = dob.split("/");
                        if (parts.length === 3) {
                            let formatted_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                            frm.set_value("dob", formatted_date);
                        }
                        frm.set_value('gender',r.message.gender=='M'?'Male':'Female');
                        frm.set_value('dzongkhag',r.message.dzongkhagName);
                        frm.set_value('gewog',r.message.gewogName);
                        frm.set_value('village',r.message.villageName);
                    } else {
                        frappe.msgprint("No Land found");
                        frm.set_df_property('kidu_sub_type', 'hidden', 1);
                    }
                }
            });
        }
    },
    kidu_type:function (frm){
        let selected_kidu_type = frm.doc.kidu_type;
        // frm.trigger('toggle_child_table_visibility');
        if(selected_kidu_type=='Land'){
            frappe.call({
                method: "erpnext.kidu_management.doctype.kidu_registration.kidu_registration.get_kidu_sub_type",
                args: {
                    kidu_type: selected_kidu_type
                },
                callback: function(r) {
                    frm.set_df_property('kidu_sub_type', 'hidden', 0);
                    if (r.message) {
                    const options = r.message.map(item => item.kidu_sub_type);
                      frm.set_query('kidu_sub_type', function() {
                        return {
                          filters: {
                            name: ['in', options]
                          }
                        };
                      });
                    } else {
                        frappe.msgprint("No Land found");
                        frm.set_df_property('kidu_sub_type', 'hidden', 1);
                    }
                }
            });
        } else{
            frm.set_query('kidu_sub_type', function() {
                return {};
              });
        }   
    },
});


frappe.ui.form.on("Member", {  // Replace with your child table DocType
    cid: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (!row.cid) return;

        // Check for duplicates in the child table
        let duplicates = frm.doc.member.filter(r => r.cid === row.cid);

        // If duplicates found (more than 1 because current row is included)
        if (duplicates.length > 1) {
            frappe.msgprint(`CID ${row.cid} is already entered in the table.`);
            row.cid = "";               
            row.full_name = "";              
            frm.refresh_field("member");
            return;
        }

        // Only trigger if CID is 11 digits
        if (row.cid && /^\d{11}$/.test(row.cid)) {
            frappe.call({
                method: "erpnext.api_setting.get_citizen_detail", // Python backend
                args: { cid: row.cid },
                callback: function(r) {
                    if (r.message) {
                        // Full name
                        let name = [r.message.firstName, r.message.middleName, r.message.lastName]
                            .filter(Boolean)
                            .join(" ");
                        row.full_name = name;

                        // Date of birth formatting
                        if (r.message.dob) {
                            let parts = r.message.dob.split("/");
                            if (parts.length === 3) {
                                let formatted_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                                row.dob = formatted_date;
                            } else {
                                row.dob = r.message.dob;
                            }
                        }

                        // Gender
                        row.gender = r.message.gender === 'M' ? 'Male' : 'Female';

                        // Other fields
                        row.dzongkhag = r.message.dzongkhagName; 
                        row.gewog = r.message.gewogName; 
                        row.village = r.message.villageName; 
                        frappe.call({
                            method: "erpnext.kidu_management.doctype.kidu_profile.kidu_profile.fetch_citizen_photo_base64",
                            args: {
                                cid: row.cid
                            },
                            callback: function(photo_r) {
                                if (photo_r.message && photo_r.message.image) {
                                    let base64_img = photo_r.message.image;
                                    let filename = row.cid + "_photo.jpeg";
                                    frappe.call({
                                        method: "frappe.client.insert",
                                        args: {
                                            doc: {
                                                doctype: "File",

                                                file_name: filename,

                                                // IMPORTANT: Attach to CHILD ROW
                                                attached_to_doctype: cdt,
                                                attached_to_name: cdn,
                                                attached_to_field: "photo",

                                                is_private: 1,

                                                content: base64_img,
                                                decode: 1
                                            }
                                        },
                                        callback: function(file_r) {

                                            if (file_r && file_r.message) {

                                                let file_doc = file_r.message;

                                                // Save file URL into child table field
                                                frappe.model.set_value(
                                                    cdt,
                                                    cdn,
                                                    "photo",
                                                    file_doc.file_url
                                                );

                                                // Refresh child table
                                                frm.refresh_field("member");
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        row.full_name = "";  
                        frappe.msgprint("No record found for CID " + row.cid);
                    }

                    // Refresh child table to show updated values
                    frm.refresh_field("member");  
                }
            });
        }
    }
});


function toggle_fields(frm) {
    let application_mode = frm.doc.application_mode; // Assuming you have a field to determine type


    // 🔥 FORCE CLEAR FIRST

    frm.set_value('emergency_contact_no', '');
    // THEN set actual value from doc
    if (frm.doc.emergency_contact_no) {
        frm.set_value('emergency_contact_no', frm.doc.emergency_contact_no);
    }
    
    
    


    frm.refresh_field('emergency_contact_no');
    if (application_mode === 'Individual') {
        frm.set_df_property('cid', 'hidden', 0);
        frm.set_df_property('full_name', 'hidden', 0);
        frm.set_df_property('dob', 'hidden', 0);
        frm.set_df_property('gender', 'hidden', 0);
        frm.set_df_property('dzongkhag', 'hidden', 0);
        frm.set_df_property('gewog', 'hidden', 0);
        frm.set_df_property('village', 'hidden', 0);
        frm.set_df_property('member', 'hidden', 1);
        frm.set_df_property('organization', 'hidden', 1);
        frm.set_df_property('contact_no', 'hidden', 0);
        frm.set_df_property('emergency_contact_no', 'hidden', 0);
        // Set required
        frm.set_df_property('cid', 'reqd', 1);
        frm.set_df_property('full_name', 'reqd', 1);
        frm.set_df_property('dob', 'reqd', 1);
        frm.set_df_property('gender', 'reqd', 1);
        frm.set_df_property('dzongkhag', 'reqd', 1);
        frm.set_df_property('gewog', 'reqd', 1);
        frm.set_df_property('village', 'reqd', 1);
        frm.set_df_property('member', 'reqd', 0);
        frm.set_df_property('organization', 'reqd', 0);
        frm.set_df_property('contact_no', 'reqd', 1);
    } 
    else if (application_mode === 'Group') {
        frm.set_df_property('cid', 'hidden', 1);
        frm.set_df_property('full_name', 'hidden', 1);
        frm.set_df_property('dob', 'hidden', 1);
        frm.set_df_property('gender', 'hidden', 1);
        frm.set_df_property('dzongkhag', 'hidden', 1);
        frm.set_df_property('gewog', 'hidden', 1);
        frm.set_df_property('village', 'hidden', 1);
        frm.set_df_property('member', 'hidden', 1);
        frm.set_df_property('member', 'hidden', 0);
        frm.set_df_property('organization', 'hidden', 1);
        frm.set_df_property('emergency_contact_no', 'hidden', 1);
        frm.set_df_property('contact_no', 'hidden', 1);


        // Set required
        frm.set_df_property('cid', 'reqd', 0);
        frm.set_df_property('full_name', 'reqd', 0);
        frm.set_df_property('dob', 'reqd', 0);
        frm.set_df_property('gender', 'reqd', 0);
        frm.set_df_property('dzongkhag', 'reqd', 0);
        frm.set_df_property('gewog', 'reqd', 0);
        frm.set_df_property('village', 'reqd', 0);
        frm.set_df_property('member', 'reqd', 1);
        frm.set_df_property('organization', 'reqd', 0);
        frm.set_df_property('contact_no', 'reqd', 0);
    } 
    else if (application_mode === 'Individual and Member') {
        frm.set_df_property('cid', 'hidden', 0);
        frm.set_df_property('full_name', 'hidden', 0);
        frm.set_df_property('dob', 'hidden', 0);
        frm.set_df_property('gender', 'hidden', 0);
        frm.set_df_property('dzongkhag', 'hidden', 0);
        frm.set_df_property('gewog', 'hidden', 0);
        frm.set_df_property('village', 'hidden', 0);
        frm.set_df_property('member', 'hidden', 0);
        frm.set_df_property('organization', 'hidden', 1);
        frm.set_df_property('emergency_contact_no', 'hidden', 0);
        frm.set_df_property('contact_no', 'hidden', 0);


         // Set required for both individual and member
        frm.set_df_property('cid', 'reqd', 1);
        frm.set_df_property('full_name', 'reqd', 1);
        frm.set_df_property('dob', 'reqd', 1);
        frm.set_df_property('gender', 'reqd', 1);
        frm.set_df_property('dzongkhag', 'reqd', 1);
        frm.set_df_property('gewog', 'reqd', 1);
        frm.set_df_property('village', 'reqd', 1);
        frm.set_df_property('member', 'reqd', 1);
        frm.set_df_property('organization', 'reqd', 0);
        frm.set_df_property('contact_no', 'reqd', 1);
    }else if (application_mode === 'Organization'){
        frm.set_df_property('cid', 'hidden', 1);
        frm.set_df_property('full_name', 'hidden', 1);
        frm.set_df_property('dob', 'hidden', 1);
        frm.set_df_property('gender', 'hidden', 1);
        frm.set_df_property('dzongkhag', 'hidden', 0);
        frm.set_df_property('gewog', 'hidden', 0);
        frm.set_df_property('village', 'hidden', 0);
        frm.set_df_property('member', 'hidden', 1);
        frm.set_df_property('organization', 'hidden', 0);
        frm.set_df_property('emergency_contact_no', 'hidden', 1);
        frm.set_df_property('contact_no', 'hidden', 1);
        // Set required
        frm.set_df_property('cid', 'reqd', 0);
        frm.set_df_property('full_name', 'reqd', 0);
        frm.set_df_property('dob', 'reqd', 0);
        frm.set_df_property('gender', 'reqd', 0);
        frm.set_df_property('dzongkhag', 'reqd', 1);
        frm.set_df_property('gewog', 'reqd', 1);
        frm.set_df_property('village', 'reqd', 1);
        frm.set_df_property('member', 'reqd', 0);
        frm.set_df_property('organization', 'reqd', 1);
        frm.set_df_property('contact_no', 'reqd', 0);
    }
}