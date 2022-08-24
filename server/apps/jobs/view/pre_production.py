import collections

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import (PPB_ATTENDEES_PAGE, PPB_BOARDS_SCRIPTS_PAGE, PPB_CALLSHEET_PAGE, PPB_CAST_PAGE,
                                 PPB_COVER_PAGE, PPB_LOCATION_PAGE, PPB_SCHEDULE_PAGE, PPB_THANK_YOU_PAGE,
                                 PPB_TITLE_PAGE, PPB_WARDROBE_PAGE, PPB_WEATHER_PAGE)
from apps.jobs.models import (Agency, AgencyContact, Cast, Client, ClientCallSheet, ClientContact, Job, JobScript,
                              JobSettings, JobShootDate, Location, PreProductionBook, ShootNote, Wardrobe)
from apps.jobs.utils import get_all_individual_job_dates

from apps.jobs.serializers import PreProductionBookSerializer


def get_cover_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_cover_page = ppb.data["Pages"]["Cover Page"]
    response_data = {
        "page_title": ppb_cover_page["page_title"],
        "page_title_style": ppb_cover_page["page_title_style"],
        "visible": ppb_cover_page["visible"],
        "page_number": ppb_cover_page["page_number"],
    }
    return response_data


def get_title_page(job):  # noqa
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_title_page = ppb.data["Pages"]["Title Page"]
    try:
        client_name = ppb_title_page["client_name"]
    except KeyError:
        client_name = job.client
    try:
        client_name_style = ppb_title_page["client_name_style"]
    except KeyError:
        client_name_style = PPB_TITLE_PAGE["client_name_style"]
    try:
        project_name = ppb_title_page["project_name"]
    except KeyError:
        project_name = job.title
    try:
        project_name_style = ppb_title_page["project_name_style"]
    except KeyError:
        project_name_style = PPB_TITLE_PAGE["project_name_style"]
    try:
        pre_production_book_label = ppb_title_page["pre_production_book_label"]
    except KeyError:
        pre_production_book_label = "Pre-Production Book"
    try:
        pre_production_book_label_style = ppb_title_page["pre_production_book_label_style"]
    except KeyError:
        pre_production_book_label_style = PPB_TITLE_PAGE["pre_production_book_label_style"]
    try:
        shoot_dates = ppb_title_page["shoot_dates"]
    except KeyError:
        shoot_dates = get_all_individual_job_dates(job)
    try:
        shoot_dates_style = ppb_title_page["shoot_dates_style"]
    except KeyError:
        shoot_dates_style = PPB_TITLE_PAGE["shoot_dates_style"]
    response_data = {
        "page_title": ppb_title_page["page_title"],
        "page_title_style": ppb_title_page["page_title_style"],
        "visible": ppb_title_page["visible"],
        "page_number": ppb_title_page["page_number"],
        "client_name": client_name,
        "client_name_style": client_name_style,
        "project_name": project_name,
        "project_name_style": project_name_style,
        "pre_production_book_label": pre_production_book_label,
        "pre_production_book_label_style": pre_production_book_label_style,
        "shoot_dates": shoot_dates,
        "shoot_dates_style": shoot_dates_style,
    }
    return response_data


