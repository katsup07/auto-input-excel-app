const funerals = ['F001', 'F002'];

export default function OrderCategorization() {
  return (
    <>
      <h1>Orders by Funeral</h1>
      <div className="tabs">
        {funerals.map((id) => (
          <button key={id}>{id}</button>
        ))}
      </div>
      <div className="tab-content">
        <ul>
          <li>Order X for selected funeral</li>
          <li>Order Y for selected funeral</li>
        </ul>
      </div>
    </>
  );
}
