"use strict";

/**
 * Module Designed to handle JSON Data and verify that the data is recieves is JSON
 */
module.exports = {
    
    /**
     * Function checks to see if variable data has type of 'object'
     * @param {*} data 
     * @returns true if the data has a type of 'object'
     */
    verifyJSON(data) {
        var isJSON = typeof data === 'object';
        console.log("[JSON-Module] - verifyJSON : " + isJSON);
        return isJSON;
    },

    /**
     * Method takes a JSON object and verifies that the data included matches all parts of the template
     * @param {JSON} data - JSON data to be checked
     * @param {string} templateURL - Link to file that contains a template of JSON Object
     * @param {string} templateName (Optional) - name of template in use
     */
    validateTemplate(data, templateURL, templateName){},

    /**
     * Get List of Children
     */
    getChildren(){

    },

    getChildByID(){}
};