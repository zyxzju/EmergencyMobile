
angular.module('controllers', ['ionic','ngResource','services'])
.controller('SignInCtrl', ['$scope', 'Storage', function ($scope, Storage) {
  // Storage.set('initState', 'simple.homepage');
   $scope.DeviceID=ionic.Platform.device().uuid; //获取移动设备
}])

// --------登录、注册、修改密码、位置选择、个人信息维护 [熊嘉臻]----------------
//登录
.controller('SignInCtrl',['$state','$scope','$ionicLoading','UserInfo','Storage',function($state,$scope,$ionicLoading,UserInfo,Storage){
  $scope.account = {UserID:'',password:''};
  if(Storage.get('USERID')){
    $scope.account.UserID=Storage.get('USERID')
  }
  $scope.signIn = function(account){
    $scope.logStatus="";
    if(account.UserID!='' && account.password!=''){
      if(UserInfo.isPasswdValid(account.password)){
        $ionicLoading.show();
        UserInfo.LogOn(account.UserID,account.password)
        .then(function(data){
          if(data.Result==1){
            $ionicLoading.hide();
            $ionicLoading.show({template:'登录成功',noBackdrop:true,duration:1500});
            Storage.set('RoleCode',data.RoleCode);
            // $scope.logStatus="登录成功";
            Storage.set('USERID',account.UserID);
            $state.go('location');
          }else{
            $ionicLoading.hide();
            $scope.logStatus="登录失败";
          }
        },function(err){
          $ionicLoading.hide();
          $scope.logStatus="登录失败，网络问题";
        });
      }else{
        $scope.logStatus="密码不符合要求"
      }
    }else{
      $scope.logStatus="请完整填写登录信息"
    }
  }
  var t={'DivideLeader':'分流组长','DividePersonnel':'分流人员','EmergencyPersonnel':'急救人员'};
  Storage.set("DictRoleMatch",JSON.stringify(t));
  $scope.toRegister = function(){
    // $rootScope.registerEnterState=true;
    $state.go('register');
  }
}])
//注册 
.controller('RegisterCtrl',['$ionicLoading','$state','$scope','$rootScope','$ionicHistory','UserInfo','Storage',function($ionicLoading,$state,$scope,$rootScope,$ionicHistory,UserInfo,Storage){
  var DictRoles=JSON.parse(Storage.get('DictRoleMatch'));//DictRoleMatch在signinCtrl初始化
  $scope.register={UserId:'',LoginPassword:'' ,LoginPassword0:'',UserName:"",role:"", Occupation: "", Position: "",Affiliaation: ""};
  $scope.Register = function(form){
    $scope.logStatus="";
    if(form.UserId!='' && form.LoginPassword!='' && form.LoginPassword0!='' && form.UserName!=''){
      if(form.LoginPassword!=form.LoginPassword0){
        $scope.logStatus="两次密码的输入不一致";
        return;
      }
      if(UserInfo.isPasswdValid(form.LoginPassword)){
        $ionicLoading.show();
        var sendData={
          "UserId": "",
          "RoleCode": "",
          "UserName": "",
          "Occupation": "",
          "Position": "",
          "Affiliaation": "",
          "LoginPassword": ""
        }
        angular.forEach(DictRoles,function(value,key){
          if(form.role==value){
            form.RoleCode = key;
          }
        });         
        delete form['role'];
        delete form['LoginPassword0'];
        angular.forEach(form,function(value,key){
          sendData[key]=value;
        });          
        UserInfo.UserRegister(sendData)
        .then(function(data){
          $ionicLoading.hide();
          $ionicLoading.show({template:'注册成功',noBackdrop:true,duration:1500})
          Storage.set('RoleCode',sendData.RoleCode);
          // $scope.logStatus="注册成功";
          Storage.set('USERID',sendData.UserId);
          $state.go('location');
        },function(err){
          $ionicLoading.hide();
          $scope.logStatus=err.data.result;
        });
      }else{
        $scope.logStatus="密码格式不符合要求"
      }      
    }else{
      $scope.logStatus="请输入完整信息！"
    }      
  }
  $scope.onClickBackward = function(){
    $ionicHistory.goBack();
  }  
}])
//设置密码
.controller('SetPasswordCtrl',['$scope','$state','$ionicHistory','$ionicLoading','Storage','UserInfo', function($scope, $state,$ionicHistory,$ionicLoading,Storage,UserInfo){
  $scope.ishide=false;
  $scope.change={oldPassword:"",newPassword:"",confirmPassword:""};
  $scope.passwordCheck = function(change){
    if(change.oldPassword){
      if(UserInfo.isPasswdValid(change.oldPassword)){
        $ionicLoading.show();
        UserInfo.LogOn(Storage.get('USERID'),change.oldPassword)
        .then(function(data){
          $ionicLoading.hide();
          $ionicLoading.show({template:'密码验证成功',noBackdrop:true,duration:1500})
          // $scope.logStatus1='验证成功';
          $scope.ishide=true; 
          // Storage.set('RoleCode',data.RoleCode);
          // $scope.logStatus="登录成功";
          // Storage.set('USERID',account.UserID);
          // $timeout($state.go('location'),500);
        },function(err){
          $ionicLoading.hide();
          $scope.logStatus1="验证失败";
        });
      }else{
        $scope.logStatus1="密码格式不符合要求";
      }    
    } 
  }

  $scope.gotoChange = function(change){
    $scope.logStatus2='';
    if((change.newPassword!="") && (change.confirmPassword!="")){
      if(change.newPassword == change.confirmPassword){
        if(UserInfo.isPasswdValid(change.newPassword)){
          $ionicLoading.show();
          UserInfo.ChangePassword(Storage.get('USERID'),change.oldPassword,change.newPassword)
          .then(function(data){
            $ionicLoading.hide();
            $ionicLoading.show({template:'修改成功',noBackdrop:true,duration:1500})
            // $scope.logStatus2="修改成功";
            $state.go('ambulance.mine');
          },function(err){
            $ionicLoading.hide();
            $scope.logStatus2="修改失败，网络错误";
          })
        }else{
          $scope.logStatus2="密码格式不符合要求";
        }
      }else{
        $scope.logStatus2="两次输入的密码不一致";
      }
    }else{
      $scope.logStatus2="请输入两遍新密码"
    }
  }
  $scope.onClickBackward = function(){
    $ionicHistory.goBack();
  }
}])
//我的位置
.controller('LocationCtrl',['$ionicLoading','$state','$scope','$rootScope','UserInfo','Storage',function($ionicLoading,$state,$scope,$rootScope,UserInfo,Storage){
  var MY_LOCATION;
  $scope.myLocation={Description:""};
  $scope.locationList=[];
  UserInfo.GetMstType('Place')
  .then(function(data){
    Storage.set("PlaceList",JSON.stringify(data));
    $scope.locationList=data;
  },function(err){

  })
  $scope.navFlag=false;
  $scope.$on('$ionicView.enter', function() {
    MY_LOCATION = Storage.get('MY_LOCATION');
    if(MY_LOCATION == undefined){
      $scope.isListShown=true;
    }else{
      $scope.myLocation.Description=MY_LOCATION;
      $scope.isListShown=false;
      $scope.navFlag=true;
    }   
  });

  $scope.toggleList = function(){
    $scope.isListShown=!$scope.isListShown;
  }
  $scope.isIconShown = function(){
    return $scope.isListShown?true:false;
  }
  
  // for(var i =0;i<5;i++){
  //   $scope.locationList.push({text:''+i,value:i+'value'});
  // }   
  $scope.setLocation = function(){
    $ionicLoading.show();
    var t;
    for(var i in $scope.locationList){
      if($scope.myLocation.Description == $scope.locationList[i].Description){
        t=$scope.locationList[i].Category + '|' + $scope.locationList[i].Type;
      }
    }
    UserInfo.SetMobileDevice({DeviceID:Storage.get('UUID'),Location:t,UserId:Storage.get('USERID'),DeviceFlag:1})
    .then(function(data){
      Storage.set('MY_LOCATION',$scope.myLocation.Description);
      $scope.isListShown=false;
      $ionicLoading.hide();
      $ionicLoading.show({template:'位置已更新',noBackdrop:true,duration:1500});
      if($scope.navFlag){
        $state.go('ambulance.mine');
      }else{
        $state.go('ambulance.list');
      }      
    },function(err){
      $ionicLoading.hide();
      $ionicLoading.show({template:'更新位置出错',noBackdrop:true,duration:3000});
    })

  }
  $scope.onClickBackward = function(){
    // $scope.$apply(function(){
      $scope.myLocation.Description=MY_LOCATION;
    // })
    console.log($rootScope.MY_LOCATION);
    // if($scope.navFlag){
      $state.go('ambulance.mine');
    // }
  }
}])
//设置-退出
.controller('SettingCtrl',['$state','$scope','$ionicPopup','$timeout','$ionicHistory','$rootScope','Storage',function($state,$scope,$ionicPopup,$timeout,$ionicHistory,$rootScope,Storage){
  $scope.$on('$ionicView.enter', function() {
    $scope.myLocation=Storage.get('MY_LOCATION');
    $scope.isListShown=false;
  });
  //获取医生基本信息
  $scope.userInfo={"userid":Storage.get("USERID"), role:Storage.get("RoleCode")};
  $scope.logOutConfirm = function(){
    var myPopup = $ionicPopup.show({
      template: '<center>确定要退出登录吗?</center>',
      title: '退出',
      //subTitle: '2',
      scope: $scope,
      buttons: [
        {
          text: '确定',
          type: 'button-assertive',
          onTap: function(e) {
            var USERID=Storage.get('USERID');
            Storage.clear();
            Storage.set('USERID',USERID);
            $timeout(function(){
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache();
              $state.go('signIn');
            },100);
          }
        },{ text: '取消',
            type: 'button-calm',
          onTap: function(e) {}
        }
      ]
    });    
  }
}])

