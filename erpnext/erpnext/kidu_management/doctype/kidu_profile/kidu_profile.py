# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from erpnext.api_setting import get_family_land_detail
import base64
from erpnext.api_setting import fetch_citizen_photo_base64
from erpnext.api_setting import get_shareholding
from erpnext.api_setting import get_property_tax_detail
from erpnext.api_setting import get_rental_income_detail
from erpnext.api_setting import get_vehicle_detail
from erpnext.api_setting import get_family_tree_detail


class KiduProfile(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.kidu_management.doctype.member.member import Member
		from frappe.types import DF

		amended_from: DF.Link | None
		appeal_reason: DF.Text
		application: DF.Attach | None
		application_channel: DF.Link | None
		application_mode: DF.Link | None
		batch_no: DF.Link | None
		brief_background: DF.TextEditor
		cid: DF.Data | None
		contact_no: DF.Data | None
		dob: DF.Date | None
		dzongkhag: DF.Data | None
		emergency_contact_no: DF.Data | None
		full_name: DF.Data | None
		gender: DF.Link | None
		gewog: DF.Data | None
		ground_for_decision: DF.Text | None
		is_soelra: DF.Check
		kidu_sub_type: DF.Link | None
		kidu_type: DF.Link | None
		land_size: DF.Data | None
		member: DF.Table[Member]
		organization: DF.Link | None
		photo: DF.AttachImage | None
		profile_date: DF.Date
		rc: DF.Data | None
		registration_no: DF.Link
		village: DF.Data | None
	# end: auto-generated types
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.kidu_management.doctype.member.member import Member
		from frappe.types import DF

		amended_from: DF.Link | None
		appeal_reason: DF.Data
		application: DF.Attach | None
		application_mode: DF.Link | None
		brief_background: DF.TextEditor
		cid: DF.Data | None
		contact_no: DF.Phone | None
		dob: DF.Date | None
		dzongkhag: DF.Data | None
		full_name: DF.Data | None
		gender: DF.Link | None
		gewog: DF.Data | None
		kidu_type: DF.Link | None
		land_size: DF.Data | None
		member: DF.Table[Member]
		photo: DF.AttachImage | None
		profile_date: DF.Date
		registration_no: DF.Link
		village: DF.Data | None
	
	def autoname(self):
		if not self.registration_no:
			frappe.throw("Registration Number is required before saving the Profile.")
		count = frappe.db.count("Kidu Profile", {"registration_no": self.registration_no})
		suffix = f"{count + 1:02d}"
		self.name = f"{self.registration_no}-{suffix}"

	def get_family_land_details(self):
		"""
		Fetch family land details from external API using the doc's CID
		""" 
		frappe.log_error("My Function Called", "Debug")
		if not self.cid:
			frappe.throw("CID is missing for this profile.")
		try:
			# result = get_family_land_detail(self.cid) or []
			result = get_family_land_detail(self.cid)
			return result
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching family land for CID {self.cid}")
			return []

	def get_family_tree_details(self):
		"""
		Fetch family land details from external API using the doc's CID
		""" 
		if not self.cid:
			frappe.throw("CID is missing for this profile.")
		try:
			# result = get_family_land_detail(self.cid) or []
			result = get_family_tree_detail(self.cid)
            
			return result
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching family land for CID {self.cid}")
			return []
    
	def fetch_citizen_photo_base64(self):
		"""
		Fetch Image
		""" 
		if not self.cid:
			frappe.throw("CID is missing to fetch Image from DCRC")
		try:
			# result = get_family_land_detail(self.cid) or []
			result = fetch_citizen_photo_base64(self.cid)
			return result
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching  the image {self.cid}")
			return []	

	def get_shareholding_data(self):
		"""
		Fetch Shareholding data from API and return the 'data' list.
		"""
		if not self.cid:
			return []  # do not throw error in print format, just return empty

		try:
			result = get_shareholding(self.cid)
			return result.get("data", [])  # return the list of shareholding
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching shareholding for {self.cid}")
			return []
	
	def get_property_tax(self):
		"""
		Fetch Property data from API and return the 'data' list.
		"""
		if not self.cid:
			return []  # do not throw error in print format, just return empty

		try:
			# result = get_family_land_detail(self.cid) or []
			result = get_property_tax_detail(self.cid)
			return result
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching property for CID {self.cid}")
			return []	

	def get_rental_come(self):
			"""
			Fetch Rental data from API and return the 'data' list.
			"""
			if not self.cid:
				return []  # do not throw error in print format, just return empty

			try:
				# result = get_family_land_detail(self.cid) or []
				result = get_rental_income_detail(self.cid)
				return result
			except Exception as e:
				frappe.log_error(frappe.get_traceback(), f"Error fetching rental income for CID {self.cid}")
				return []	

	def get_vehicle_detail(self):
		"""
		Fetch Vehicle  data from API and return the 'data' list.
		"""
		if not self.cid:
			return []  # do not throw error in print format, just return empty

		try:
			# result = get_family_land_detail(self.cid) or []
			result = get_vehicle_detail(self.cid)
			return result
		except Exception as e:
			frappe.log_error(frappe.get_traceback(), f"Error fetching rental income for CID {self.cid}")
			return []

	def get_kidu_recipient_list(self):
		if not self.cid:
			frappe.throw("CID is missing for this profile.")

		recipients = frappe.get_all(
			"tabKidu Recipient",
			filters={"cid": self.cid},   # use self.cid
			fields=[
				"cid",
				"full_name",
				"dzongkhag",
				"land_size_acres",
				"parent"
			]
		)
		frappe.msgprint(recipients)
		return recipients
