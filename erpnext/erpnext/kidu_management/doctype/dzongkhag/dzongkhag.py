# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Dzongkhag(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		dzongkhag: DF.Data
		dzongkhag_code: DF.Data
	# end: auto-generated types
	

	# def autoname(self):
	# 	self.name = get_next_number()


# def get_next_number():
# 	# Get the last name (numeric only) from your Doctype
# 	last_name = frappe.db.get_value("Dzongkhag", {}, "name", order_by="creation desc")
# 	if last_name and last_name.isdigit():
# 		next_no = int(last_name) + 1
# 	else:
# 		next_no = 1

# 	# Format to always show two digits (01, 02, 03, ...)
# 	return f"{next_no:02d}"
