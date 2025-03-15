import isValidGitHash from "./isValidGitHash";

const getHash = async () => {
  const { execa } = await import("execa");

  const { stdout: hash } = await execa("git", ["rev-parse", "HEAD"], {
    shell: false,
  });

  if (!isValidGitHash(hash)) {
    throw new Error("Git command execution did not return a valid git hash.");
  }

  return hash;
};

export default getHash;
