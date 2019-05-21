console.log('Client-side code running');


var button = document.getElementById('submitDetails');

  button.addEventListener('click', function(e) {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var phone = document.getElementById('phone').value;
  console.log("name:", name);
  var data = {"name":name, "email":email, "password":password, "phone":phone};
  console.log("data = ",data);

  if (name == ""||email == ""||password == ""||phone == "") {
    document.getElementById("error_msg").innerHTML="<span class='err_1'>*please enter all feilds</span>";
    return false;
  }

  



  fetch('createUser', {method: 'POST',headers: {'Accept': 'application/json, text/plain, */*',
         'Content-Type': 'application/json'},dataType:'json', body:JSON.stringify(data)})

    .then(function(response) {
          return response.json();
    })   
     
      .then(function(myJson){
        console.log('response:',JSON.stringify(myJson));
        var res = JSON.stringify(myJson);
        var x = JSON.parse(res);
        console.log('x.message',x.message);
        document.getElementById("error_msg").innerHTML = x.message;
        if(x.status===200)
        {
          document.getElementById("error_msg").innerHTML = "<span class='err_2'>"+x.message+"</span>";
           load_users();

          return;
        }
        else{
          document.getElementById("error_msg").innerHTML = "<span class='err_3'>"+x.message+"</span>";
        }
        
      })
      
      .catch(function(error) {
          console.log(error);
          throw new Error('Request failed.');
      });
  });


  function load_users(){
  // var get_users = document.getElementById('getDetails');
 
    fetch('getUsers', {method:'GET'})
      .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
      })
      
        .then(function(myJson){
            var res = JSON.stringify(myJson);
            var result = JSON.parse(res);
            var users='';
            console.log(result)
             users+="<table class='table table-bordered' ><tr><th>ID</th><th>name</th><th>email</th><th>mobile</th><th>password</th><th>View</th><th>Delete</th></tr>";
            for(var i=0;i<result.data.length;i++)
            { 
              users+="<tr><td>"+result.data[i]._id+"</td><td>"+result.data[i].name+"</td><td>"+result.data[i].email+"</td><td>"+result.data[i].phone+"</td><td>"+result.data[i].password+"</td><td><a class=\"btn btn-info\" href=\"view_user.html?id="+result.data[i]._id+"\">view</a></td><td><a class=\"btn btn-danger remove\" onclick=\"delete_users('"+result.data[i].phone+"')\"> <span  class=\"glyphicon glyphicon-trash\"></span></a></td></tr>";
                                                                                                                                                                                                                                                                                                             
            }
                document.getElementById("users_data").innerHTML = users;
  
        }) 
        .catch(function(error) {
        console.log(error);
        });
  };
    load_users();

  function delete_users(phone) {
    var data = {phone:phone};
    console.log(data);
    var x = confirm("Are you sure you want to delete?");
    if (x) {
      fetch('deleteUser', {method: 'POST',headers: {'Accept': 'application/json, text/plain, */*',
             'Content-Type': 'application/json'},dataType:'json', body:JSON.stringify(data)})
          .then(function(response) {
              return response.json();
        })   
          .then(function(myJson) {
            var res = JSON.stringify(myJson);
            var y = JSON.parse(res);
    
            if(y.status===200) { 
              load_users();
              document.getElementById("error_msg").innerHTML= "<span class='err_4'>"+y.message+"";
              
            } else {
              document.getElementById("error_msg").innerHTML = y.message;
            }
          })
    }
    else {
        return false ;
    }
  };

  





