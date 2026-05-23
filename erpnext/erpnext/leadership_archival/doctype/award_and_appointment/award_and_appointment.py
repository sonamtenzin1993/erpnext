# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class AwardandAppointment(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		cid: DF.Data | None
		citation: DF.SmallText | None
		conferred_by: DF.Link
		dzongkhag: DF.Link
		event_name: DF.Data
		location: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		postthumous: DF.Check
		title: DF.Link
	# end: auto-generated types
	pass
