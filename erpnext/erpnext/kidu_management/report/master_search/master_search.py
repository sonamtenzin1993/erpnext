import frappe

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data


def get_columns():
    return [
        {"label": "Registration No", "fieldname": "registration_no", "fieldtype": "Data", "width": 150},
        {"label": "Full Name", "fieldname": "full_name", "fieldtype": "Data", "width": 150},
        {"label": "CID", "fieldname": "cid", "fieldtype": "Data", "width": 150},
        {"label": "Phone No", "fieldname": "contact_no", "fieldtype": "phone", "width": 150},
        {"label": "Status", "fieldname": "workflow_state", "fieldtype": "Data", "width": 150}
    ]


def get_data(filters):
    # 🚨 If no filter is given, return empty
    if not filters or not filters.get("cid"):
        return []

    return frappe.db.sql("""
        SELECT 
            kr.cid,
            kr.registration_no,
            kr.full_name,
            kr.contact_no,
            COALESCE(kp.workflow_state, 'Register') AS workflow_state
        FROM `tabKidu Registration` kr
        LEFT JOIN `tabKidu Profile` kp
            ON kr.name = kp.registration_no
        WHERE kr.cid = %(cid)s
    """, filters, as_dict=1)