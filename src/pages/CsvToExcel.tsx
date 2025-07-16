import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function CsvToExcel() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  // Excel template workbook state
  const [templateWb, setTemplateWb] = useState<XLSX.WorkBook | null>(null);

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
      setTemplateWb(wb);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (templateWb) {
      // append CSV data rows (skip header) into each sheet of the template
      templateWb.SheetNames.forEach((sheetName) => {
        const ws = templateWb.Sheets[sheetName];
        XLSX.utils.sheet_add_aoa(ws, data, { origin: -1 });
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
        <label>XLSXアップロード:</label>
       <div><input type="file" accept=".xlsx" onChange={handleTemplateUpload} /></div> 
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>CSVアップロード:</label>
        <div><input type="file" accept=".csv" onChange={handleFileUpload} /></div>
      </div>

      {data.length > 0 && (
        <>
          <button
            onClick={handleExport}
            style={{
              marginTop: 16,
              padding: '0.5em 1em',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            出力 (XLSX)
          </button>
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {headers.map((h, idx) => (
                    <th
                      key={idx}
                      style={{ border: '1px solid #ccc', padding: '8px', background: '#f0f0f0' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ border: '1px solid #ccc', padding: '8px' }}>
                        {cell}
                      </td>
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
