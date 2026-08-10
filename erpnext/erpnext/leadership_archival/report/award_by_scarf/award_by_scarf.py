# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    
    chart = {
        "data": {
            "labels": [row.title for row in data],
            "datasets": [
                {
                    "values": [row.total_scarf for row in data]
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
            "label": "Title",
            "fieldname": "title",
            "fieldtype": "Data",
            "width": 150
        },
        {
            "label": "Total Scarf",
            "fieldname": "total_scarf",
            "fieldtype": "Int",
            "width": 150
        }
    ]


def get_data(filters):
    return frappe.db.sql("""
        SELECT
            aw.title AS title,
            COUNT(*) AS total_scarf
        FROM `tabAward and Appointment` aw
        INNER JOIN `tabKasho` k
            ON aw.parent = k.name
        WHERE aw.title LIKE '%Scarf%'
        GROUP BY aw.title
    """, as_dict=True)



