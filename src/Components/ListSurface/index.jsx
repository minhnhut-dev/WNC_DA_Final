import React from 'react';
import { Button, Card, CardText, CardTitle, Container } from 'reactstrap';
import { API_URL, fixUrl } from '../../constants/index';
import './ListSurfaces.scss';
const ListSurfaces = ({ surface, setSurfaceId}) => {

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
            <Button color='danger' onClick={() => setSurfaceId(surface?.id)}>
              Báo cáo vi phạm
            </Button>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default ListSurfaces;