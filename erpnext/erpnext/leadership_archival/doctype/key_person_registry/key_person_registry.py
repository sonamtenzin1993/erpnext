# Copyright (c) 2026, Frappe Technologies and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
from erpnext.api_setting import get_citizen_detail



class KeyPersonRegistry(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from erpnext.leadership_archival.doctype.associated_organization.associated_organization import AssociatedOrganization
		from erpnext.leadership_archival.doctype.award_and_recognition.award_and_recognition import AwardandRecognition
		from erpnext.leadership_archival.doctype.education_and_qualification.education_and_qualification import EducationandQualification
		from erpnext.leadership_archival.doctype.leadership_appointment.leadership_appointment import LeadershipAppointment
		from erpnext.leadership_archival.doctype.publication.publication import Publication
		from frappe.types import DF

		amended_from: DF.Link | None
		associated_organization: DF.Table[AssociatedOrganization]
		award_recognition: DF.Table[AwardandRecognition]
		cid: DF.Data | None
		designation: DF.Link
		dob: DF.Date | None
		dzongkhag: DF.Data | None
		education_and_qualification: DF.Table[EducationandQualification]
		email: DF.Data | None
		gewog: DF.Data | None
		name: DF.Int | None
		phone_no: DF.Phone | None
		photograph: DF.AttachImage | None
		present_dzongkhag: DF.Data | None
		present_gewog: DF.Data | None
		present_village: DF.Data | None
		professional_information: DF.Table[LeadershipAppointment]
		publication: DF.Table[Publication]
		registry_name: DF.Data
		resignationorterminationrecord: DF.Text | None
		social_media_account: DF.Data | None
		status: DF.Link
		village: DF.Data | None
	# end: auto-generated types
	def get_citizen_detail(self):
		get_citizen_detail(self.cid)
