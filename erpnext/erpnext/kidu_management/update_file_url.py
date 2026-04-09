# # file: erpnext/kidu_management/update_file_url.py
# import frappe
# import csv
# import os

# def update_file_url():
#     """
#     Updates the 'application' field in Kidu Registration
#     using the 'file_url' from File based on matching CID from CSV.
#     """

#     # Path to CSV file (update if needed)
#     file_path = "/home/tshering/cid_list.csv"

#     if not os.path.exists(file_path):
#         print(f"CSV file not found: {file_path}")
#         return

#     # Open CSV and read CIDs
#     with open(file_path, newline='') as csvfile:
#         reader = csv.DictReader(csvfile)
#         for row in reader:
#             cid = row.get('cid')
#             if not cid:
#                 print("Skipping row without CID:", row)
#                 continue

#             # Find File linked to this CID
#             files = frappe.get_all(
#                 "File",  # Correct DocType name
#                 filters={"file_name": ["like", f"{cid}%"]},
#                 fields=["file_url"],
#                 limit=1
#             )

#             if not files:
#                 print(f"No File found for CID: {cid}")
#                 continue

#             # Find Kidu Registration for this CID
#             registrations = frappe.get_all(
#                 "Kidu Registration",
#                 filters={"cid": cid},
#                 fields=["name"],
#                 limit=1
#             )

#             if not registrations:
#                 print(f"No Kidu Registration found for CID: {cid}")
#                 continue

#             # Update the registration document
#             try:
#                 reg_doc = frappe.get_doc("Kidu Registration", registrations[0].name)
#                 reg_doc.application = files[0].file_url
#                 reg_doc.save(ignore_permissions=True)
#                 print(f"Updated CID: {cid}")
#             except Exception as e:
#                 print(f"Error updating CID {cid}: {str(e)}")
# #  run:bench --site ks.ogz.bt execute erpnext.kidu_management.update_file_url.update_file_url

# file: erpnext/kidu_management/update_file_url.py
import frappe
import csv
import os

def update_file_url():
    """
    Updates the 'application' field in Kidu Registration
    using the 'file_url' from File based on matching CID from CSV.
    """

    # Path to CSV file (update if needed)
    file_path = "/home/tshering/cid_list.csv"

    if not os.path.exists(file_path):
        print(f"CSV file not found: {file_path}")
        return

    # Open CSV and read CIDs
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cid = row.get('cid')
            if not cid:
                print("Skipping row without CID:", row)
                continue

            # Find File linked to this CID
            files = frappe.get_all(
                "File",  # Correct DocType name
                filters={"file_name": ["like", f"{cid}Photo%"]},
                fields=["file_url"],
                limit=1
            )

            if not files:
                print(f"No File found for CID: {cid}")
                continue

            # Find Kidu Registration for this CID
            registrations = frappe.get_all(
                "Kidu Profile",
                filters={"cid": cid},
                fields=["name"],
                limit=1
            )

            if not registrations:
                print(f"No Kidu Registration found for CID: {cid}")
                continue

            # Update the registration document
            try:
                reg_doc = frappe.get_doc("Kidu Profile", registrations[0].name)
                reg_doc.photo = files[0].file_url
                reg_doc.save(ignore_permissions=True)
                print(f"Updated CID: {cid}")
            except Exception as e:
                print(f"Error updating CID {cid}: {str(e)}")
#  run:bench --site ks.ogz.bt execute erpnext.kidu_management.update_file_url.update_file_url