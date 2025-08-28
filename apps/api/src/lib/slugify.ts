import slugifyLib from "slugify";

export const slugify = (input: string) => {
  return slugifyLib(input, {
    lower: true,
    strict: true,
    trim: true,
    replacement: "-",
  });
};
