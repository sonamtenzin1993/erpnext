# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {"label": "Name", "fieldname": "recipientName", "fieldtype": "Data", "width": 150},
        {"label": "CID", "fieldname": "cid", "fieldtype": "Data", "width": 150},
        {"label": "DoB", "fieldname": "dob", "fieldtype": "phone", "width": 150},
        {"label": "Contact No", "fieldname": "contact_no", "fieldtype": "phone", "width": 150},
        {"label": "Title", "fieldname": "title", "fieldtype": "Data", "width": 150},
        {"label": "Location", "fieldname": "location", "fieldtype": "Data", "width": 150},
        {"label": "Event Name", "fieldname": "event_name", "fieldtype": "Data", "width": 150},
        {"label": "Confer By","options": "Conferred By", "fieldname": "conferred_by", "fieldtype": "Link", "width": 150},
        {"label": "Citation", "fieldname": "citation", "fieldtype": "Data", "width": 150},
        {"label": "Award or Appointment Date", "fieldname": "issued_date", "fieldtype": "Data", "width": 150},
        {"label": "PostThumous","fieldname": "postThumous", "fieldtype": "check", "width": 150},
        {"label": "Link to Profile","options": "Key Person Registry", "fieldname": "profile", "fieldtype": "Link", "width": 150},
        {"label": "Kasho","options": "Kasho", "fieldname": "kasho", "fieldtype": "Link", "width": 150},
    ]
    
def get_data(filters):
    conditions = []

    if filters.get("cid"):
        conditions.append("aw.cid = %(cid)s")

    if filters.get("title_medal"):
        conditions.append("aw.title = %(title_medal)s")
    # ✅ FORCE Kasho Type (no frontend dependency)
    conditions.append("k.kasho_type IN ('Award', 'Appointment')")
        
    start_date = filters.get("start_date")
    end_date = filters.get("end_date")

    if start_date and end_date:
        if end_date < start_date:
            frappe.throw("End Date must be greater than Start Date")
        conditions.append("k.issue_date BETWEEN %(start_date)s AND %(end_date)s")
    elif start_date:
        conditions.append("k.issue_date >= %(start_date)s")
    elif end_date:
        conditions.append("k.issue_date <= %(end_date)s")

    where_clause = " AND ".join(conditions)

    if where_clause:
        where_clause = "WHERE " + where_clause
    else:
        return []  # 🚨 No filters → no data

    return frappe.db.sql(f"""
        SELECT 
			aw.cid AS cid,
			kpr.registry_name AS recipientName,
			kpr.dob AS dob,
			aw.title AS title,
			aw.location AS location,
			aw.event_name AS event_name,
			aw.conferred_by AS conferred_by,
			aw.citation AS citation,
			k.issue_date AS issued_date,
			aw.citation AS citation,
			k.name AS kasho,
			kpr.name AS profile,
			aw.postThumous AS postThumous
		FROM `tabAward and Appointment` aw
		INNER JOIN `tabKasho` k 
			ON aw.parent = k.name
		LEFT JOIN `tabKey Person Registry` kpr 
			ON kpr.cid = aw.cid
        {where_clause}
    """, filters, as_dict=1)



