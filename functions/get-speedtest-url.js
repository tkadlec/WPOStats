const { ACCESS_TOKEN, SITE_ID } = process.env;
const NetlifyAPI = require('netlify');

exports.handler = async function(event, context) {
    // get latest testId
    const client = new NetlifyAPI(ACCESS_TOKEN);
    //fetch forms
    const forms = await client.listFormSubmissions({
        formId: '6036cdd27d632a0007c2691f'
    })
    console.log('FORMS: ' + forms);
    console.log('Latest test: ' + forms[0].data.testURL);

    return {
        statusCode: '302',
        headers: {
            Location: JSON.stringify(forms[0].data.testURL)
        }
    }

}