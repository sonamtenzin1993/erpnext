# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime
from frappe.utils import getdate

class Kasho(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from erpnext.kidu_management.doctype.kidu_recipient.kidu_recipient import KiduRecipient
        from frappe.types import DF

        amended_from: DF.Link | None
        document_type: DF.Link
        dzongkhag: DF.Link
        issue_date: DF.Date
        kasho: DF.Attach
        kasho_no: DF.Data | None
        kasho_type: DF.Link
        kidu_recipient: DF.Table[KiduRecipient]
        registration_no: DF.Data | None
    # end: auto-generated types

    # def autoname(self):
    #     frappe.msgprint('document_name')
    #      if self.document_name=='Kasho':
    #         # Populate child table before generating name
    #         self.append_members_to_kidu_recipient()

    #         # Count total recipients
    #         recipient_count = len(self.kidu_recipient)
            
    #         kidu_type_code=frappe.get_value(
    #             "Kidu Type Name",  # target Doctype
    #             {"name": self.kasho_type},  # filter condition
    #             ["kidu_type_code"],  # fields to fetch
    #             as_dict=True
    #         ).get('kidu_type_code')

    #         dzongkhag_code=frappe.get_value(
    #             "Dzongkhag",  # target Doctype
    #             {"name": self.dzongkhag},  # filter condition
    #             ["dzongkhag_code"],  # fields to fetch
    #             as_dict=True
    #         ).get('dzongkhag_code')

    #         # Generate Kasho number 
    #         kasho_no=generate_kasho_no(
    #             kidu_type_code=kidu_type_code,
    #             dzongkhag_code=dzongkhag_code,
    #             recipient_count=recipient_count
    #         )
    #         self.name = kasho_no
    #     else:
    #         document_type = (self.document_name or '').strip().upper()
    #         if document_type == "LAND":
    #             prefix = "LAND"
    #         elif document_type == "CENSUS":
    #             prefix = "CEN"
    #         elif document_type == "LEGAL":
    #             prefix = "LEGAL"
    #         elif document_type == "MEDICAL EXPENSE":
    #             prefix = "ME"
    #         elif document_type == "DISASTER":
    #             prefix = "DS"
    #         elif document_type == "GOENSHO ZHABTOG":
    #             prefix = "GZ"
    #         elif document_type == "MARRIAGE CERTIFICATE":
    #             prefix = "MC"
    #         elif document_type == "ROYAL SOELRA":
    #             prefix = "RS"
    #         elif document_type == "TRAVEL DOCUMENT":
    #             prefix = "TD"
    #         elif document_type == "NOC/Security Clearance":
    #             prefix = "NOC"
    #         elif document_type == "VISA":
    #             prefix = "VISA"
    #         elif document_type == "WORK PERMIT":
    #             prefix = "WP"
    #         else:
    #             prefix = "MISC"
    #         series_format = f"{prefix} ####"
            
    #         self.name = series_format
    def autoname(self):
        document_type = (self.document_type or "").strip().upper()

        if document_type == "KASHO":
            # Populate child table before generating name
            self.append_members_to_kidu_recipient()

            # Count total recipients
            recipient_count = len(self.kidu_recipient or [])

            kidu_type_code = frappe.get_value(
                "Kidu Type Name",
                self.kasho_type,
                "kidu_type_code"
            )

            dzongkhag_code = frappe.get_value(
                "Dzongkhag",
                self.dzongkhag,
                "dzongkhag_code"
            )

            # Generate Kasho number
            kasho_no = generate_kasho_no(
                kidu_type_code=kidu_type_code,
                dzongkhag_code=dzongkhag_code,
                recipient_count=recipient_count,
                kasho_issued_date=self.issue_date
            )

            self.name=kasho_no
            self.kasho_no=kasho_no

        else: 
            kasho_type = (self.kasho_type or "").strip().upper()
            if "LAND" in kasho_type:
                prefix = "LAND"
            elif "CENSUS" in kasho_type:
                prefix = "CEN"
            elif "LEGAL" in kasho_type:
                prefix = "LEGAL"
            elif "MEDICAL" in kasho_type:
                prefix = "ME"
            elif "DISASTER" in kasho_type:
                prefix = "DS"
            elif "GOENSHO" in kasho_type:
                prefix = "GZ"
            elif "MARRIAGE" in kasho_type:
                prefix = "MC"
            elif "ROYAL SOELRA" in kasho_type:
                prefix = "RS"
            elif "TRAVEL" in kasho_type:
                prefix = "TD"
            elif "NOC" in kasho_type:
                prefix = "NOC"
            elif "VISA" in kasho_type:
                prefix = "VISA"
            elif "WORK PERMIT" in kasho_type:
                prefix = "WP"
            else:
                prefix = "MISC"
            kasho_no = frappe.model.naming.make_autoname(f"{prefix}.####")
            self.name=kasho_no
            self.kasho_no=kasho_no



    def append_members_to_kidu_recipient(self):
        """
        Fetch parent + members and append to 'kidu_recipient' child table.
        """
        if not self.registration_no:
            return

        # Fetch flattened rows using module-level function
        child_rows = get_kasho_member_data(self.registration_no)

        # Clear existing child table
        self.set("kidu_recipient", [])

        # Append each row
        for row in child_rows:
            child = self.append("kidu_recipient", {})
            child.cid = row.get("cid")
            child.full_name = row.get("full_name")
            child.dzongkhag = row.get("dzongkhag")


@frappe.whitelist()
def get_kasho_member_data(registration_no):
    """
    Module-level function to fetch parent + members for a registration_no.
    Returns a list of dicts for child table.
    """
    # Step 1: Fetch approved Kidu Profile
    profile = frappe.db.get_value(
        "Kidu Profile",
        {
            "registration_no": registration_no,
            "workflow_state": "Approved"
        },
        ["registration_no", "application_mode"],
        as_dict=True
    )

    if not profile:
        return []

    # Step 2: Fetch Kidu Registration
    reg_doc = frappe.get_doc("Kidu Registration", profile["registration_no"])

    child_rows = []

    # Parent row
    child_rows.append({
        "cid": reg_doc.cid,
        "full_name": reg_doc.full_name,
        "dzongkhag": reg_doc.dzongkhag
    })

    # Members (if Individual + Member)
    if profile.get("application_mode") == "Individual and Member" and reg_doc.member:
        for m in reg_doc.member:
            child_rows.append({
                "cid": m.cid,
                "full_name": m.full_name,
                "dzongkhag": reg_doc.dzongkhag
            })

    return child_rows

@frappe.whitelist()
def fetch_citizen_photo_base64(cid):
    """
    Calls external API, retrieves Base64 image, and returns it to client
    """
    response = requests.get(cid)
    if response.status_code != 200:
        frappe.throw(f"Failed to fetch API: {response.status_code}")
    
    data = response.json()
    
    # Adjust path based on your API
    base64_image = data["citizenimages"]["citizenimage"][0]["image"]
    
    return base64_image


def generate_kasho_no(kidu_type_code, dzongkhag_code, recipient_count,kasho_issued_date):
    """
    Generate Kasho number in the format:
    [KashoType][yymmdd][Dzongkhag][Serial][RecipientCount]
    """
    kasho_issued_date_converted = getdate(kasho_issued_date)
    kidu_type_code = f"{int(kidu_type_code):02d}"
    # frappe.msgprint(kasho_issued_date)
    date_part = kasho_issued_date_converted.strftime("%y%m%d")
    dzongkhag_code = f"{int(dzongkhag_code):02d}"

    # Serial number (11-13 digits)
    last_kasho = frappe.db.sql("""
        SELECT name FROM `tabKasho`
        WHERE name LIKE %s
        ORDER BY creation DESC LIMIT 1
    """, (f"{kidu_type_code}{date_part}{dzongkhag_code}%",))

    if last_kasho:
        last_serial = int(last_kasho[0][0][10:13])
        next_serial = last_serial + 1
    else:
        next_serial = 1

    serial_part = f"{next_serial:03d}"
    recipient_part = f"{int(recipient_count):04d}"

    return f"{kidu_type_code}{date_part}{dzongkhag_code}{serial_part}{recipient_part}"
