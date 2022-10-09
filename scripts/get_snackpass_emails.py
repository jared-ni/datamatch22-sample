'''
Use this script to get emails of people who are going on Snackpass dates
'''

import argparse
import json
import csv


def main(matches, privateProfile, outfile):
    with open(matches) as m:
        with open(privateProfile) as p:
            matches = json.load(m)
            privateProfile = json.load(p)

            emails = set()
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
                    if uid1 in privateProfile:
                        emails.add(privateProfile[uid1]['email'])
                    if uid2 in privateProfile:
                        emails.add(privateProfile[uid2]['email'])

            emails = list(emails)
            with open(outfile, 'w') as csvfile:
                fieldnames = ['email']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()

                count = 0
                for email in emails:
                    writer.writerow({'email': email})
                    count += 1
                print(f'for sanity check, number of emails for Snackpass dates:', count)


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
    parser.add_argument('-o',
                        help='output email CSV file',
                        type=str,
                        default='snackpass_emails.csv')
    args = parser.parse_args()
    main(args.m, args.p, args.o)
