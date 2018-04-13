class WeatherService {

	constructor($http) {
        'ngInject';
        this.$http = $http;
        this.weatherURL = '';
    }

    getWeatherSydney() {
        const httpConfig = {
			method: 'GET',
			url: `${this.weatherURL}/data/2.5/weather`,
			params: {
                appid: 'b6907d289e10d714a6e88b30761fae22', // for register
                id: '2154855' // id of Sydney
            }
		};

		return this.$http(httpConfig)
			.then(response => {
                const data = response.data;
                if (angular.isDefined(data)) {
                    return data.main.temp;
                }

                return null;
            })
			.catch((error) => {
			});
    }

}

export default WeatherService;
