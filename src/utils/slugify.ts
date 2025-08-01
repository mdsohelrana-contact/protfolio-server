const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export default slugify;
