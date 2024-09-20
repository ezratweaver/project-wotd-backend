export function generateOTP(length: number) {
  const allowedCharacters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let otp = "";
  for (let i = 1; i <= length; i++) {
    const index = Math.floor(Math.random() * allowedCharacters.length);

    otp = otp + allowedCharacters[index];
  }

  return otp;
}
