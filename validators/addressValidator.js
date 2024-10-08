const axios = require('axios');

async function isLocalValid(neighborhood, city){
    try {
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
            key: global.env.OPENCAGE_KEY,
            q: `${neighborhood}, ${city}, Brasil`,
            limit: 1,
            no_annotations: 1,
            }
        });
        console.log(response.data.results[0])
        
        if(response.data.results[0].components.suburb && response.data.results[0].components.city){
            return true;
        } else {
            return false;
        }
    } 
    catch (error) {
        return false;
    }
}

module.exports = {isLocalValid}