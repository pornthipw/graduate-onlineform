var app = angular.module('form_file', [
  'mongo_service','$strap.directives']);


app.config(function($routeProvider) {
  
  $routeProvider.when('/list', {
    controller:FormListController,  
    templateUrl:'static/forms/form_list.html'
  });
  
  $routeProvider.when('/forms/:type/:id', {
    controller:FormController, 
    templateUrl:'static/forms/route.html'
  });
  
  $routeProvider.when('/forms', {
    controller:FormCreateController, 
    templateUrl:'static/forms/gs11/form.html'
  });
  
});

function getStudent(id, Student, Program, callback) {
  Student.get({
      id:id,
      fields:JSON.stringify(["id", "prefix_name", "first_name","last_name","status_code"]),
      relations:JSON.stringify(["program"])
    },function(r_student) {      
      Program.get({
          id:r_student.program.id,           
          fields:JSON.stringify(["id", "name","status_desc"]),
          relations:JSON.stringify(["level", "faculty"])
      },function(r_program) {
        r_student.program = r_program;        
        callback(r_student);
      });      
    });
}


function FormController($scope, $routeParams, Form) {  
  
  Form.get({id:$routeParams.id}, function(form)  {    
    $scope.form = form;    
    $scope.templateUrl = 'static/forms/'+$routeParams.type+'/form.html';
  });
}

function FormCreateController($scope, $location, $routeParams, Student, Program, Form) {
  $scope.get_student = function() {
    getStudent($scope.form.student.id, Student, Program, function(r_student) {
      $scope.form.student = r_student;      
    });   
  }
  
  $scope.form = {};
  
  $scope.save = function() {    
    //$scope.dt = new Date();
    $scope.form['currentdate'] = new Date();      
    console.log($scope.form);    
    Form.save({}, $scope.form, function(result) {
        console.log(result);
        $location.path('/list');
    });
    
  }; 
          
}

function FormListController($scope, $location, $routeParams, Student, Program, Form) {
  $scope.form_list = Form.query(function(response) {
    
  });
      
  $scope.get_template = function (id) {
    Form.get({},function(form) {
        var dataUrl = '/form/gs11?form=' + JSON.stringify(form);      
        var link = document.createElement('a');
        angular.element(link).attr('href', dataUrl);
        link.click();        
    });
  }
}

/*
function FormTemplateController($scope, $location, $routeParams, Student, Program, Form) {
  console.log("");
}
*/

