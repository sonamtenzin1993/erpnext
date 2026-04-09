# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Member(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		cid: DF.Data
		contact_no: DF.Phone
		dob: DF.Date
		dzongkhag: DF.Data
		full_name: DF.Data
		gender: DF.Link
		gewog: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		photo: DF.AttachImage
		village: DF.Data
	# end: auto-generated types
	pass
