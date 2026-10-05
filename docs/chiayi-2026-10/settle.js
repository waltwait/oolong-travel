/* 分帳：所有花費由 people 平分，算出每人該付多少、誰要給誰多少。
   金額一律換成「分」（×100）用整數算，避免小數誤差。
   平分除不盡時，多出來的 1 分依 people 順序分給前面的人，總和永遠對得起來。 */
(function (root) {
  function settle(entries, people) {
    var paid = {};
    people.forEach(function (p) { paid[p] = 0; });
    var total = 0;
    entries.forEach(function (e) {
      if (!(e.payer in paid)) throw new Error('不在分帳名單裡：' + e.payer);
      var c = Math.round(e.amount * 100);
      paid[e.payer] += c;
      total += c;
    });

    var n = people.length;
    var base = Math.floor(total / n), extra = total - base * n;
    var share = {}, balance = {};
    people.forEach(function (p, i) {
      share[p] = base + (i < extra ? 1 : 0);
      balance[p] = paid[p] - share[p]; // 正＝該收錢，負＝該付錢
    });

    // 欠最多的先還給被欠最多的，轉帳次數最多 n-1 筆
    var debtors = people.filter(function (p) { return balance[p] < 0; })
      .map(function (p) { return { name: p, left: -balance[p] }; });
    var creditors = people.filter(function (p) { return balance[p] > 0; })
      .map(function (p) { return { name: p, left: balance[p] }; });
    debtors.sort(function (a, b) { return b.left - a.left; });
    creditors.sort(function (a, b) { return b.left - a.left; });

    var transfers = [], i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      var amt = Math.min(debtors[i].left, creditors[j].left);
      transfers.push({ from: debtors[i].name, to: creditors[j].name, amount: amt / 100 });
      debtors[i].left -= amt;
      creditors[j].left -= amt;
      if (debtors[i].left === 0) i++;
      if (creditors[j].left === 0) j++;
    }

    function dollars(obj) {
      var o = {};
      Object.keys(obj).forEach(function (k) { o[k] = obj[k] / 100; });
      return o;
    }
    return {
      total: total / 100,
      paid: dollars(paid),
      share: dollars(share),
      balance: dollars(balance),
      transfers: transfers
    };
  }

  if (typeof module === 'object' && module.exports) module.exports = settle;
  else root.settle = settle;
})(this);
