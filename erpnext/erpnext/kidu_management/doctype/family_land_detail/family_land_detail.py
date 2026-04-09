# Copyright (c) 2025, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class FamilyLandDetail(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		cid: DF.Data | None
		family_name: DF.Data | None
		gewog_thromde_village: DF.Data | None
		land_type: DF.Data | None
		net_plot_area: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		plot_name: DF.Data | None
		plot_no: DF.Data | None
		thram_no: DF.Data | None
	# end: auto-generated types
	pass
