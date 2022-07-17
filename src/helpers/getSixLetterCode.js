export const getSixLetterCode = () => {
  let code = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  while (code.length < 6) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};
