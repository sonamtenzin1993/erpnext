// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

    frappe.ui.form.on("Kidu Profile", {
    // Triggered when the form is loaded
    onload(frm) {
        // Auto-fetch if link is already selected
        if(frm.doc.kidu_registration) {
            frm.trigger('registration_no');
        }
    },

    // Triggered when Kidu Registration link changes
    registration_no(frm) {
        if(!frm.doc.registration_no) return;

        // Fetch the linked Kidu Registration document
        frappe.db.get_doc('Kidu Registration', frm.doc.registration_no)

        .then(reg => {
            //Fetch citizen photo from DCRC
            frappe.call({
                method: "erpnext.kidu_management.doctype.kidu_profile.kidu_profile.fetch_citizen_photo_base64",
                args: { cid: reg.cid },
                callback: function(r) {
                    if(r.message){
                        let base64_img = r.message.image; // Base64 from API
                        let doctype = frm.doc.doctype;    // Current DocType
                        let docname = frm.doc.name;       // Current document name
                        let fieldname = "photo";          // Field to attach image
                        let filename = "citizen_photo.jpeg";

                        // 1️⃣ Option: Set directly as data URL (quick display, not stored as File doc)
                        let data_url = "data:image/jpeg;base64," + base64_img;
                        frm.set_value(fieldname, data_url);
                        frm.refresh_field(fieldname);

                        // 2️⃣ Option: Properly save as File in Frappe (recommended)
                        frappe.call({
                            method: "frappe.client.insert",
                            args: {
                                doc: {
                                    doctype: "File",
                                    file_name: filename,
                                    attached_to_doctype: doctype,
                                    attached_to_name: docname,
                                    attached_to_field: fieldname,
                                    is_private: 1,
                                    content: base64_img,
                                    decode: 1
                                }
                            },
                            callback: function(file_r) {
                                if(file_r && file_r.message){
                                    let file_doc = file_r.message;

                                    // Set the DocType image field to the file URL
                                    frm.set_value("photo", file_doc.file_url);  // e.g., /private/files/citizen_photo.jpeg
                                    frm.refresh_field("photo");
                                    // frappe.msgprint(`File "${file_doc.file_name}" attached successfully.`);
                                 }
                            }
                        });
                    }
                }
            });

            // Populate Profile fields
            frm.set_df_property('emergency_contact_no', 'hidden', 1);
            if(frm.doc.application_mode==='Organization' || frm.doc.application_mode==='Group'){
                frm.set_df_property('photo', 'reqd', 0);
                frm.set_df_property('photo', 'hidden', 1);
            }else{
                frm.set_df_property('photo', 'reqd', 1);
                frm.set_df_property('photo', 'hidden', 0);            }
            frm.set_value('cid', reg.cid || '');
            frm.set_value('full_name', reg.full_name || '');
            frm.set_value('dob', reg.dob || '');
            frm.set_value('kidu_type', reg.kidu_type || '');
            frm.set_value('application_mode', reg.application_mode || '');
            frm.set_value('contact_no', reg.contact_no || '');
            frm.set_value('emergency_contact_no', reg.emergency_contact_no || '');
            frm.set_value('rc', reg.rc || '');
            frm.set_value('application_channel', reg.application_channel || '');
            frm.set_value('application', reg.application || '');
            frm.set_value('gender', reg.gender || '');
            frm.set_value('dzongkhag', reg.dzongkhag || '');
            frm.set_value('gewog', reg.gewog || '');
            frm.set_value('village', reg.village || '');
            frm.set_value('kidu_sub_type', reg.kidu_sub_type || '');
            frm.set_value('organization', reg.organization || '');


            // Clear existing child table rows
    frm.clear_table('member'); // 'members' = your child table fieldname

    // Loop through the child table in Kidu Registration (assuming it has 'members' child table)
    if (reg.member && reg.member.length > 0) {
        reg.member.forEach(member => {
            let child = frm.add_child('member'); // add a new row
            child.full_name = member.full_name || '';
            child.cid = member.cid || '';
            child.dob = member.dob || '';
            child.gender = member.gender || '';
            child.contact_no = member.contact_no || '';
            child.dzongkhag = member.dzongkhag || '';
            child.gewog = member.gewog || '';
            child.village = member.village || '';
            child.photo = member.photo || '';
        });
        }

        frm.refresh_fields(); // Ensure updated values appear
        });
    }

    });


function toggle_fields_on_kidu_type(frm) {
 // Logic based on Kidu Type
 if (frm.doc.kidu_type === 'Land') {
    frm.set_df_property('land_size', 'hidden', 0);
 } 
else if (frm.doc.kidu_type === 'Elderly') {
    // frm.set_df_property('cid', 'hidden', 0);
    // frm.set_df_property('gender', 'hidden', 0);
    // frm.set_df_property('dzongkhag', 'hidden', 0);
 } 
else if (frm.doc.kidu_type === 'Disability') {
    // frm.set_df_property('cid', 'hidden', 0);
    // frm.set_df_property('full_name', 'hidden', 0);
    // frm.set_df_property('gewog', 'hidden', 0);
}
}
