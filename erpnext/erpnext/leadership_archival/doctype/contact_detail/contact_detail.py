# Copyright (c) 2026, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class ContactDetail(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		dzongkhag: DF.Data | None
		email: DF.Data | None
		gewog: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		phone_no: DF.Phone | None
		social_media_accounts: DF.SmallText | None
		village: DF.Data | None
	# end: auto-generated types
	pass
