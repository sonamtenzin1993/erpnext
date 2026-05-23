import frappe
import requests
from dotenv import load_dotenv
import os

def generate_token():
    load_dotenv()
    token_url = os.getenv("TOKEN_URL")
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    
    data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
        }
    
    response = requests.post(token_url, data=data)
    # Handle the response
    if response.status_code == 200:
        token = response.json().get('access_token')
        return token
        # print(f"Access Token: {token}")
    else:
        print(f"Failed to retrieve token: {response.status_code}, {response.text}")
        return None
    
@frappe.whitelist()
def get_civil_servant_details(cid=None):
    load_dotenv()
    token = generate_token()
    
    if token:
        api_url =os.getenv("CIVIL_SERVANT_DETAIL_API")
        
        if cid:
            api_url= f"{api_url}/{cid}"
            
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        
        # Handle the API response
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
            # Parse and print the response data (or handle it as needed)
            
            civil_servant_data = response.json()
            employee_details={}
            if civil_servant_data['HMSemployeedetails']:
                employee_details = civil_servant_data['HMSemployeedetails']['HMSemployeedetail'][0]
            # frappe.throw(str(frappe.as_json(employee_details)))
                return employee_details
            else:
                return None
            # print(f"Civil Servant Details: {civil_servant_data}")
        else:
            print(f"Failed to fetch civil servant details: {response.status_code}, {response.text}")
        
        
    else:
        print("No token available to make API request.")

@frappe.whitelist()
def post_performance_score(Rating=None, Employee_ID=None, Position_ID=None, Agency_ID=None, 
                           Moderation_Score=None, Performance_Score=None, Competency_Score=None, 
                           Remarks=None, Created_By=None):    
    load_dotenv()
    token = generate_token()
    
    post_pms_api = os.getenv("CIVIL_SERVANT_PMS_API")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "response": [
            {
                "Rating": Rating,
                "Employee_ID": Employee_ID,
                "Position_ID": Position_ID,
                "Agency_ID": Agency_ID,
                "Moderation_Score": Moderation_Score,
                "Performance_Score": Performance_Score,
                "Competency_Score": Competency_Score,
                "Remarks": Remarks,
                "Created_By": Created_By
            }
        ]
    }
    # frappe.throw(str(payload))
    post_response = requests.post(post_pms_api, headers=headers, json=payload)
    frappe.msgprint("Message From MAX: " + str(post_response.json()))
    if post_response.status_code == 200:
        print("Data posted successfully:", post_response.json())
    else:
        print(f"Failed to post data: {post_response.status_code}, {post_response.text}")

@frappe.whitelist()
def get_citizen_detail(cid=None):
    load_dotenv()
    token = generate_token()
    if token:
        api_url =os.getenv("api_citizendetail_uri")
        if cid:
            api_url= f"{api_url}/{cid}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
        # Parse the response JSON
            citizen_details = response.json()
            # frappe.msgprint(f"${citizen_details}")
        # Check if the response has expected data
            if (
                'allCitizenDetailsResponse' in citizen_details and
                'allCitizenDetail' in citizen_details['allCitizenDetailsResponse'] and
                citizen_details['allCitizenDetailsResponse']['allCitizenDetail']
            ):
        # Extract the first citizen's details
                citizen = citizen_details['allCitizenDetailsResponse']['allCitizenDetail'][0]
                # frappe.msgprint(f"${citizen}")
                return citizen
        else:
            frappe.msgprint("No citizen data found.")
            return None
    else:
        print("No token available to make API request.")

@frappe.whitelist()
def fetch_citizen_photo_base64(cid):
    load_dotenv()
    token = generate_token()
    if token:
        api_url =os.getenv("api_citizen_image")
        if cid:
            api_url= f"{api_url}/{cid}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
        # Parse the response JSON
            data = response.json()
            # frappe.msgprint(f"${citizen_details}")
        # Check if the response has expected data
            if (
                data['citizenimages']['citizenimage']
            ):
        # Extract the first citizen's details
                based64_image = data['citizenimages']['citizenimage'][0]
                # frappe.msgprint(f"${citizen}")
                return based64_image
        else:
            frappe.msgprint("No Imagefound.")
            return None
    else:
        print("No token available to make API request. Contact Developer or Govtech for neccessary action")
    # """
    # Calls external API, retrieves Base64 image, and returns it to client
    # """
    # response = requests.get(api_url)
    # if response.status_code != 200:
    #     frappe.throw(f"Failed to fetch API: {response.status_code}")
    
    # data = response.json()
    
    # # Adjust path based on your API
    # base64_image = data["citizenimages"]["citizenimage"][0]["image"]
    
    # return base64_image

