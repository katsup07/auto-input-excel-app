import { useState } from 'react';

const funerals = ['F001', 'F002'] as const;
type FuneralId = typeof funerals[number];
const orders: Record<FuneralId, { id: string; name: string; date: string }[]> = {
  F001: [
    { id: '123', name: '佐藤家', date: '2025-07-10' },
    { id: '124', name: '鈴木家', date: '2025-07-12' },
  ],
  F002: [
    { id: '125', name: '高橋家', date: '2025-07-15' },
    { id: '126', name: '田中家', date: '2025-07-20' },
  ],
};

export default function OrderCategorization() {
  const [active, setActive] = useState<FuneralId>('F001');
  return (
    <>
      <h1>葬儀ごとの申込一覧</h1>
      <div className="tabs">
        {funerals.map((id) => (
          <button
            key={id}
            className={"tab" + (active === id ? " active" : "")}
            onClick={() => setActive(id)}
          >
            {id}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {orders[active].map((order) => (
            <li key={order.id} style={{ padding: '0.7rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ fontWeight: 500 }}>{order.name}</span>（{order.date}）
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
