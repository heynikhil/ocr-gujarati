const vision = require('@google-cloud/vision');
const { Translate } = require('@google-cloud/translate').v2;
const config = require('./dfpostman/config')
const fs = require('fs');


const credentials = {
    client_email: config.client_email,
    private_key: config.private_key,
};
const client = new vision.ImageAnnotatorClient({
    projectId: config.project_id,
    credentials
});

const translate = new Translate({
    projectId: config.project_id,
    credentials
})

async function ocr() {
 
    const [textDetections] = await client.annotateImage({
        "image": {
            "source": {
                "imageUri": "gs://gujocttest/guj.png"
            }
        },
        "features": [
            {
                "type": "DOCUMENT_TEXT_DETECTION"
            },
            {
                "type": "TEXT_DETECTION"
            },
   
        ],
        "imageContext": {
            "languageHints": ["gu"]
        }
    });
    const [annotation] = textDetections.textAnnotations;

    const text = annotation ? annotation.description : '';
    console.log(`Extracted text from image:`, text);
    fs.writeFileSync("synchronous.txt", text)

    let [translateDetection] = await translate.detect(text);
    if (Array.isArray(translateDetection)) {
        [translateDetection] = translateDetection;
    }
    console.log(
        `Detected language "${translateDetection.language}"`
    );
}
ocr()