const { ACCESS_TOKEN, SITE_ID } = process.env;
const NetlifyAPI = require('netlify');

exports.handler = async function(event, context) {
    // get latest testId

    const client = new NetlifyAPI(ACCESS_TOKEN);
    console.log("client is in....");
    //fetch forms
    try {
        const forms = await client.listFormSubmissions({
            formId: '6036cdd27d632a0007c2691f'
        })
        console.log(forms[0].data.testURL);
        return {
            statusCode: '302',
            headers: {
                Location: forms[0].data.testURL
            }
        }
    } catch (error) {
        console.log("error....");
        console.log(error);
        return { statusCode: 422, body: error};
    }
    
    // //serve redirect
    // return {
    //     statusCode: 302,
    //     body: JSON
    // }
}