import React, {useState} from 'react';
import { Formik, useFormik } from 'formik';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { axiosService } from '../../Services/axiosServices';
import ReCAPTCHA from "react-google-recaptcha";

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
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";

const ModalReport = ({handleReportSurfaces, isOpen, toggle, formReports}) => {
  const [thumbnail, setThumbnail] = useState('');

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      content: "",
      formReport: 0,
      surface: 0,
      imgUrl: null,
    },
    onSubmit: async (values) => {
      const params = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        imgUrl: values.imgUrl,
        content: values.content,
        formReport: values.formReport,
        surface: isOpen,
      }

      try {
        handleReportSurfaces(params).then(() => {
          Swal.fire({
            title: "Báo cáo",
            text: "Báo cáo thành công",
            icon: "success"
          })
        })
        toggle();
      } catch (error) {
        Swal.fire({
          text: "Báo cáo thất bại",
          icon: "error",

        })
        console.log(error);
      }
    },
  });

  const renderOptionsFormReport = () => {
    return (
        formReports && formReports.map((formReport, i) => (
            <option value={formReport.id} key={i}>{formReport.name}</option>
        ))
    )
  }

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

  return (
    <>
      <Modal isOpen={isOpen} size="xl">
        <ModalHeader toggle={toggle}>Người dân báo cáo quảng cáo - {isOpen}</ModalHeader>
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
                    <ReCAPTCHA
                      sitekey="6LdBr0QpAAAAAA5i6j_iOudXzia71koXnCO19ifO"
                    />

                    <Button
                      color="success"
                      style={{ marginLeft: "40%" }}
                      type="submit"
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
    </>
  );
};

export default ModalReport;