//个人信息维护
.controller('myProfileCtrl',['$state','$scope','$ionicHistory','$ionicLoading','UserInfo','Storage',function($state,$scope,$ionicHistory,$ionicLoading,UserInfo,Storage){
  var DictRoles=JSON.parse(Storage.get('DictRoleMatch'));
  var temp={};
  $scope.$on('$ionicView.enter', function(){
    if(temp){
      $scope.$apply(function(){
        $scope.profile = temp;
      })
    }
  });
  $scope.profile={UserName:'',role:'',Occupation:'',Position:'',Affiliation:''};
  $scope.upload = function(profile){
    $ionicLoading.show();
    angular.forEach(DictRoles,function(value,key){
      if(profile.role==value){
        profile.RoleCode = key;
      }
    });
    UserInfo.ModifyUserInfo(Storage.get('USERID'),profile.RoleCode,profile.UserName,profile.Occupation,profile.Position,profile.Affiliation)
    .then(function(data){
      $ionicLoading.hide();
      temp={UserName:profile.UserName,role:profile.role,Occupation:profile.Occupation,Position:profile.Position,Affiliation:profile.Affiliation};
      $ionicLoading.show({template:'修改成功',noBackdrop:true,duration:1500});
      // $scope.logStatus="修改成功";
    },function(err){
      $scope.logStatus="修改失败";
    })    
  }
  $ionicLoading.show();
  UserInfo.GetModifyUserInfo(Storage.get('USERID'))
  .then(function(data){
    $ionicLoading.hide();
    // $scope.profile.UserName = data.UserName;
    angular.forEach(DictRoles,function(value,key){
      if(data.RoleCode == key){
        data.role=value;
      }
    })
    delete data['RoleCode'];
    temp = data;
    $scope.profile = data;
  },function(err){
    $ionicLoading.hide();
  });
}])

