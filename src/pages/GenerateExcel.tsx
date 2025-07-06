export default function GenerateExcel() {
  return (
    <>
      <h1>Generate New Excel File</h1>
      <form className="form">
        <label>
          Customer Name:
          <input type="text" placeholder="Name" />
        </label>
        <label>
          Funeral Date:
          <input type="date" />
        </label>
        <label>
          Items:
          <textarea placeholder="List items here" />
        </label>
        <button type="submit">Create File</button>
      </form>
    </>
  );
}
