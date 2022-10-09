"""
Use this script to export Harvard surveys from the Firestore
"""

import argparse
import json
from firebase_admin import credentials, firestore, initialize_app


def main(cred_path, outfile):
    cred = credentials.Certificate(cred_path)
    db_url = 'https://datamatch2022-default-rtdb.firebaseio.com'
    initialize_app(cred, {'databaseURL': db_url})

    db = firestore.client()
    docs = db.collection('surveys').stream()
    res = {'surveys': {}}
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')
        res['surveys'][doc.id] = doc.to_dict()

    with open(outfile, 'w') as fp:
        json.dump(res, fp, indent=2, sort_keys=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c',
                        help='path to admin SDK credentials',
                        required=True,
                        type=str)
    parser.add_argument('-o',
                        help='out path for config.json file',
                        type=str,
                        default='config.json')
    args = parser.parse_args()
    main(args.c, args.o)