// --------急救人员-列表、新建、后送 [赵艳霞]----------------
//病人列表(已接收、已后送、已送达)
.controller('AmbulanceListCtrl',['$state','$scope','$ionicLoading','UserInfo','Storage','PatientVisitInfo', '$state', function($state,$scope,$ionicLoading,UserInfo,Storage, PatientVisitInfo, $state){
 
  //根据状态获取不同列表，并控制显示
  var GetPatientsbyStatus = function(Status)
  {
      var promise = PatientVisitInfo.GetPatientsbyStatus(Status); 
      promise.then(function(data)
      { 
         $scope.PatientList = data;
         $scope.$broadcast('scroll.refreshComplete'); 
        },function(err) {   
      });      
  }

  //不同角色，列表跳转不同
  $scope.setCurrent = function(item) {
    Storage.set("PatientID", item.PatientID);  
    Storage.set("VisitNo", item.VisitNo);
    if(Storage.get('RoleCode')=='EmergencyPersonnel')  {
      if($scope.curtab=="tab1"){
        $state.go('visitInfo'); 
      }  
      else {} //$state.go('viewEmergency'); 
    }
    else {
      if(($scope.curtab!="tab1")&&($scope.curtab!="tab2")){
        $state.go('viewEmergency'); 
      }
    }
  };

  //tab选中的控制
  //默认显示 初始化与角色权限相关
  if(Storage.get('RoleCode')=='EmergencyPersonnel'){    
      $scope.tab1_checked=true;  
       $scope.tab2_checked=false;  
       $scope.tab3_checked=false;  
       $scope.curtab="tab1";  
       $scope.tab1_color={color:'blue'};   
       $scope.tab2_color="";  
       $scope.tab3_color="";  
       GetPatientsbyStatus(1);
       $scope.newPatientIcon=true;  
   }
   else if(Storage.get('RoleCode')=='DividePersonnel'){
       $scope.tab1_checked=false;  
       $scope.tab2_checked=true;  
       $scope.tab3_checked=false;  
       $scope.curtab="tab2";  
       $scope.tab1_color="";   
       $scope.tab2_color={color:'blue'};  
       $scope.tab3_color="";  
       GetPatientsbyStatus(2);
       $scope.newPatientIcon=false; 
   }
   else{
       $scope.tab1_checked=false;  
       $scope.tab2_checked=false;  
       $scope.tab3_checked=true;  
       $scope.curtab="tab3";  
       $scope.tab1_color="";   
       $scope.tab2_color="";  
       $scope.tab3_color={color:'blue'};  
       GetPatientsbyStatus(3);
       $scope.newPatientIcon=false; 
   }

 //tab切换列表 显示或隐藏
 $scope.sel_tab = function(vtab) {  
   if($scope.curtab!=vtab) 
   {
    if(vtab=="tab1")  GetPatientsbyStatus(1);
    else if(vtab=="tab2")  GetPatientsbyStatus(2);
    else  GetPatientsbyStatus(3);
   }

   if(vtab=="tab1"){ 
          $scope.tab1_checked=true;  
          $scope.tab2_checked=false;  
          $scope.tab3_checked=false;  
          $scope.curtab="tab1";  
          $scope.tab1_color={color:'blue'};  
          $scope.tab2_color="";  
          $scope.tab3_color="";                   
   }else if (vtab=="tab2"){  
          $scope.tab1_checked=false;  
          $scope.tab2_checked=true;  
          $scope.tab3_checked=false;  
          $scope.curtab="tab2";  
          $scope.tab1_color="";  
          $scope.tab2_color={color:'blue'};  
          $scope.tab3_color="";                 
   }else if (vtab=="tab3"){  
          $scope.tab1_checked=false;  
          $scope.tab2_checked=false;  
          $scope.tab3_checked=true;  
          $scope.curtab="tab3";  
          $scope.tab1_color="";  
          $scope.tab2_color="";  
          $scope.tab3_color={color:'blue'};                  
   }  
     
  };
  
  //下拉刷新
   $scope.refreshList = function() { 
     if($scope.curtab=="tab1")  GetPatientsbyStatus(1);
     else if($scope.curtab=="tab2")  GetPatientsbyStatus(2);
     else  GetPatientsbyStatus(3);
   };

}])