def get_attendees_page(job):  # noqa
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_attendees_page = ppb.data["Pages"]["Attendees"]
    try:
        client = Client.objects.get(job=job)
        client_name1 = client.client_contact_title
        client_contact1 = client.client_contact
    except Client.DoesNotExist:
        client_name1 = ""
        client_contact1 = ""
    try:
        agency = Agency.objects.get(job=job)
        agency_name1 = agency.agency_contact_title
        agency_contact1 = agency.agency_contact
    except Agency.DoesNotExist:
        agency_name1 = ""
        agency_contact1 = ""
    agency_attendees_data = []
    try:
        agency_attendees = ppb_attendees_page["agency_attendees"]
        for agency_attendee in agency_attendees:
            if agency_attendee["agency_attendee_id"] == "":
                agency_attendees_data.append(agency_attendee)
            else:
                job_agency_attendee = AgencyContact.objects.get(pk=agency_attendee["agency_attendee_id"])
                agency_attendees_data.append({
                    "agency_attendee_id": agency_attendee["agency_attendee_id"],
                    "agency_attendee_contact": agency_attendee["agency_attendee_contact"]
                    if agency_attendee["agency_attendee_contact"] != "" else job_agency_attendee.agency_contact,
                    "agency_attendee_contact_style": agency_attendee["agency_attendee_contact_style"],
                    "agency_attendee_contact_title": agency_attendee["agency_attendee_contact_title"]
                    if agency_attendee["agency_attendee_contact_title"] != ""
                    else job_agency_attendee.agency_contact_title,
                    "agency_attendee_contact_title_style": agency_attendee["agency_attendee_contact_title_style"],
                })
    except KeyError:
        pass
    client_attendees_data = []
    try:
        client_attendees = ppb_attendees_page["client_attendees"]
        for client_attendee in client_attendees:
            if client_attendee["client_attendee_id"] == "":
                client_attendees_data.append(client_attendee)
            else:
                job_client_attendee = ClientContact.objects.get(pk=client_attendee["client_attendee_id"])
                client_attendees_data.append({
                    "client_attendee_id": client_attendee["client_attendee_id"],
                    "client_attendee_contact": client_attendee["client_attendee_contact"]
                    if client_attendee["client_attendee_contact"] != "" else job_client_attendee.client_contact,
                    "client_attendee_contact_style": client_attendee["client_attendee_contact_style"],
                    "client_attendee_contact_title": client_attendee["client_attendee_contact_title"]
                    if client_attendee["client_attendee_contact_title"] != ""
                    else job_client_attendee.client_contact_title,
                    "client_attendee_contact_title_style": client_attendee["client_attendee_contact_title_style"],
                })
    except KeyError:
        pass
    try:
        agency_name = ppb_attendees_page["agency_name"] if ppb_attendees_page["agency_name"] != "" else agency_name1
        agency_name_style = ppb_attendees_page["agency_name_style"]
    except KeyError:
        agency_name = agency_name1
        agency_name_style = PPB_ATTENDEES_PAGE["agency_name_style"]
    try:
        agency_contact = ppb_attendees_page["agency_contact"] if ppb_attendees_page[
                                                                     "agency_contact"] != "" else agency_contact1
        agency_contact_style = ppb_attendees_page["agency_contact_style"]
    except KeyError:
        agency_contact = agency_contact1
        agency_contact_style = PPB_ATTENDEES_PAGE["agency_contact_style"]
    try:
        client_name = ppb_attendees_page["client_name"] if ppb_attendees_page["client_name"] != "" else client_name1
        client_name_style = ppb_attendees_page["client_name_style"]
    except KeyError:
        client_name = client_name1
        client_name_style = PPB_ATTENDEES_PAGE["client_name_style"]
    try:
        client_contact = ppb_attendees_page["client_contact"] if ppb_attendees_page[
                                                                     "client_contact"] != "" else client_contact1
        client_contact_style = ppb_attendees_page["client_contact_style"]
    except KeyError:
        client_contact = client_contact1
        client_contact_style = PPB_ATTENDEES_PAGE["client_contact_style"]
    response_data = {
        "page_title": ppb_attendees_page["page_title"],
        "page_title_style": ppb_attendees_page["page_title_style"],
        "visible": ppb_attendees_page["visible"],
        "page_number": ppb_attendees_page["page_number"],
        "agency_attendees": agency_attendees_data,
        "agency_name": agency_name,
        "agency_name_style": agency_name_style,
        "agency_contact": agency_contact,
        "agency_contact_style": agency_contact_style,
        "client_attendees": client_attendees_data,
        "client_contact": client_contact,
        "client_contact_style": client_contact_style,
        "client_name": client_name,
        "client_name_style": client_name_style,
    }
    return response_data


def get_boards_scripts_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_boards_scripts_page = ppb.data["Pages"]["Boards/Scripts"]
    data = []
    try:
        scripts = ppb_boards_scripts_page["scripts"]
        for script in scripts:
            if script["job_script_id"] == "":
                document = script["document"]
                job_script_id = script["job_script_id"]
            else:
                document = JobScript.objects.get(pk=script["job_script_id"]).script.document
                job_script_id = JobScript.objects.get(pk=script["job_script_id"]).id
            data.append({"job_script_id": job_script_id, "document": document})
    except KeyError:
        pass
    response_data = {
        "page_title": ppb_boards_scripts_page["page_title"],
        "page_title_style": ppb_boards_scripts_page["page_title_style"],
        "visible": ppb_boards_scripts_page["visible"],
        "page_number": ppb_boards_scripts_page["page_number"],
        "scripts": data,
    }
    return response_data


