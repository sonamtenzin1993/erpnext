# # Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# # For license information, please see license.txt

# import frappe

# def execute(filters=None):
#     columns = get_columns()
#     data = get_data(filters)
    
#     chart = {
#         "data": {
#             "labels": [row.title for row in data],
#             "datasets": [
#                 {
#                     "values": [row.total_scarf for row in data]
#                 }
#             ]
#         },
#         "type": "pie",
#         "colors": [
#             "#8B0000",  # Dark Red
#             "#FFA500",  # Orange
#             "#FFFFFF"   # White
#         ]
#     }
#     return columns, data, None, chart


# def get_columns():
#     return [
#         {
#             "label": "Year",
#             "fieldname": "year",
#             "fieldtype": "Data",
#             "width": 150
#         },
#         {
#             "label": "Total Appointment",
#             "fieldname": "total_appointment",
#             "fieldtype": "Int",
#             "width": 150
#         }
#     ]


# def get_data(filters):
#     return frappe.db.sql("""
#      SELECT
#             YEAR(aw.start_term) AS year,
#             COUNT(*) AS total_appointment
#     FROM `tabLeadership Appointment` aw
#     INNER JOIN `tabKasho` k
#         ON aw.parent = k.name
#     LEFT JOIN `tabKey Person Registry` kpr
#         ON kpr.cid = aw.cid
#     WHERE k.kasho_type = 'Appointment'
#     GROUP BY YEAR(aw.start_term)
#     ORDER BY YEAR(aw.start_term);
#     """, as_dict=True)
# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)

    chart = {
        "data": {
            "labels": [str(row.year) for row in data],
            "datasets": [
                {
                    "values": [row.total_appointment for row in data]
                }
            ]
        },
        "type": "pie",
        "colors": [
            "#8B0000",  # Dark Red
            "#FFA500",  # Orange
            "#FFFFFF"   # White
        ]
    }

    return columns, data, None, chart


def get_columns():
    return [
        {
            "label": "Year",
            "fieldname": "year",
            "fieldtype": "Data",
            "width": 150
        },
        {
            "label": "Total Appointment",
            "fieldname": "total_appointment",
            "fieldtype": "Int",
            "width": 150
        }
    ]


def get_data(filters=None):
    filters = filters or {}

    conditions = [
        "k.kasho_type = 'Appointment'"
    ]

    if filters.get("conferred_by"):
        conditions.append(
            "aw.conferred_by = %(conferred_by)s"
        )

    return frappe.db.sql(
        f"""
        SELECT
            YEAR(aw.start_term) AS year,
            COUNT(*) AS total_appointment

        FROM `tabLeadership Appointment` aw

        INNER JOIN `tabKasho` k
            ON aw.parent = k.name

        LEFT JOIN `tabKey Person Registry` kpr
            ON kpr.cid = aw.cid

        WHERE {" AND ".join(conditions)}

        GROUP BY YEAR(aw.start_term)

        ORDER BY YEAR(aw.start_term)
        """,
        filters,
        as_dict=True
    )


