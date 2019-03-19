export function titleCase (str): string {
  return str.toLowerCase().split(' ').map((word): string => {
    return word.replace(word[0], word[0].toUpperCase())
  }).join(' ')
}
