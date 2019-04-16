var timers=[];//存储所有定时器
	var listArray=[];//存放遍历之后形成的序列
	var seekArray=[];//存放遍历查找时形成的序列
	var resultArray=[];//存放查找结果的数组
	var seekFlag=false;//记录是否查找到相应的内容，如果找到则为true
	var BFIndex=0;//记录广度优先遍历的深度
	var isReturn=false;
	var rootNode=document.getElementsByTagName('div')[1];
	var dftBtn=document.getElementById('dft');
	var bftBtn=document.getElementById('bft');
	var bftSeek=document.getElementById('bftSeek');
	var dftSeek=document.getElementById('dftSeek');
	var inputText=document.getElementById('inputText');
	var showError=document.getElementsByTagName('h4')[0];
	//去除.content div
	var odiv1=document.getElementsByTagName('div');
	var odiv=[];
	for(var k=1;k<odiv1.length;k++){
		odiv.push(odiv1[k]);
	}
	//阻止默认事件
	function stopDefault(e){
		if(e.preventDefault){
			e.preventDefault();
		}else{
			e.returnValue=false;
		}		
	}
	//添加事件句柄
	function addListener(obj,ev,fun){
		if(obj.addEventListener){
			obj.addEventListener(ev,fun,false);
		}else{
			obj.attachEvent('on'+ev,fun);
		}
	}
	//当前button显示标识
	function showButton(obj){
		var btns=document.getElementsByTagName('button');
		for(var i=0;i<btns.length;i++){
			btns[i].style.backgroundColor='#80BDA4';
		}
		obj.style.backgroundColor='#80BDA4';
	}
	//停止所有定时器
	function clearIntervals(){
		for(var i=0;i<timers.length;i++){
			if(timers[i]){
				clearInterval(timers[i]);
			}
		}
	}
	/******
	可视化遍历
	******/
	//深度优先遍历
	function DFT(node,arr){
		if(node){
			arr.push(node);
			for(var i=0;i<node.children.length;i++){
				DFT(node.children[i],arr);
			}
		}
		return arr;
	}
	//广度优先遍历
	function BFT(node,arr){
		if(node){
			arr.push(node);
			BFT(node.nextElementSibling,arr);//依次获取当前层的各个节点
			var node=arr[BFIndex++];//依次获取每一层的各个节点
			BFT(node.firstElementChild,arr);//获取当前节点对应的下一层的第一个节点
		}
		return arr;
	}
	//渲染
	function render(obj,index,arr){
		for(var i=0;i<odiv.length;i++){//每一步可视化都要重置所有div的bgcolor
			odiv[i].style.backgroundColor='#000';
			odiv[i].style.color='#80BDA4';
		}
		obj[index].style.backgroundColor='#FFF9DA';
		
		if(arr){
			for(var j=0;j<arr.length;j++){//可视化查找时保存的符合查找条件的数组
				arr[j].style.backgroundColor='#E5AC27';
				arr[j].style.color='#000';		
			}
		}
	}
	//绑定事件
	addListener(dftBtn,'click',function(e){
		stopDefault(e);//组织button click时的submit事件
		showButton(this);
		clearIntervals();
		listArray.length=0;
		listArray=DFT(rootNode,listArray);
		var index=0;
		render(listArray,index++);
		this.timer=setInterval(function(){
			if(index==listArray.length){
				listArray[listArray.length-1].style.backgroundColor='#000';			
				clearInterval(dftBtn.timer);
				return;
			}
			render(listArray,index++);
		},500);//每隔500毫秒执行一次渲染函数
		timers.push(this.timer);
	});
	addListener(bftBtn,'click',function(e){
		stopDefault(e);
		showButton(this);
		clearIntervals();
		listArray.length=0;
		BFIndex=0;//从最顶层开始遍历,初始化
		listArray=BFT(rootNode,listArray);
		var index=0;
		render(listArray,index++);
		this.timer=setInterval(function(){
			if(index==listArray.length){
				listArray[listArray.length-1].style.backgroundColor='#000';			
				clearInterval(bftBtn.timer);
				return;//跳出定时器
			}
			render(listArray,index++);
		},500);
		timers.push(this.timer);
	});
	
	/******
	可视化遍历查找
	******/
	//可视化查找渲染
	function seekRender(obj,item,fun){
		seekFlag=false;
		lastFlag=false;//匹配结果是否含有最后一个div
		seekArray.length=0;
		resultArray.length=0;
		seekArray=fun(rootNode,seekArray);//两种遍历的节点数据顺序
		var index=0;
		//避免空白结点的影响，gecko
		var seekArrayItem=seekArray[index].firstChild.nodeValue.replace(/\s/g,'');
		if(seekArrayItem==item&&index<seekArray.length){
			if(index==seekArray.length-1){
				lastFlag=true;
			}
			seekFlag=true;
			resultArray.push(seekArray[index]);
		}
		//render(seekArray,index++,resultArray);
		//还原所有设置
		for(var i=0;i<odiv.length;i++){
			odiv[i].style.backgroundColor='#000';
			odiv[i].style.color='#80BDA4';
		}
		timers.push(obj.timer=setInterval(function(){
			var seekArrayItem=seekArray[index].firstChild.nodeValue.replace(/\s/g,'');
			if(seekArrayItem==item&&index<seekArray.length){
				if(index==seekArray.length-1){
					lastFlag=true;
				}
				seekFlag=true;
				resultArray.push(seekArray[index]);
			}
			if(!seekFlag&&index==seekArray.length-1){
				//查找内容不存在时给出错误提示
				showError.style.visibility='visible';
			}
			render(seekArray,index++,resultArray);
			
			//当前节点内所包含的内容
			if(index==seekArray.length){			
				if(!lastFlag){
					console.log('3333');
					lastTimer = setTimeout(function(){
						//console.log('hello');
						seekArray[seekArray.length-1].style.backgroundColor='#000';
						clearTimeout(lastTimer);
					},500);
					
					
					//clearTimeout(lastTimer);
				}else{
					odiv[odiv.length-1].style.backgroundColor='#E5AC27';
				}				
				clearInterval(obj.timer);
				return;
			}
			

		},500));
	}
	/******	
	//深度优先遍历查找
	function dft(node,item){
		使用全局变量强制退出递归
		if(isReturn){
			isReturn=false;
			return;
		}
		if(!!node){      										
			seekArray.push(node);
			for(var i=0;i<node.children.length;i++){
				dft(node.children[i],item);
			}
		}
		return seekArray;
	} 
	******/
	//查找事件绑定
	addListener(dftSeek,'click',function(e){
		stopDefault(e);
		showButton(this);
		clearIntervals();
		//input文本框字符串的验证
		var item=inputText.value.toString().replace(/\s/g,'');//做空字符串处理
		if(item==''){
			alert('查找内容不能为空！');
			return;
		}
		seekRender(dftSeek,item,DFT);
	});
	addListener(bftSeek,'click',function(e){
		stopDefault(e);
		showButton(this);
		clearIntervals();
		//input文本框字符串的验证
		var item=inputText.value.toString().replace(/\s/g,'');//做空字符串处理
		if(item==''){
			alert('查找内容不能为空！');
			return;
		}
		BFIndex=0;
		seekRender(bftSeek,item,BFT);		
	});
	//文本框获得焦点错误提示信息消失
	addListener(inputText,'focus',function(){		
		showError.style.visibility='hidden';
	});
	//文本框回车事件
	addListener(inputText,'keydown',function(ev){
		var e=ev||window.ev;
		
		if(e.keyCode==13){
			e.preventDefault();
			dftSeek.focus();
		}
	});