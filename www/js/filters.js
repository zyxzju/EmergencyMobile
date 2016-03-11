angular.module('filters', [])
.filter('role', function() {
  return function(input) {
    switch(input)
    {
      case 'DivideLeader':return '分流组长';break;
      case 'DividePersonnel':return '分流人员';break;
      case 'EmergencyPersonnel':return '急救人员';break;

    }
  };
})
.filter('Status', function() {
  return function(input) {
  	switch(input)
  	{
  		case '1':return '已接收';break;
  		case '2':return '已后送';break;
  		case '3':return '已送达';break;
  		case '4':return '已分诊';break;
  	}
  };
})
.filter('sex', function() {
  return function(input) {
  	switch(input)
  	{
  		case '1':return '男';break;
  		case '2':return '女';break;
  		case '0':return '其他';break;

  	}
  };
})