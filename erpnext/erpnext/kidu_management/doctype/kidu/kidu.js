// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kidu", {
	refresh(frm) {
        // Ensure workflow state field exists
        //  frm.trigger('toggle_child_table_visibility');
        //  frm.trigger('fetch_land_details');
        if (frm.doc.workflow_state) {
            // Hide or show field based on workflow state
            if (frm.doc.workflow_state === 'Waiting for Profiling' || frm.doc.workflow_state === 'Waiting for Approval'
                ||frm.doc.workflow_state === 'Waiting for Kidu Receive'|| frm.doc.workflow_state ==='Kidu Received') {
                frm.set_df_property('appeal_reason', 'hidden', 0);
                frm.set_df_property('profile_date', 'hidden', 0);
                frm.set_df_property('appeal_place', 'hidden', 0);
                frm.set_df_property('land_size', 'hidden', 0);
                frm.set_df_property('brief_background', 'hidden', 0);
                frm.set_df_property('photo', 'hidden', 0);
            } else {
               frm.set_df_property('appeal_reason', 'hidden', 1);
                frm.set_df_property('profile_date', 'hidden', 1);
                frm.set_df_property('appeal_place', 'hidden', 1);
                frm.set_df_property('land_size', 'hidden', 1);
                frm.set_df_property('brief_background', 'hidden', 1);
                 frm.set_df_property('photo', 'hidden', 1);
            }
        }
    },

    // Trigger on workflow state change
    workflow_state(frm) {
        frm.trigger('refresh');
    },
    onload: function(frm) {
        // frm.trigger('toggle_child_table_visibility');
        // frm.set_query("dzongkhag", function () {
		// 	return {
		// 		filters: {
		// 			'is_dzongkhag': 1,
		// 		},
		// 	};
		// });
		// frm.set_query("gewog", function () {
		// 	return {
		// 		filters: {
		// 			'is_gewog': 1,
		// 			'parent_dzongkhag': frm.doc.dzongkhag
		// 		},
		// 	};
		// });
		// frm.set_query("village", function () {
		// 	return {
		// 		filters: {
		// 			'is_village': 1,
		// 		},
		// 	};
		// });

        if (frm.doc.kidu_type === 'Land') {
            frm.set_df_property('kidu_sub_type', 'hidden', 0);
            frm.set_df_property('fetch_land_details', 'hidden', 0);
        } else {
            frm.set_df_property('kidu_sub_type', 'hidden', 1);
            frm.set_df_property('fetch_land_details', 'hidden', 1);
        }
    },

    kidu_type:function (frm){
        let selected_kidu_type = frm.doc.kidu_type;
        // frm.trigger('toggle_child_table_visibility');
        if(selected_kidu_type=='Land'){
            frappe.call({
                method: "erpnext.kidu_management.doctype.kidu.kidu.get_kidu_sub_type",
                args: {
                    kidu_type: selected_kidu_type
                },
                callback: function(r) {
                    frm.set_df_property('kidu_sub_type', 'hidden', 0);
                    frm.set_df_property('family_land_detail', 'hidden', 0);
                     frm.set_df_property('fetch_land_details', 'hidden', 0);
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
                        frm.set_df_property('family_land_detail', 'hidden', 1);
                         frm.set_df_property('fetch_land_details', 'hidden', 1);
                    }
                }
            });
        } else{
            frm.set_query('kidu_sub_type', function() {
                return {};
              });
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
                        frm.set_value('applicant_name',name);
                        let dob=r.message.dob;
                        let parts = dob.split("/");
                        if (parts.length === 3) {
                            let formatted_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                            frm.set_value("dob", formatted_date);
                        }

                        frm.set_value('thram_no',r.message.thramNo);
                        frm.set_value('house_no',r.message.houseNo);                        
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

     toggle_child_table_visibility: function(frm) {
        if (frm.doc.kidu_type === 'Land') {
            frm.set_df_property('family_land_detail', 'hidden', 0);
            // frm.set_df_property('fetch_land_details', 'hidden', 0);
        } else {
            frm.set_df_property('family_land_detail', 'hidden', 1);
            // frm.set_df_property('fetch_land_details', 'hidden', 1);
        }
    },



    fetch_land_details: function(frm) {
        // ✅ This runs when your button field is clicked
        if (frm.doc.cid && frm.doc.cid.trim() !== '') {
            frappe.call({
                method: "erpnext.api_setting.get_family_land_detail",
                args: { cid: frm.doc.cid },
                callback: function(res) {
                    if (res.message) {
                        frm.clear_table('family_land_detail');
                        let land_details = res.message;
                        frm.trigger('toggle_child_table_visibility');
                        Object.keys(land_details).forEach(index => {
                            const landDetails = land_details[index].landDetail;
                            if (Array.isArray(landDetails)) {
                                landDetails.forEach((detail) => {
                                    let child = frm.add_child('family_land_detail');
                                    child.cid = detail.ownerCid;
                                    child.family_name = detail.ownerName;
                                    child.plot_no = detail.plotId;
                                    child.net_plot_area = detail.plotNetArea;
                                    child.thram_no = detail.thramNumber;
                                    child.plot_name = detail.plotName;
                                    child.gewog_thromde_village = detail.gewogOrThromdeVillage;
                                    child.land_type = detail.landLocationFlag;
                                });
                            }
                        });

                        frm.refresh_field('family_land_detail');
                        // frappe.msgprint("✅ Family Land Details loaded successfully!");
                    } else {
                        frappe.msgprint("⚠️ No land details found for this CID.");
                    }
                }
            });
        } else {
            frappe.msgprint("⚠️ Please enter a valid CID before loading land details.");
        }
    }
    
});
