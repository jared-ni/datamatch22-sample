'''
Use this script to set verified checks for DM members
'''

import argparse
import json
from firebase_admin import credentials, firestore, db, initialize_app

def main(cred_path, env):
    cred = credentials.Certificate(cred_path)
    if env == 'production':
        # update databaseURL later
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-default-rtdb.firebaseio.com'})
    else:
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-test-default-rtdb.firebaseio.com'})

    f = open('../src/constants/VerifiedEmails.json')
    emails = json.load(f)['emails']

    privateProfileData = db.reference('/privateProfile').get()
    publicProfileRef = db.reference('/publicProfile')

    for key, value in privateProfileData.items():
        if value['email'] in emails:
            publicProfileRef.child(key).update({'verified': True})
            

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c',
                        help='path to admin SDK credentials',
                        required=True,
                        type=str)
    parser.add_argument('-e',
                        help='environment (development/production)',
                        type=str,
                        default='development')
    args = parser.parse_args()
    main(args.c, args.e)
