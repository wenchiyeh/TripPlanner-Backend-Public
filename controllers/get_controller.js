// /**
//  * Created by ying.wu on 2017/6/27.
//  */
// function payAction(req, res) {
//   let uid = req.query.uid;
//   let base_param = {
//     MerchantTradeNo: uid, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
//     MerchantTradeDate: onTimeValue(), //ex: 2017/02/13 15:45:30
//     TotalAmount: "100",
//     TradeDesc: "企鵝玩偶 一隻",
//     ItemName: "企鵝玩偶 300元 X 1",
//     ReturnURL: "http://localhost:3000/productList", // 付款結果通知URL
//     OrderResultURL: "http://localhost:3000/productList", // 在使用者在付款結束後，將使用者的瀏覽器畫面導向該URL所指定的URL
//     EncryptType: 1,
//     // ItemURL: 'http://item.test.tw',
//     Remark: "該服務繳費成立時，恕不接受退款。",
//     // HoldTradeAMT: '1',
//     // StoreID: '',
//     // UseRedeem: ''
//   };

//   let create = new opay();
//   let parameters = {};
//   let invoice = {};
//   try {
//     let htm = create.payment_client.aio_check_out_credit_onetime(parameters = base_param);
//     res.render('payment_action', {
//       result: htm
//     })
//   } catch (err) {
//     // console.log(err);
//     let error = {
//       status: '500',
//       stack: ""
//     }
//     res.render('error', {
//       message: err,
//       error: error
//     })
//   }
// }
      
// const onTimeValue = function () {
//   var date = new Date();
//   var mm = date.getMonth() + 1;
//   var dd = date.getDate();
//   var hh = date.getHours();
//   var mi = date.getMinutes();
//   var ss = date.getSeconds();

//   return [date.getFullYear(), "/" +
//     (mm > 9 ? '' : '0') + mm, "/" +
//     (dd > 9 ? '' : '0') + dd, " " +
//     (hh > 9 ? '' : '0') + hh, ":" +
//     (mi > 9 ? '' : '0') + mi, ":" +
//     (ss > 9 ? '' : '0') + ss
//   ].join('');
// };
// module.exports = class GetPayment {
//   payUid(req, res) {
//     let uid = randomValue(10, 99) + "1234567890234567" + randomValue(10, 99);
//     res.render('payment', { uid: uid });
//   }
// }
// const randomValue = function (min, max) {
//   return Math.round(Math.random() * (max - min) + min);
// }