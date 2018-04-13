class WeatherService {

	constructor($http, WEATHER_INFO) {
        'ngInject';
        this.$http = $http;
        this.weatherURL = '';
        this.WEATHER_INFO = WEATHER_INFO;
    }

    getWeatherSydney() {
        const httpConfig = {
			method: 'GET',
			url: `${this.weatherURL}/data/2.5/weather`,
			params: this.WEATHER_INFO
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
