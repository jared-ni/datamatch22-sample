'''
Use this script to take update local teams.json to match Firestore's teams node
'''

import argparse
import json
from firebase_admin import credentials, firestore, initialize_app


def main(cred_path, env, outfile):
    cred = credentials.Certificate(cred_path)
    if env == 'production':
        # update databaseURL later
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022.firebaseio.com'})
    else:
        app = initialize_app(
            cred, {'databaseURL': 'https://datamatch2022-test-default-rtdb.firebaseio.com'})

    db = firestore.client()
    # make sure collection name is 'team'
    schools = db.collection('team').get()
    teams = {'Campus Members' : [], 'Web' : [], 'Design' : [], 'Algorithm' : [], 'Statistics' : [], 'Business' : []}
    for school in schools:
        members = school.to_dict()['data']
        for member in members:
            # only team members in the Harvard list have a team; everyone else goes to campus members
            key = member.get('team', 'Web') if school.id == 'Harvard' else 'Campus Members'
            member['school'] = member.get('school', 'Harvard') if school.id == 'Harvard' else school.id
            teams[key].append(member)

    with open(outfile, 'w') as fp:
        json.dump(teams, fp, indent=2, sort_keys=True)


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
                        help='out path for teams.json file',
                        type=str,
                        default='src/constants/teams.json')
    args = parser.parse_args()
    main(args.c, args.e, args.o)
