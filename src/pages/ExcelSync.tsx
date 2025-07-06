const ExcelSync = () => (
  <>
    <h1>Excel Sync Overview</h1>
    <button className="primary">Download Latest</button>
    <table>
      <thead>
        <tr>
          <th>Sheet Name</th>
          <th>Last Updated</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Orders.xlsx</td>
          <td>07/04/2025 09:00</td>
          <td>Success</td>
        </tr>
        <tr>
          <td>Inventory.xlsx</td>
          <td>07/03/2025 15:30</td>
          <td>Failure</td>
        </tr>
      </tbody>
    </table>
  </>
);

export default ExcelSync;
