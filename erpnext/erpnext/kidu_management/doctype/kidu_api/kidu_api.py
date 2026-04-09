import frappe
from frappe.model.document import Document
from erpnext.api_setting import get_vehicle_detail_Profile
from erpnext.api_setting import get_shareholding_profile
from erpnext.api_setting import get_family_land_detail_profile
from erpnext.api_setting import get_rental_income_detail_profile
from erpnext.api_setting import get_property_tax_data_profile

from typing import TYPE_CHECKING



class KiduAPI(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from erpnext.kidu_management.doctype.family_land_detail.family_land_detail import FamilyLandDetail
        from erpnext.kidu_management.doctype.income.income import Income
        from erpnext.kidu_management.doctype.property.property import property
        from erpnext.kidu_management.doctype.shareholding.shareholding import Shareholding
        from erpnext.kidu_management.doctype.vehicle_detail.vehicle_detail import VehicleDetail
        from frappe.types import DF

        cid: DF.Data | None
        family_land_detail_tab: DF.Table[FamilyLandDetail]
        income_tab: DF.Table[Income]
        property_tax_tbl: DF.Table[property]
        shareholding_tab: DF.Table[Shareholding]
        vehicle_detail: DF.Table[VehicleDetail]
    # end: auto-generated types

@frappe.whitelist()
def get_shareholding_data(cid):
    """
    Fetch Shareholding data from API and return the 'message' list.
    """
    if not cid:
        return []  # do not throw error, just return empty

    try:
        result = get_shareholding_profile(cid)

        # data = result.get("message", [])
        # return data
        return result
    except Exception:
        frappe.log_error(frappe.get_traceback(), f"Error fetching shareholding for {cid}")
        return []


@frappe.whitelist()
def get_vehicle(cid):
    """
    Fetch Vehicle data from API and return the 'data' list.
    If the API returns an error object, return empty list.
    """
    if not cid:
        return []

    try:
        result = get_vehicle_detail_Profile(cid)

        # If the API returns an error dict, return empty list
        if isinstance(result, dict) and result.get("code") and result.get("message"):
            return []

        # Otherwise, return the data list
        return result or []

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"Error fetching vehicle for CID {cid}: {e}")
        return []

@frappe.whitelist()
def get_family_land_detail_data(cid=None):
    if not cid:
        return []  # do not throw error, just return empty

    try:
        result = get_family_land_detail_profile(cid)

        # data = result.get("message", [])
        # return data
        return result
    except Exception:
        frappe.log_error(frappe.get_traceback(), f"Error fetching shareholding for {cid}")
        return []


@frappe.whitelist()
def get_income_tax_data(cid=None):
    if not cid:
        return []  # do not throw error, just return empty

    try:
        result = get_rental_income_detail_profile(cid)

        # data = result.get("message", [])
        # return data
        return result
    except Exception:
        frappe.log_error(frappe.get_traceback(), f"Error fetching shareholding for {cid}")
        return []

@frappe.whitelist()
def get_property_tax_data(cid=None):
    if not cid:
        return []  # do not throw error, just return empty

    try:
        result = get_property_tax_data_profile(cid)

        # data = result.get("message", [])
        # return data
        return result
    except Exception:
        frappe.log_error(frappe.get_traceback(), f"Error fetching shareholding for {cid}")
        return []

