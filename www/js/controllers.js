
angular.module('controllers', ['ionic','ngResource','services'])
.controller('SignInCtrl', ['$scope', 'Storage', function ($scope, Storage) {
  // Storage.set('initState', 'simple.homepage');
   $scope.DeviceID=ionic.Platform.device().uuid; //获取移动设备
}])
.controller('NewPatientCtrl', ['$scope', '$ionicHistory', function ($scope, $ionicHistory) {

  $scope.goBack = function() {
    console.log("1");
    $ionicHistory.goBack();
  };

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
  $scope.logOutConfirm = function(){
    var myPopup = $ionicPopup.show({
      template: '<center>确定要退出登录吗?</center>',
      title: '退出',
      //subTitle: '2',
      scope: $scope,
      buttons: [
        { text: '取消',
          type: 'button-small',
          onTap: function(e) {}
        },
        {
          text: '<b>确定</b>',
          type: 'button-small button-calm ',
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
//已接收病人列表
.controller('AmbulanceListCtrl',['$state','$scope','$ionicLoading','UserInfo','Storage',function($state,$scope,$ionicLoading,UserInfo,Storage){
 
  //tab选中的控制
  //初始化与权限相关
    if(Storage.get('RoleCode')=='EmergencyPersonnel'){    
        $scope.tab1_checked=true;  
         $scope.tab2_checked=false;  
         $scope.tab3_checked=false;  
         $scope.curtab="tab1";  
         $scope.tab1_color={color:'blue'};   
         $scope.tab2_color="";  
         $scope.tab3_color="";  
     }
     else{
         $scope.tab1_checked=false;  
         $scope.tab2_checked=true;  
         $scope.tab3_checked=false;  
         $scope.curtab="tab2";  
         $scope.tab1_color="";   
         $scope.tab2_color={color:'blue'};  
         $scope.tab3_color="";  
     }
 
   $scope.sel_tab = function(vtab) {  
     if(vtab=="tab1"){  
            console.log("------TabController.sel_tab-1");  
            $scope.tab1_checked=true;  
            $scope.tab2_checked=false;  
            $scope.tab3_checked=false;  
            $scope.curtab="tab1";  
            $scope.tab1_color={color:'blue'};  
            $scope.tab2_color="";  
            $scope.tab3_color="";  
               
              
     }else if (vtab=="tab2"){  
            console.log("------TabController.sel_tab-2");  
          $scope.tab1_checked=false;  
            $scope.tab2_checked=true;  
            $scope.tab3_checked=false;  
            $scope.curtab="tab2";  
            $scope.tab1_color="";  
            $scope.tab2_color={color:'blue'};  
            $scope.tab3_color="";                 
     }else if (vtab=="tab3"){  
            console.log("------TabController.sel_tab-3");  
          $scope.tab1_checked=false;  
            $scope.tab2_checked=false;  
            $scope.tab3_checked=true;  
            $scope.curtab="tab3";  
            $scope.tab1_color="";  
            $scope.tab2_color="";  
            $scope.tab3_color={color:'blue'};                  
     }  
       
    };

}])
//新建ID

//后送


// --------急救人员-伤情与处置 [马志彬]----------------
//伤情记录

//生理参数采集

//处置


// --------分流人员-列表、信息查看、分流 [张亚童]----------------
//已后送病人列表

//信息查看

//分流

