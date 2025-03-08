const isValidGitHash = (hash: string) => {
  const gitHashRegex = /^[0-9a-f]{40}$/;
  return typeof hash === "string" && gitHashRegex.test(hash);
};

export default isValidGitHash;