def get_schedule_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_schedule_page = ppb.data["Pages"]["Schedule"]
    if ppb.is_schedule_updated:
        response_data = ppb.data["Pages"]["Schedule"]
    else:
        job_shoot_dates = JobShootDate.objects.filter(job=job).order_by("date")
        response_data = {}
        response_data["page_title"] = ppb_schedule_page["page_title"]
        response_data["page_title_style"] = ppb_schedule_page["page_title_style"]
        response_data["visible"] = ppb_schedule_page["visible"]
        response_data["page_number"] = ppb_schedule_page["page_number"]
        data = {}
        index = 0
        for job_shoot_date in job_shoot_dates:
            index += 1
            data[job_shoot_date.date.strftime("%B %d, %Y")] = {}
            shoot_notes = ShootNote.objects.filter(job_shoot_date=job_shoot_date,
                                                   ).order_by("job_shoot_date__date", "time")
            shoot_note_list = []
            for shoot_note in shoot_notes:
                shoot_note_list.append({
                    "time": shoot_note.time,
                    "time_style": PPB_SCHEDULE_PAGE["time_style"],
                    "notes": shoot_note.notes,
                    "notes_style": PPB_SCHEDULE_PAGE["notes_style"],
                })
            data[job_shoot_date.date.strftime("%B %d, %Y")]["notes"] = shoot_note_list
            data[job_shoot_date.date.strftime("%B %d, %Y")]["date"] = job_shoot_date.date.strftime("%b %d, %Y")
            data[job_shoot_date.date.strftime("%B %d, %Y")]["shoot_day"] = f"Shoot Day {index}"
            data[job_shoot_date.date.strftime("%B %d, %Y")]["shoot_day_style"] = PPB_SCHEDULE_PAGE["shoot_day_style"]
        response_data["schedules"] = data
    return response_data


def get_cast_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_cast_page = ppb.data["Pages"]["Cast"]
    data = []
    try:
        casts = ppb_cast_page["casts"]
        for cast in casts:
            if cast["cast_id"] == "":
                data.append(cast)
            else:
                job_cast = Cast.objects.get(pk=cast["cast_id"])
                data.append({
                    "cast_id": cast["cast_id"],
                    "profile_photo": cast["profile_photo"] if cast["profile_photo"] != "" else job_cast.profile_photo,
                    "role_title": cast["role_title"] if cast["role_title"] != "" else job_cast.role_title,
                    "role_title_style": cast["role_title_style"],
                    "full_name": cast["full_name"] if cast["full_name"] != "" else job_cast.full_name,
                    "full_name_style": cast["full_name_style"],
                })
    except KeyError:
        pass
    response_data = {
        "page_title": ppb_cast_page["page_title"],
        "page_title_style": ppb_cast_page["page_title_style"],
        "visible": ppb_cast_page["visible"],
        "page_number": ppb_cast_page["page_number"],
        "casts": data,
    }
    return response_data


def get_wardrobe_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_wardrobe_page = ppb.data["Pages"]["Wardrobe"]
    data = []
    try:
        wardrobes = ppb_wardrobe_page["wardrobes"]
        for wardrobe in wardrobes:
            if wardrobe["wardrobe_id"] == "":
                data.append(wardrobe)
            else:
                job_wardrobe = Wardrobe.objects.get(pk=wardrobe["wardrobe_id"])
                data.append({
                    "wardrobe_id": wardrobe["wardrobe_id"],
                    "image": wardrobe["image"] if wardrobe["image"] != "" else job_wardrobe.image,
                    "role_title": wardrobe["role_title"] if wardrobe[
                                                                "role_title"] != "" else job_wardrobe.cast.role_title,
                    "role_title_style": wardrobe["role_title_style"],
                    "full_name": wardrobe["full_name"] if wardrobe["full_name"] != "" else job_wardrobe.cast.full_name,
                    "full_name_style": wardrobe["full_name_style"],
                })
    except KeyError:
        pass
    response_data = {
        "page_title": ppb_wardrobe_page["page_title"],
        "page_title_style": ppb_wardrobe_page["page_title_style"],
        "visible": ppb_wardrobe_page["visible"],
        "page_number": ppb_wardrobe_page["page_number"],
        "wardrobes": data,
    }
    return response_data


