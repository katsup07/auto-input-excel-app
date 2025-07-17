import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function CsvToExcel() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  // Excel template workbook state
  const [templateWb, setTemplateWb] = useState<XLSX.WorkBook | null>(null);
  // parsed template content for preview
  const [templateHeaders, setTemplateHeaders] = useState<string[]>([]);
  const [templateDataRows, setTemplateDataRows] = useState<string[][]>([]);

  // Mapping CSV headers to Excel column positions (0-indexed)
  const csvToExcelMapping: { [key: string]: number } = {
    "Date": 3, // 受注月日 (column 4)
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      const wb = XLSX.read(bstr as string | ArrayBuffer, { type: 'binary' });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
      if (rows.length) {
        setHeaders(rows[0] as string[]);
        setData(rows.slice(1) as string[][]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // handle XLSX template upload
  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      const wb = XLSX.read(bstr as string | ArrayBuffer, { type: 'binary' });
      
      // parse template for display - headers from row 4, data from row 5 onwards
      const firstSheet = wb.SheetNames[0];
      const tplRows = XLSX.utils.sheet_to_json<string[]>(wb.Sheets[firstSheet], { header: 1 });
      if (tplRows.length > 3) {
        // Headers from row 4 (0-indexed row 3), limited to columns 1-54
        setTemplateHeaders((tplRows[3] || []).slice(0, 54));
        // Data from row 5 onwards (0-indexed row 4+)
        setTemplateDataRows(tplRows.slice(4).map(row => row.slice(0, 54)));
      }
      setTemplateWb(wb);
    };
    reader.readAsBinaryString(file);
  };

  // combine template and CSV headers for preview
  const displayHeaders = templateHeaders.length > 0 ? templateHeaders : headers;

  const handleExport = () => {
    if (templateWb) {
      templateWb.SheetNames.forEach((sheetName) => {
        const ws = templateWb.Sheets[sheetName];
        
        // Create mapped rows based on CSV to Excel column mapping
        const mappedRows = data.map(csvRow => {
          const mappedRow = new Array(54).fill(''); // Initialize with empty strings
          
          // For each CSV header, find the corresponding Excel column position
          headers.forEach((csvHeader, csvIndex) => {
            const excelColumnIndex = csvToExcelMapping[csvHeader];
            if (excelColumnIndex !== undefined && csvIndex < csvRow.length) {
              mappedRow[excelColumnIndex] = csvRow[csvIndex] || '';
            }
          });
          
          return mappedRow;
        });
        
        // Append mapped rows starting from row 5 (0-indexed row 4)
        XLSX.utils.sheet_add_aoa(ws, mappedRows, { origin: { r: 4, c: 0 } });
      });
      XLSX.writeFile(templateWb, 'export.xlsx');
    } else {
      // fallback: create new workbook with CSV content
      const wb = XLSX.utils.book_new();
      const wsData = [headers, ...data];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'export.xlsx');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: 16 }}>CSVをExcelに追加</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>XLSXアップロード:</label>
        <input
          type="file"
          accept=".xlsx"
          onChange={handleTemplateUpload}
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
          onChange={handleFileUpload}
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

      {(templateHeaders.length > 0 || data.length > 0) && (
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
                  {displayHeaders.map((h, idx) => (
                    <th key={idx} style={{ border: '1px solid #ccc', padding: '8px', background: '#f3f6fa' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {templateDataRows.map((row, i) => (
                  <tr key={`tpl-${i}`} style={{ backgroundColor: '#e6f4ea' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ border: '1px solid #ccc', padding: '8px' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
                {data.map((row, i) => (
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
