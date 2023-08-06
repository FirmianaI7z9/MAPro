var canvas1, c1, canvas2, c2, cc, height, width;
var title, lcat, scat, lev, main1, main2, res;
var lcd, scd;
var json;
var typ, regi, are;
var regio, areo;
var se, lvl, qnum, disv, qans;
var ans = [false, false, false, false];
var isf = false;
var tans;
const color = ['red','blue','green','orange'];

function init() {
  title = document.getElementsByClassName('title')[0];
  lcat = document.getElementsByClassName('l_category')[0];
  lcd = document.getElementById('lcd');
  scat = document.getElementsByClassName('s_category')[0];
  scd = document.getElementById('scd');
  lev = document.getElementsByClassName('level')[0];
  main1 = document.getElementsByClassName('main1')[0];
  main2 = document.getElementsByClassName('main2')[0];
  res = document.getElementsByClassName('result')[0];

  canvas1 = document.getElementById("canvas1");
  width = canvas1.width;
  height = canvas1.height;
  c1 = canvas1.getContext("2d");
  canvas2 = document.getElementById("canvas2");
  width = canvas2.width;
  height = canvas2.height;
  c2 = canvas2.getContext("2d");
}
window.onload = function () {
  init();
}

function a(str) {
  title.style = "display: none;";
  typ = str;
  let requestURL = typ + '.json';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function () {
    let data = request.response;
    json = JSON.parse(JSON.stringify(data));

    let region = json['region'];

    var clone = lcd.cloneNode(false);
    lcd.parentNode.replaceChild(clone, lcd);
    lcd = clone;

    region.forEach((reg) => {
      lcd.insertAdjacentHTML(
        'beforeend',
        '<button type=\"button\" class=\"lb\" onclick=\"b(\'' + reg['id'] + '\')\">'
          + reg['name'].replace('/','<br>') + '</button>'
      );
    });

    lcd.insertAdjacentHTML(
      'beforeend',
      '<button type=\"button\" class=\"lb\" onclick=\"ab(\'\')\">Back<br>戻る</button>'
    );

    lcat.style = "";
  }
}

function ab() {
  lcat.style = "display: none;";
  title.style = "";
}

function b(str) {
  lcat.style = "display: none;";
  regi = str;
  let requestURL = typ + '.json';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function () {
    let data = request.response;
    json = JSON.parse(JSON.stringify(data));

    let region = json['area'];

    var clone = scd.cloneNode(false);
    scd.parentNode.replaceChild(clone, scd);
    scd = clone;

    region.forEach((reg) => {
      if (reg['region'] == regi) {
        regio = reg['areas'];
        reg['areas'].forEach((area) => {
          scd.insertAdjacentHTML(
            'beforeend',
            '<div class="lbc">'
              + '<img class="lbi" src="pic/' + typ + '_' + area['id'] + '.png" onclick="c(\'' + area['id'] + '\')"/>'
              + '<p>' + area['name'].replace('/', '<br>') + '</p></div>'
          );
        });
      }
    });

    scd.insertAdjacentHTML(
      'beforeend',
      '<button type=\"button\" class=\"lb\" onclick=\"bb(\'\')\">Back<br>戻る</button>'
    );

    scat.style = "";
  }
}

function bb() {
  scat.style = "display: none;";
  lcat.style = "";
}

function c(str) {
  scat.style = "display: none;";
  are = str;
  regio.forEach((ar) => {
    if (ar['id'] == are) {
      areo = ar;
    }
  });

  var bnor = document.getElementsByClassName('bnor');
  if (areo['isnormal'] == false) {
    bnor[0].innerHTML = bnor[1].innerHTML = "NORMAL is disabled<br><span class=\"ss\">この地域はNORMAL非対応です</span>";
    bnor[0].setAttribute("disabled", true);
    bnor[1].setAttribute("disabled", true);
  } else {
    bnor[0].innerHTML = bnor[1].innerHTML = "NORMAL<br><span class=\"ss\">「市」のみ出題されます</span>";
    bnor[0].removeAttribute("disabled");
    bnor[1].removeAttribute("disabled");
  }
  lev.style = "";
}

