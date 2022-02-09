import axios from "axios";

export const mapService = {
    getUSCovidData: () => {
        return axios.get('https://corona.lmao.ninja/v2/jhucsse/counties');

    },
};
export default mapService;