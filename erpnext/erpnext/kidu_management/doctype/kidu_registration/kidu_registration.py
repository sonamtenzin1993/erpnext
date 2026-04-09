# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime
from frappe.model.naming import make_autoname
from erpnext.api_setting import get_citizen_detail
import re

class KiduRegistration(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.kidu_management.doctype.member.member import Member
		from frappe.types import DF

		amended_from: DF.Link | None
		application: DF.Attach | None
		application_channel: DF.Link | None
		application_mode: DF.Link
		cid: DF.Data | None
		contact_no: DF.Phone
		dob: DF.Date | None
		dzongkhag: DF.Data | None
		emergency_contact_no: DF.Phone | None
		full_name: DF.Data | None
		gender: DF.Link | None
		gewog: DF.Data | None
		kidu_sub_type: DF.Link | None
		kidu_type: DF.Link
		member: DF.Table[Member]
		rc: DF.Data | None
		registration_date: DF.Date
		registration_no: DF.Data | None
		village: DF.Data | None
	# end: auto-generated types

	# def autoname(self):
	# 	kidu_type = (self.kidu_type or '').strip().upper()
	# 	if kidu_type == "LAND":
	# 		prefix = "LAND"
	# 	elif kidu_type == "CENSUS":
	# 		prefix = "CEN"
	# 	elif kidu_type == "LEGAL SERVICE":
	# 		prefix = "LEGAL"
	# 	elif kidu_type == "MEDICAL EXPENSE":
	# 		prefix = "ME"
	# 	elif kidu_type == "DISASTER":
	# 		prefix = "DS"
	# 	elif kidu_type == "GOENSHO ZHABTOG":
	# 		prefix = "GZ"
	# 	elif kidu_type == "MARRIAGE CERTIFICATE":
	# 		prefix = "MC"
	# 	elif kidu_type == "ROYAL SOELRA":
	# 		prefix = "RS"
	# 	elif kidu_type == "TRAVEL DOCUMENT":
	# 		prefix = "TD"
	# 	elif kidu_type == "NOC/Security Clearance":
	# 		prefix = "NOC"
	# 	elif kidu_type == "VISA":
	# 		prefix = "VISA"
	# 	elif kidu_type == "WORK PERMIT":
	# 		prefix = "WP"
	# 	else:
	# 		prefix = "MISC"
	# 	current_year = now_datetime().strftime('%Y')
	# 	series_format = f"{prefix}{current_year}.####"
	# 	self.name = make_autoname(series_format)
	# 	self.kidu_registration_no=self.name

	def autoname(self):
		kidu_type = (self.kidu_type or '').strip().upper()
		
		prefix_map = {
			"LAND": "LAND",
			"CENSUS": "CEN",
			"LEGAL": "LEGAL",
			"MEDICAL EXPENSE": "ME",
			"DISASTER": "DS",
			"GOENSHO ZHABTOG": "GZ",
			"MARRIAGE CERTIFICATE": "MC",
			"ROYAL SOELRA": "RS",
			"TRAVEL DOCUMENT": "TD",
			"NOC/SECURITY CLEARANCE": "NOC",
			"VISA": "VISA",
			"WORK PERMIT": "WP"
		}
		
		prefix = prefix_map.get(kidu_type, "MISC")
		current_year = now_datetime().strftime('%Y')
		
		# Search existing names starting with PREFIX + YEAR
		like_pattern = f"{prefix}{current_year}%"
		
		last_entry = frappe.db.sql(
			"""SELECT name FROM `tabKidu Registration`
			WHERE name LIKE %s
			ORDER BY name DESC
			LIMIT 1""",
			(like_pattern,),
			as_dict=True
		)
		
		if last_entry:
			last_name = last_entry[0]['name']
			# Extract only the numeric sequence after the YEAR
			match = re.search(rf'{prefix}{current_year}(\d+)$', last_name)
			if match:
				next_number = int(match.group(1)) + 1
			else:
				next_number = 1
		else:
			next_number = 1

		# Final name: PREFIX + YEAR + 4-digit sequence
		self.name = f"{prefix}{current_year}{str(next_number).zfill(4)}"
		self.kidu_registration_no = self.name
	

	def after_update(doc, method):
		"""
		Sync Registration fields to linked Profile if it exists.
		"""
		if not doc.name:
			return
        
		# Get linked profiles
		profiles = frappe.get_all(
			"Kidu Profile",
			filters={"registration_no": doc.name},
			fields=["name"]
		)

		# Only proceed if there are linked profiles
		if profiles:
			for profile in profiles:
				frappe.db.set_value("Kidu Profile", profile.name, "full_name", doc.full_name)
				frappe.db.set_value("Kidu Profile", profile.kidu_type, "kidu_type", doc.kidu_type)

				# Add more fields if needed

			frappe.db.commit()  # save changes
# @frappe.whitelist()
# def get_cid_detail(cid):
# 	get_citizen_detail(cid)

	def get_citizen_detail(self):
		get_citizen_detail(self.cid)


@frappe.whitelist()
def get_kidu_sub_type(kidu_type):
    result = frappe.db.get_list('Kidu Sub Type',                           # DocType
    	filters={'kidu_type': kidu_type},     # Condition
    	fields=['kidu_sub_type']     # Fields to fetch
    )
    return result or {}

