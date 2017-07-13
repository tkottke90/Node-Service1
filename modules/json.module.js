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
     * Get List of Children
     */
    getChildren(){

    },

    getChildByID(){}
};