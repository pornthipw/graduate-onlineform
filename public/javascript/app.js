var app = angular.module('form_file', [
  'mongo_service','$strap.directives']);

app.filter('external_staff', function() {
  return function(input, key) {
    if(input) {
      var result = [];
      angular.forEach(input, function(v) {
       //console.log(v);
        if(!v.external_staff) {
          result.push(v);
        }
      });
      return result;
    }
  }
});

app.config(function($routeProvider) {
  
  $routeProvider.when('/list', {
    controller:FormListController,  
    templateUrl:'static/forms/form_list.html'
  });
  
  $routeProvider.when('/forms/:type/:id', {
    controller:FormController, 
    templateUrl:'static/forms/route.html'
  });
  
  $routeProvider.when('/forms/:type', {
    controller:FormCreateController, 
    templateUrl:'static/forms/gs11/form.html'
  });
  
  $routeProvider.when('/', {
    controller:MainController, 
    templateUrl:'static/index.html'
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

function MainController($scope, $routeParams) {  
  
}

function FormController($scope, $routeParams, Form) {  
  
  Form.get({id:$routeParams.id}, function(form)  {    
    $scope.form = form;    
    $scope.templateUrl = 'static/forms/'+$routeParams.type+'/form.html';
  });
  
  $scope.download_form = function() {
    //console.log($scope.form._id);
    Form.get({id:$scope.form._id},function(form) {
        var dataUrl = 'form/download?form=' + JSON.stringify(form);      
        var link = document.createElement('a');
        angular.element(link).attr('href', dataUrl);
        link.click();        
    });
  }
}

function FormCreateController($scope, $location, $routeParams, Student, Program, GradStaff, Staff, Form) {
  $scope.get_student = function() {
    getStudent($scope.form.student.id, Student, Program, function(r_student) {
      $scope.form.student = r_student;      
    });   
  }

  GradStaff.query({},function(result){
    $scope.grad_staff = result;
  });
    
  $scope.get_gradstaff = function () {    
    $scope.advisor_list = [];
    //console.log($scope.form.advisor);
    
    angular.forEach($scope.grad_staff, function(staff) {       
      if(staff.first_name.indexOf($scope.form.search_advisor)!=-1 || 
        staff.last_name.indexOf($scope.form.search_advisor)!=-1) {         
        $scope.advisor_list.push(staff);    
      }      
    });    
    //console.log($scope.advisor_list);
  }
    
  $scope.committee = [];
  $scope.add_committee = function(staff) {
    if(staff.selected) {
      GradStaff.get({id:staff.id,
        fields:JSON.stringify(['id','position','first_name','last_name','faculty','work']),
        relations:JSON.stringify(['staff']),      
      },function(res) {
        res['full_name'] = '';
        if(res.position) {
          res['full_name'] = res.position+' ';
        } 
        res['full_name'] += res.first_name + ' '+res.last_name;
        $scope.committee.push(res);        
        if (res.staff['id']) {        
          res.education = {level:''};
          Staff.get({id:res.staff.id,
            relations:JSON.stringify(['education']), 
          },function(s_res) {
            var e_list = ["ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"];
            angular.forEach(s_res.education, function(edu,index) { 
                       
              if(e_list.indexOf(edu['level']) >= e_list.indexOf(res.education['level'])) {
                res.education = edu;
              } 
               
                         
              });                        
          });
        } else {
          res['external_staff'] = true;
          staff['external_staff'] = true;
        }
      });
    } else {
      var m_idx = -1;
      angular.forEach($scope.committee, function(member, idx) {
        if(member.id == staff.id) {
          m_idx = idx;
        }
      });
      if(m_idx != -1) {
        $scope.committee.remove(m_idx);
      }
    }        
  }    
  
  $scope.form = {};
  
  
  $scope.get_committee_info = function(committee) {
    //console.log(committee);
    committee['active_advised'] = 0;
    GradStaff.get({id:committee.id,
        relations:JSON.stringify(['students']),      
      },function(res) { 
        angular.forEach(res.students, function(student){
          if (student.status_code==10 || student.status_code==11) {
              committee.active_advised++;
          } 
        });
        //console.log(res);
    });
  };
  
  $scope.save = function() {        
    $scope.form['type'] = $routeParams.type;
    $scope.form['currentdate'] = new Date();      
    //console.log($scope.form);    
    Form.save({}, $scope.form, function(result) {
        //console.log(result);
        $location.path('/list');
    });
    
  }; 
          
}

function FormListController($scope, $location, $routeParams, Student, Program, Form) {
  $scope.form_list = Form.query(function(response) {
    
  });
      
}

/*
function FormTemplateController($scope, $location, $routeParams, Student, Program, Form) {
  console.log("");
}
*/



Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

