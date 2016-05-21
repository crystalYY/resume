/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 'choose',
  nowGraTime: "day"
}
function getTarget(e){
  var ev=e||window.event;
  return ev.target||ev.srcElement;
}
//兼容的事件监听函数
function addListener(obj,ev,fun){
  if(obj.addEventListener){
    obj.addEventListener(ev,fun,false);
  }
  else if(obj.attachEvent){
    obj.attachEvent('on'+ev,fun);
  }
  else{
    obj['on'+ev]=fun;
  }
}
//颜色数组
var colors=['#2F0000','#BF0060','#D200D2','#009393','#00A600'];

/**
 * 渲染图表
 */
function renderChart(width,height,title) {
  var aqiChart=document.getElementById('aqiChart');
  var aqiItem=document.createElement('p');
  aqiChart.style.display='block';
  aqiItem.style.display='inline-block';
  aqiItem.style.width=width+'px';
  aqiItem.style.height=height+'px';
  aqiItem.title=title;
  aqiItem.style.marginLeft='6px';
  if(height<100&&height>=0){
    aqiItem.style.backgroundColor=colors[4];
  }else if(height<200){
    aqiItem.style.backgroundColor=colors[3];
  }else if(height<300){
    aqiItem.style.backgroundColor=colors[2];
  }else if(height<400){
    aqiItem.style.backgroundColor=colors[1];
  }else{
    aqiItem.style.backgroundColor=colors[0];
  }
  aqiChart.appendChild(aqiItem);
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */

 //用户选择“周”时
function chooseWeek(mon,monNum,nowCity) {
  var showDetial=document.getElementById('showDetial');
  showDetial.style.display='block';
  showDetial.innerHTML=nowCity+'每周的AQI情况如下图所示';
  var sum=0;
  var nowWeek=0;
  var aqiHeight=0;
  var aqiTtile='';
  for(var i=1;i<=mon.length;i++){
    console.log(i+'='+mon[i-1]);
    sum+=mon[i-1];
    if(i%7==0){
      nowWeek=i/7;
      aqiHeight=parseInt(sum/7);
      sum=0;
      aqiTtile=nowCity+' 第'+monNum+'个月，第'+nowWeek+'周的平均AQI为 '+aqiHeight;
      renderChart(30,aqiHeight,aqiTtile);
      continue;
    }
    if(i==mon.length){
      console.log(i-28+' sum='+sum);
      aqiHeight=parseInt(sum/(i-28));
      nowWeek++;
      aqiTtile=nowCity+' 第'+monNum+'个月，第'+nowWeek+'周的平均AQI为 '+aqiHeight;
      renderChart(30,aqiHeight,aqiTtile);
    }
  }
}

//用户选择“月”时
function chooseMonth(mon,monNum,nowCity){
  var showDetial=document.getElementById('showDetial');
  showDetial.style.display='block';
  showDetial.innerHTML=nowCity+'每月的AQI情况如下图所示';
  var sum=0;
  var aqiHeight=0;
  var aqiTtile='';
  for(var i=0;i<mon.length;i++){
    sum+=mon[i];
  }
  aqiHeight=sum/i;
  aqiTtile=nowCity+'在第'+monNum+'个月的平均AQI为 '+aqiHeight;
  renderChart(50,aqiHeight,aqiTtile);
}

function graTimeChange(city) { 
  var formTime=document.getElementById('form-gra-time');
  var formInputs=formTime.getElementsByTagName('input');
  var checkdRadio='';
  var selectedOption='';
  //获取当前选定单选项
  for(var i=0;i<formInputs.length;i++){
    if(formInputs[i].checked){
        checkdRadio=formInputs[i].value;
    }
  }
  // 确定是否选项发生了变化 
  if(checkdRadio!=pageState.nowGraTime||pageState.nowSelectCity!=city){
    // 设置对应数据
    var nowCity=city;
    var aqiMonthNum1=[];
    var aqiMonthNum2=[];
    var aqiMonthNum3=[];
    //var aqiMonthTime1=[];
    //var aqiMonthTime2=[];
    //var aqiMonthTime3=[];
    var aqiHeight=0;
    var aqiTtile='';
    if(nowCity!='choose'){
      for(var cityTime in aqiSourceData[nowCity]){
        var aqiTimes=cityTime.split('-');
        switch(aqiTimes[1]){
          case '01':
            aqiMonthNum1.push(parseInt(aqiSourceData[nowCity][cityTime]));
            //aqiMonthTime1.push(cityTime);
            break;
          case '02':
            aqiMonthNum2.push(parseInt(aqiSourceData[nowCity][cityTime]));
            //aqiMonthTime2.push(cityTime);
            break;
          case '03':
            aqiMonthNum3.push(parseInt(aqiSourceData[nowCity][cityTime]));
            //aqiMonthTime3.push(cityTime);
        }
        if(checkdRadio=='day'){
          var showDetial=document.getElementById('showDetial');
          showDetial.style.display='block';
          showDetial.innerHTML=nowCity+'每天的AQI情况如下图所示';
          pageState.nowGraTime='day';
          aqiHeight=parseInt(aqiSourceData[nowCity][cityTime]);
          aqiTtile=nowCity+' 在'+cityTime+'的aqi值为：'+aqiHeight;
          // 调用图表渲染函数
          renderChart(5,aqiHeight,aqiTtile);
        }
      }
      if(checkdRadio=='week'){
        pageState.nowGraTime='week';
        chooseWeek(aqiMonthNum1,'一',nowCity);
        chooseWeek(aqiMonthNum2,'二',nowCity);
        chooseWeek(aqiMonthNum3,'三',nowCity);
      }
      if(checkdRadio=='month'){
        pageState.nowGraTime='month';
        chooseMonth(aqiMonthNum1,'一',nowCity);
        chooseMonth(aqiMonthNum2,'二',nowCity);
        chooseMonth(aqiMonthNum3,'三',nowCity);
      }
    }
  }
  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var selectedOption='';
  var cityOptions=document.getElementById('city-select').getElementsByTagName('option');
  for(var i=0;i<cityOptions.length;i++){
    if(cityOptions[i].selected){
      selectedOption=cityOptions[i].value;
      break;
    }
  }
  graTimeChange(selectedOption);
  pageState.nowSelectCity=selectedOption;
}

  


/**
 * 初始化change事件，调用函数citySelectChang
 */
function initCitySelector() {
  var radios=document.getElementById('form-gra-time');
  var oSelect=document.getElementById('city-select');
  addListener(radios,'change',function(e){
    var ev=getTarget(e);    
    if(ev.nodeName.toLowerCase()=='input'){
      var resultForm=document.getElementById('aqiChart');
      resultForm.innerHTML='';
      citySelectChange();
    }
  });
  addListener(oSelect,'change',function(){
    var resultForm=document.getElementById('aqiChart');
    resultForm.innerHTML='';
    citySelectChange();
});
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initGraTimeForm() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  for(var cityName in aqiSourceData){
    var newOption=document.createElement('option');
    var selects=document.getElementById('city-select');
    newOption.value=cityName.toString();
    var optionText=document.createTextNode(cityName);
    newOption.appendChild(optionText);
    selects.appendChild(newOption);
  }

}


/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
}

init();