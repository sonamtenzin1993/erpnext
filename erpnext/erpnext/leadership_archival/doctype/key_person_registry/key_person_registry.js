// Copyright (c) 2026, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Key Person Registry", {
	refresh(frm) {

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
                        frm.set_value('registry_name',name);
                        let dob=r.message.dob;
                        let parts = dob.split("/");
                        if (parts.length === 3) {
                            let formatted_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                            frm.set_value("dob", formatted_date);
                        }
                        // frm.set_value('gender',r.message.gender=='M'?'Male':'Female');
                        frm.set_value('dzongkhag',r.message.dzongkhagName);
                        frm.set_value('gewog',r.message.gewogName);
                        frm.set_value('village',r.message.villageName);
                    } else {
                        frappe.msgprint("No Land found");
                    }
                }
            });
        }
    },
});
