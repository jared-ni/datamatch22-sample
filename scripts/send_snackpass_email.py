'''
Use this script to send emails to people who are going on Snackpass dates
'''

import argparse
import json
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = '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'


def main(matches, privateProfile, smallProfile):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    with open(matches) as m:
        with open(privateProfile) as p:
            with open(smallProfile) as s:
                matches = json.load(m)
                privateProfile = json.load(p)
                smallProfile = json.load(s)

                emails = []
                for key, val in matches.items():
                    if 'canDate' not in val:
                        continue
                    if not val['canDate']:
                        continue
                    if 'dateInfo' not in val:
                        continue
                    if 'dateOptionId' not in val['dateInfo']:
                        continue
                    if 'confirmed' not in val['dateInfo']:
                        continue
                    if val['dateInfo']['dateOptionId'] == '-MvlKglWoyvJeFJ9N00Q':
                        uid1, uid2 = key.split('-')

                        if uid1 in privateProfile and uid2 in smallProfile:
                            emails.append((privateProfile[uid1]['email'], smallProfile[uid2]['name']))
                        if uid2 in privateProfile:
                            emails.append((privateProfile[uid2]['email'], smallProfile[uid1]['name']))

                count = 0
                for user_email, matched_user in emails:
                    try:
                        send_to = sib_api_v3_sdk.SendSmtpEmailTo(email=user_email)
                        params = sib_api_v3_sdk.SendSmtpEmail(to=[send_to], template_id=97, params={"matchedUser": matched_user})
                        api_response = api_instance.send_transac_email(params)
                        print(api_response)
                        count += 1
                    except ApiException as e:
                        print(e)
                print('Num emails sent:', count)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-m',
                        help='exported matches json',
                        required=True,
                        type=str)
    parser.add_argument('-p',
                        help='exported privateProfile json',
                        required=True,
                        type=str)
    parser.add_argument('-s',
                        help='exported smallProfile json',
                        required=True,
                        type=str)
    args = parser.parse_args()
    main(args.m, args.p, args.s)
