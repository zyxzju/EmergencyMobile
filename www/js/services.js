angular.module('services', ['ionic','ngResource'])

// 客户端配置
.constant('CONFIG', {
  baseUrl: 'http://121.43.107.106:9000/Api/v1/',
  //revUserId: "",
  //TerminalName: "",
  //TerminalIP: "",
  //DeviceType: '1',
})

// 本地存储函数
.factory('Storage', ['$window', function ($window) {
  return {
    set: function(key, value) {
      $window.localStorage.setItem(key, value);
    },
    get: function(key) {
      return $window.localStorage.getItem(key);
    },
    rm: function(key) {
      $window.localStorage.removeItem(key);
    },
    clear: function() {
      $window.localStorage.clear();
    }
  };
}])

//公用函数
.factory('Common', ['Storage', function (Storage) {
return{

    // 获取RevisonInfo信息 Common.postInformation().revUserId
    postInformation:function(){
      var postInformation={};
      if(window.localStorage['UID']==null){
        postInformation.revUserId = 'who'
      }
      else{
        postInformation.revUserId = window.localStorage['UID'];
      }
      
      postInformation.TerminalIP = 'IP';
      if(window.localStorage['TerminalName']==null){
        postInformation.TerminalName = 'which';
      }
      else{
        postInformation.TerminalName = window.localStorage['TerminalName'];
      }
      postInformation.DeviceType = 2;
      return postInformation;
    }

  }
}])

// 数据模型函数, 具有取消(cancel/abort)HTTP请求(HTTP request)的功能
.factory('Data',['$resource', '$q','$interval' ,'CONFIG','Storage' , function($resource,$q,$interval ,CONFIG,Storage){
   var serve={};
   var abort = $q.defer();
   var getToken=function(){
     return Storage.get('TOKEN') ;
   }

   var Users = function(){
      return $resource(CONFIG.baseUrl + ':path/:route',{path:'Users',},{
        LogOn:{method:'POST', params:{route: 'LogOn'}, timeout: 10000},
        Register:{method:'POST', params:{route: 'Register'}, timeout: 10000},
        ChangePassword:{method:'POST',params:{route:'ChangePassword'},timeout: 10000},
        UID:{method:'GET',params:{route:'UID',Type:'@Type',Name:'@Name'},timeout:10000},
      });
    };

    serve.abort = function ($scope) {
    abort.resolve();
    $interval(function () {
      abort = $q.defer();
      serve.Users = Users(); 
      }, 0, 1);
    };
    serve.Users = Users();
    return serve;
}])

//示例
.factory('VitalInfo', ['$q', 'Data', 'extraInfo',function($q, Data, extraInfo){
  var self = this;

  self.PostPatientVitalSigns = function(data){
    var deferred = $q.defer();
    Data.VitalInfo.PostPatientVitalSigns(data,
      function(s){
        deferred.resolve(s);
      },function(e){
        deferred.reject(e);
      });
    return deferred.promise;
  };

  self.VitalSigns = function (UserId,StartDate,EndDate,top,skip) {
    var deferred = $q.defer();
    Data.VitalInfo.VitalSigns({UserId:UserId,StartDate:StartDate,EndDate:EndDate,$top:top,$skip:skip}, function (data, headers) {
      deferred.resolve(data);
      }, function (err) {
      deferred.reject(err);
      });
    return deferred.promise;
  };
  
  self.GetLatestPatientVitalSigns = function (data) {
    var deferred = $q.defer();
    Data.VitalInfo.GetLatestPatientVitalSigns(data, function (data, headers) {
      deferred.resolve(data);
      }, function (err) {
      deferred.reject(err);
      });
    return deferred.promise;
  };
  return self;
}])

//用户基本操作-登录、注册、修改密码、位置选择、个人信息维护 [熊佳臻]

//急救人员-列表、新建、后送 [赵艳霞]

//急救人员-伤情与处置

//分流人员-列表、信息查看、分流



;
