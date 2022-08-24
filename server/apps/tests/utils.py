import random
import string
from functools import partial


def id_generator(size=6, chars=string.ascii_lowercase):
    return "".join(random.choice(chars) for _ in range(size))


def mock_request(*args, **kwargs):
    del kwargs

    class MockResponse:
        def __init__(self, json_data=None, status_code=200):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    return MockResponse(json_data=args[0])


def mock_validation(self, *args, **kwargs):
    intent = self.request.data.get("intent")
    endpoint_data = self.request.data.get("data")
    endpoint_type = kwargs.get("endpoint_type")
    patient_id = kwargs.get("patient_id")

    return endpoint_data, endpoint_type, "", intent, patient_id, None, None


mock_empty = partial(mock_request, None)
