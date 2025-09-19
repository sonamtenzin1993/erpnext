# Copyright (c) 2024, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Kidu(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.kidu_management_system.doctype.family_member.family_member import FamilyMember
		from frappe.types import DF

		amended_from: DF.Link | None
		applicant_name: DF.Data
		cid: DF.Data
		family_member: DF.Table[FamilyMember]
		kidu_type: DF.Link
	# end: auto-generated types
	pass
