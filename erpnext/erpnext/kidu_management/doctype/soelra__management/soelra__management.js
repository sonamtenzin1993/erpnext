// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Soelra  Management", {
	refresh(frm) {
	},
    // Triggered when Kidu Registration link changes
    registration(frm) {
        if(!frm.doc.registration) return;

        // Fetch the linked Kidu Registration document
        frappe.db.get_doc('Kidu Registration', frm.doc.registration).then(reg => {
            // //Fetch citizen photo from DCRC
            // frappe.call({
            //     method: "erpnext.kidu_management.doctype.kidu_profile.kidu_profile.fetch_citizen_photo_base64",
            //     args: { cid: reg.cid },
            //     callback: function(r) {
            //         if(r.message){
            //             let base64_img = r.message.image; // Base64 from API
            //             let doctype = frm.doc.doctype;    // Current DocType
            //             let docname = frm.doc.name;       // Current document name
            //             let fieldname = "photo";          // Field to attach image
            //             let filename = "citizen_photo.jpeg";

            //             // 1️⃣ Option: Set directly as data URL (quick display, not stored as File doc)
            //             let data_url = "data:image/jpeg;base64," + base64_img;
            //             frm.set_value(fieldname, data_url);
            //             frm.refresh_field(fieldname);

            //             // 2️⃣ Option: Properly save as File in Frappe (recommended)
            //             frappe.call({
            //                 method: "frappe.client.insert",
            //                 args: {
            //                     doc: {
            //                         doctype: "File",
            //                         file_name: filename,
            //                         attached_to_doctype: doctype,
            //                         attached_to_name: docname,
            //                         attached_to_field: fieldname,
            //                         is_private: 1,
            //                         content: base64_img,
            //                         decode: 1
            //                     }
            //                 },
            //                 callback: function(file_r) {
            //                     if(file_r && file_r.message){
            //                         let file_doc = file_r.message;

            //                         // Set the DocType image field to the file URL
            //                         frm.set_value("photo", file_doc.file_url);  // e.g., /private/files/citizen_photo.jpeg
            //                         frm.refresh_field("photo");
            //                         // frappe.msgprint(`File "${file_doc.file_name}" attached successfully.`);
            //                      }
            //                 }
            //             });
            //         }
            //     }
            // });

            // // Populate Profile fields
            // frm.set_df_property('emergency_contact_no', 'hidden', 1);
            // if(frm.doc.application_mode==='Organization' || frm.doc.application_mode==='Group'){
            //     frm.set_df_property('photo', 'reqd', 0);
            //     frm.set_df_property('photo', 'hidden', 1);
            // }else{
            //     frm.set_df_property('photo', 'reqd', 1);
            //     frm.set_df_property('photo', 'hidden', 0);            
            // }

            //Gyalpoi Tozay
            if(reg.kidu_type=='Gyalpoi Tozay'){
                frm.set_df_property('school_college', 'reqd', 1);
                frm.set_df_property('school_college', 'hidden', 0);
                frm.set_df_property('dzongkhag', 'reqd', 1);
                frm.set_df_property('dzongkhag', 'hidden', 0);
                frm.set_df_property('class_year', 'reqd', 1);
                frm.set_df_property('class_year', 'hidden', 0);
                frm.set_df_property('result', 'reqd', 1);
                frm.set_df_property('result', 'hidden', 0);
                frm.set_df_property('score', 'reqd', 1);
                frm.set_df_property('score', 'hidden', 0);
                frm.set_df_property('is_college', 'hidden', 0);        
            }else{
                frm.set_df_property('school_college', 'reqd', 0);
                frm.set_df_property('school_college', 'hidden', 1);
                frm.set_df_property('dzongkhag', 'reqd', 0);
                frm.set_df_property('dzongkhag', 'hidden', 1);
                frm.set_df_property('class_year', 'reqd', 0);
                frm.set_df_property('class_year', 'hidden', 1);
                frm.set_df_property('result', 'reqd', 0);
                frm.set_df_property('result', 'hidden', 1);
                frm.set_df_property('score', 'reqd', 0);
                frm.set_df_property('score', 'hidden', 1);   
                frm.set_df_property('course_stream', 'reqd', 0);
                frm.set_df_property('course_stream', 'hidden', 1);   
                frm.set_df_property('is_college', 'hidden', 0);        
            }

            //Gensho Zhabtog
            if(reg.kidu_type=='Gensho Zhabtog'){
                frm.set_df_property('school_college', 'reqd', 0);
                frm.set_df_property('school_college', 'hidden', 1);
                frm.set_df_property('dzongkhag', 'reqd', 0);
                frm.set_df_property('dzongkhag', 'hidden', 1);
                frm.set_df_property('class_year', 'reqd', 0);
                frm.set_df_property('class_year', 'hidden', 1);
                frm.set_df_property('result', 'reqd', 0);
                frm.set_df_property('result', 'hidden', 1);
                frm.set_df_property('score', 'reqd', 0);
                frm.set_df_property('score', 'hidden', 1);
                frm.set_df_property('course_stream', 'reqd', 0);
                frm.set_df_property('course_stream', 'hidden', 1);
                 frm.set_df_property('is_college', 'hidden', 1);    
            }

            frm.set_value('cid', reg.cid || '');
            frm.set_value('applicant_name', reg.full_name || '');
           
            // frm.set_value('full_name', reg.full_name || '');
            // frm.set_value('dob', reg.dob || '');
            // frm.set_value('kidu_type', reg.kidu_type || '');
            // frm.set_value('application_mode', reg.application_mode || '');
            // frm.set_value('contact_no', reg.contact_no || '');
            // frm.set_value('emergency_contact_no', reg.emergency_contact_no || '');
            // frm.set_value('rc', reg.rc || '');
            // frm.set_value('application_channel', reg.application_channel || '');
            // frm.set_value('application', reg.application || '');
            // frm.set_value('gender', reg.gender || '');
            // frm.set_value('dzongkhag', reg.dzongkhag || '');
            // frm.set_value('gewog', reg.gewog || '');
            // frm.set_value('village', reg.village || '');
            // frm.set_value('kidu_sub_type', reg.kidu_sub_type || '');
            // frm.set_value('organization', reg.organization || '');
            // frm.set_value('is_soelra', reg.is_soelra || 0);
            // frm.refresh_fields();
        });
    }
});
