import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { geoJson } from "../../utils/geojson";
import {MAPBOX_ACCESS_TOKEN} from "../../config/config";

const Map = () => {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  const mapContainerRef = useRef(null);

  function createElementReport(address, full_address) {
    let reportElement = `<div class="container">
  <div class="row">
      <div class="col-12">
          <div class="info-box">
              <div class="title-report">
              <span class="badge badge-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
            </svg>
          </span>
          <strong>Thông tin địa điểm</strong>
              </div>
              <p>${address}</p>
              <p>${full_address}</p>
              <div type="button" class="btn btn-outline-danger btn-sm float-right">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" class="bi bi-exclamation-octagon-fill" viewBox="0 0 16 16">
                  <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                    BÁO CÁO VI PHẠM
              </div>
          </div>
      </div>
  </div>
</div>`;

    return reportElement;
  }

  async function reverseGeocoding(lat, long) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=pk.eyJ1Ijoibmh1dHBoYW1kZXYiLCJhIjoiY2xvbGcwZm5sMG1lMDJpbnJuemNmYm1xYyJ9.w9hEet44dcjmTnu7LWUkWQ`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [ 106.7008, 10.7769],
      maxZoom: 20,
      zoom: 14,

    });

    let lng;
    let lat;

    map.on("click", async (event) => {
      lng = event.lngLat.lng.toFixed(6);
      lat = event.lngLat.lat.toFixed(6);
      const data = await reverseGeocoding(lat, lng);
      let features = data.features;
      let Address = features[0].text; // địa danh: "Bách hoá xanh, chợ, trường, công ty,..."
      let  ward = features[1].text;
      let district = features[3].text;
      let city = features[4].text;
      const fullAddress = `${Address}, ${ward}, ${district}, ${city}`;
      const elementReport = createElementReport(Address, fullAddress);

      new mapboxgl.Popup()
        .setLngLat(event.lngLat)
        .setHTML(elementReport)
        .addTo(map);
    });

    map.on('load', () => {
      map.addSource('places', {
        'type': 'geojson',
        'data': geoJson
      });


      map.addLayer({
        id: 'myDataCircles',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': 15,
          "circle-color": "#11b4da",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        }
      });
      
      // Add a new layer to the map for the labels
      map.addLayer({
        id: 'myDataLabels',
        type: 'symbol',
        source: 'places',
        layout: {
          'text-field': 'QC',
          'text-size': 9
        }
      });

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "bottom-right"
      );
  
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: true, // Use the geocoder's default marker style
        bbox: [106.6297, 10.6958, 106.8413, 10.8765], // Set the bounding box coordinates
        placeholder: "Tìm kiếm địa điểm", // Placeholder text for the search bar,
        autocomplete: true,
      });
      
      map.addControl(geocoder, "top-left");
      const marker = new mapboxgl.Marker({
        color: '#314ccd'
      });

      map.on('click', 'myDataCircles', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'myDataCircles', function() {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      // When the mouse leaves a feature in the 'placesCircles' layer, change the cursor style back to default
      map.on('mouseleave', 'myDataCircles', function() {
        map.getCanvas().style.cursor = '';
      });

    

      map.on('click' , (event) => {
        console.log(event);
        marker.setLngLat(event.lngLat).addTo(map);

        if(map.getLayer('places')) {
         return;
        }else {
          alert('Bạn chưa chọn địa điểm');
        }
      });

    });
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
      <div id="map" ref={mapContainerRef} />;
    </>
  );
};

export default Map;
