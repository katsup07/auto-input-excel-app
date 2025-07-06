import { useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import type { CellBase, Matrix } from 'react-spreadsheet';

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

const initialData: Matrix<CellBase<string>> = [
  [
    { value: '佐藤家' },
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
    { value: '鈴木家' },
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
  [
    { value: '高橋家' },
    { value: '2025-07-15' },
    { value: '高橋 一郎' },
    { value: '03-1234-5678' },
    { value: '〒160-0003 東京都新宿区西新宿3-3-3' },
    { value: '¥180,000' },
    { value: '高橋' },
    { value: 'ichiro@example.jp' },
    { value: '振り込み' },
    { value: '控室利用' },
  ],
  [
    { value: '田中家' },
    { value: '2025-07-20' },
    { value: '田中 花子' },
    { value: '070-1122-3344' },
    { value: '〒530-0001 大阪府大阪市北区梅田1-1-1' },
    { value: '¥220,000' },
    { value: '田中' },
    { value: '' },
    { value: '現地払い' },
    { value: 'ペット同伴' },
  ],
];

const OrderIntake = () => {
  const [data, setData] = useState<Matrix<CellBase<string>>>(initialData);
  const handleAddRow = () => {
    setData(prev => [
      ...prev,
      columns.map(() => ({ value: '' }))
    ]);
  };
  const handleRemoveRow = () => {
    setData(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
  };
  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10,
          padding: '1rem 0 1rem 0',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          borderBottom: '1px solid #eee',
        }}
      >
        <h1 style={{ margin: 0, color: "black", fontSize: '1.3rem', flex: 1 }}>新規申込フォーム一覧</h1>
        <button className="primary" onClick={handleAddRow}>
          新しい行を追加
        </button>
        <button className="primary" onClick={handleRemoveRow} disabled={data.length === 0}>
          最後の行を削除
        </button>
      </div>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <style>{`
          /* Adjust column widths for react-spreadsheet */
          .Spreadsheet__table th:nth-child(1),
          .Spreadsheet__table th:nth-child(3),
          .Spreadsheet__table th:nth-child(7) {
            min-width: 90px;
            max-width: 120px;
            width: 100px;
          }
          .Spreadsheet__table th:nth-child(5),
          .Spreadsheet__table td:nth-child(5) {
            min-width: 220px;
            max-width: 320px;
            width: 260px;
          }
          .Spreadsheet__table th,
          .Spreadsheet__table td {
            white-space: pre-wrap !important;
            word-break: break-all;
          }
        `}</style>
        <Spreadsheet
          data={data}
          onChange={setData}
          columnLabels={columns}
        />
      </div>
    </>
  );
};

export default OrderIntake;
