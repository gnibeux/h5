 $(function() {
var vm = new Vue({
	el: '#app',
	data: {
		telval: 1,
		countdown: 0,
		showCode:true,
		disableSecond:"disabled",
		count:60,
		curCount:0,
		code:"",
		codeLength:4,
		InterValObj:null,
		phone:""
	},
	mounted: function() {

	},
	methods: {
		sendMessage:function(){
		    this.curCount = this.count;  
	        //产生验证码  
	        var phone = JSON.stringify({"phoneNo": this.phone});
             this.$http.post('http://hkr.evershare.cn:9999/hkr-agg-ar/api/v1/verify_codes', phone).then(function(response) {
		        return response.text();
	        }, function(err) {
	            console.log(err)
	        }).then((text) => {
	        	text = eval("("+ text +")");
	        	if(text.code == 0){
	        		//设置button效果，开始计时  
			        this.showCode = false;
			        this.$el.querySelector("#countdown").textContent = this.curCount + "s";  
			        this.InterValObj = window.setInterval(this.SetRemainTime, 1000); //启动计时器，1秒执行一次  
	        	}
	        });	        
		},  
		//timer处理函数  
		SetRemainTime: function(){
		    if (this.curCount == 0) {                  
		        window.clearInterval(this.InterValObj);//停止计时器  
		        this.showCode = true;
		        this.$el.querySelector("#second").textContent = "重获新密令";  
				this.code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效      
		    }  
		    else {  
		        this.curCount--;  
		        this.$el.querySelector("#countdown").textContent = this.curCount + "s";  
		    }  
		},  
		test: function(currentEl, targetEl) {
			var flag = true;
			if(currentEl.target.id == "phonenum") {
				flag = /^1[34578]\d{9}$/.test(currentEl.target.value);
			} else {
				flag = /^\d{4}$/.test(currentEl.target.value);
			}
			if(currentEl.target.id == "phonenum"){
				if(!flag) {
					this.curCount = 0;
					this.showCode = true;
					this.disableSecond = true;
					this.$el.querySelector("#" + targetEl.id).style.backgroundColor = "lightgrey";
				} else {
					//- this.showCode = false;
					this.disableSecond = false;
					this.$el.querySelector("#" + targetEl.id).style.backgroundColor = "white";
				}
			}
			return flag;
		},
		testTel: function(el) {
			var targetEl = this.$el.querySelector("#second");
			this.test(el, targetEl);
		},
		testCode: function(el) {
			var targetEl = this.$el.querySelector("#submit");
			var flag = this.test(el, targetEl);
			if(flag){
				//向后台发送处理数据  
		    	var map = {
				  "identifyingCode": this.code,
				  "phoneNo": this.phone,
				  "source": "4"
				};
				map = JSON.stringify(map);
		        this.$http.post('http://hkr.evershare.cn:9999/hkr-agg-ar/api/v1/users/login', map).then(function(response) {
			        return response.text();
		        }, function(err) {
		            console.log(err)
		        }).then((text) => {
		        	text = eval("("+ text +")");
		        	if(text.code == 0){
		        		localStorage.code = text.code;
	        			window.location.href = "second.html";
		        	}else{
		        		alert("密令错误，再次补血");
		        		this.code = "";
		        	}
		        });	      
			}
		}
		
	}
})

})