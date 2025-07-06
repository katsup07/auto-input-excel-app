
import { useState, useRef } from 'react';
import { FaPlus, FaMinus, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Spreadsheet from 'react-spreadsheet';


// Remove NUM_PAGES, use dynamic length
const columns = [
  'ご葬家名または故人名',
  'ご葬儀の日程',
  'ご依頼者のお名前',
  'ご依頼者の連絡先',
  'ご依頼者の住所',
  '金額',
  '芳名板のお名前',
  'メールアドレス',
  'お支払い方法',
  '備考欄',
];
const initialDataList = [
  [
    // Sheet 1 data
    [
      { value: '佐藤' },
      { value: '2025-07-10' },
      { value: '山田 太郎' },
      { value: '090-1234-5678' },
      { value: '〒100-0001 東京都千代田区千代田1-1' },
      { value: '¥150,000' },
      { value: '山田' },
      { value: 'taro@example.com' },
      { value: '振り込み' },
      { value: 'なし' },
    ],
    [
      { value: '大橋' },
      { value: '2025-07-14' },
      { value: '山田 太郎' },
      { value: '090-1234-5678' },
      { value: '〒100-0001 東京都千代田区千代田1-1' },
      { value: '¥150,000' },
      { value: '山田' },
      { value: 'kenji@example.com' },
      { value: '振り込み' },
      { value: 'なし' },
    ],
    [
      { value: '鈴木' },
      { value: '2025-07-12' },
      { value: '鈴木 花子' },
      { value: '080-9876-5432' },
      { value: '〒150-0002 東京都渋谷区渋谷2-2-2' },
      { value: '¥200,000' },
      { value: '鈴木' },
      { value: '' },
      { value: '現地払い' },
      { value: '白い花希望' },
    ],
  ],
  [
    // Sheet 2 data
    [
      { value: '松本' },
      { value: '2025-08-01' },
      { value: '松本 一郎' },
      { value: '090-2222-3333' },
      { value: '〒220-0001 神奈川県横浜市西区みなとみらい1-1' },
      { value: '¥300,000' },
      { value: '松本' },
      { value: 'ichiro.matsumoto@example.com' },
      { value: 'クレジットカード' },
      { value: '特になし' },
    ],
    [
      { value: '小林家' },
      { value: '2025-08-03' },
      { value: '小林 花子' },
      { value: '080-3333-4444' },
      { value: '〒330-0002 埼玉県さいたま市大宮区桜木町2-2-2' },
      { value: '¥250,000' },
      { value: '小林' },
      { value: '' },
      { value: '現地払い' },
      { value: '供花希望' },
    ],
  ],
];





// Unicode for circled numbers: ① (U+2460), ② (U+2461), ...
const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
const defaultSheetName = idx => `シート ${(circledNumbers[idx] || idx + 1)}`;

const OrderIntake = () => {
  const [activePage, setActivePage] = useState(0);
  const [pagesData, setPagesData] = useState(initialDataList);
  const [sheetNames, setSheetNames] = useState(initialDataList.map((_, idx) => defaultSheetName(idx)));
  const [editingSheetIdx, setEditingSheetIdx] = useState(-1);
  const [editingSheetValue, setEditingSheetValue] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  // PDFエクスポート
  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    const input = tableRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`${sheetNames[activePage] || '注文一覧'}.pdf`);
  };

  const handleAddRow = () => {
    setPagesData(prev => prev.map((data, idx) =>
      idx === activePage
        ? [...data, columns.map(() => ({ value: '' }))]
        : data
    ));
  };
  const handleRemoveRow = () => {
    setPagesData(prev => prev.map((data, idx) =>
      idx === activePage && data.length > 0
        ? data.slice(0, -1)
        : data
    ));
  };

  // Unicode for circled numbers: ① (U+2460), ② (U+2461), ...
  const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];


  const handleAddSheet = () => {
    setPagesData(prev => [...prev, [columns.map(() => ({ value: '' }))]]);
    setSheetNames(prev => [...prev, defaultSheetName(prev.length)]);
    setActivePage(pagesData.length); // focus new sheet
  };

  const handleRenameSheet = idx => {
    setEditingSheetIdx(idx);
    setEditingSheetValue(sheetNames[idx]);
  };

  const handleRenameSheetSubmit = (idx) => {
    if (editingSheetValue.trim() === '') {
      setEditingSheetIdx(-1);
      setEditingSheetValue('');
      return;
    }
    setSheetNames(prev => prev.map((name, i) => i === idx ? editingSheetValue.trim() : name));
    setEditingSheetIdx(-1);
    setEditingSheetValue('');
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: "black", fontSize: '1.3rem' }}>注文一覧</h1>
        <button
          className="secondary"
          onClick={handleExportPDF}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.95em',
            padding: '0.35em 0.8em',
            height: 32,
            borderRadius: 6
          }}
          title="PDF出力"
        >
          <FaDownload style={{ fontSize: '1em' }} /> PDF出力
        </button>
      </div>
      <div className="tabs" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
        {pagesData.map((_, idx) => (
          <div key={idx} style={{ position: 'relative', display: 'inline-block', marginRight: 14 }}>
            {editingSheetIdx === idx ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleRenameSheetSubmit(idx);
                }}
                style={{ display: 'inline-block' }}
              >
                <input
                  type="text"
                  value={editingSheetValue}
                  autoFocus
                  onChange={e => setEditingSheetValue(e.target.value)}
                  onBlur={() => handleRenameSheetSubmit(idx)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') {
                      setEditingSheetIdx(-1);
                      setEditingSheetValue('');
                    }
                  }}
                  style={{
                    fontSize: '1.1rem',
                    padding: '0.3rem 0.7rem',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    minWidth: 60,
                    maxWidth: 120,
                  }}
                  title="Enterで確定、Escでキャンセル"
                />
              </form>
            ) : (
              <button
                className={"tab" + (activePage === idx ? " active" : "")}
                style={{ fontSize: '1.1rem', paddingRight: pagesData.length > 1 ? 36 : undefined, display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}
                onClick={() => setActivePage(idx)}
                onDoubleClick={() => handleRenameSheet(idx)}
                title="ダブルクリックで名前を変更"
              >
                {/* Edit icon in top left corner, circular, above tab */}
                <span
                  onClick={e => {
                    e.stopPropagation();
                    handleRenameSheet(idx);
                  }}
                  style={{
                    position: 'absolute',
                    left: -10,
                    top: -14,
                    width: 20,
                    height: 20,
                    border: 'none',
                    background: '#fff',
                    color: '#3182ce',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                    zIndex: 2,
                    borderRadius: '50%',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="名前を変更"
                  tabIndex={-1}
                >
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                    <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-1.1 1.1-1.7-1.7 1.1-1.1zm-2.12 2.12l1.7 1.7-8.13 8.13c-.13.13-.23.3-.27.48l-.38 1.7c-.07.3.2.57.5.5l1.7-.38c.18-.04.35-.14.48-.27l8.13-8.13-1.7-1.7-8.13 8.13c-.13.13-.23.3-.27.48l-.38 1.7c-.07.3.2.57.5.5l1.7-.38c.18-.04.35-.14.48-.27l8.13-8.13z" fill="#3182ce"/>
                  </svg>
                </span>
                {sheetNames[idx]}
              </button>
            )}
            {pagesData.length > 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (window.confirm('このシートを削除してもよろしいですか？')) {
                    setPagesData(prev => {
                      const newData = prev.filter((_, i) => i !== idx);
                      // If the removed tab was before or at the current, adjust activePage
                      if (activePage > idx) setActivePage(a => a - 1);
                      else if (activePage === idx) setActivePage(a => Math.max(0, a - 1));
                      return newData;
                    });
                    setSheetNames(prev => prev.filter((_, i) => i !== idx));
                    // If renaming, cancel rename if the sheet is deleted
                    if (editingSheetIdx === idx) {
                      setEditingSheetIdx(-1);
                      setEditingSheetValue('');
                    }
                  }
                }}
                style={{
                  position: 'absolute',
                  right: -10,
                  top: -14,
                  width: 20,
                  height: 20,
                  border: 'none',
                  background: '#fff',
                  color: '#e53e3e',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  zIndex: 2,
                  borderRadius: '50%',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label={`Remove sheet ${idx + 1}`}
                tabIndex={-1}
                title="シートを削除"
              >×</button>
            )}
          </div>
        ))}
        <button
          className="tab"
          style={{ fontSize: '1.1rem', padding: '0.5rem 1rem', border: '1px solid #ccc', background: '#f1f1f1', cursor: 'pointer' }}
          onClick={handleAddSheet}
          aria-label="Add new sheet"
          title="新しいシートを追加"
        >
          ＋
        </button>
      </div>
      <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 8, paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button className="primary" onClick={handleAddRow} title="新しい行を追加" style={{ fontSize: '0.95em', padding: '0.35em 0.8em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaPlus style={{ fontSize: '1em' }} /> 行追加
          </button>
          <button className="primary" onClick={handleRemoveRow} disabled={pagesData[activePage].length === 0} title="最後の行を削除" style={{ fontSize: '0.95em', padding: '0.35em 0.8em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaMinus style={{ fontSize: '1em' }} /> 行削除
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto', maxWidth: '100%', marginTop: 16 }} ref={tableRef}>
        <style>{`
          .Spreadsheet__table th {
            background: #f7fafc !important;
            border: 1px solid #e5e7eb !important;
            padding: 0.5rem !important;
            color: inherit;
            font-weight: normal;
          }
          .Spreadsheet__table td {
            white-space: pre-wrap !important;
            word-break: break-all;
            border: 1px solid #e5e7eb !important;
            padding: 0.5rem !important;
          }
        `}</style>
        <Spreadsheet
          data={pagesData[activePage]}
          onChange={newData => setPagesData(prev => prev.map((d, idx) => idx === activePage ? newData : d))}
          columnLabels={columns}
        />
      </div>
    </>
  );
};

export default OrderIntake;
