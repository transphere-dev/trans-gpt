import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { getTableData } from '../lib/misc';

const ExportButton = ({  fileName }) => {
  const [loading,setLoading] = useState(false)
  const exportToExcel = () => {
   try {
    setLoading(true)
    const data = getTableData();
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    setLoading(true)
    setLoading(false)
    
   } catch (error) {
    setLoading(false)
   }
  };

  return (
    <Button isLoading={loading} loadingText={'Exporting...'} mt={'5%'} w={'100%'} onClick={exportToExcel}>
      Export to Excel
    </Button>
  );
};

export default ExportButton;