//新建PID
.controller('NewPatientCtrl', ['$scope', '$ionicHistory' ,'PatientInfo','MstType','$ionicLoading','$ionicPopup','Storage','$state', function ($scope, $ionicHistory,PatientInfo,MstType,$ionicLoading,$ionicPopup,Storage,$state) {

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }; 

  $scope.nextStep = function(GetPatientsbyStatus){
      if(Storage.get("PatientID")=="")
      {
        $ionicLoading.show({
          template: "未新建病人ID，不能继续U",
          noBackdrop: true,
          duration: 1000,
        });
      }
    else  $state.go('newVisit');
  }

  
  var GetDefault =function(){    
    Storage.set("PatientID","");  
    Storage.set("VisitNo","");
    $scope.NewPatientID={"PatientID":""};

    var promise_NewPatient = PatientInfo.GetNewPatientID();  //获取推荐PID
     promise_NewPatient.then(function(data)
     { 
       $scope.NewPatientID.PatientID= data.PatientID;
       
      },function(err) {   
     }); 

     // 获取血型类型
     var promise_BloodType = MstType.GetMstType('BloodType');
     promise_BloodType.then(function(data)
     { 
       $scope.BloodTypes = data;
       },function(err) {   
     });      

     //获取性别
     var promise_Gender = MstType.GetMstType('Gender');
     promise_Gender.then(function(data)
     { 
       $scope.Genders = data;
      },function(err) {   
    });      
        
    //获取部别
     var promise_Troop = MstType.GetMstType('Troop');
     promise_Troop.then(function(data)
     { 
       $scope.Troops = data;
      },function(err) {   
    });      
     
     //获取职位
     var promise_JOB = MstType.GetMstType('JOB');
     promise_JOB.then(function(data)
     { 
       $scope.JOBs = data;
      },function(err) {   
    });      
  
     //获取头衔
     var promise_Rank = MstType.GetMstType('Rank');
     promise_Rank.then(function(data)
     { 
       $scope.Ranks = data;
      },function(err) {   
    }); 
  }
    
  GetDefault(); //加载页面默认参数     

  //检查新建的PID是否重复,不重复则弹出确认框
  $scope.SaveNewPatientID = function() {
    if($scope.NewPatientID.PatientID==""){
      $ionicLoading.show({
        template: "病人ID不能为空",
        noBackdrop: true,
        duration: 1000,
      });
    }
    else{
      var promise_CheckPatientID = PatientInfo.CheckPatientID( $scope.NewPatientID.PatientID);
      promise_CheckPatientID.then(function(data)
       { 
          if(data.result=="病人Id不存在"){
             showConfirm();
          }
          else{
            $ionicLoading.show({
              template: "该病人ID已存在，请重新输入",
              noBackdrop: true,
              duration: 1000,
            });
          }
        },function(err) {   
      }); 
    } //else end
  }  

   $scope.BasicInfo={}; //提交的容器初始化
   //新建患者确认框
   var showConfirm = function() {
      $scope.confirmPopup = $ionicPopup.confirm({
         title: '确认提交?',
         template: '您新建患者的PID是  '+$scope.NewPatientID.PatientID,
         scope: $scope,
         buttons: [
            {text: '提交',
             type: 'button-assertive',
           　onTap: function(e) {
               sendData = {
                "PatientID": $scope.NewPatientID.PatientID,
                "PatientName": $scope.BasicInfo.PatientName,
                "Gender":  $scope.BasicInfo.Gender,
                "Age": $scope.BasicInfo.Age,
                "DOB": $scope.BasicInfo.DOB,
                "BloodType": $scope.BasicInfo.BloodType,
                "Allergy": $scope.BasicInfo.Allergy,
                "ImageID": $scope.BasicInfo.ImageID,
                "TroopType": $scope.BasicInfo.Troop,
                "Job": $scope.BasicInfo.JOB,
                "Rank": $scope.BasicInfo.Rank,
                'UserID':'',
                'TerminalName':"",
                "TerminalIP": ""
              }
            var promise =  PatientInfo.SetPatientInfo(sendData);
            promise.then(function(data){ 
                  if(data.result=="数据插入成功"){
                    //console.log($scope.NewPatientID.PatientID);
                    Storage.set("PatientID", $scope.NewPatientID.PatientID); //Storage存入PatientID
                    $ionicLoading.show({
                       template: "保存成功",
                       noBackdrop: true,
                      duration: 1000,
                    });
                  }//if end 
                },function(err) {  
                   $ionicLoading.show({
                     template:"保存失败" , //err.data.result
                     noBackdrop: false,
                     duration: 1000,
                     hideOnStateChange: true
                   }); 
            }); //promise end
          } //onTap end
        },{
            text: '<b>取消</b>',
            type: 'button-positive',
         }]
      });
   }
                   
}])

