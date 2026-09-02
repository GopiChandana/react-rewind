/**
 * Custom Sequential Regular Expression Fuzzy Matcher with Proximity Scoring
 * @param {string} text - The database text to check against (e.g., Restaurant Name, Dish Name)
 * @param {string} query - The search query typed by the user (e.g., "chkn briyani")
 * @returns {object} { matches: boolean, score: number }
 */

export const fuzzyMatch = (
  text: string,
  query: string,
): { matches: boolean; score: number } => {
  //if we type nothing or search text is empty,then everything is a perfect match with a score of 0

  if (!query) return { matches: true, score: 0 };

  //Splitting input characters into an array with individual strings (e.g., ['c', 'h', 'k', 'n'])

  const chars = query.split("");

  // Here we are finding any character in this string that has a special meaning in RegEx,
  // and put a safety backslash \ right in front of it so it behaves like a normal, literal
  // character and join using the greedy wildcards (*.)

  const pattern = chars
    .map((ch) => ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");

  // Compiling text strings into RegExp system

  const regex = new RegExp(pattern, "i"); // 'i' for case insensitive

  // If sequences break, assign an Infinity score to hide it.

  if (!regex.test(text)) return { matches: false, score: Infinity };

  //Proximity Span Distance Calculation logic

  const lowerText = text.toLowerCase();

  const lowerQuery = query.toLowerCase();

  // indexOf() starts at the beginning of the string and moves forward until it finds the first match.

  const firstIndex = lowerText.indexOf(lowerQuery.charAt(0));

  //lastIndexOf() starts at the end of the string and moves backward until it finds the first match.
  const lastIndex = lowerText.lastIndexOf(
    lowerQuery.charAt(lowerQuery.length - 1),
  );

  const matchDistance = lastIndex - firstIndex;

  // Return matching verification flag and proximity dense score weights (Lowest scores win!!)
  return { matches: true, score: matchDistance };
};
