
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

// --------登录、注册、修改密码、位置选择、个人信息维护 [熊佳臻]----------------
//登录
.controller('SignInCtrl',['$state','$scope',function($state,$scope){
  $scope.toRegister = function(){
    $state.go('register');
  }
  $scope.signIn = function(account){
    if(account.username!='' && account.password!=''){
      $state.go('location');
    }else{
      $scope.logStatus="信息不完整"
    }
  }
}])
//注册 
.controller('RegisterCtrl',['$state','$scope',function($state,$scope){
  $scope.register = function(form){
    $scope.logStatus="";
    if(form.account && form.passwd && form.passwd0 && form.realName && form.gender && form.role && form.affiliation && form.position){
      $state.go('location');
    }else{
      $scope.logStatus="请输入完整信息！"
    }
  }
}])
//设置密码
.controller('SetPasswordCtrl',['$scope','$state','$timeout','$ionicHistory', function($scope , $state,$timeout,$ionicHistory){
  $scope.ishide=false;
  $scope.change={oldPassword:"",newPassword:"",confirmPassword:""};
  $scope.passwordCheck = function(change){
    if(change.oldPassword){
        $scope.logStatus1='验证成功';
        $timeout(function(){$scope.ishide=true;} , 500);     
    } 
  }

  $scope.gotoChange = function(change){
    $scope.logStatus2='';
    if((change.newPassword!="") && (change.confirmPassword!="")){
      if(change.newPassword == change.confirmPassword){
          $scope.logStatus2='修改成功';
          $timeout(function(){
            $state.go('ambulance.mine');
          } , 500);
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
.controller('LocationCtrl',['$state','$scope','$rootScope',function($state,$scope,$rootScope){
  $scope.myLocation={
    text:''
  };
  $scope.locationList=[];
  $scope.$on('$ionicView.enter', function() {
    if($rootScope.MY_LOCATION == undefined){
      $scope.isListShown=true;
      console.log('first',$rootScope.MY_LOCATION);
    }else{
      $scope.myLocation=$rootScope.MY_LOCATION;
      $scope.isListShown=false;
      console.log('after',$rootScope.MY_LOCATION);
    }   
  });

  $scope.toggleList = function(){
    $scope.isListShown=!$scope.isListShown;
  }
  $scope.isIconShown = function(){
    return $scope.isListShown?true:false;
  }
  
  for(var i =0;i<5;i++){
    $scope.locationList.push({text:''+i,value:i+'value'});
  }   
  $scope.setLocation = function(){
    $rootScope.MY_LOCATION = $scope.myLocation;
    $scope.isListShown=false;
    $state.go('ambulance.list');
  }
  // $scope.selected = function(location){
  //  $scope.myLocation =$scope.myLocation + location.text +' ';
  //  updateLocation(location.text);
  // }
}])
//设置
.controller('SettingCtrl',['$state','$scope',function($state,$scope){

}])
//个人信息维护


// --------急救人员-列表、新建、后送 [赵艳霞]----------------
//已接收病人列表

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