//新建VID
.controller('NewVisitCtrl', ['$scope', '$ionicHistory', '$http','$ionicPopup' ,'PatientVisitInfo', '$ionicLoading','MstType','Storage','PatientInfo', 'Common', function ($scope, $ionicHistory,$http,$ionicPopup,PatientVisitInfo, $ionicLoading,MstType,Storage, PatientInfo, Common) {

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  
  //获取推荐VID
  var GetNewVisitNo= function(patientID)
  {
     var promise = PatientVisitInfo.GetNewVisitNo(patientID); 
     promise.then(function(data)
     { 
        $scope.NewVisitNo = data;
        },function(err) {   
     });      
  }

  //获取病人基本信息
  var GetPsPatientInfo= function(strPatientID)
  {
     var promise = PatientInfo.GetPsPatientInfo(strPatientID); 
     promise.then(function(data)
     { 
       $scope.Patient = data;
      },function(err) {   
    });      
  }

  //获取病人基本信息
  $scope.$on('$ionicView.enter', function() { 
      GetNewVisitNo(Storage.get("PatientID"));
      GetPsPatientInfo(Storage.get("PatientID")); 
  }); 

  $scope.visitInfo={"InjuryArea": "", "InjuryDateTime": new Date(Common.DateTimeNow().fullTime), "VisitDateTime": new Date(Common.DateTimeNow().fullTime)};

  //保存确认框
  $scope.showConfirm = function() {
  
    $scope.confirmPopup = $ionicPopup.confirm({
           title: '确认提交?',
           template: '请确认就诊编号为'+$scope.NewVisitNo.VisitNo,
           scope: $scope,
           buttons: [
              {text: '提交',
               type: 'button-assertive',
             　onTap: function(e) {
                 var sendData = {
                  "PatientID": Storage.get("PatientID"),
                  "VisitNo":  $scope.NewVisitNo.VisitNo,
                  "Status": "1",
                  "DeviceID": "",  //暂时留空
                  "InjuryArea": $scope.visitInfo.InjuryArea, 
                  "InjuryAreaGPS": "",
                  "InjuryDateTime": $scope.visitInfo.InjuryDateTime, //"9999-12-31 23:59:59"
                  "VisitDateTime": $scope.visitInfo.VisitDateTime, //"2016-03-07 19:07:19"
                  "EvaDateTime": new Date("9999-12-31 23:59:59"),
                  "EvaBatchNo": "",
                  "EvaDestination": "",
                  "EvaTransportation": "",
                  "EvaPosition": "",
                  "ArriveDateTime": new Date("9999-12-31 23:59:59"),
                  "ArrivePlace": "",
                  "TriageDateTime": new Date("9999-12-31 23:59:59"),
                  "TriageToDept": "",
                  "UnitCode": "",
                  "UserID": "",
                  "TerminalName": "",
                  "TerminalIP": ""
                }
              //console.log(sendData);
              var promise =  PatientVisitInfo.SetPsPatientVisitInfo(sendData);
              promise.then(function(data){ 
                  if(data.result=="数据插入成功"){
                      //Storage存入VisitNo
                      Storage.set("VisitNo",$scope.NewVisitNo.VisitNo); 
                      $ionicLoading.show({
                       template: "保存成功",
                       noBackdrop: true,
                       duration: 700,
                      });
                  }
                },function(err) {  
                   $ionicLoading.show({
                      template: "保存失败",
                     noBackdrop: false,
                     duration: 1000,
                     hideOnStateChange: true
                   }); 
              }); 
            }
          },
          {
              text: '取消',
              type: 'button-positive',
          }]
    });
     
  };
     
  //后送确认框         
    $scope.showreservePop = function() {
      if( (Storage.get("VisitNo")!='') && (Storage.get("PatientID")!=''))
      {
            var myPopup = $ionicPopup.show({
               templateUrl: 'templates/ambulance/evacuation.html',
               title: '后送操作',
               scope: $scope,
               buttons: [
                  {text: '确定',
                   type: 'button-assertive',
                 　onTap: function(e) {
                      Evacuation();
        　　　　    }
                   },{
                   text: '取消',
                   type: 'button-positive',
               }]
           });

      }
      else
      {
        $ionicLoading.show({
           template: '请先保存就诊记录',
           noBackdrop: false,
           duration: 1000,
           hideOnStateChange: true
        });

      }
   }

      //后送操作
     $scope.evacuationInfo={"EvaDateTime": new Date(Common.DateTimeNow().fullTime), "EvaBatchNo":"", "EvaDestination":"",  "EvaTransportation":"",  "EvaPosition":""};
     var Evacuation= function()
     {

        var sendData={
          "PatientID": Storage.get("PatientID"),
          "VisitNo": Storage.get("VisitNo"),
          "Status": "2",
          "EvaDateTime": $scope.evacuationInfo.EvaDateTime,
          "EvaBatchNo": $scope.evacuationInfo.EvaBatchNo,
          "EvaDestination": $scope.evacuationInfo.EvaDestination,
          "EvaTransportation": $scope.evacuationInfo.EvaTransportation,
          "EvaPosition": $scope.evacuationInfo.EvaPosition,
          "UserID": "",
          "TerminalName": "",
          "TerminalIP": ""
        }
        console.log(sendData);
       var promise =  PatientVisitInfo.UpdateEva(sendData); 
       promise.then(function(data){ 
          if(data.result=="数据插入成功"){
            $ionicLoading.show({
              template: "后送完成！",
              noBackdrop: false,
              duration: 1000,
              hideOnStateChange: true
            });
            setTimeout(function(){
              $state.go('ambulance.list'); //回主页
            },600);
          }
         },function(err) {   
       }); 
     } 
     

     //后送选项加载
     //后送批次
     var promise_EVABatchNos = MstType.GetMstType('EVABatchNo');
      promise_EVABatchNos.then(function(data)
         { 
           $scope.EVABatchNos = data;
          },function(err) {   
      }); 

     //后送方式
     var promise_EvaTransportation= MstType.GetMstType('EvaTransportation');
     promise_EvaTransportation.then(function(data)
     { 
        $scope.EvaTransportations = data;
        },function(err) {   
     });      

    //后送体位
     var promise_EvaPosition = MstType.GetMstType('EvaPosition');
     promise_EvaPosition.then(function(data)
     { 
        $scope.EvaPositions = data;
       },function(err) {   
     });      

     //后送地点 必须
     var promise = MstType.GetMstType('EvaDestination');
     promise.then(function(data)
     { 
       $scope.EvaDestinations = data;
      },function(err) {   
    });      

}])

