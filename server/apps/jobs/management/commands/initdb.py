import csv
import json
import os
import traceback

from django.core.management.base import BaseCommand

from apps.jobs.processors import process_job_memo_data, process_registration_data


class Command(BaseCommand):
    help = "Initializes the database with test data."

    def add_arguments(self, parser):
        parser.add_argument("--dataset", dest="dataset", action="store", default="simple",
                            help="The dataset to load: simple, widefield, everett, boston")

    def handle_registration_data(self, js_name, csv_name):
        with open(js_name, "r") as f:
            js_contents = json.load(f)
        with open(csv_name) as f:
            csv_contents = [{k: v for k, v in row.items()} for row in csv.DictReader(f, skipinitialspace=True)]
        process_registration_data(js_contents, csv_contents)

    def handle_job_memo_data(self, csv_name):
        with open(csv_name) as f:
            csv_contents = [{k: v for k, v in row.items()} for row in csv.DictReader(f, skipinitialspace=True)]
        process_job_memo_data(csv_contents)

    def handle(self, *args, **kwargs):
        try:
            processed = False
            if kwargs["dataset"] == "register":
                root = os.path.join("apps/jobs/management/commands/db/init/")
                for company in os.listdir(root):
                    company = os.path.join(root, company)
                    if os.path.isdir(company):
                        csv_name = f"{company}/accounts.csv"
                        js_name = f"{company}/company.json"
                        self.handle_registration_data(js_name, csv_name)
                        processed = True
            elif kwargs["dataset"] == "jobmemo":
                jobmemo_root = os.path.join("apps/jobs/management/commands/db/jobmemo/")
                if os.path.isdir(jobmemo_root):
                    csv_name = f"{jobmemo_root}/jobmemos.csv"
                    self.handle_job_memo_data(csv_name)
                    processed = True
            if not processed:
                raise Exception("No handlers for the extensions in the dataset.")
        except Exception as ex:
            print(ex)
            traceback.print_exc()
            print("There was a problem with the dataset.")
