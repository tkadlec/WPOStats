const { ACCESS_TOKEN, SITE_ID } = process.env;
const fetch = require('fetch');

exports.handler = async function(event, context) {
    // get latest testId

    fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`, {
        headers: {
            "Authorization": "Bearer " + ACCESS_TOKEN
        }
    }).then((response) => {
        response.json().then((json) => {
            console.log("response....");
            console.log(json);
            return {
                statusCode: '200',
                body: JSON.stringify(json);
            }
        })
    });
    
    
    // //serve redirect
    // return {
    //     statusCode: 302,
    //     body: JSON
    // }
}