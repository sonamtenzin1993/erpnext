// Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("Kidu API", {
   
    refresh(frm) {
         frm.disable_save();
    },

    search(frm) {
        const cid = frm.doc.cid;

        if (!cid) {
            frappe.msgprint("Please enter CID before searching.");
            return;
        }

        frappe.call({
            method: "erpnext.kidu_management.doctype.kidu_api.kidu_api.get_vehicle",
            args: { cid: cid },
            callback(r) {
                const result = r.message;

                frm.clear_table("vehicle_detail"); // clear previous rows
                // Success: array of vehicle objects
                if (Array.isArray(result) && result.length > 0) {
                    result.forEach(row => {
                        let child = frm.add_child("vehicle_detail");
                        child.cid = row.cid;
                        child.name = row.name;
                        child.contact = row.contact;
                        child.make = row.make;
                        child.model = row.model;
                        child.registration_date = row.registrationDate;
                    });
                    frm.refresh_field("vehicle_detail");
                } else {
                    // No vehicle data returned
                    // let child = frm.add_child("vehicle_detail");
                    // child.make = "No vehicle data found for this CID.";
                    // child.model = "";
                    // child.registration_date = "";
                    frm.refresh_field("vehicle_detail");
                }
            }
        });

        frappe.call({
            method: "erpnext.kidu_management.doctype.kidu_api.kidu_api.get_shareholding_data",
            args: { cid: cid },
            callback(r) {
                const result = r.message.data;
                frm.clear_table("shareholding_tab"); // clear previous rows
                // Success: array of vehicle objects
                if (Array.isArray(result) && result.length > 0) {
                    result.forEach(row => {
                        let child = frm.add_child("shareholding_tab");
                        child.firm_name = row.firm_name;
                        child.unit = row.unit;
                        child.type = row.type;
                        child.unit_price = row.uniprice;
                    });
                    frm.refresh_field("shareholding_tab");
                } else {
                    frm.refresh_field("shareholding_tab");
                }
            }
        });


        frappe.call({
        method: "erpnext.kidu_management.doctype.kidu_api.kidu_api.get_family_land_detail_data",
        args: {cid: cid },
        callback: function(r) {
            if (!r.message) return;

            const message_list = r.message;

            // Clear table first
            frm.clear_table("family_land_detail_tab");

            message_list.forEach(item => {
                if (item.landDetail && item.landDetail.length > 0) {

                    item.landDetail.forEach(land => {
                        let child = frm.add_child("family_land_detail_tab");
                        child.cid = land.ownerCid;
                        child.family_name = land.ownerName;
                        child.thram_no = land.thramNumber;
                        child.plot_no = land.plotId;
                        child.plot_name = land.plotName;
                        child.net_plot_area = land.plotNetArea;
                        child.gewog_thromde_village = land.dzongkhagOrThromde;                       
                        child.land_type = land.landLocationFlag;
                    });
                }
            });

            frm.refresh_field("family_land_detail_tab");
            }
        });

         frappe.call({
            method: "erpnext.kidu_management.doctype.kidu_api.kidu_api.get_income_tax_data",
            args: { cid: cid },
            callback(r) {
                const result = r.message;
                frm.clear_table("income_tab"); // clear previous rows
                // Success: array of vehicle objects
                if (Array.isArray(result) && result.length > 0) {
                    result.forEach(row => {
                        console.log('OK')
                        let child = frm.add_child("income_tab");
                        child.building_type = row.buildingType;
                        child.location = row.location;
                        child.rental_income = row.rentalIncome;
                        child.tax_paid = row.taxPaid;
                        child.year = row.year;
                        child.status = row.status;

                    });
                    frm.refresh_field("income_tab");
                } else {
                    frm.refresh_field("income_tab");
                }
            }
        });


        frappe.call({
            method: "erpnext.kidu_management.doctype.kidu_api.kidu_api.get_property_tax_data",
            args: { cid: cid },
            callback(r) {
                const result = r.message;
                frm.clear_table("property_tax_tbl"); // clear previous rows
                // Success: array of vehicle objects
                if (Array.isArray(result) && result.length > 0) {
                    result.forEach(row => {
                        console.log('OK')
                        let child = frm.add_child("property_tax_tbl");
                        child.business_name = row.businessName;
                        child.business_sector = row.businessSector;
                        child.business_size = row.businessSize;
                         child.turn_over = row.turnOver;
                        child.tax_paid = row.taxPaid;
                        child.year = row.year;
                        child.status = row.status;

                    });
                    frm.refresh_field("property_tax_tbl");
                } else {
                    frm.refresh_field("property_tax_tbl");
                }
            }
        });


    }

});
