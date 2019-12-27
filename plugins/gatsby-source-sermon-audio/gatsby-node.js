const axios = require('axios');

const defaultFieldsToInclude = ['bibleText'];
const requiredFields = ['id', 'internal'];

const processSermons = (sermon, fieldsToInclude = defaultFieldsToInclude) => {
    return Object.keys(sermon)
        .reduce((acc, key) => {
            if (fieldsToInclude.concat(requiredFields).includes(key)) {
                return {
                    ...acc,
                    [key]: sermon[key]
                };
            }
            return acc;
        }, {});
};

const getSermons = (apiKey) => {
    return axios.get('https://api.sermonaudio.com/v2/node/sermons', {
        headers: {
            'X-Api-Key': apiKey
        }
    });
}

exports.sourceNodes = async ({ actions }, options) => {
    const { apiKey } = options;
    const { createNode } = actions

    // getting the list of items for calendar
    const { data: { results }} = await getSermons(apiKey);

     results.forEach(result => console.log("result", result));
  
    // Process data into nodes.
    results
        .map(sermon => ({
            ...sermon,
            id: sermon.sermonId,
            internal: {
                contentDigest: sermon.sermonId,
                type: 'Sermon'
            }
        }))
        .forEach(sermon => createNode(processSermons(sermon)));
  
    // We're done, return.
    return;
};
