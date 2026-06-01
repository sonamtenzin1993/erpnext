
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
        from erpnext.leadership_archival.doctype.award_and_appointment.award_and_appointment import AwardandAppointment
        from erpnext.leadership_archival.doctype.leadership_appointment.leadership_appointment import LeadershipAppointment
        from frappe.types import DF

        agency: DF.Link | None
        amended_from: DF.Link | None
        appointment: DF.Table[LeadershipAppointment]
        awardappointment: DF.Table[AwardandAppointment]
        document_type: DF.Link
        dzongkhag: DF.Link | None
        issue_date: DF.Date
        kasho: DF.Attach | None
        kasho_no: DF.Data | None
        kasho_type: DF.Link
        kidu_recipient: DF.Table[KiduRecipient]
        medal_title: DF.Link | None
        recipient_type: DF.Link
        registration_no: DF.Data | None
    # end: auto-generated types
    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from erpnext.kidu_management.doctype.kidu_recipient.kidu_recipient import KiduRecipient
        from erpnext.leadership_archival.doctype.award_and_appointment.award_and_appointment import AwardandAppointment
        from frappe.types import DF

        agency: DF.Link | None
        amended_from: DF.Link | None
        awardappointment: DF.Table[AwardandAppointment]
        document_type: DF.Link
        dzongkhag: DF.Link | None
        issue_date: DF.Date
        kasho: DF.Attach | None
        kasho_no: DF.Data | None
        kasho_type: DF.Link
        kidu_recipient: DF.Table[KiduRecipient]
        medal_title: DF.Link | None
        recipient_type: DF.Link
        registration_no: DF.Data | None

    def autoname(self):
        document_type = (self.document_type or "").strip().upper()

        if document_type == "KASHO":
            # Populate child table before generating name
            self.append_members_to_kidu_recipient()
            
            #Count total recipients
            if self.kasho_type=="Appointment":
                recipient_count = len(self.appointment or [])
                institution_code=frappe.get_value("Agency",self.agency,"agency_code")
            elif self.kasho_type=="Award":
                recipient_count = len(self.awardappointment or [])
                institution_code=frappe.get_value("Title",self.medal_title,"title_code")
            else:
                recipient_count = len(self.kidu_recipient or [])
                institution_code=frappe.get_value("Dzongkhag",self.dzongkhag,"dzongkhag_code")
                
            kasho_type_code = frappe.get_value("Kidu Type Name",self.kasho_type,"kidu_type_code")

            # Generate Kasho number
            kasho_no = generate_kasho_no(
                kasho_type_code=kasho_type_code,
                institution_code=institution_code,
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
            elif "APPOINTMENT" in kasho_type:
                prefix = "AP"
            elif "AW" in kasho_type:
                prefix = "AW"
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

    def on_submit(self):
        #Save to Award and Recognition
        for row in self.awardappointment:

            # Find Profile using child table CID
            profile_name = frappe.db.get_value(
                "Key Person Registry",
                {"cid": row.cid},
                "name"
            )

            # Skip if Profile does not exist
            if not profile_name:
                continue

            # Get Profile document
            profile_doc = frappe.get_doc("Key Person Registry", profile_name)

            # Add Ward and Appointment
            profile_doc.append("award_recognition", {
                "title": row.title,
                "location": row.location,
                "event_name": row.event_name,
                "conferred_by": row.conferred_by,
                "citation": row.citation,
                "honor": "National",     
            })

            # Save
            profile_doc.save(ignore_permissions=True)
            
        for row in self.appointment:

            # Find Profile using child table CID
            profile_name = frappe.db.get_value(
                "Key Person Registry",
                {"cid": row.cid},
                "name"
            )

            # Skip if Profile does not exist
            if not profile_name:
                continue

            profile_doc = frappe.get_doc("Key Person Registry", profile_name)

            profile_doc.append("professional_information", {
                "cid": row.cid,
                "position": row.position,
                "organization": row.organization,
                "conferred_by": row.conferred_by,
                "start_term": row.start_term,
                "end_term": row.end_term,   
                "employee_status": row.employee_status,  
            })

            # Save
            profile_doc.save(ignore_permissions=True)

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

@frappe.whitelist()
def get_award_profile(cid):
    return frappe.db.get_value(
        "Key Person Registry",
        {"cid": cid},
        ["registry_name", "dob"],
        as_dict=True
    )

def generate_kasho_no(kasho_type_code, institution_code, recipient_count,kasho_issued_date):
    """
    Generate Kasho number in the format:
    [KashoType][yymmdd][Dzongkhag][Serial][RecipientCount]
    """
    kasho_issued_date_converted = getdate(kasho_issued_date)
    kasho_type_code = f"{int(kasho_type_code):02d}"
    date_part = kasho_issued_date_converted.strftime("%y%m%d")
    kasho_type_code = f"{int(kasho_type_code):02d}"

    total_count_kasho_on_that_date = frappe.db.count(
        "Kasho",
        filters={"issue_date": ["like", f"{kasho_issued_date_converted}%"]}
    )
    next_serial = total_count_kasho_on_that_date + 1
    serial_part = f"{next_serial:03d}"
    recipient_part = f"{int(recipient_count):04d}"

    return f"{kasho_type_code}{date_part}{institution_code}{serial_part}{recipient_part}"

