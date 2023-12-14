import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { geoJson } from "../../utils/geojson";

const Map = () => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoibmh1dHBoYW1kZXYiLCJhIjoiY2xvbGcwZm5sMG1lMDJpbnJuemNmYm1xYyJ9.w9hEet44dcjmTnu7LWUkWQ";
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
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.707222, 10.752444], // Ho Chi Minh City
      zoom: 12,
    });
    map.on("load", () => {
      map.addSource("points", {
        type: "geojson",
        data: geoJson,
        cluster: true, // Enables clustering
        clusterMaxZoom: 14, // Maximum zoom level at which clustering is enabled
        clusterRadius: 50, // The radius of each cluster when clustering points
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]], // Filter out clustered points
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 15,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
      map.addLayer({
        id: 'unclustered-point-label',
        type: 'symbol',
        source: 'points',
        filter: ['!', ['has', 'point_count']], // Use the same filter as your circle layer
        layout: {
            'text-field': 'QC', // This is the text that will be displayed
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'], // Set the text font
            'text-size': 12 // Set the text size
        },
        paint: {
            'text-color': '#ffffff' // Set the text color
        }
      });
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
    let lng;
    let lat;
    map.addControl(geocoder, "top-left");

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
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
      <div id="map" ref={mapContainerRef}  />;
    </>
  );
};

export default Map;
