export const getFileExt = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

export const isImage = (fileName) => {
  const fileExt = getFileExt(fileName);

  return ['jpeg', 'jpg', 'gif', 'png', 'svg'].includes(fileExt.toLowerCase());
};

export const isPdf = (fileName) => {
  const fileExt = getFileExt(fileName);

  return fileExt.toLowerCase() === 'pdf';
};