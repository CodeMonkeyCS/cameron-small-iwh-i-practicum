const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-734c46cf-85a1-45e9-8473-39c2eb3178fa';
const CUSTOM_SCHEMAS_URL = `https://api.hubspot.com/crm/v3/schemas`;
const CUSTOM_OBJECTS_URL = 'https://api.hubapi.com/crm/v3/objects';

let petObjects = []

/// \brief find and return the first instance of the Pet object schema
function findPetSchema(arrayOfObjects) {
    let petIndex = -1;
    for (let index = 0; index < arrayOfObjects.length; ++index) {
        if (arrayOfObjects[index]['labels']['singular'] === "Pet") {
            petIndex = index;
            break;
        }
    }

    // create a schema of the data we care about
    const petObject = arrayOfObjects[petIndex];
    const petSchema = {
        objectTypeId : petObject['objectTypeId'],
        fullyQualifiedName : petObject['fullyQualifiedName'],
        id : petObject['id'],
        searchableProperties : petObject['searchableProperties'],
    }

    return petSchema;
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const customObjects = CUSTOM_SCHEMAS_URL;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(customObjects, { headers });
        const petSchema = findPetSchema(response.data.results);

        const petProperties = '&properties=pet_name&properties=pet_bio&properties=job_title'
        const petsURL = `${CUSTOM_OBJECTS_URL}/${petSchema.objectTypeId}?${petProperties}`;
        const petsResponse = await axios.get(petsURL, { headers });

        petObjects = petsResponse.data.results;
        res.render('home', { title: 'Pets | HubSpot APIs', petObjects });

    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update', async (req, res) => {
    try {
        res.render('update', { title: 'Pets | HubSpot APIs', petObjects });

    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update', async (req, res) => {
    // const update = {
    //     properties: {
    //         "pet_name": req.body.pet_name
    //         "pet_bio": req.body.pet_bio
    //         "job_title": req.body.job_title
    //     }
    // }
    //
    // const email = req.query.email;
    // const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    // const headers = {
    //     Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    //     'Content-Type': 'application/json'
    // };

    try {
        // await axios.patch(updateContact, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));