var t = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: function(n) {
        var e = n.getFullYear(), r = n.getMonth() + 1, o = n.getDate(), i = n.getHours(), u = n.getMinutes(), a = n.getSeconds();
        return [ e, r, o ].map(t).join("/") + " " + [ i, u, a ].map(t).join(":");
    },
    formatTime1: function(n) {
        return [ n.getFullYear(), n.getMonth() + 1, n.getDate() ].map(t).join("-");
    },
    json2Form: function(t) {
        var n = [];
        for (var e in t) n.push(encodeURIComponent(e) + "=" + encodeURIComponent(t[e]));
        return n.join("&");
    },
    throttle: function(t, n) {
        null != n && void 0 != n || (n = 1500);
        var e = null;
        return function() {
            var r = +new Date();
            (r - e > n || !e) && (t.apply(this, arguments), e = r);
        };
    },
    delUrlParam: function(t, n) {
        if (-1 == t.indexOf(n)) return t;
        for (var e = t.split("?"), r = e[0], o = e[1].split("&"), i = -1, u = 0; u < o.length; u++) if (o[u].split("=")[0] == n) {
            i = u;
            break;
        }
        return -1 == i ? t : (o.splice(i, 1), o && o.length > 0 ? r + "?" + o.join("&") : r);
    },
    toPercent: function(t) {
        var n = Number(10 * t);
        return n += "%";
    },
    
  formatTime3: formatTime3,
  formatTime4: formatTime4,
  formatTime5: formatTime5,
  getDateStr: getDateStr,
};


function formatTime3(date) {
  var date = new Date(date / 1000 * 1000);

  var Y = date.getFullYear() + '.';

  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';

  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  return (Y + M + D)
}


function formatTime5(date) {
  var date = new Date(date / 1000 * 1000);

  var Y = date.getFullYear() + '-';

  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';

  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  return (Y + M + D)
}

function formatTime4(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number/1000 * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



//today 是需要计算的某一天的日期例如“2017 - 07 - 07”，传 null 默认今天，addDayCount 是要推算的天数， -1是前一天，0是今天，1是后一天，以此类推
function getDateStr(today, addDayCount) {
  var dd;
  if (today) {
    dd = new Date(today);
  } else {
    dd = new Date();
  }
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + "-" + m + "-" + d;
}
