
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

}]);

// --------登录、注册、修改密码、位置选择、个人信息维护 [熊佳臻]----------------
//登录

//注册 

//设置密码

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