@frappe.whitelist()
def get_property_tax_detail(cid=None):
    load_dotenv()
    token = generate_token()
    if token:
        api_url =os.getenv("api_property_tax_url")
        if cid:
            api_url= f"{api_url}/{cid}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
        # Parse the response JSON
            tax_property = response.json()
        # Check if the response has expected data
            if (tax_property and 'businessAllYearsResponse' in tax_property
            and 'businessRecord' in tax_property['businessAllYearsResponse']
            and tax_property['businessAllYearsResponse']['businessRecord']
            ):
        # Extract the first citizen's details
                return  tax_property['businessAllYearsResponse']['businessRecord']            
        else:
            frappe.msgprint("No tax data data found.")
            return None
    else:
        print("No token available to make API request.")

@frappe.whitelist()
def get_rental_income_detail(cid=None):
    load_dotenv()
    token = generate_token()
    if token:
        api_url =os.getenv("api_rental_income_url")
        if cid:
            api_url= f"{api_url}/{cid}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
        # Parse the response JSON
            rental_income = response.json()
        # Check if the response has expected data
            if (rental_income and 'rentalAllYearsResponse' in rental_income
            and 'rentalRecord' in rental_income['rentalAllYearsResponse']
            and rental_income['rentalAllYearsResponse']['rentalRecord']
            ):
        # Extract the first citizen's details
                return  rental_income['rentalAllYearsResponse']['rentalRecord']            
        else:
            frappe.msgprint("No rental income data data found.")
            return None
    else:
        print("No token available to make API request.")

@frappe.whitelist()
def get_family_land_detail(cid=None):
    if not cid :
        print("No CID,please enter the CID to view the family Land details")
    else:
        load_dotenv()
        token = generate_token()
        if token:
            api_url =os.getenv("api_citizendetail_uri")
            if cid:
                api_url= f"{api_url}/{cid}"
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = requests.get(api_url, headers=headers)
            if response.status_code != 200:
                frappe.throw(f"{response.text}")
            if response.status_code == 200:
                citizen_details = response.json()
                if (
                    'allCitizenDetailsResponse' in citizen_details and
                    'allCitizenDetail' in citizen_details['allCitizenDetailsResponse'] and
                    citizen_details['allCitizenDetailsResponse']['allCitizenDetail']
                ):
                    citizen = citizen_details['allCitizenDetailsResponse']['allCitizenDetail'][0]
                    householdNo=citizen.get('householdNo')
                    family_tree_url =os.getenv("api_familyTree_uri")
                    if cid:
                        family_tree_url= f"{family_tree_url}/{householdNo}"
                    family_response = requests.get(family_tree_url, headers=headers)
                    if family_response.status_code != 200:
                        frappe.throw(f"{family_response.text}")
                    if family_response.status_code == 200:
                        family_detail = family_response.json()
                        family_detail_list = family_detail.get('familyDetails', {}).get('familyDetail', [])
                        family_land_details=[]
                        for land in family_detail_list:
                            family_cid=land.get('cid')
                            api_nlcs_uri =os.getenv("api_nlcs_uri")
                            family_land_detail_url= f"{api_nlcs_uri}/{family_cid}"
                            family_land_response = requests.get(family_land_detail_url, headers=headers)
                            if family_land_response.status_code != 200:
                                frappe.throw(f"{family_land_response.text}")
                            if family_land_response.status_code == 200:
                                family_land=family_land_response.json()
                                if family_land.get('landDetails', {}).get('landDetail',[]):
                                    family_land_details.append(family_land.get('landDetails', {}))
                        return family_land_details
            else:
                frappe.msgprint("No citizen data found.")
                return None
                
    token = generate_token()

