var express  =  require(`express`);
var router  =  express.Router();

// 金流
const ecpay_payment = require("ecpay_payment_nodejs");


//
//使用環境參數
require("dotenv").config();



router.post("/", function (req, res, next) {
  let data = req.body;
  let user_name = data.user_name;
  let ticket_number = data.ticket_number;
  let className = data.className;
  let buy_ticket_type = data.buy_ticket_type;
  let totalTicket = data.totalTicket;
  let buy_ticket_price = data.buy_ticket_price;
  let buy_ticket_day = data.buy_ticket_day;
  let user_gender = data.user_gender;
  let user_phone = data.user_phone;
  let user_mail = data.user_mail;
  let user_birthday = data.user_birthday;
  let credit = data.credit;
  let buy_ticket_time = data.buy_ticket_time;
  let base_param = {
    MerchantTradeNo: { ticket_number }, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: { buy_ticket_time }, //ex: 2017/02/13 15:45:30
    TotalAmount: { buy_ticket_price },
    TradeDesc: "講座購買",
    ItemName: { className },
    ReturnURL: "http://localhost:3000/productList",
    // ChooseSubPayment: "",
    //OrderResultURL: "http://192.168.0.1/payment_result",
    //NeedExtraPaidInfo: "1",
    //ClientBackURL: "https://www.google.com",
    ItemURL: "http://localhost:3000/productList",
    Remark: "備註",
    // StoreID: "",
    // CustomField1: "",
    // CustomField2: "",
    // CustomField3: "",
    // CustomField4: "",
  };

  // 若要測試開立電子發票，請將inv_params內的"所有"參數取消註解 //
  let inv_params = {
    // RelateNumber: 'PLEASE MODIFY',  //請帶30碼uid ex: SJDFJGH24FJIL97G73653XM0VOMS4K
    // CustomerID: 'MEM_0000001',  //會員編號
    // CustomerIdentifier: '',   //統一編號
    // CustomerName: '測試買家',
    // CustomerAddr: '測試用地址',
    // CustomerPhone: '0123456789',
    // CustomerEmail: 'johndoe@test.com',
    // ClearanceMark: '2',
    // TaxType: '1',
    // CarruerType: '',
    // CarruerNum: '',
    // Donation: '2',
    // LoveCode: '',
    // Print: '1',
    // InvoiceItemName: '測試商品1|測試商品2',
    // InvoiceItemCount: '2|3',
    // InvoiceItemWord: '個|包',
    // InvoiceItemPrice: '35|10',
    // InvoiceItemTaxType: '1|1',
    // InvoiceRemark: '測試商品1的說明|測試商品2的說明',
    // DelayDay: '0',
    // InvType: '07'
  };

  let create = new ecpay_payment();
  let htm = create.payment_client.aio_check_out_credit_onetime(
    (parameters = base_param),
    (invoice = inv_params)
  );
  console.log(htm);
});


module.exports  =  router
