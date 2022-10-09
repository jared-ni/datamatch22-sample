'''
Use this script to take exported Firebase user data and create emails CSV for biz team to send out pub emails
'''

import argparse
import json
import csv


def main(users, outfile):
    with open(users) as f:
        count = 0
        data = json.load(f)
        with open(outfile, 'w') as csvfile:
            fieldnames = ['email']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for value in data.values():
                if 'email' in value:
                    count += 1
                    writer.writerow({'email': value['email']})
        print(count)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i',
                        help='exported users json',
                        required=True,
                        type=str)
    parser.add_argument('-o',
                        help='output email CSV file',
                        type=str,
                        default='emails.csv')
    args = parser.parse_args()
    main(args.i, args.o)
