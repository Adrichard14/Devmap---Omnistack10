const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {

    async index(request, response){
        const devs = await Dev.find();
        
        return response.json(devs);
    },

    async update(request, response) {
        const { github_username } = request.body;
        let dev = await Dev.findOne( { github_username });
        if(!dev){
            console.log('O dev buscado não está cadastrado!');
        } else{
            const { name, bio, techs, avatar_url} = request.body;
             const techsArray = parseStringAsArray(techs);
            dev = await Dev.update({
                name, 
                techsArray,
                avatar_url,
                bio
            })
           
        }
        return response.json(dev);
    },

    async destroy(){

    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const {
                name = login, avatar_url, bio
            } = apiResponse.data

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

             dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }


        return response.json(dev);
    }
}