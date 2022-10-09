'''
Use this script to generate date codes, taking in `/dateOptions` node as 
a JSON file.
'''

import json
import math
import random
import sys


def generate_code():
    digits = [str(x) for x in range(1, 10)]
    digits += [chr(x) for x in range(65, 91)]
    code = ""
    for _ in range(8):
        idx = math.floor(random.random() * len(digits))
        code += digits[idx]
    return code


def main(argv):
    # Usage: first argument is path of file that contains `/dateOptions` data as json
    # second argument is path of file that contains existing `/codes` data as json
    try:
        date_options_json = open(argv[0], 'r')
    except:
        print("File does not exist.")
        sys.exit(1)

    if len(argv) > 1:
        # Open for reading and writing
        codes_json = open(argv[1], 'r+')
        # Save existing data in `codes_dict`
        try:
            # for some reason, this line wouldn't work if argv[1] opened in 'w+'...
            codes_dict = json.load(codes_json)
        except:
            codes_dict = {}
    else:
        codes_json = open('datamatch2022-test-codes-import.json', 'w')
        codes_dict = {}

    # Keys are dateOptionId's
    date_options_dict = json.load(date_options_json)

    # For each date option, generate appropriate number of codes and store in
    # `codes_dict` to get converted back to JSON
    for date_option_id, date_option_id_values in date_options_dict.items():
        date_option_id_dict = {}

        # Skip this `date_option_id` if `codeType` is provided or multiuse
        code_type = date_option_id_values['codeType']
        if code_type == 'provided' or code_type == 'multiuse':
            continue

        # Something went wrong if `date_option_id` is already in `codes_dict`
        if date_option_id in codes_dict:
            print(
                f"{date_option_id} already exists in the `/codes`! Please double check {argv[1]}.")
            codes_json.close()
            date_options_json.close()
            sys.exit(1)

        # Generate unique codes for each date option
        for _ in range(date_option_id_values['total']):
            while True:
                code = generate_code()
                if code not in date_option_id_dict:
                    break
            date_option_id_dict[code] = False
        codes_dict[date_option_id] = date_option_id_dict

    codes_json.seek(0)
    codes_json.truncate()
    codes_json.write(json.dumps(codes_dict))
    codes_json.close()
    date_options_json.close()


if __name__ == "__main__":
    main(sys.argv[1:])
