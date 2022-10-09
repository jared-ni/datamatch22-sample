'''
Use this script to take match data and create the matchCatalog to upload to Firebase
'''

import argparse
import json


def main(infile, outfile):
    matchCatalog = {}
    with open(infile) as f:
        data = json.load(f)
        for key in data.keys():
            uid1, uid2 = key.split('-')
            if uid1 not in matchCatalog:
                matchCatalog[uid1] = {}
            if uid2 not in matchCatalog:
                matchCatalog[uid2] = {}
            matchCatalog[uid1][uid2] = {'matched': False}
            matchCatalog[uid2][uid1] = {'matched': False}
    with open(outfile, 'w') as out:
        json.dump(matchCatalog, out)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', help='input match json', required=True, type=str)
    parser.add_argument('-o',
                        help='output match catalog',
                        type=str,
                        default='matchCatalog.json')
    args = parser.parse_args()
    main(args.i, args.o)
