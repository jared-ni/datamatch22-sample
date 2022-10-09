export const generateCode = () => {
  const digits = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  let code = '';
  for (let i = 0; i < 8; ++i) {
    let index = Math.floor(Math.random() * digits.length);
    code += digits[index];
  }
  return code;
};

// Used for date notifications (don't use for cancelling dates)
// Returns true until EOD of the scheduled date
export const isInFuture = day => {
  const now = Date.now();
  const timeScheduled = Date.parse(String(day + 15) + ' Feb 2021 05:00:00 GMT');
  return timeScheduled - now > 0;
};
