export function getRatingMessage(rate: number): string {
  if (rate <= 1) {
    return 'Very bad. Totally dissatisfied.'
  } else if (rate <= 2) {
    return "Bad. I didn't like it."
  } else if (rate <= 3) {
    return 'Good, but it could be better.'
  } else if (rate <= 4) {
    return 'Very good!'
  } else if (rate <= 5) {
    return 'I loved it! Wonderful!'
  } else {
    return 'Invalid rating.'
  }
}
