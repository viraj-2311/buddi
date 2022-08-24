from logging import Filter


class DebugSQL_Filter(Filter):
    """Do not show Django's debug SQL to debug log"""
    def filter(self, record):
        return record.funcName != "debug_sql"