function cb() {
  lev.style = "display: none;";
  scat.style = "";
}

function d(sec, lv) {
  lev.style = "display: none;";
  se = sec;
  lvl = lv;
  if (sec == 0) {
    main1.style = "";
    cc = c1;
    document.getElementById('qt1').textContent = areo['name'].replace('/', ' / ') + ' - ' + (lv == 0 ? 'NORMAL' : 'WHOLE');
  } else {
    main2.style = "";
    cc = c2;
    document.getElementById('qt2').textContent = areo['name'].replace('/', ' / ') + ' - ' + (lv == 0 ? 'NORMAL' : 'WHOLE');
  }
  let requestURL = 'geojson/' + typ + '_' + areo['id'] + '.geojson';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function () {
    let data = request.response;
    json = JSON.parse(JSON.stringify(data));
    tans = 0;
    qnum = 0;
    np();
  }
}

function db() {
  main1.style = "display: none;";
  lev.style = "";
}

function e(num) {
  if (isf == false) {
    ans[num] = !ans[num];
    if (ans[num] == true) {
      document.getElementById(se + 'ans' + num).classList.add('mccbr');
    } else {
      document.getElementById(se + 'ans' + num).classList.remove('mccbr');
    }
    var cnt = 0;
    ans.forEach(v => {
      if (v == true) cnt++;
    });

    if (se == 0 && cnt == 2) {
      isf = true;
      if (ans[qans[0]] == true && ans[qans[1]] == true) {
        cc.beginPath();
        cc.arc(300, 240, 100, 0, 2 * Math.PI, true);
        cc.strokeStyle = 'blue';
        cc.lineWidth = 20;
        cc.closePath();
        cc.stroke();
        tans++;
      } else {
        document.getElementById(se + 'ans' + qans[0]).classList.add('mccwr');
        document.getElementById(se + 'ans' + qans[1]).classList.add('mccwr');
        cc.beginPath();
        cc.moveTo(390, 140);
        cc.lineTo(400, 150); cc.lineTo(310, 240); cc.lineTo(400, 330); cc.lineTo(390, 340); cc.lineTo(300, 250); cc.lineTo(210, 340);
        cc.lineTo(200, 330); cc.lineTo(290, 240); cc.lineTo(200, 150); cc.lineTo(210, 140); cc.lineTo(300, 230);
        cc.closePath();
        cc.fillStyle = 'red';
        cc.fill();
      }
    } else if (se == 1 && cnt == 1) {
      isf = true;
      if (ans[qans[0]] == true) {
        cc.beginPath();
        cc.arc(300, 240, 100, 0, 2 * Math.PI, true);
        cc.strokeStyle = 'blue';
        cc.lineWidth = 20;
        cc.closePath();
        cc.stroke();
        tans++;
      } else {
        document.getElementById(se + 'ans' + qans[0]).classList.add('mccwr');
        cc.beginPath();
        cc.moveTo(390, 140);
        cc.lineTo(400, 150); cc.lineTo(310, 240); cc.lineTo(400, 330); cc.lineTo(390, 340); cc.lineTo(300, 250); cc.lineTo(210, 340);
        cc.lineTo(200, 330); cc.lineTo(290, 240); cc.lineTo(200, 150); cc.lineTo(210, 140); cc.lineTo(300, 230);
        cc.closePath();
        cc.fillStyle = 'red';
        cc.fill();
      }
    }
  } else {
    qans.forEach(i => {
      document.getElementById(se + 'ans' + i).classList.remove('mccwr');
    });
    for (let i = 0; i < 4; i++) {
      if (ans[i] == true) document.getElementById(se + 'ans' + i).classList.remove('mccbr');
      ans[i] = false;
    }
    if (qnum == 5) {
      main1.style = "display: none;";
      main2.style = "display: none;";
      document.getElementById('ren').textContent = areo['name'].replace('/', ' / ');
      document.getElementById('reg').textContent = (se == 0 ? 'Unscramble / 入れ替わった市区町村を直せ' : 'Direct / 市区町村名一問一答');
      document.getElementById('rer').textContent = '[ correct : ' + (20 * tans) + '% ]';
      res.style = "";
    } else {
      np();
    }
  }
}