@frappe.whitelist()
def get_family_land_detail_profile(cid=None):
    if not cid :
        print("No CID,please enter the CID to view the family Land details")
    else:
        load_dotenv()
        token = generate_token()
        if token:
            api_url =os.getenv("api_citizendetail_uri")
            if cid:
                api_url= f"{api_url}/{cid}"
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = requests.get(api_url, headers=headers)

            if response.status_code != 200:
                frappe.throw(f"{response.text}")
            if response.status_code == 200:
                citizen_details = response.json()
                if (
                    'allCitizenDetailsResponse' in citizen_details and
                    'allCitizenDetail' in citizen_details['allCitizenDetailsResponse'] and
                    citizen_details['allCitizenDetailsResponse']['allCitizenDetail']
                ):
                    citizen = citizen_details['allCitizenDetailsResponse']['allCitizenDetail'][0]
                    householdNo=citizen.get('householdNo')
                    family_tree_url =os.getenv("api_familyTree_uri")
                    if cid:
                        family_tree_url= f"{family_tree_url}/{householdNo}"
                    family_response = requests.get(family_tree_url, headers=headers)
                    # frappe.msgprint(str(family_response.text))
                    if family_response.status_code != 200:
                        frappe.throw(f"{family_response.text}")
                    if family_response.status_code == 200:
                        family_detail = family_response.json()
                        family_detail_list = family_detail.get('familyDetails', {}).get('familyDetail', [])
                        family_land_details=[]
                        for land in family_detail_list:
                            family_cid=land.get('cid')
                            api_nlcs_uri =os.getenv("api_nlcs_uri")
                            family_land_detail_url= f"{api_nlcs_uri}/{family_cid}"
                            family_land_response = requests.get(family_land_detail_url, headers=headers)
                            if family_land_response.status_code != 200:
                                frappe.throw(f"{family_land_response.text}")
                            if family_land_response.status_code == 200:
                                family_land=family_land_response.json()
                                if family_land.get('landDetails', {}).get('landDetail',[]):
                                    family_land_details.append(family_land.get('landDetails', {}))
                        return family_land_details
            else:
                frappe.msgprint("No citizen data found.")
                return None
                
    token = generate_token()

@frappe.whitelist()
def get_shareholding(cid):

    api_url = os.getenv("api_shareholding_url")
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-KEY": os.getenv("X-API-KEY"),
    }

    payload = {"cid": cid}  # send form data correctly

    resp = requests.post(api_url, headers=headers, data=payload)
    result = resp.json()
    
     # <-- assign JSON to result

    # If API returns error
    if resp.status_code != 200 or result.get("error"):
        frappe.throw(result.get("message", "API Error"))

    # Optional: show the API result in a message (debug only)
    # frappe.msgprint(str(result))
    # data = result.get("message", [])
    return result

@frappe.whitelist()
def get_vehicle_detail(cid=None):
    load_dotenv()
    token = generate_token()

    if not token:
        frappe.throw("Token not generated")

    api_url = os.getenv("api_vehicle_url")

    # Append CID to endpoint if provided
    if cid:
        api_url = f"{api_url}/{cid}"

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    response = requests.get(api_url, headers=headers)

    # Handle HTTP errors
    if response.status_code != 200:
        frappe.throw(response.text)

    # Convert API response to JSON
    data = response.json()
    # 🔥 EXPECTED FORMAT:  
    # data = [ {cid, name, model...}, {...}, {...} ]

    # If API returns exactly the list you showed
    if isinstance(data, list):
        return data

    # No valid data
    return []

@frappe.whitelist()
def get_vehicle_detail_Profile(cid=None):
    load_dotenv()
    token = generate_token()

    if not token:
        frappe.throw("Token not generated")

    api_url = os.getenv("api_vehicle_url")

    # Append CID to endpoint if provided
    if cid:
        api_url = f"{api_url}/{cid}"

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    response = requests.get(api_url, headers=headers)

    # Handle HTTP errors
    if response.status_code != 200:
        return []
        # frappe.throw(response.text)

    # Convert API response to JSON
    data = response.json()
    # 🔥 EXPECTED FORMAT:  
    # data = [ {cid, name, model...}, {...}, {...} ]

    # If API returns exactly the list you showed
    if isinstance(data, list):
        return data

    # No valid data
    return []

