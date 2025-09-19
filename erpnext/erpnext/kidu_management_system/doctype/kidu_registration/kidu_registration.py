# Copyright (c) 2024, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class KiduRegistration(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		cid: DF.Data
		name1: DF.Data
		phone_no: DF.Phone | None
		photos: DF.AttachImage
	# end: auto-generated types
	pass

	def validate(self):
		if self._action == 'submit':
			# Add your custom validation logic here
			if len(self.name1)<4:
				frappe.throw('Enter the number greater than')
			doc=frappe.get_value('Kidu Registration',{'name1':self.name1})
			if self.name1==doc.name1:
				frappe.throw('Data Duplication')