def get_callsheet_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_callsheet_page = ppb.data["Pages"]["Callsheet"]
    data = []
    try:
        callsheets = ppb_callsheet_page["callsheets"]
        for callsheet in callsheets:
            if callsheet["callsheet_id"] == "":
                data.append(callsheet)
            else:
                job_callsheet = ClientCallSheet.objects.get(pk=callsheet["callsheet_id"])
                data.append({
                    "callsheet_id": callsheet["callsheet_id"],
                    "production_contact_label": callsheet["production_contact_label"] if callsheet[
                        "production_contact_label"] else "Production Contact:",
                    "production_contact_label_style": callsheet["production_contact_label_style"],
                    "production_contact": callsheet["production_contact"] if callsheet[
                        "production_contact"] else job_callsheet.production_contact.get_full_name(),
                    "production_contact_style": callsheet["production_contact_style"],
                    "production_contact_phone_label": callsheet["production_contact_phone_label"] if callsheet[
                        "production_contact_phone_label"] else "Production Contact Phone:",
                    "production_contact_phone_label_style": callsheet["production_contact_phone_label_style"],
                    "production_contact_phone": callsheet["production_contact_phone"] if callsheet[
                        "production_contact_phone"] else job_callsheet.production_contact_phone,
                    "production_contact_phone_style": callsheet["production_contact_phone_style"],
                    "location_label": callsheet["location_label"] if callsheet["location_label"] else "Location:",
                    "location_label_style": callsheet["location_label_style"],
                    "location": callsheet["location"] if callsheet[
                        "location"] else job_callsheet.location.get_address(),
                    "location_style": callsheet["location_style"],
                    "directions_label": callsheet["directions_label"] if callsheet[
                        "directions_label"] else "Directions:",
                    "directions_label_style": callsheet["directions_label_style"],
                    "directions": callsheet["directions"] if callsheet["directions"] else job_callsheet.location.link,
                    "directions_style": callsheet["directions_style"],
                    "hospital_label": callsheet["hospital_label"] if callsheet["hospital_label"] else "Hospital:",
                    "hospital_label_style": callsheet["hospital_label_style"],
                    "hospital": callsheet["hospital"] if callsheet["hospital"] else job_callsheet.hospital,
                    "hospital_style": callsheet["hospital_style"],
                    "parking_label": callsheet["parking_label"] if callsheet["parking_label"] else "Parking:",
                    "parking_label_style": callsheet["parking_label_style"],
                    "parking": callsheet["parking"] if callsheet["parking"] else job_callsheet.parking,
                    "parking_style": callsheet["parking_style"],
                    "date_label": callsheet["date_label"] if callsheet["date_label"] else "Date:",
                    "date_label_style": callsheet["date_label_style"],
                    "date": callsheet["date"] if callsheet["date"] else job_callsheet.date.strftime("%B %dth, %Y"),
                    "date_style": callsheet["date_style"],
                    "time_label": callsheet["time_label"] if callsheet["time_label"] else "Time:",
                    "time_label_style": callsheet["time_label_style"],
                    "time": callsheet["time"] if callsheet["time"] else job_callsheet.time,
                    "time_style": callsheet["time_style"],
                    "notes_label": callsheet["notes_label"] if callsheet["notes_label"] else "Note:",
                    "notes_label_style": callsheet["notes_label_style"],
                    "notes": callsheet["notes"] if callsheet["notes"] else job_callsheet.notes,
                    "notes_style": callsheet["notes_style"],
                })
    except KeyError:
        pass
    response_data = {
        "page_title": ppb_callsheet_page["page_title"],
        "page_title_style": ppb_callsheet_page["page_title_style"],
        "visible": ppb_callsheet_page["visible"],
        "page_number": ppb_callsheet_page["page_number"],
        "callsheets": data,
    }
    return response_data


def get_location_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_location_page = ppb.data["Pages"]["Location"]
    data = []
    try:
        locations = ppb_location_page["locations"]
        for location in locations:
            if location["location_id"] == "":
                data.append(location)
            else:
                job_location = Location.objects.get(pk=location["location_id"])
                data.append({
                    "location_id": location["location_id"],
                    "location_title_label": location["location_title_label"] if location[
                        "location_title_label"] else "Location Title:",
                    "location_title_label_style": location["location_title_label_style"],
                    "location_title": location["location_title"] if location[
                        "location_title"] else job_location.location_title,
                    "location_title_style": location["location_title_style"],
                    "address_label": location["address_label"] if location["address_label"] else "Address:",
                    "address_label_style": location["address_label_style"],
                    "address": location["address"] if location["address"] else job_location.get_address(),
                    "address_style": location["address_style"],
                    "directions_label": location["directions_label"] if location["directions_label"] else "Directions:",
                    "directions_label_style": location["directions_label_style"],
                    "directions": location["directions"] if location["directions"] else job_location.link,
                    "directions_style": location["directions_style"],
                    "notes_label": location["notes_label"] if location["notes_label"] else "Note:",
                    "notes_label_style": location["notes_label_style"],
                    "notes": location["notes"] if location["notes"] else job_location.notes,
                    "notes_style": location["notes_style"],
                    "image": location["image"] if location["image"] else job_location.image,
                })
    except KeyError:
        pass
    response_data = {
        "page_title": ppb_location_page["page_title"],
        "page_title_style": ppb_location_page["page_title_style"],
        "visible": ppb_location_page["visible"],
        "page_number": ppb_location_page["page_number"],
        "locations": data,
    }
    return response_data


