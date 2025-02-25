export const commonRootPath = "../../../../backend/build-campaigns/";

export const toDashCase = (word: string) =>
  word.replace(
    /[A-Z]/g,
    (match, offset) => (offset > 0 ? "-" : "") + match.toLowerCase(),
  );