//查看或编辑病人基本信息
.controller('PatientInfoCtrl', ['$scope', '$ionicHistory' ,'PatientInfo','MstType','$ionicLoading','$ionicPopup','Storage','$state', function ($scope, $ionicHistory,PatientInfo,MstType,$ionicLoading,$ionicPopup,Storage,$state) {

  $scope.goBack = function() {
    $ionicHistory.goBack();
  }; 

  //获取下拉框选项
  var GetDefault =function(){    

     // 获取血型类型
     var promise_BloodType = MstType.GetMstType('BloodType');
     promise_BloodType.then(function(data)
     { 
       $scope.BloodTypes = data;
       },function(err) {   
     });      

     //获取性别
     var promise_Gender = MstType.GetMstType('Gender');
     promise_Gender.then(function(data)
     { 
       $scope.Genders = data;
      },function(err) {   
    });      
        
    //获取部别
     var promise_Troop = MstType.GetMstType('Troop');
     promise_Troop.then(function(data)
     { 
       $scope.Troops = data;
      },function(err) {   
    });      
     
     //获取职位
     var promise_JOB = MstType.GetMstType('JOB');
     promise_JOB.then(function(data)
     { 
       $scope.JOBs = data;
      },function(err) {   
    });      
  
     //获取头衔
     var promise_Rank = MstType.GetMstType('Rank');
     promise_Rank.then(function(data)
     { 
       $scope.Ranks = data;
      },function(err) {   
    }); 
  }
    
  GetDefault(); //加载页面默认参数     
  
  $scope.BasicInfo={};
  //获取已经保存的信息并展示
  var promise_PatientInfo = PatientInfo.GetPsPatientInfo(Storage.get("PatientID")); 
  promise_PatientInfo.then(function(data)
  { 
     $scope.BasicInfo = data;
    },function(err) {   
  });

   //修改患者基本信息确认框
   $scope.showConfirm = function() {
      $scope.confirmPopup = $ionicPopup.confirm({
         title: '确认提交?',
         template: '确定修改患者基本信息',
         scope: $scope,
         buttons: [
            {text: '提交',
             type: 'button-assertive',
           　onTap: function(e) {
               sendData = {
                "PatientID": Storage.get("PatientID"),
                "PatientName": $scope.BasicInfo.PatientName,
                "Gender":  $scope.BasicInfo.Gender,
                "Age": $scope.BasicInfo.Age,
                "DOB": $scope.BasicInfo.DOB,
                "BloodType": $scope.BasicInfo.BloodType,
                "Allergy": $scope.BasicInfo.Allergy,
                "ImageID": $scope.BasicInfo.ImageID,
                "TroopType": $scope.BasicInfo.Troop,
                "Job": $scope.BasicInfo.JOB,
                "Rank": $scope.BasicInfo.Rank,
                'UserID':$scope.BasicInfo.UserID,
                'TerminalName':"",
                "TerminalIP": ""
              }
            var promise =  PatientInfo.SetPatientInfo(sendData);
            promise.then(function(data){ 
                  if(data.result=="数据插入成功"){

                    $ionicLoading.show({
                       template: "保存成功",
                       noBackdrop: true,
                      duration: 1000,
                    });
                  }//if end 
                },function(err) {  
                   $ionicLoading.show({
                     template:"保存失败" , //err.data.result
                     noBackdrop: false,
                     duration: 1000,
                     hideOnStateChange: true
                   }); 
            }); //promise end
          } //onTap end
        },{
            text: '<b>取消</b>',
            type: 'button-positive',
         }]
      });
   }
                   
}])

