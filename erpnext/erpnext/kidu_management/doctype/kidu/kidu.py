# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime
from frappe.model.naming import make_autoname
from erpnext.api_setting import get_family_land_detail

class Kidu(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.kidu_management.doctype.family.family import Family
		from erpnext.kidu_management.doctype.family_land_detail.family_land_detail import FamilyLandDetail
		from frappe.types import DF

		amended_from: DF.Link | None
		appeal_place: DF.Data | None
		appeal_reason: DF.Data | None
		applicant_name: DF.Data
		application: DF.Attach
		brief_background: DF.TextEditor | None
		cid: DF.Data
		contact_no: DF.Phone
		dob: DF.Date
		dzongkhag: DF.Data | None
		family_land_detail: DF.Table[FamilyLandDetail]
		family_member: DF.Table[Family]
		gender: DF.Link
		gewog: DF.Data | None
		house_no: DF.Data | None
		kidu_registration_no: DF.Data | None
		kidu_sub_type: DF.Link | None
		kidu_type: DF.Link
		land_size: DF.Data | None
		occupation: DF.Link | None
		photo: DF.AttachImage | None
		profile_date: DF.Date | None
		thram_no: DF.Data | None
		village: DF.Data | None
	# end: auto-generated types
 
	def autoname(self):
		kidu_type = (self.kidu_type or '').strip().upper()
		if kidu_type == "LAND":
			prefix = "LAND"
		elif kidu_type == "CENSUS":
			prefix = "CEN"
		elif kidu_type == "LEGAL SERVICE":
			prefix = "LEGAL"
		elif kidu_type == "MEDICAL EXPENSE":
			prefix = "ME"
		elif kidu_type == "DISASTER":
			prefix = "DS"
		elif kidu_type == "GOENSHO ZHABTOG":
			prefix = "GZ"
		elif kidu_type == "MARRIAGE CERTIFICATE":
			prefix = "MC"
		elif kidu_type == "ROYAL SOELRA":
			prefix = "RS"
		elif kidu_type == "TRAVEL DOCUMENT":
			prefix = "TD"
		elif kidu_type == "NOC/Security Clearance":
			prefix = "NOC"
		elif kidu_type == "VISA":
			prefix = "VISA"
		elif kidu_type == "WORK PERMIT":
			prefix = "WP"
		else:
			prefix = "MISC"
		current_year = now_datetime().strftime('%Y')
		series_format = f"{prefix}{current_year}.####"
		self.name = make_autoname(series_format)
		self.kidu_registration_no=self.name
	
	def before_save(self):
        # This will clear the child table before submit (just in case it's different logic)
		self.set("family_land_detail", [])
	
	def on_submit(self):
        # This will clear the child table before submit (just in case it's different logic)
		self.set("family_land_detail", [])

	def get_family_land_details(self):
		"""
		Fetch family land details from external API using the doc's CID
		"""
		if not self.cid:
			frappe.throw("CID is missing for this profile.")
		try:
			return get_family_land_detail(self.cid) or []
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching family land for CID {self.cid}")
			return []
  
@frappe.whitelist()
def get_cid_detail(cid):
	get_citizen_detail(cid)

@frappe.whitelist()
def get_kidu_sub_type(kidu_type):
    result = frappe.db.get_list('Kidu Sub Type',                           # DocType
    	filters={'kidu_type': kidu_type},     # Condition
    	fields=['kidu_sub_type']     # Fields to fetch
    )
    return result or {}

@frappe.whitelist()
def create_profile(source_name, target_doc=None):
	if frappe.db.exists('Kidu Profiling',
		{'kidu_registration_no':source_name,
		'docstatus':('!=',2)
		}):
		frappe.throw(
			title='Error',
			msg="You have already profiled the application")
	doclist = get_mapped_doc("Kidu Registration", source_name, {
		"Kidu Registration": {
			"doctype": "Kidu Profiling",
			"field_map":{
					"kidu_registration_no":"name",
					"dzongkhag":"permanent_dzongkhag",
					"gewog":"permanent_gewog",
					"village":"permanent_village",
				},
		},
		"Family Member": {
        	"doctype": "Family Member"  # child table stays same
    		},
		"Family Land Detail":{
			"doctype":"Family Land Detail"
		},
		
	}, target_doc)
	return doclist
