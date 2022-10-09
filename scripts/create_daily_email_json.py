'''
Use this script to generate a JSON for daily notifications for use with send_daily_email.py
'''

import argparse
from curses.ascii import alt
import json
import csv


def main(current_day, users_file, match_catalog_file, matches_file, outfile):
    emails = []

    mc_f = open(match_catalog_file, 'r')
    user_f = open(users_file, 'r')
    m_f = open(matches_file, 'r')
    
    match_catalog_data = json.load(mc_f)
    user_data = json.load(user_f)
    matches_data = json.load(m_f)
    for uid1, user in user_data.items():

        new_matches = 0
        unread = 0
        dates = 0

        if uid1 in match_catalog_data:
            for uid2, match in match_catalog_data[uid1].items():
                if match["matched"]:
                    if "unread" not in match:
                        if uid2 in match_catalog_data and uid1 in match_catalog_data[uid2] and match_catalog_data[uid2][uid1]["matched"] and "unread" not in match_catalog_data[uid2][uid1]:
                            new_matches += 1
                    elif match["unread"] > 0:
                        unread += match["unread"]

                    match_id = f'{uid1}-{uid2}' if uid1 < uid2 else f'{uid2}-{uid1}'

                    if match_id in matches_data and "dateInfo" in matches_data[match_id]:
                        if "day" in matches_data[match_id]["dateInfo"]:
                            if matches_data[match_id]["dateInfo"]["day"] >= current_day:
                                dates += 1

            if current_day == 1 or (new_matches + unread + dates) > 0:
                email = { "email": user["email"], "new_matches": new_matches, "unread": unread, "dates": dates }
                emails.append(email)

    with open(outfile, 'w') as out_f:
        json.dump(emails, out_f)

    mc_f.close()
    user_f.close()
    m_f.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-day',
                        help='the day it is',
                        required=True,
                        type=int)
    parser.add_argument('-users',
                        help='exported users_file json',
                        required=True,
                        type=str)
    parser.add_argument('-matchCatalog',
                        help='exported match_catalog_file json',
                        required=True,
                        type=str)
    parser.add_argument('-matches',
                        help='exported matches_file json',
                        required=True,
                        type=str)
    parser.add_argument('-o',
                        help='output email JSON file',
                        type=str,
                        default='emails.json')
    args = parser.parse_args()
    main(args.day, args.users, args.matchCatalog, args.matches, args.o)
