'''
Use this script to take update local config.json to match Firestore's config
'''

import argparse
import json
from firebase_admin import credentials, firestore, initialize_app


def main(cred_path, env, outfile):
    cred = credentials.Certificate(cred_path)
    if env == 'production':
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-default-rtdb.firebaseio.com'})
    else:
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-test-default-rtdb.firebaseio.com'})

    db = firestore.client()
    doc = db.collection('settings').document('config').get()
    print(doc.to_dict())

    with open(outfile, 'w') as fp:
        json.dump(doc.to_dict(), fp, indent=2, sort_keys=True)


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
                        help='out path for config.json file',
                        type=str,
                        default='src/constants/config.json')
    args = parser.parse_args()
    main(args.c, args.e, args.o)
