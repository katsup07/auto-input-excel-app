const OrderIntake = () => (
  <>
    <h1>新規申込フォーム一覧</h1>
    <table>
      <thead>
        <tr>
          <th>ご葬家名または故人名</th>
          <th>ご葬儀の日程</th>
          <th>ご依頼者のお名前</th>
          <th>ご依頼者の連絡先</th>
          <th>ご依頼者の住所</th>
          <th>金額</th>
          <th>芳名板のお名前</th>
          <th>メールアドレス</th>
          <th>お支払い方法</th>
          <th>備考欄</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>佐藤家</td>
          <td>2025-07-10</td>
          <td>山田 太郎</td>
          <td>090-1234-5678</td>
          <td>〒100-0001 東京都千代田区千代田1-1</td>
          <td>¥150,000</td>
          <td>山田</td>
          <td>taro@example.com</td>
          <td>振り込み</td>
          <td>なし</td>
        </tr>
        <tr>
          <td>鈴木家</td>
          <td>2025-07-12</td>
          <td>鈴木 花子</td>
          <td>080-9876-5432</td>
          <td>〒150-0002 東京都渋谷区渋谷2-2-2</td>
          <td>¥200,000</td>
          <td>鈴木</td>
          <td></td>
          <td>現地払い</td>
          <td>白い花希望</td>
        </tr>
        <tr>
          <td>高橋家</td>
          <td>2025-07-15</td>
          <td>高橋 一郎</td>
          <td>03-1234-5678</td>
          <td>〒160-0003 東京都新宿区西新宿3-3-3</td>
          <td>¥180,000</td>
          <td>高橋</td>
          <td>ichiro@example.jp</td>
          <td>振り込み</td>
          <td>控室利用</td>
        </tr>
        <tr>
          <td>田中家</td>
          <td>2025-07-20</td>
          <td>田中 花子</td>
          <td>070-1122-3344</td>
          <td>〒530-0001 大阪府大阪市北区梅田1-1-1</td>
          <td>¥220,000</td>
          <td>田中</td>
          <td></td>
          <td>現地払い</td>
          <td>ペット同伴</td>
        </tr>
      </tbody>
    </table>
  </>
);

export default OrderIntake;