def get_weather_page(job):
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_weather_page = ppb.data["Pages"]["Weather"]
    response_data = {
        "page_title": ppb_weather_page["page_title"],
        "page_title_style": ppb_weather_page["page_title_style"],
        "visible": ppb_weather_page["visible"],
        "page_number": ppb_weather_page["page_number"],
    }
    return response_data


def get_thank_you_page(job):  # noqa
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_thank_you_page = ppb.data["Pages"]["Thank You"]
    try:
        company_name = ppb_thank_you_page["company_name"]
    except KeyError:
        company_name = job.company.title
    try:
        company_name_style = ppb_thank_you_page["company_name_style"]
    except KeyError:
        company_name_style = PPB_THANK_YOU_PAGE["company_name_style"]
    try:
        address = ppb_thank_you_page["address"]
    except KeyError:
        address = (f"{job.company.state}, {job.company.city}, "
                   f"{job.company.street}, {job.company.zip_code}")
    try:
        address_style = ppb_thank_you_page["address_style"]
    except KeyError:
        address_style = PPB_THANK_YOU_PAGE["address_style"]
    try:
        phone = ppb_thank_you_page["phone"]
    except KeyError:
        phone = job.company.phone
    try:
        phone_style = ppb_thank_you_page["phone_style"]
    except KeyError:
        phone_style = PPB_THANK_YOU_PAGE["phone_style"]
    try:
        email = ppb_thank_you_page["email"]
    except KeyError:
        email = job.company.email
    try:
        email_style = ppb_thank_you_page["email_style"]
    except KeyError:
        email_style = PPB_THANK_YOU_PAGE["email_style"]
    response_data = {
        "page_title": ppb_thank_you_page["page_title"],
        "page_title_style": ppb_thank_you_page["page_title_style"],
        "visible": ppb_thank_you_page["visible"],
        "page_number": ppb_thank_you_page["page_number"],
        "company_name": company_name,
        "company_name_style": company_name_style,
        "address": address,
        "address_style": address_style,
        "phone": phone,
        "phone_style": phone_style,
        "email": email,
        "email_style": email_style,
    }
    return response_data


def get_watermark(job):  # noqa
    ppb, created = PreProductionBook.objects.get_or_create(job=job)
    ppb_watermark = ppb.data["Watermarks"]
    try:
        client = Client.objects.get(job=job)
        client_logo1 = client.get_profile_photo()
    except Client.DoesNotExist:
        client_logo1 = job.client_logo_s3_url
    try:
        agency = Agency.objects.get(job=job)
        agency_logo1 = agency.profile_photo
    except Agency.DoesNotExist:
        agency_logo1 = None
    try:
        prod_logo = ppb_watermark["prod_logo"]
    except KeyError:
        prod_logo = job.company.profile_photo_s3_url
    try:
        client_logo = ppb_watermark["client_logo"]
    except KeyError:
        client_logo = client_logo1
    try:
        agency_logo = ppb_watermark["agency_logo"]
    except KeyError:
        agency_logo = agency_logo1
    response_data = {
        "prod_logo": prod_logo,
        "client_logo": client_logo,
        "agency_logo": agency_logo,
    }
    return response_data


default_ppb_pages = {
    "Cover Page": get_cover_page,
    "Title Page": get_title_page,
    "Attendees": get_attendees_page,
    "Boards/Scripts": get_boards_scripts_page,
    "Schedule": get_schedule_page,
    "Cast": get_cast_page,
    "Wardrobe": get_wardrobe_page,
    "Callsheet": get_callsheet_page,
    "Location": get_location_page,
    "Weather": get_weather_page,
    "Thank You": get_thank_you_page,
}


