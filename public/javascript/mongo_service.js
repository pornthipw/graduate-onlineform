var app = angular.module('mongo_service', ['ngResource']);

var prefix = '/apps/onlineform';
//var prefix = '';


app.factory('Form', function($resource) {
  var Form = $resource(prefix + '/db/form/:id', {    
    id: '@id',    
  },
  {update: { method:'PUT' }});
  return Form;
});
 

app.factory('Student', function($resource) {
    var Student = $resource(
      'http://www.db.grad.nu.ac.th/django/rest/students/:id', 
      {callback:'JSON_CALLBACK'}, 
      {
	'query':  {method:'JSONP', isArray:true},
	'get':  {method:'JSONP'}
      });                         
    return Student;    
});


app.factory('Program', function($resource) {
    var Program = $resource(
      'http://www.db.grad.nu.ac.th/django/rest/programs/:id', 
      {callback:'JSON_CALLBACK'}, 
      {
	'query':  {method:'JSONP', isArray:true},
	'get':  {method:'JSONP'}
      });                         
    return Program;    
});

app.factory('GradStaff', function($resource) {
    var GradStaff= $resource(
      'http://www.db.grad.nu.ac.th/django/rest/gradstaffs/:id', 
      {callback:'JSON_CALLBACK'}, 
      {
	'query':  {method:'JSONP', isArray:true},
	'get':  {method:'JSONP'}
      });                         
    return GradStaff;    
});

app.factory('Staff', function($resource) {
    var Staff= $resource(
      'http://www.db.grad.nu.ac.th/django/rest/staffs/:id', 
      {callback:'JSON_CALLBACK'}, 
      {
	'query':  {method:'JSONP', isArray:true},
	'get':  {method:'JSONP'}
      });                         
    return Staff;    
});












