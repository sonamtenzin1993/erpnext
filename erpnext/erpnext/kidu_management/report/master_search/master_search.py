import frappe

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data

def get_columns():
    return [
        {"label": "Registration No","options": "Kidu Registration", "fieldname": "name", "fieldtype": "Link", "width": 150},
        {"label": "Full Name", "fieldname": "full_name", "fieldtype": "Data", "width": 150},
        {"label": "CID", "fieldname": "cid", "fieldtype": "Data", "width": 150},
        {"label": "Phone No", "fieldname": "contact_no", "fieldtype": "phone", "width": 150},
        {"label": "Status", "fieldname": "workflow_state", "fieldtype": "Data", "width": 150},
        {"label": "Kidu Type", "fieldname": "kidu_type", "fieldtype": "Data", "width": 150},
        {"label": "Kidu Sub Type", "fieldname": "kidu_sub_type", "fieldtype": "Data", "width": 150},
        {"label": "View Profile","options": "Kidu Profile", "fieldname": "profile_name", "fieldtype": "Link", "width": 150},

    ]
    

def get_data(filters):
    conditions = []

    if filters.get("cid"):
        conditions.append("kr.cid = %(cid)s")

    if filters.get("registration_no"):
        conditions.append("kr.name = %(registration_no)s")

    where_clause = " AND ".join(conditions)

    if where_clause:
        where_clause = "WHERE " + where_clause
    else:
        return []  # 🚨 No filters → no data

    return frappe.db.sql(f"""
        SELECT 
            kr.cid,
            kr.name,
            kr.full_name,
            kr.contact_no,
            kr.kidu_type,
            kr.kidu_sub_type,
            kp.name AS profile_name,
            COALESCE(kp.workflow_state, 'Register') AS workflow_state
        FROM `tabKidu Registration` kr
        LEFT JOIN `tabKidu Profile` kp
            ON kr.name = kp.registration_no
        {where_clause}
    """, filters, as_dict=1)