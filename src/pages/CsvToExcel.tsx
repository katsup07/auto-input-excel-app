import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// Helpers
const isNumber = (x: unknown) => !isNaN(Number(x));

// Mapping CSV headers to Excel column positions (0-indexed)
  const csvToExcelMapping: { [key: string]: number } = {
    "No.": 0, // No column (index 0)
    "Date": 2, // 受注\n月日 (column 3, index 2)
    "ご葬家名または故人名": 4, // 芳名板記載内容 (columns 5-17, using first column)
    "芳名板のお名前": 4, // 芳名板記載内容 (columns 5-17, using first column)  
    "ご依頼者のお名前": 17, // 依頼者名（敬称略） (columns 18-25, using first column)
    "ご依頼者の住所": 28, // 住所 (columns 29-39, using first column)
    "ご依頼者の連絡先": 39, // 電話番号 (columns 40-42, using first column)
    "Phone Number": 39, // 電話番号 (columns 40-42, using first column)
    "金額": 42, // 領収額（税込み） (columns 43-45, using first column)
    "お支払い方法": 52, // お支払い (column 53)
    "備考欄": 53, // 参考 (column 54)
  };

    // Utility function to convert Excel serial number to date
  const excelSerialToDate = (serial: number): string => {
    const epoch = new Date(1899, 11, 30); // Excel epoch date
    const days = Math.floor(serial);
    epoch.setDate(epoch.getDate() + days);
    return epoch.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };


