// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kidu Profile", {
    // Triggered when the form is loaded
    onload(frm) {
        // Auto-fetch if link is already selected
        if(frm.doc.kidu_registration) {
            frm.trigger('registration_no');
        }

        if(frm.doc.kidu_type) {
            toggle_fields_on_kidu_type(frm, frm.doc.kidu_type);
        }

        if(frm.doc.application_mode) {
            toggle_fields_on_kidu_type(frm, frm.doc.application_mode);
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
            // // Populate Profile fields
            // if(reg.application_mode === 'Organization' || reg.application_mode==='Group'){
            //     frm.set_df_property('photo', 'reqd', 0);
            //     frm.set_df_property('photo', 'hidden', 1);
            // }else{
            //     frm.set_df_property('photo', 'reqd', 1);
            //     frm.set_df_property('photo', 'hidden', 0);  
            // }

            frm.set_df_property('emergency_contact_no', 'hidden', 1);
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
            frm.set_value('is_soelra', reg.is_soelra || 0);
            frm.set_value('case_type', reg.case_type || '');
            frm.set_value('organization', reg.organization || '');
            
            //populate the field based on the Kidu
            // if(reg.kidu_type=='Legal'){
            //     frm.set_df_property('case_type', 'reqd', 1);
            //     frm.set_df_property('case_type', 'hidden', 0);
            //     frm.set_value('case_type', reg.case_type);

            // }else{
            //     frm.set_df_property('case_type', 'reqd', 0);
            //     frm.set_df_property('case_type', 'hidden', 1);
            //     frm.set_value('case_type','');
            // }

            // //populate the field based on the Kidu
            // if(reg.organization=='Organization'){
            //     frm.set_df_property('organization', 'reqd', 1);
            //     frm.set_df_property('organization', 'hidden', 0);
            //     frm.set_value('organization', reg.organization);
            // }else{
            //     frm.set_df_property('organization', 'reqd', 0);
            //     frm.set_df_property('organization', 'hidden', 1);
            //     frm.set_value('organization','');
            // }

            // //Gyalpoi Tozay
            // if(reg.kidu_type=='Gyalpoi Tozay'){
            //     frm.set_df_property('std_code', 'reqd', 1);
            //     frm.set_df_property('std_code', 'hidden', 0);
            // }else{
            //     frm.set_df_property('std_code', 'reqd', 0);
            //     frm.set_df_property('std_code', 'hidden', 1);
            // }

            // // Status field for Gensho Zhabtoga or Gyalpoi Tozay
            // if(reg.kidu_type=='Gensho Zhabtog' || reg.kidu_type=='Gyalpoi Tozay'){
            //     frm.set_df_property('status', 'reqd', 1);
            //     frm.set_df_property('status', 'hidden', 0);
            // }else{
            //     frm.set_df_property('status', 'reqd', 0);
            //     frm.set_df_property('status', 'hidden', 1);
            // }
            //  //Populate Land and Legal fields
            // if(reg.kidu_type=='Land'|| reg.kidu_type=='Legal'){
            //     frm.set_df_property('kidu_sub_type', 'reqd', 1);
            //     frm.set_df_property('kidu_sub_type', 'hidden', 0);
            // }else{
            //     frm.set_df_property('kidu_sub_type', 'reqd', 0);
            //     frm.set_df_property('kidu_sub_type', 'hidden', 1);
            // }
            toggle_fields_on_kidu_type(frm, reg.kidu_type);
            toggle_fields_on_application_mode(frm, reg.application_mode)
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


function toggle_fields_on_kidu_type(frm, kidu_type) {
    // Land
    // frm.set_df_property('land_size', 'hidden', kidu_type !== 'Land');

    //Show and hide kidu Sub Type field
    const show_kidu_sub_type = kidu_type === 'Land' || 
    kidu_type === 'Legal';
    frm.set_df_property('kidu_sub_type', 'reqd', show_kidu_sub_type ? 1 : 0);
    frm.set_df_property('kidu_sub_type', 'hidden', show_kidu_sub_type ? 0 : 1);

    // Status field for Gensho Zhabtog Gyalpoi Tozay
    const show_status = kidu_type === 'Gensho Zhabtog' || 
    kidu_type === 'Gyalpoi Tozay';
    frm.set_df_property('status', 'reqd', show_status ? 1 : 0);
    frm.set_df_property('status', 'hidden', show_status ? 0 : 1);

    // Gyalpoi Tozay
    const show_std_code = kidu_type === 'Gyalpoi Tozay';
    frm.set_df_property('std_code', 'reqd', show_std_code ? 1 : 0);
    frm.set_df_property('std_code', 'hidden', show_std_code ? 0 : 1);
    
    //Legal
    const show_cast_type = kidu_type === 'Legal';
    frm.set_df_property('case_type', 'reqd', show_cast_type ? 1 : 0);
    frm.set_df_property('case_type', 'hidden', show_cast_type ? 0 : 1);
}

function toggle_fields_on_application_mode(frm, application_mode) {
    //Application mode Organization or Group
    const show_photo = application_mode === 'Organization' || application_mode === 'Group' ;
    frm.set_df_property('photo', 'reqd', show_photo ? 0 : 1);
    frm.set_df_property('photo', 'hidden', show_photo ? 1 : 0);

    //Applicatio is Organization
    const show_organization = application_mode === 'Organization';
    frm.set_df_property('organization', 'reqd', show_photo ? 1 : 0);
    frm.set_df_property('organization', 'hidden', show_photo ? 0 : 1);
}
