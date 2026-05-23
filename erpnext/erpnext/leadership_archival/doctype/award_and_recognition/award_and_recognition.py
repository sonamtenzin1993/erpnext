# Copyright (c) 2026, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class AwardandRecognition(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		citation: DF.SmallText | None
		conferred_by: DF.Link | None
		event_name: DF.Data | None
		honor: DF.Link | None
		location: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		title: DF.Link
	# end: auto-generated types
	pass
