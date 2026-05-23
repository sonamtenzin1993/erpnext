# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class AssociatedOrganization(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		designation: DF.Data | None
		organization: DF.Link
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		remarks: DF.Data
		role: DF.Data | None
		task: DF.SmallText | None
	# end: auto-generated types
	pass
