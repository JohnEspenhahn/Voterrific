'use strict';

angular.module('location', ['uiGmapgoogle-maps']).config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyD0d7h9MKnvO8J_aWUO1PdJP4hntSzRWfA',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});