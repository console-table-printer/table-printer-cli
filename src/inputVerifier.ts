export const isValidJson = (str: string): Boolean => {
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

export const verifyInput = (inp: string): Boolean => isValidJson(inp);

export const verifyTableOptions = (options: string): boolean => {
  try {
    JSON.parse(options);
    return true;
  } catch (err) {
    console.error('Invalid tableOptions JSON');
    return false;
  }
};
