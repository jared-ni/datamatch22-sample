'''
Use this script to take update local sponsors.json to match sponsors' info in Firebase/Firestore
'''

import argparse
import json
from firebase_admin import credentials, firestore, db, initialize_app


def main(cred_path, env, outfile):
    cred = credentials.Certificate(cred_path)
    if env == 'production':
        # update databaseURL later
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-default-rtdb.firebaseio.com'})
    else:
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-test-default-rtdb.firebaseio.com'})

    sponsors = db.reference('/sponsors').get()
    for key in sponsors.keys():
        sponsors[key]['schools'] = 'All' if sponsors[key].get('allSchools', False) else []
        sponsors[key]['blurbLocations'] = [loc['value'] for loc in sponsors[key]['blurbLocations']]
        sponsors[key].pop('allSchools', None)

    firestore_db = firestore.client()
    config = firestore_db.collection('settings').document('config').get().to_dict()
    college_mapping = config['college_to_sponsors']
    for college in college_mapping.keys():
        for sponsor_key in college_mapping[college]:
            if sponsors[sponsor_key]['schools'] != 'All':
                sponsors[sponsor_key]['schools'].append(college)

    with open(outfile, 'w') as fp:
        json.dump(list(sponsors.values()), fp, indent=2, sort_keys=True)


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
    parser.add_argument('-o',
                        help='out path for sponsors.json file',
                        type=str,
                        default='src/constants/sponsors.json')
    args = parser.parse_args()
    main(args.c, args.e, args.o)
