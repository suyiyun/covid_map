export const mapUtils = {
    
    getCovidPoints: function(countyLevelPoints) {
        const result = {};
        if (!countyLevelPoints) {   //sanity check
            return {};
        }
        const states = {
            type: 'states',
            US: {
            },
        };
        const nations = {
            type: 'nations',
        };

        //  aggregate data by state
        for (const point of countyLevelPoints) {
            // sanity check
            if (Number.isNaN(point.stats.confirmed)){
                console.log('error');
                continue;
            }
            // ...other sanity check 

            // initialize county if necessary
            if (!states[point.country]) {
                states[point.country] = {};
            }
            
            if (!states[point.country][point.province]) {
                states[point.country][point.province] = {
                    confirmed: 0,
                    deaths: 0,
                    recovered: 0,
                };
            }

            // aggregate
            states[point.country][point.province].confirmed += point.stats.confirmed;
            states[point.country][point.province].deaths += point.stats.deaths;
            states[point.country][point.province].recovered += point.stats.recovered;

            // 坐标
            // initialize
            if (!states[point.country][point.province].coordinates) {
                states[point.country][point.province].coordinates = point.coordinates;
            }
            
            let i = 1; // zoom level
            for(; i<=4; i++) {
                result[i] = nations;
            }

            for(; i<=9; i++) {
                result[i] = states;
            }
            for (; i<=20; i++){
                result[i] = countyLevelPoints;
            }

        }
        return result;
    },
    isInBoundary: function (bounds, coordinates) {
        return coordinates && bounds && bounds.nw && bounds.se && ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
            && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
    }
};