import React from 'react';

const CardSpacesInfo = ({ features }) => {
  const { formAdvertising, locationTypes, zone, full_address } = features.properties;
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="info-box">
              <div className="title-report">
                <span className="badge badge-success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                  </svg>
                </span>
                <strong>Điểm đặt quảng cáo</strong>
              </div>
              <p>{formAdvertising}</p>
              <p>{locationTypes}</p>
              <p>{full_address}</p>
              <p>{zone}</p>
              <div type="button" className="btn btn-outline-danger btn-sm float-right report-spaces">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-exclamation-octagon-fill" viewBox="0 0 16 16">
                  <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                BÁO CÁO VI PHẠM
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default CardSpacesInfo;