function f() {
  res.style = "display: none;";
  d(se, lvl);
}

function g() {
  res.style = "display: none;";
  scat.style = "";
}

function np() {
  isf = false;
  qnum++;
  document.getElementById('qn' + (se + 1)).textContent = qnum + ' out of 5 problems';
  let region = json['features'];
  let maxx = -200, minx = 200, maxy = -100, miny = 100;
  var carr = [];

  region.forEach((reg) => {
    let geometry = reg['geometry'];
    let val = reg['properties'];
    if ((lvl != 0 || val['Region'] == null) && val['City'] != null) {
      carr.push(val['Region'] + '/' + val['City'] + '/' + val['CityE']);
    }

    geometry = geometry['coordinates'];
    geometry.forEach(val => {
      val.forEach(poly => {
        poly.forEach(poly => {
          maxx = Math.max(maxx, poly[0]);
          minx = Math.min(minx, poly[0]);
          maxy = Math.max(maxy, poly[1]);
          miny = Math.min(miny, poly[1]);
        });
      });
    });
  });
  disv = Math.min(590.0 / (maxx - minx), 470.0 / (maxy - miny));

  carr = fisher_yates(carr);
  carr = carr.slice(0, 4);
  qans = fisher_yates([0,1,2,3]);
  if (se == 0) qans = qans.slice(0,2);

  cc.clearRect(0, 0, 600, 480);
  cc.lineWidth = 1;
  region.forEach((reg) => {
    let geometry = reg['geometry'];
    let index = carr.indexOf(reg['properties']['Region'] + '/' + reg['properties']['City'] + '/' + reg['properties']['CityE']);
    geometry = geometry['coordinates'];
    if ((se == 0 && index != -1) || (se == 1 && index == qans[0])) {
      cc.fillStyle = color[(se == 0 ? index : 0)];
      geometry.forEach((val) => {
        let isStart = true;
        cc.beginPath();
        val.forEach(poly => {
          poly.forEach(poly => {
            if (isStart) {
              cc.moveTo((poly[0] - (minx + maxx) * 0.5) * disv + 300, (poly[1] - (miny + maxy) * 0.5) * disv * -1 + 240);
              isStart = false;
            } else {
              cc.lineTo((poly[0] - (minx + maxx) * 0.5) * disv + 300, (poly[1] - (miny + maxy) * 0.5) * disv * -1 + 240);
            }
          });
        });
        cc.closePath();
        cc.fill();
      });
    }
    cc.strokeStyle = 'black';

    geometry.forEach((val) => {
      let isStart = true;
      cc.beginPath();
      val.forEach(poly => {
        poly.forEach(poly => {
          if (isStart) {
            cc.moveTo((poly[0] - (minx + maxx) * 0.5) * disv + 300, (poly[1] - (miny + maxy) * 0.5) * disv * -1 + 240);
            isStart = false;
          } else {
            cc.lineTo((poly[0] - (minx + maxx) * 0.5) * disv + 300, (poly[1] - (miny + maxy) * 0.5) * disv * -1 + 240);
          }
        });
      });
      cc.closePath();
      cc.stroke();
    });
  });

  if (se == 0) [carr[qans[0]], carr[qans[1]]] = [carr[qans[1]],carr[qans[0]]];
  
  for (let i = 0; i < 4; i++) {
    document.getElementById('' + se + (i + 1) + '1').textContent = carr[i].split('/')[2] ?? "";
    document.getElementById('' + se + (i + 1) + '2').textContent = (carr[i].split('/')[0] == 'null' ? "" : carr[i].split('/')[0]);
    document.getElementById('' + se + (i + 1) + '3').textContent = carr[i].split('/')[1] ?? "";
  }
}

function fisher_yates(src) {
  const dst = src.slice();
  let i = src.length;
  while (i > 0) {
    i--;
    const j = Math.floor(Math.random() * (i + 1));
    [dst[i], dst[j]] = [dst[j], dst[i]];
  }
  return dst;
}