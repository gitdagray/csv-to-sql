export const validate = (value: any): value is string => {
    if (!value || typeof value !== "string" || value.length < 1) {
        return false;
    }
    return true;
};

/**
 *
 * @param {string} fileNameWithExtension - send a file name with file extension
 * @description It will take a filename with file extension
 * @example `example.csv`
 * @returns {string} validFilename
 */
export const skipExtension = (fileNameWithExtension: string): string =>
    fileNameWithExtension.split(".")[0] as string;
