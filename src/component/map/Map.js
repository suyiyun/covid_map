import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import CountyCard from '../cards/CountyCard';
import StateCard from '../cards/StateCard';
import mapService from '../../services/mapService'; 
import { mapUtils } from '../../utils/mapUtils';
// const AnyReactComponent = ({ text }) => <div>{text}</div>;
// const AnyReactComponent = ({ children }) => children;

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 41,
      lng: -74.1
    },
    zoom: 11
  };

  state = {
    boundary: {},
    zoomLevel: 11,
    points: null,
  }
  renderPoints = () => {
    const zoomLevel = this.state.zoomLevel;
    const result = [];
    if(!this.state.points) {
      return result;
    }
    // console.log(this.state, 'state');

    const pointsByZoomLevel = this.state.points[zoomLevel];
    // console.log('ZoomByzoomLevel')

    if (Array.isArray(pointsByZoomLevel)) {
      for (const county of pointsByZoomLevel) {
        if(!mapUtils.isInBoundary(this.state.boundary, county.coordinates)){
          continue;
        }
        // console.log('push');

        result.push(
          <CountyCard
              key={`county-card-${county.county}`}
              lat={county.coordinates.latitude}
              lng={county.coordinates.longitude}
              countyName={county.county}
              {...county.stats}
          
          />
        );

      }
    }

    // handle state level
    if (pointsByZoomLevel.type === 'states') {
      for (const nation in pointsByZoomLevel) {
        for (const state in pointsByZoomLevel[nation]){
          const stateData = pointsByZoomLevel[nation][state];
          if(!mapUtils.isInBoundary(this.state.boundary, stateData.coordinates)){
            continue;
          }
          result.push(
            <StateCard 
                key={`state-card-${state}`}
                lat={stateData.coordinates.latitude}
                lng={stateData.coordinates.longitude}
                stateName={state}
                confirmed={stateData.confirmed}
                deaths={stateData.deaths}
                recovered={stateData.recovered}
                
            />
          )

        }
      }

    }
    return result;

  }

  render() {
      console.log(this.state);
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCkbWwvhzxprr8Smo5s1CFl9XVqoHnz63c' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChange={(changeEventObject) => {
            this.setState({
              boundary: changeEventObject.bounds,
              zoomLevel: changeEventObject.zoom,
            });
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => {
            mapService.getUSCovidData()
            .then((response) => {
              const aggregatedDataPoints = mapUtils.getCovidPoints(response.data);
              // console.log(aggregatedDataPoints);
              // console.log('api called');
              this.setState({
                points: aggregatedDataPoints,
              });

          })
            .catch(function(error){
              console.log(error);
              
            });
          }}
          
        >
          {/* <AnyReactComponent
            lat={41}
            lng={-74.1}
            text="My Marker"
          /> */}
          {/* <CountyCard lat={41} lng={-74.1} />
          <StateCard lat={41} lng={-74.2} /> */}
          {this.renderPoints()}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;