import { flattenDeep } from 'lodash';

const regex = '(?<unicode>&[a-z]*;)|(?<html><[a-z]>|<[a-z]\/>)'

export const getHtmlAndUnicode = (testString) => {
    const results = [
        ...testString.matchAll(regex)
    ];
    return flattenDeep(results)
        .map((result) => {
            if (!!result.group.unicode && !!result.group.html) return result.group
            if (!result.group.unicode && !!result.group.html) return { html: result.group.html }
            if (!!result.group.unicode && !result.group.html) return { unicode: result.group.unicode }
        })
};
