import { Button, Modal, Slider } from 'antd';

import React, { useEffect, useState } from 'react';

const RedeemModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}> = ({ isModalOpen, setIsModalOpen }) => {
  const [day, setDay] = useState(3);

  return (
    <Modal
      title={'Redeem'}
      open={isModalOpen}
      onOk={() => {
        setIsModalOpen(false);
      }}
      onCancel={() => {
        setIsModalOpen(false);
        setDay(3);
      }}
      transitionName=""
      footer={null}
      maskClosable={false}
    >
      <div>
        <Slider value={day} onChange={setDay} min={3} max={14} step={1} />
        <span>{day} day(s)</span>
      </div>
      <div className="flex-center">
        <Button>OK</Button>
      </div>
    </Modal>
  );
};

export default RedeemModal;