//查看或编辑病人就诊记录
.controller('VisitInfoCtrl', ['$scope', '$ionicHistory', '$http','$ionicPopup' ,'PatientVisitInfo', '$ionicLoading','MstType','Storage','PatientInfo','Common', function ($scope, $ionicHistory,$http,$ionicPopup,PatientVisitInfo, $ionicLoading,MstType,Storage, PatientInfo, Common) {

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  

  //获取病人基本信息
  var GetPatientbyPID= function(strPatientID)
  {
    var promise_PatientInfo = PatientInfo.GetPsPatientInfo(Storage.get("PatientID")); 
    promise_PatientInfo.then(function(data)
    { 
        $scope.GetPatientbyPID = data;
      },function(err) {   
    });
  }
  //获取病人已填就诊信息
  var GetPatientVisitInfo= function(strPatientID, strVisitNo)
  {
     var promise = PatientVisitInfo.GetPatientVisitInfo(strPatientID, strVisitNo); 
     promise.then(function(data)
     { 
       $scope.visitInfo = data;
       $scope.visitInfo.InjuryDateTime =new Date($scope.visitInfo.InjuryDateTime);
       $scope.visitInfo.VisitDateTime =new Date($scope.visitInfo.VisitDateTime);
      },function(err) {   
    });      
  }

  $scope.$on('$ionicView.enter', function() { 
      GetPatientbyPID(Storage.get("PatientID")); 
      GetPatientVisitInfo(Storage.get("PatientID"), Storage.get("VisitNo"));
  }); 

  //$scope.visitInfo={"InjuryArea": "", "InjuryDateTime": new Date(), "VisitDateTime": new Date()};
  //保存确认框
  $scope.showConfirm = function() {
    $scope.confirmPopup = $ionicPopup.confirm({
           title: '确认提交?',
           template: '请确认',
           scope: $scope,
           buttons: [
              {text: '提交',
               type: 'button-assertive',
             　onTap: function(e) {
                 var sendData = {
                  "PatientID": Storage.get("PatientID"),
                  "VisitNo":  Storage.get("VisitNo"),
                  "Status": "1",
                  "DeviceID": "",  //暂时留空
                  "InjuryArea": $scope.visitInfo.InjuryArea, 
                  "InjuryAreaGPS": "",
                  "InjuryDateTime":$scope.visitInfo.InjuryDateTime,
                  "VisitDateTime": $scope.visitInfo.VisitDateTime, 
                  "EvaDateTime": "2016-03-07 19:07:19",
                  "EvaBatchNo": "",
                  "EvaDestination": "",
                  "EvaTransportation": "",
                  "EvaPosition": "",
                  "ArriveDateTime": new Date("9999-12-31 23:59:59"),
                  "ArrivePlace": "",
                  "TriageDateTime": new Date("9999-12-31 23:59:59"),
                  "TriageToDept": "",
                  "UnitCode": "",
                  "UserID": "",
                  "TerminalName": "",
                  "TerminalIP": ""
                }
              var promise =  PatientVisitInfo.UpdateInjury(sendData);
              promise.then(function(data){ 
                  if(data.result=="数据插入成功"){
                      $ionicLoading.show({
                       template: "保存成功",
                       noBackdrop: true,
                       duration: 700,
                      });
                  }
                },function(err) {  
                   $ionicLoading.show({
                      template: "保存失败",
                     noBackdrop: false,
                     duration: 1000,
                     hideOnStateChange: true
                   }); 
              }); 
            }
          },
          {
              text: '取消',
              type: 'button-positive',
          }]
    });
     
  };
     
  //后送确认框         
  $scope.showreservePop = function() {
      if( (Storage.get("VisitNo")!='') && (Storage.get("PatientID")!=''))
      {
            var myPopup = $ionicPopup.show({
               templateUrl: 'templates/ambulance/evacuation.html',
               title: '后送操作',
               scope: $scope,
               buttons: [
                  {text: '确定',
                   type: 'button-assertive',
                 　onTap: function(e) {
                      Evacuation();
        　　　　    }
                   },{
                   text: '取消',
                   type: 'button-positive',
               }]
           });

      }
      else
      {
        $ionicLoading.show({
           template: '请先保存就诊记录',
           noBackdrop: false,
           duration: 1000,
           hideOnStateChange: true
        });

      }
  }

    //后送操作
  $scope.evacuationInfo={"EvaDateTime": new Date(Common.DateTimeNow().fullTime), "EvaBatchNo":"", "EvaDestination":"",  "EvaTransportation":"",  "EvaPosition":""};
     var Evacuation= function()
     {

        var sendData={
          "PatientID": Storage.get("PatientID"),
          "VisitNo": Storage.get("VisitNo"),
          "Status": "2",
          "EvaDateTime": $scope.evacuationInfo.EvaDateTime,
          "EvaBatchNo": $scope.evacuationInfo.EvaBatchNo,
          "EvaDestination": $scope.evacuationInfo.EvaDestination,
          "EvaTransportation": $scope.evacuationInfo.EvaTransportation,
          "EvaPosition": $scope.evacuationInfo.EvaPosition,
          "UserID": "",
          "TerminalName": "",
          "TerminalIP": ""
        }
     var promise =  PatientVisitInfo.UpdateEva(sendData); 
     promise.then(function(data){ 
        if(data.result=="数据插入成功"){
          $ionicLoading.show({
            template: "后送完成！",
            noBackdrop: false,
            duration: 1000,
            hideOnStateChange: true
          });
          setTimeout(function(){
            $state.go('ambulance.list'); //回主页
          },600);
        }
       },function(err) {   
     }); 
   } 
     

   //后送选项加载
   //后送批次
   var promise_EVABatchNos = MstType.GetMstType('EVABatchNo');
    promise_EVABatchNos.then(function(data)
       { 
         $scope.EVABatchNos = data;
        },function(err) {   
    }); 

   //后送方式
   var promise_EvaTransportation= MstType.GetMstType('EvaTransportation');
   promise_EvaTransportation.then(function(data)
   { 
      $scope.EvaTransportations = data;
      },function(err) {   
   });      

  //后送体位
   var promise_EvaPosition = MstType.GetMstType('EvaPosition');
   promise_EvaPosition.then(function(data)
   { 
      $scope.EvaPositions = data;
     },function(err) {   
   });      

   //后送地点 必须
   var promise = MstType.GetMstType('EvaDestination');
   promise.then(function(data)
   { 
     $scope.EvaDestinations = data;
    },function(err) {   
  });      

}])

