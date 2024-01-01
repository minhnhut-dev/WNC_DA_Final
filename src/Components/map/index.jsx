import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { axiosService } from "../../Services/axiosServices";
import { MAPBOX_ACCESS_TOKEN } from "../../config/config";
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  CardImg
} from "reactstrap";

import "./map.css";
import ReactDOMServer from 'react-dom/server';

import CardSpacesInfo from "../CardSpaceInfo";
import { useFormik } from "formik";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as yup from "yup";
import ListSurfaces from "../ListSurface";
import ModalReport from "../ModaReport";

const Map = () => {
  const [spacesId, setSpacesId] = useState(null);
  const [modal, setModal] = useState(false);
  const [formReports, setFormReports] = useState([]);
  const [listSurfaces, setListSurfaces] = useState([]);
  const [surfaceId, setSurfaceId] = useState(null);
  
  const toggle = () => setModal(!modal);
  const toggleModalReportSurface = () => setSurfaceId(null);
  const loadSpaces = async () => {
    const response = await axiosService.get("/spaces?page=1&limit=100");
    return response.data;
  }

  const handleLoadSurfacesBySpaces = async (id) => {
    const { data } = await axiosService.get(`/surfaces/space/${id}`);
    return data;
  }

  const handleLoadFormReports = async () => {
    const { data } = await axiosService.get(`/form-reports`);
    return data;
  }

  const handleReportSurfaces = async (params) => {
    const { data } = await axiosService.post(`/reports-surface`, params);
    return data;
  };

  const formatGeoJson = (data) => {
    let geoJson = {
      type: "FeatureCollection",
      features: [],
    };
    data.forEach((item) => {
      let feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
        },
        properties: {
          id: item.id,
          description: item.address,
          formAdvertising: item.formAdvertising.name,
          locationTypes: item.locationTypes.name,
          zone: item.zone,
          full_address: `${item.address}, ${item.ward.name}, ${item.district.name}`,
        },
      };
      geoJson.features.push(feature);
    });

    return geoJson;
  }

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

  const renderOptionsFormReport = () => {
    return (
      formReports && formReports.map((formReport, i) => (
        <option value={formReport.id} key={i}>{formReport.name}</option>
      ))
    )
  }

  useEffect(() => {
    loadSpaces().then((space) => {
      const { data } = space;
      if (data) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [106.660172, 10.762622],
          maxZoom: 20,
          zoom: 14,
        });
        map.on('load', () => {
          map.addSource('places', {
            'type': 'geojson',
            'data': formatGeoJson(data),
          });
          map.addLayer({
            id: 'myDataCircles',
            type: 'circle',
            source: 'places',
            paint: {
              'circle-radius': 8,
              "circle-color": "#11b4da",
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            }
          });
          map.addLayer({
            id: 'myDataLabels',
            type: 'symbol',
            source: 'places',
            layout: {
              'text-field': 'QC',
              'text-size': 6
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

          map.on('click', 'myDataCircles', async (e) => {
            setFullAddress(e.features[0].properties.full_address)
            setSpacesId(e.features[0].properties.id)
            const coordinates = e.features[0].geometry.coordinates.slice();
            const CardSpaces = ReactDOMServer.renderToString(<CardSpacesInfo features={e.features[0]} />);
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            try {
              const response = await handleLoadSurfacesBySpaces(e.features[0].properties.id);
              setListSurfaces(response)
            } catch (error) {
              console.log(error);
            }


            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(CardSpaces)
              .addTo(map);

            document.querySelector('.report-spaces').addEventListener('click', () => {
              toggle();
            });
          });
          // Change the cursor to a pointer when the mouse is over the places layer.
          map.on('mouseenter', 'myDataCircles', function () {
            map.getCanvas().style.cursor = 'pointer';
          });

          // When the mouse leaves a feature in the 'placesCircles' layer, change the cursor style back to default
          map.on('mouseleave', 'myDataCircles', function () {
            map.getCanvas().style.cursor = '';
          });

        });
        // Clean up on unmount
        return () => map.remove();
      }
    });

    handleLoadFormReports().then((response) => {
      setFormReports(response);
    });

  }, []);

  //FORMIK
  const [fullAddress, setFullAddress] = useState(null);
  const [thumbnail, setThumbnail] = useState('');

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      content: "",
      formReport: 0,
      space: 0,
      imgUrl: null,
    },
    onSubmit: async (values) => {
      try {
        await handleAddReportSpace(values);
      } catch (error) {

      }
    },
  });


  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        formik.setFieldValue('imgUrl', file);
        setThumbnail(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddReportSpace = async (values) => {
    const reportData = {
      name: formik.values.name,
      email: formik.values.email,
      phone: formik.values.phone,
      content: formik.values.content,
      imgUrl: formik.values.imgUrl,
      formReport: parseInt(formik.values.formReport),
      space: parseInt(spacesId),
    };

    const { data } = await axiosService.post('/reports-space', reportData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  return (
    <>
      <div className="row">
        <div className="col-md-9">
          <div className="card p-2 mt-1">
            <div id="map" ref={mapContainerRef} />
          </div>
        </div>
        <div className="col-md-3 col-xs-12" >
          <h4 className=" fw-bold mt-1">Danh sách bảng quảng cáo</h4>
          {listSurfaces && listSurfaces.map((surface, i) => (
            <ListSurfaces key={i} surface={surface} setSurfaceId={setSurfaceId} />
          ))}
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Người dân báo cáo - {fullAddress}</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Card>
                <CardTitle className="text-center my-3 fw-bold" tag="h2">
                  Thêm báo cáo
                </CardTitle>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleEmail" className="fw-bold">
                            Tên người dùng
                          </Label>
                          <Input
                            name="name"
                            placeholder="Nhập địa chỉ"
                            type="text"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleEmail" className="fw-bold">
                            Email
                          </Label>
                          <Input
                            name="email"
                            placeholder="Nhập email"
                            type="text"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleEmail" className="fw-bold">
                            Điện thoại
                          </Label>
                          <Input
                            name="phone"
                            placeholder="Nhập số điện thoại"
                            type="text"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleSelect">Select</Label>
                          <Input
                            type="select"
                            id="formReport"
                            name="formReport"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.formReport}
                            className="form-control">
                            <option value="">Chọn hình thức quảng cáo</option>
                            {renderOptionsFormReport()}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleEmail" className="fw-bold">
                            Ảnh báo cáo
                          </Label>
                          <Input
                            type="file"
                            id="imgUrl"
                            name="imgUrl"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e)}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        {thumbnail &&
                          <Card>
                            <div
                              style={{
                                width: '200px', /* Đặt chiều rộng mong muốn */
                                height: '200px', /* Đặt chiều cao mong muốn */
                                overflow: 'hidden', /* Đảm bảo hình ảnh không bị tràn ra khỏi khu vực chứa */
                              }}
                            >
                              <CardImg
                                alt="Card image cap"
                                src={thumbnail}
                                top
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                          </Card>
                        }
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label for="exampleEmail" className="fw-bold">
                        Nội dung
                      </Label>

                      <CKEditor
                        editor={ClassicEditor}
                        data={formik.values.content}
                        onReady={editor => {

                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          formik.setFieldValue('content', data);
                        }}
                      />

                    </FormGroup>
                    <Button
                      color="success"
                      style={{ marginLeft: "40%" }}
                      type="submit"
                      onClick={toggle}

                    >
                      Báo cáo
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
       <ModalReport  handleReportSurfaces={handleReportSurfaces} isOpen={surfaceId} toggle={toggleModalReportSurface} formReports={formReports}/>
    </>
  );
};

export default Map;
