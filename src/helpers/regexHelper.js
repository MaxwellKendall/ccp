import { flattenDeep } from 'lodash';

const regex = '(?<unicode>&[a-z]*;)|(?<html><[a-z]>|<\/[a-z]>)'

export const charByUnicode = {
    '&nbsp;': ' '
}

export const removeHTMLAndUnicode = (testString) => {
    const results = [
        ...testString.matchAll(regex)
    ];
    return results
        .map((result) => {
            console.log("result", result)
            if (!!result.groups.unicode && !!result.groups.html) return result.groupss
            if (!result.groups.unicode && !!result.groups.html) return { html: result.groups.html }
            if (!!result.groups.unicode && !result.groups.html) return { unicode: result.groups.unicode }
        })
        .reduce((str, match) => {
            if (match.unicode) {
                return str.replace(match.unicode, charByUnicode[match.unicode])
            }
            if (match.html) {
                return str.replace(match.html, '');
            }
        }, testString);
    console.log("test", test)
};
