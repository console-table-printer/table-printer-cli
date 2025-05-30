export const isValidJson = (str: string): Boolean => {
  if (!str) {
    console.error('Input is required');
    return false;
  }

  try {
    const jsonObj = JSON.parse(str);
    if (!Array.isArray(jsonObj)) {
      console.error('"input" is not an array');
      return false;
    }
    return true;
  } catch (err) {
    console.log('Invalid JSON input');
    return false;
  }
};

export const verifyInput = (inp: string): Boolean => {
  if (inp === undefined || inp === null) {
    console.error('Input is required');
    return false;
  }
  return isValidJson(inp);
};

export const verifyTableOptions = (options: string): boolean => {
  if (!options) {
    console.error('Table options are required');
    return false;
  }
  try {
    JSON.parse(options);
    return true;
  } catch (err) {
    console.error('Invalid tableOptions JSON');
    return false;
  }
};
