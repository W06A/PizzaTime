import React from 'react';

import { useOrderContext } from './OrderContext';



const OrderCounter = () => {
  const { orderCount } = useOrderContext();
  


 

  return (
    <span >
      ({orderCount})
    </span>
  );
};
export default OrderCounter;