@frappe.whitelist()
def get_shareholding_profile(cid):
    load_dotenv()
    api_url = os.getenv("api_shareholding_url")
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-KEY": os.getenv("X-API-KEY"),
    }


    payload = {"cid": cid}  # send form data correctly

    resp = requests.post(api_url, headers=headers, data=payload)
    result = resp.json()

    # If API returns error
    if resp.status_code != 200 or result.get("error"):
        frappe.throw(result.get("message", "API Error"))


    # Optional: show the API result in a message (debug only)
    # frappe.msgprint(str(result))
    data = result.get("message", [])

    return result

@frappe.whitelist()
def get_rental_income_detail_profile(cid=None):
    load_dotenv()
    token = generate_token()
    if token:
        api_url =os.getenv("api_rental_income_url")
        if cid:
            api_url= f"{api_url}/{cid}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
        # Parse the response JSON
            rental_income = response.json()
        # Check if the response has expected data
            if (rental_income and 'rentalAllYearsResponse' in rental_income
            and 'rentalRecord' in rental_income['rentalAllYearsResponse']
            and rental_income['rentalAllYearsResponse']['rentalRecord']
            ):
        # Extract the first citizen's details
                return  rental_income['rentalAllYearsResponse']['rentalRecord']            
        else:
            frappe.msgprint("No rental income data data found.")
            return None
    else:
        print("No token available to make API request.")

@frappe.whitelist()
def get_property_tax_data_profile(cid=None):
    load_dotenv()
    token = generate_token()
    if token:
        api_url =os.getenv("api_property_tax_url")
        if cid:
            api_url= f"{api_url}/{cid}"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url, headers=headers)
        if response.status_code != 200:
            frappe.throw(f"{response.text}")
        if response.status_code == 200:
        # Parse the response JSON
            tax_property = response.json()
        # Check if the response has expected data
            if (tax_property and 'businessAllYearsResponse' in tax_property
            and 'businessRecord' in tax_property['businessAllYearsResponse']
            and tax_property['businessAllYearsResponse']['businessRecord']
            ):
        # Extract the first citizen's details
                return  tax_property['businessAllYearsResponse']['businessRecord']            
        else:
            frappe.msgprint("No tax data data found.")
            return None
    else:
        print("No token available to make API request.")
            
@frappe.whitelist()
def get_family_tree_detail(cid=None):
    if not cid :
        print("No CID,please enter the CID to view the family Land details")
    else:
        load_dotenv()
        token = generate_token()
        if token:
            api_url =os.getenv("api_citizendetail_uri")
            if cid:
                api_url= f"{api_url}/{cid}"
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = requests.get(api_url, headers=headers)
            if response.status_code != 200:
                frappe.throw(f"{response.text}")
            if response.status_code == 200:
                citizen_details = response.json()
                # frappe.throw(citizen_details)
                if (
                    'allCitizenDetailsResponse' in citizen_details and
                    'allCitizenDetail' in citizen_details['allCitizenDetailsResponse'] and
                    citizen_details['allCitizenDetailsResponse']['allCitizenDetail']
                ):
                    citizen = citizen_details['allCitizenDetailsResponse']['allCitizenDetail'][0]
                    householdNo=citizen.get('householdNo')
                    family_tree_url =os.getenv("api_familyTree_uri")
                    if cid:
                        family_tree_url= f"{family_tree_url}/{householdNo}"
                    family_response = requests.get(family_tree_url, headers=headers)
                    if family_response.status_code != 200:
                        frappe.throw(f"{family_response.text}")
                    if family_response.status_code == 200:
                        family_detail = family_response.json()
                        family_detail_list = family_detail.get('familyDetails', {}).get('familyDetail', [])
                        return family_detail_list
            else:
                frappe.msgprint("No citizen data found.")
                return None
                
    token = generate_token()
