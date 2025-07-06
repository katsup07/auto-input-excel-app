export default function GenerateExcel() {
  return (
    <>
      <h1>新規Excelファイル作成</h1>
      <form className="form">
        <label>
          ご依頼者のお名前
          <input type="text" placeholder="お名前" />
        </label>
        <label>
          ご葬儀の日程
          <input type="date" />
        </label>
        <label>
          項目
          <textarea placeholder="項目を入力してください" />
        </label>
        <button className="primary" type="submit">ファイル作成</button>
      </form>
    </>
  );
}
