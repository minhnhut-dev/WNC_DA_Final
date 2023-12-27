import React from 'react';
import { Formik, useFormik } from 'formik';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { axiosService } from '../../Services/axiosServices';
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

const ModalReport = ({callback, isOpen, toggle}) => {
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
        callback(values);
      } catch (error) {

      }
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Người dân báo cáo quảng cáo</ModalHeader>
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
    </>
  );
};

export default ModalReport;