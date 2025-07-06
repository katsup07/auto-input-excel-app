const ExcelSync = () => (
  <>
    <h1>Excel同期状況</h1>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
      <button className="primary">最新版をダウンロード</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>シート名</th>
          <th>最終更新日時</th>
          <th>更新状況</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Orders.xlsx</td>
          <td>2025/07/04 09:00</td>
          <td style={{ color: '#2b6cb0', fontWeight: 500 }}>成功</td>
        </tr>
        <tr>
          <td>Inventory.xlsx</td>
          <td>2025/07/03 15:30</td>
          <td style={{ color: '#e53e3e', fontWeight: 500 }}>失敗</td>
        </tr>
      </tbody>
    </table>
  </>
);

export default ExcelSync;