export default function CsvToExcel() {
  // CSV
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  // Excel
  const [excelTemplateWorkbook, setExcelTemplateWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [excelTemplateHeaders, setExcelTemplateHeaders] = useState<string[]>([]);
  const [excelTemplateRows, setExcelTemplateRows] = useState<string[][]>([]);

  // CSV
  const handleCSVFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      const workBook = XLSX.read(bstr as string | ArrayBuffer, { type: 'binary' });
      const wsName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[wsName];
      const rows = XLSX.utils.sheet_to_json<string[]>(workSheet, { header: 1 });
      
      if (rows.length) {
        setCsvHeaders(rows[0].map(header => header.trim()));
        setCsvRows(rows.slice(1) as string[][]);
      }
    };
    reader.readAsBinaryString(file);
  };


  // XLSX
  const handleExcelTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      const workbook = XLSX.read(bstr as string | ArrayBuffer, { type: 'binary', bookVBA: true });
      
      // parse template for display - headers from row 4, data from row 5 onwards
      const firstSheet = workbook.SheetNames[0];
      // header: 1 option gives an array of arrays, not json objects.
      const tplRows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[firstSheet], { header: 1 }); 
      
        const filteredRows = tplRows.filter(row => row.some(cell => typeof cell === "string" && cell?.trim() !== ''));
        // Headers from row 4 (0-indexed row 3), limited to columns 1-54
        setExcelTemplateHeaders((filteredRows[3] || []).slice(0, 54));
        // Data from row 5 onwards (0-indexed row 4+)
        setExcelTemplateRows(filteredRows.slice(4).map(row => row.slice(0, 54)));
      
      setExcelTemplateWorkbook(workbook);
    };
    reader.readAsBinaryString(file);
  };


  // Get only non-empty headers for display and removes empty columns
  const getNonEmptyHeaders = () => {
    if (excelTemplateHeaders.length === 0) return csvHeaders;
    return excelTemplateHeaders.filter(header => header && header.trim() !== '');
  };

  const nonEmptyHeaders = getNonEmptyHeaders();

  // Map CSV data to match Excel column structure for display (only non-empty columns)
  const getMappedDisplayData = () => {
    if (excelTemplateHeaders.length === 0) return csvRows; // No template, show CSV as-is

    return csvRows.map(csvRow => {
      const mappedRow: string[] = [];

      // For each non-empty header, find the corresponding data
      nonEmptyHeaders.forEach((header, displayIndex) => {
        const originalIndex = excelTemplateHeaders.indexOf(header);

        // Find which CSV field maps to this Excel column
        const csvHeaderIndex = csvHeaders.findIndex(csvHeader => {
          const trimmedHeader = csvHeader.trim();
          const excelColumnIndex = csvToExcelMapping[trimmedHeader];
          
          return excelColumnIndex === originalIndex;
        });

        if (csvHeaderIndex !== -1 && csvHeaderIndex < csvRow.length) {
          let cellValue = csvRow[csvHeaderIndex] || '';

          // Convert Excel serial number to date if the header is "Date"
          if (csvHeaders[csvHeaderIndex].trim() === "Date" && isNumber(cellValue))
            cellValue = excelSerialToDate(Number(cellValue));

          mappedRow[displayIndex] = cellValue;
        } else {
          mappedRow[displayIndex] = '';
        }
      });

      return mappedRow;
    });
  };


  const mappedDisplayData = getMappedDisplayData();

  const handleExport = () => {
    if (!excelTemplateWorkbook) {
      // fallback: create new workbook with CSV content
      const workbook = XLSX.utils.book_new();
      const wsData = [csvHeaders, ...csvRows];
      const workSheet = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(workbook, workSheet, 'Sheet1');
      XLSX.writeFile(workbook, 'export.xlsx');
      return;
    }

    excelTemplateWorkbook.SheetNames.forEach((sheetName) => {
      const workSheet = excelTemplateWorkbook.Sheets[sheetName];

      // Determine the last row with data in the template
      const range = XLSX.utils.decode_range(workSheet['!ref'] || '');
      const lastRow = range.e.r;

      // Create mapped rows based on CSV to Excel column mapping
      const mappedRows = csvRows.map(csvRow => {
        const mappedRow = new Array(54).fill(''); // Initialize with empty strings

        // For each CSV header, find the corresponding Excel column position
        csvHeaders.forEach((csvHeader, csvIndex) => {
          const excelColumnIndex = csvToExcelMapping[csvHeader];
          if (excelColumnIndex !== undefined && csvIndex < csvRow.length) {
            let cellValue = csvRow[csvIndex] || '';

            // Convert Excel serial number to date if the header is "Date"
            if (csvHeader.trim() === "Date" && isNumber(cellValue))
              cellValue = excelSerialToDate(Number(cellValue));

            mappedRow[excelColumnIndex] = cellValue;
          }
        });

        return mappedRow;
      });

      // Append mapped rows starting from the next row after the last row
      XLSX.utils.sheet_add_aoa(workSheet, mappedRows, { origin: { r: lastRow + 1, c: 0 } });
    });

    XLSX.writeFile(excelTemplateWorkbook, 'export.xlsx');
  };

    
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: 16 }}>CSVをExcelに追加</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>XLSXアップロード:</label>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleExcelTemplateUpload}
          style={{
            backgroundColor: '#217346',
            color: '#fff',
            padding: '0.5em',
            borderRadius: 4,
            cursor: 'pointer',
            border: 'none'
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>CSV アップロード:</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVFileUpload}
          style={{
            backgroundColor: '#2b6cb0',
            color: '#fff',
            padding: '0.5em',
            borderRadius: 4,
            cursor: 'pointer',
            border: 'none'
          }}
        />
      </div>

      {(excelTemplateHeaders.length > 0 || csvRows.length > 0) && (
        <>
          <button onClick={handleExport}  className="secondary" style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.95em',
            padding: '0.35em 0.8em',
            height: 32,
            borderRadius: 6
          }}>
            <FaDownload style={{ fontSize: '1em' }} />エクセルに出力
          </button>
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {nonEmptyHeaders.map((h, idx) => (
                    <th key={idx} style={{ border: '1px solid #ccc', padding: '8px', background: '#f3f6fa' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelTemplateRows.map((row, i) => (
                  <tr key={`tpl-${i}`} style={{ backgroundColor: '#e6f4ea' }}>
                    {nonEmptyHeaders.map((header, j) => {
                      const originalIndex = excelTemplateHeaders.indexOf(header);
                      return (
                        <td key={j} style={{ border: '1px solid #ccc', padding: '8px' }}>
                          {row[originalIndex] || ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {mappedDisplayData.map((row, i) => (
                  <tr key={`csv-${i}`} style={{ backgroundColor: '#e7f1fa' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ border: '1px solid #ccc', padding: '8px' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