// --------急救人员-伤情与处置 [马志彬]----------------
//伤情、处置记录

//生理参数采集


// --------分流人员-列表、信息查看、分流 [张亚童]----------------
//信息查看
.controller('ViewEmergencyCtrl', ['$scope', '$ionicHistory', '$http','$ionicPopup' ,'$ionicLoading','Storage','MstType', 'PatientInfo', 'VitalSignInfo', 'EmergencyInfo','PatientVisitInfo', 'Common', function ($scope, $ionicHistory,$http,$ionicPopup, $ionicLoading, Storage, MstType, PatientInfo, VitalSignInfo, EmergencyInfo, PatientVisitInfo, Common) {
  
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }; 

   //已后送与已送达的控制

   // 读入病人基本信息
  var promise = PatientInfo.GetPsPatientInfo(Storage.get("PatientID"));
  promise.then(function(data){
    $scope.PatientInfos = data;
  }, function(err){
    // 无错误读入处理
  });

  // 读入病人生理体征参数信息
  var promise = VitalSignInfo.GetVitalSignInfos(Storage.get("PatientID"), Storage.get("VisitNo"));
  promise.then(function(data){
    $scope.VitalSignInfos = data;
    // console.log($scope.VitalSignInfos);
  }, function(err){
    // 无错误读入处理
  });

  // 读入病人伤情/处置信息
  var promise = EmergencyInfo.GetEmergencyInfos(Storage.get("PatientID"), Storage.get("VisitNo"));
  promise.then(function(data){
    $scope.EmergencyInfos = data;
    // console.log($scope.EmergencyInfos);
  }, function(err){
    // 无错误读入处理
  });

  // 读入分诊去向字典表
  var promise = MstType.GetMstType("TriageDept");
  promise.then(function(data){
    $scope.TriageDepts = data;
  }, function(err){
    // 无错误读入处理
  });

  $scope.TriageDate = {"TriageDateTime":"", "TriageToDept":""};

  //分诊popup的弹出
  $scope.triagePopup = function(){
    //分诊时间
    $scope.TriageDate.TriageDateTime=new Date(Common.DateTimeNow().fullTime);

    var Popup_triage = $ionicPopup.show({
      templateUrl : 'triage.html',
      scope : $scope,
      title : '分诊' ,
      buttons : [
        { text:'确定',
          type:'button-assertive',
          onTap: function(){

          // 插入病人分诊信息
          var promise = PatientVisitInfo.UpdateTriage( Storage.get("PatientID"), Storage.get("VisitNo"), "4", $scope.TriageDate.TriageDateTime, $scope.TriageDate.TriageToDept);
          promise.then(function(data){
            if(data.result=="数据插入成功"){
              $ionicLoading.show({
                template: '分诊成功',
                duration:1000
              });
              // $state.go('Injurylist');
            }
          }, function(err){
            // 无错误处理
          });
          }
        },{ text:'取消' ,
          type:'button-positive'
        }
      ]
    });
  };
 
}])

;