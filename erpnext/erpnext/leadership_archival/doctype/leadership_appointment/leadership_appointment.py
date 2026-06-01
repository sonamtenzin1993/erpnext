# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class LeadershipAppointment(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		cid: DF.Data | None
		conferred_by: DF.Link
		duration: DF.Int
		employee_status: DF.Link | None
		end_term: DF.Date
		organization: DF.Link
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		position: DF.Link
		start_term: DF.Date
	# end: auto-generated types
	pass
