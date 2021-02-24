const WebPageTest = require('webpagetest');
const { WPT_API_KEY, COMMIT_REF, URL } = process.env;
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
    const wpt = new WebPageTest('www.webpagetest.org', WPT_API_KEY);

    let opts = {
        "firstViewOnly": true,
        "runs": 3,
        "location": "Dulles:Chrome",
        "label": 'Netlify Deploy ' + COMMIT_REF
    }

    console.log('Running WPT....');

    wpt.runTest(URL, opts, (err, result)=> {
        if (result && result.data) {
            //looking good, let's get our ID
            let testId = result.data.testId;
            console.log('Test ID: ' + testId);

            //submit it via Netlify forms
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode({
                    "form-name": "webpagetest-test",
                    "testId": testId
                })
            }).then(() => ({
                statusCode: 200,
                body: 'success'
            }))
            .catch((error) => ({statusCode: 422, body: String(error)}));
        } else {
            
        }
    });
}