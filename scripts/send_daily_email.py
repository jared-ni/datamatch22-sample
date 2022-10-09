'''
Use this script along with create_daily_email_json.py to send daily notifications
'''


import argparse
import json
import csv
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = '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'

def main(notifs, day):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    with open(notifs, 'r') as n_f:
        notifs_data = json.load(n_f)
        for user in notifs_data:
            try:
                send_to = sib_api_v3_sdk.SendSmtpEmailTo(email=user["email"])
                params = sib_api_v3_sdk.SendSmtpEmail(to=[send_to], template_id=58, params={"day": "2/" + str(14 + int(day)), "new_matches": user["new_matches"], "unread": user["unread"], "dates": user["dates"]})
                api_response = api_instance.send_transac_email(params)
                print(api_response)
            except ApiException as e:
                print(e)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-notifs',
                        help='JSON file of user notifications from create_daily_email_json.py',
                        required=True,
                        type=str)
    parser.add_argument('-day',
                        help='the day it is',
                        required=True,
                        type=str)
    args = parser.parse_args()
    main(args.notifs, args.day)
