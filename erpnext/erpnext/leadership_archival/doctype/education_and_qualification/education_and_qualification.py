# Copyright (c) 2026, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class EducationandQualification(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		country: DF.Link
		course: DF.Link
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		university: DF.Link
		year_of_completion: DF.Data
	# end: auto-generated types
	pass
