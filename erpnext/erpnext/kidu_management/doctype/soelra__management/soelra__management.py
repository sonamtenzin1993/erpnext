# Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class SoelraManagement(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		amount: DF.Currency
		applicant_name: DF.Data
		cid: DF.Data
		class_year: DF.Data | None
		course_stream: DF.Data | None
		disbursement_date: DF.Date
		dzongkhag: DF.Data | None
		is_college: DF.Check
		payment_to: DF.Link
		registration: DF.Link
		remarks: DF.Text | None
		result: DF.Data | None
		school_college: DF.Data | None
		score: DF.Percent
	# end: auto-generated types
	pass