def deep_update(source, overrides):
    """
    Update a nested dictionary or similar mapping.
    Modify ``source`` in place.
    """
    for key, value in overrides.items():
        if isinstance(value, collections.Mapping) and value:
            returned = deep_update(source.get(key, {}), value)
            source[key] = returned
        else:
            source[key] = overrides[key]
    return source


class PPBViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class =  PreProductionBookSerializer
    def list(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        ppb = PreProductionBook.objects.get(job=job)
        ppb_data = ppb.data
        custom_pages = {}
        for key in ppb_data["Pages"]:
            if "Custom" in key:
                custom_pages[key] = ppb_data["Pages"][key]
        pages = {
            "Cover Page": get_cover_page(job),
            "Title Page": get_title_page(job),
            "Attendees": get_attendees_page(job),
            "Boards/Scripts": get_boards_scripts_page(job),
            "Schedule": get_schedule_page(job),
            "Cast": get_cast_page(job),
            "Wardrobe": get_wardrobe_page(job),
            "Callsheet": get_callsheet_page(job),
            "Location": get_location_page(job),
            "Weather": get_weather_page(job),
            "Thank You": get_thank_you_page(job),
        }
        pages.update(custom_pages)
        response_data = {
            "pages": pages,
            "watermarks": get_watermark(job),
        }
        return Response(response_data)

    def create(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        response_data = {}
        ppb = PreProductionBook.objects.get(job=job)
        ppb.data["Pages"] = deep_update(ppb.data["Pages"], request.data)
        for key in request.data.keys():
            response_data[key] = ppb.data["Pages"][key]
        ppb.save()
        if "Cover Page" in request.data:
            response_data = {
                "Cover Page": get_cover_page(job),
            }
        if "Title Page" in request.data:
            response_data = {
                "Title Page": get_title_page(job),
            }
        if "Attendees" in request.data:
            response_data = {
                "Attendees": get_attendees_page(job),
            }
        if "Boards/Scripts" in request.data:
            response_data = {
                "Boards/Scripts": get_boards_scripts_page(job),
            }
        if "Schedule" in request.data:
            response_data = {
                "Schedule": get_schedule_page(job),
            }
        if "Cast" in request.data:
            response_data = {
                "Cast": get_cast_page(job),
            }
        if "Wardrobe" in request.data:
            response_data = {
                "Wardrobe": get_wardrobe_page(job),
            }
        if "Callsheet" in request.data:
            response_data = {
                "Callsheet": get_callsheet_page(job),
            }
        if "Location" in request.data:
            response_data = {
                "Location": get_location_page(job),
            }
        if "Weather" in request.data:
            response_data = {
                "Weather": get_weather_page(job),
            }
        if "Thank You" in request.data:
            response_data = {
                "Thank You": get_thank_you_page(job),
            }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, job_id=None, pk=None):
        return super(PPBViewSet, self).retrieve(request=request, pk=pk)

    def delete(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        page_key = request.data
        ppb = PreProductionBook.objects.get(job=job)
        ppb_data = ppb.data
        if page_key in ppb_data["Pages"]:
            del ppb_data["Pages"][page_key]
        ppb.data = ppb_data
        ppb.save()
        return Response([], status=status.HTTP_200_OK)

    def ordering(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        ppb = PreProductionBook.objects.get(job=job)
        ppb_data = ppb.data
        index = 1
        for page in request.data:
            ppb_data["Pages"][page]["page_number"] = index
            index += 1
        ppb.data = ppb_data
        ppb.save()
        return Response([], status=status.HTTP_200_OK)

    def reset(self, request, job_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        ppb = PreProductionBook.objects.get(job=job)
        ppb_data = ppb.data
        # Reset Cover Page
        cover_page = ppb_data["Pages"]["Cover Page"]
        cover_page["page_title_style"] = PPB_COVER_PAGE["page_title_style"]
        # Reset Title Page
        title_page = ppb_data["Pages"]["Title Page"]
        title_page["page_title_style"] = PPB_TITLE_PAGE["page_title_style"]
        title_page["client_name_style"] = PPB_TITLE_PAGE["client_name_style"]
        title_page["project_name_style"] = PPB_TITLE_PAGE["project_name_style"]
        title_page["pre_production_book_label_style"] = PPB_TITLE_PAGE["pre_production_book_label_style"]
        title_page["shoot_dates_style"] = PPB_TITLE_PAGE["shoot_dates_style"]
        # Reset Attendees Page
        attendees_page = ppb_data["Pages"]["Attendees"]
        attendees_page["page_title_style"] = PPB_ATTENDEES_PAGE["page_title_style"]
        attendees_page["agency_name_style"] = PPB_ATTENDEES_PAGE["agency_name_style"]
        attendees_page["agency_contact_style"] = PPB_ATTENDEES_PAGE["agency_contact_style"]
        attendees_page["client_name_style"] = PPB_ATTENDEES_PAGE["client_name_style"]
        attendees_page["client_contact_style"] = PPB_ATTENDEES_PAGE["client_contact_style"]
        try:
            agency_attendees = attendees_page["agency_attendees"]
            for agency_attendee in agency_attendees:
                agency_attendee["agency_attendee_contact_style"] = PPB_ATTENDEES_PAGE["agency_attendee_contact_style"]
                agency_attendee["agency_attendee_contact_title_style"] = PPB_ATTENDEES_PAGE[
                    "agency_attendee_contact_title_style"]
        except KeyError:
            pass
        try:
            client_attendees = attendees_page["client_attendees"]
            for client_attendee in client_attendees:
                client_attendee["client_attendee_contact_style"] = PPB_ATTENDEES_PAGE["client_attendee_contact_style"]
                client_attendee["client_attendee_contact_title_style"] = PPB_ATTENDEES_PAGE[
                    "client_attendee_contact_title_style"]
        except KeyError:
            pass
        boards_scripts_page = ppb_data["Pages"]["Boards/Scripts"]
        # Reset Boards/Scripts Page
        boards_scripts_page["page_title_style"] = PPB_BOARDS_SCRIPTS_PAGE["page_title_style"]
        schedule_page = ppb_data["Pages"]["Schedule"]
        schedule_page["page_title_style"] = PPB_SCHEDULE_PAGE["page_title_style"]
        try:
            schedules = schedule_page["schedules"]
            for schedule in schedules:
                schedule["shoot_day_style"] = PPB_SCHEDULE_PAGE["shoot_day_style"]
                notes = schedule["notes"]
                for note in notes:
                    note["time_style"] = PPB_SCHEDULE_PAGE["time_style"]
                    note["notes_style"] = PPB_SCHEDULE_PAGE["notes_style"]
        except KeyError:
            pass
        # Reset Cast Page
        cast_page = ppb_data["Pages"]["Cast"]
        cast_page["page_title_style"] = PPB_CAST_PAGE["page_title_style"]
        try:
            casts = cast_page["casts"]
            for cast in casts:
                cast["role_title_style"] = PPB_CAST_PAGE["role_title_style"]
                cast["full_name_style"] = PPB_CAST_PAGE["full_name_style"]
        except KeyError:
            pass
        # Reset Wardrobe Page
        wardrobe_page = ppb_data["Pages"]["Wardrobe"]
        wardrobe_page["page_title_style"] = PPB_WARDROBE_PAGE["page_title_style"]
        try:
            wardrobes = wardrobe_page["wardrobes"]
            for wardrobe in wardrobes:
                wardrobe["role_title_style"] = PPB_WARDROBE_PAGE["role_title_style"]
                wardrobe["full_name_style"] = PPB_WARDROBE_PAGE["full_name_style"]
        except KeyError:
            pass
        # Reset Callsheet Page
        callsheet_page = ppb_data["Pages"]["Callsheet"]
        callsheet_page["page_title_style"] = PPB_CALLSHEET_PAGE["page_title_style"]
        try:
            callsheets = callsheet_page["callsheets"]
            for callsheet in callsheets:
                callsheet["production_contact_label_style"] = PPB_CALLSHEET_PAGE["production_contact_label_style"]
                callsheet["production_contact_style"] = PPB_CALLSHEET_PAGE["production_contact_style"]
                callsheet["production_contact_phone_label_style"] = PPB_CALLSHEET_PAGE[
                    "production_contact_phone_label_style"]
                callsheet["production_contact_phone_style"] = PPB_CALLSHEET_PAGE["production_contact_phone_style"]
                callsheet["location_label_style"] = PPB_CALLSHEET_PAGE["location_label_style"]
                callsheet["location_style"] = PPB_CALLSHEET_PAGE["location_style"]
                callsheet["directions_label_style"] = PPB_CALLSHEET_PAGE["directions_label_style"]
                callsheet["directions_style"] = PPB_CALLSHEET_PAGE["directions_style"]
                callsheet["hospital_label_style"] = PPB_CALLSHEET_PAGE["hospital_label_style"]
                callsheet["hospital_style"] = PPB_CALLSHEET_PAGE["hospital_style"]
                callsheet["parking_label_style"] = PPB_CALLSHEET_PAGE["parking_label_style"]
                callsheet["parking_style"] = PPB_CALLSHEET_PAGE["parking_style"]
                callsheet["date_label_style"] = PPB_CALLSHEET_PAGE["date_label_style"]
                callsheet["date_style"] = PPB_CALLSHEET_PAGE["date_style"]
                callsheet["time_label_style"] = PPB_CALLSHEET_PAGE["time_label_style"]
                callsheet["time_style"] = PPB_CALLSHEET_PAGE["time_style"]
                callsheet["notes_label_style"] = PPB_CALLSHEET_PAGE["notes_label_style"]
                callsheet["notes_style"] = PPB_CALLSHEET_PAGE["notes_style"]
        except KeyError:
            pass
        # Reset Location Page
        location_page = ppb_data["Pages"]["Location"]
        location_page["page_title_style"] = PPB_LOCATION_PAGE["page_title_style"]
        try:
            locations = location_page["locations"]
            for location in locations:
                location["location_title_label_style"] = PPB_LOCATION_PAGE["location_title_label_style"]
                location["location_title_style"] = PPB_LOCATION_PAGE["location_title_style"]
                location["address_label_style"] = PPB_LOCATION_PAGE["address_label_style"]
                location["address_style"] = PPB_LOCATION_PAGE["address_style"]
                location["directions_label_style"] = PPB_LOCATION_PAGE["directions_label_style"]
                location["directions_style"] = PPB_LOCATION_PAGE["directions_style"]
                location["notes_label_style"] = PPB_LOCATION_PAGE["notes_label_style"]
                location["notes_style"] = PPB_LOCATION_PAGE["notes_style"]
        except KeyError:
            pass
        # Reset Weather Page
        weather_page = ppb_data["Pages"]["Weather"]
        weather_page["page_title_style"] = PPB_WEATHER_PAGE["page_title_style"]
        # Reset Thank You Page
        thank_you_page = ppb_data["Pages"]["Thank You"]
        thank_you_page["page_title_style"] = PPB_THANK_YOU_PAGE["page_title_style"]
        thank_you_page["company_name_style"] = PPB_THANK_YOU_PAGE["company_name_style"]
        thank_you_page["address_style"] = PPB_THANK_YOU_PAGE["address_style"]
        thank_you_page["phone_style"] = PPB_THANK_YOU_PAGE["phone_style"]
        thank_you_page["email_style"] = PPB_THANK_YOU_PAGE["email_style"]
        ppb.data = ppb_data
        ppb.save()
        ppb_data = ppb.data
        custom_pages = {}
        for key in ppb_data["Pages"]:
            if "Custom" in key:
                custom_pages[key] = ppb_data["Pages"][key]
        pages = {
            "Cover Page": get_cover_page(job),
            "Title Page": get_title_page(job),
            "Attendees": get_attendees_page(job),
            "Boards/Scripts": get_boards_scripts_page(job),
            "Schedule": get_schedule_page(job),
            "Cast": get_cast_page(job),
            "Wardrobe": get_wardrobe_page(job),
            "Callsheet": get_callsheet_page(job),
            "Location": get_location_page(job),
            "Weather": get_weather_page(job),
            "Thank You": get_thank_you_page(job),
        }
        pages.update(custom_pages)
        response_data = {
            "pages": pages,
            "watermarks": get_watermark(job),
        }
        return Response(response_data, status=status.HTTP_200_OK)

    def watermark(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        ppb = PreProductionBook.objects.get(job=job)
        ppb.data["Watermarks"] = deep_update(ppb.data["Watermarks"], request.data)
        ppb.save()
        response_data = get_watermark(job)
        return Response(response_data, status=status.HTTP_200_OK)


@api_view(["POST", "GET"])
@permission_classes((IsAuthenticated,))
def update_ppb_settings(request, job_id=None):
    if not job_id:
        raise NotImplementedError("This API doesn't support execution missing gig id.")
    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
    job_settings = JobSettings.objects.get(job=job)
    if request.method == "POST":
        job_settings.ppb_settings = request.data
        job_settings.save()
    return Response(job_settings.ppb_settings)
