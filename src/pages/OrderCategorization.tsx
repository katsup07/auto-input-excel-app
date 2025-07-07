
import { useState, useRef } from 'react';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 仮データ: 注文一覧（OrderIntakeの初期データを利用）
const rawOrders = [
  // Sheet 1
  {
    family: '佐藤', date: '2025-07-10', customer: '山田 太郎', phone: '090-1234-5678', address: '〒100-0001 東京都千代田区千代田1-1', amount: '¥150,000', board: '山田', email: 'taro@example.com', payment: '振り込み', note: 'なし',
  },
  {
    family: '大橋', date: '2025-07-11', customer: '山田 太郎', phone: '090-1234-5678', address: '〒100-0001 東京都千代田区千代田1-1', amount: '¥150,000', board: '山田', email: 'kenji@example.com', payment: '振り込み', note: 'なし',
  },
  {
    family: '鈴木', date: '2025-07-12', customer: '鈴木 花子', phone: '080-9876-5432', address: '〒150-0002 東京都渋谷区渋谷2-2-2', amount: '¥200,000', board: '鈴木', email: '', payment: '現地払い', note: '白い花希望',
  },
  // Sheet 2
  {
    family: '松本', date: '2025-08-01', customer: '松本 一郎', phone: '090-2222-3333', address: '〒220-0001 神奈川県横浜市西区みなとみらい1-1', amount: '¥300,000', board: '松本', email: 'ichiro.matsumoto@example.com', payment: 'クレジットカード', note: '特になし',
  },
  {
    family: '小林家', date: '2025-08-03', customer: '小林 花子', phone: '080-3333-4444', address: '〒330-0002 埼玉県さいたま市大宮区桜木町2-2-2', amount: '¥250,000', board: '小林', email: '', payment: '現地払い', note: '供花希望',
  },
];

// 葬家名＋日付でグループ化
const groupByFuneral = (orders: typeof rawOrders) => {
  const map = new Map<string, typeof rawOrders>();
  for (const order of orders) {
    const key = `${order.family}（${order.date}）`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(order);
  }
  return map;
};

const funeralMap = groupByFuneral(rawOrders);
const funeralTabs = Array.from(funeralMap.keys());


export default function OrderCategorization() {
  const [active, setActive] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  // PDFエクスポート
  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    const input = tableRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`${funeralTabs[active] || '注文の分類・集計'}.pdf`);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0, color: 'black', fontSize: '1.3rem' }}>注文の分類・集計</h1>
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
        {funeralTabs.map((key, idx) => (
          <button
            key={key}
            className={"tab" + (active === idx ? " active" : "")}
            onClick={() => setActive(idx)}
            style={{ minWidth: 120, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="tab-content" ref={tableRef}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>ご依頼者のお名前</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>連絡先</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>住所</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>金額</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>芳名板</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>メール</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>支払い方法</th>
              <th style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>備考</th>
            </tr>
          </thead>
          <tbody>
            {funeralMap.get(funeralTabs[active])!.map((order, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.customer}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.phone}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.address}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.amount}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.board}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.email}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.payment}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '0.5rem' }}>{order.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
