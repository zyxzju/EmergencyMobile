angular.module('filters', [])
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