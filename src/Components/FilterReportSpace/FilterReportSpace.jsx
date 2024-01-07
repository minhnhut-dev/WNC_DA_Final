import React from 'react';
import {Input} from "reactstrap";

const FilterReportSpace = ({setOptionFilterSpace}) => {
  return (
    <>
      <Input type="select" className="form-control position-absolute" style={{width: "40vh", right: '10px'}} onChange={(e) => setOptionFilterSpace(e.target.value)}>
        <option value="">Chọn</option>
        <option value={"all"}>Tất cả</option>
        <option value={"report-filter"}>Báo cáo vi phạm</option>
      </Input>
    </>
  );
};

export default FilterReportSpace;