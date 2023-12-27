import React from 'react';
import './ListSurfaces.scss';
import { Container, Card, CardBody, CardTitle, CardFooter, CardText, Button } from 'reactstrap';
import { fixUrl, API_URL } from '../../constants/index'
const ListSurfaces = ({ surface }) => {

  return (
    <>
      <Container className='mb-3'>
        <div className="list-surfaces">
          <Card body   className="my-2">
        
            <img
              style={{ padding: '20px' }}
              alt="Card cap"
              src={API_URL + fixUrl(surface?.imgUrl)}
              width="100%"
            />
             <CardText  tag="p" className='text-bold text-left'>
             {surface?.surfaceType?.name}
            </CardText>
             <CardTitle tag="span" className='text-left'> 
              {surface?.space.address}
            </CardTitle>
            <CardText  tag="p"  className='text-left'>
              Kích thước: {surface?.width} x {surface?.height} m
            </CardText>
            <CardText  tag="p"  className='text-left'>
              Hình thức: {surface?.space?.formAdvertising?.name}
            </CardText>
            {/* <CardText  tag="p">
              Phân loại: {surface?.space?.formAdvertising?.name}
            </CardText> */}
            <Button color='danger'>
              Báo cáo vi phạm
            </Button>
            <CardFooter className='text-left'></CardFooter>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default ListSurfaces;