# update_file_url.py

import frappe
import csv

def update_file_url():
    file_path = "/home/frappe/cid_list.csv"

    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cid = row['cid']

            file = frappe.get_all(
                "File",
                filters={"file_name": ["like", f"{cid}%"]},
                fields=["file_url"],
                limit=1
            )

            if not file:
                print(f"No file for CID: {cid}")
                continue

            registration = frappe.get_all(
                "tabKidu Registration",
                filters={"cid": cid},
                fields=["name"]
            )

            if not registration:
                print(f"No Registration for CID: {cid}")
                continue

            reg_doc = frappe.get_doc("Kidu Registration", registration[0].name)
            reg_doc.application = file[0].file_url
            reg_doc.save(ignore_permissions=True)

            print(f"Updated CID: {cid}")