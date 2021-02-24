const WebPageTest = require('webpagetest');
const { WPT_API_KEY, COMMIT_REF, URL } = process.env;
const request = require("request");

function encode(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
}

exports.handler = function(event, context) {
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
            console.log(encode({
                "form-name": "webpagetest-test",
                "testId": testId
            }));
            
            let payload = {
                "form-name": "webpagetest-test",
                "testId": testId
            };
            console.log("Payload....");
            console.log(payload);

            request.post({ "url": URL, "formData": payload}, function(err, httpResponse, body) {
                let msg;

                if (err) {
                    msg = "Submission failed: " + err;
                    console.log(msg);
                } else {
                    msg = "submission succeeded";
                    console.log(msg);
                }
            });

            return console.log('Complete');
        } else {
            
        }
    });
}