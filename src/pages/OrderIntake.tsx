
import { useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import type { CellBase, Matrix } from 'react-spreadsheet';


const NUM_PAGES = 2;
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




const OrderIntake = () => {
  const [activePage, setActivePage] = useState(0);
  const [pagesData, setPagesData] = useState(initialDataList);

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

  return (
    <>
      <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10, padding: '1rem 0 1rem 0', borderBottom: '1px solid #eee' }}>
        <h1 style={{ margin: 0, color: "black", fontSize: '1.3rem' }}>注文一覧</h1>
        <div className="tabs" style={{ marginTop: '1rem' }}>
          {Array(NUM_PAGES).fill(null).map((_, idx) => (
            <button
              key={idx}
              className={"tab" + (activePage === idx ? " active" : "")}
              style={{ marginRight: 8, fontSize: '1.1rem' }}
              onClick={() => setActivePage(idx)}
            >
              シート {circledNumbers[idx] || idx + 1}
            </button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 8, paddingTop: 8, display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="primary" onClick={handleAddRow}>
            新しい行を追加
          </button>
          <button className="primary" onClick={handleRemoveRow} disabled={pagesData[activePage].length === 0}>
            最後の行を削除
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <style>{`
          .Spreadsheet__table th,
          .Spreadsheet__table td {
            white-space: pre-wrap !important;
            word-break: break-all;
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
