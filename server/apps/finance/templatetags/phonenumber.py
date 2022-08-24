from django import template

register = template.Library()


def phonenumber(phone: str):
    # checking if None/Null
    if phone is None:
        return ""

    phone = str(phone)
    if phone.startswith('+') and len(phone) == 12:
        phone = phone[1:]
    if phone.startswith('1') and len(phone) == 11:
        return "+%s (%s) %s-%s" % (phone[0], phone[1:4], phone[4:7], phone[7:])
    if len(phone) == 10:
        return "+1 (%s) %s-%s" % (phone[0:3], phone[3:6], phone[6:])
    return str(phone)

register.filter('phonenumber', phonenumber)
