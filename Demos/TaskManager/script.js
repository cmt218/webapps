//Cole Tomlinson
function waiting(a) {
              if(a.value=="Waiting For" || a.value=="Talk To"){
                $("#secret").html("Detail:<input type='text' id='detail'/>");
              }
              else{
                $("#secret").html("");
              }
          }

        function displayList(lst) {
              var ptable = $("tbody");
              ptable.html("");
              for (p in lst) {
                var person = lst[p];
                ptable.append("<tr><td><input type='checkbox' id='" + person.id + "'/></td><td>" + person.task + "</td><td>" + person.type + "</td><td>" + person.date + "</td></tr>");   
              }
          }
          

            function deleteTasks() {
              // Retrieve all the checkboxes
              var checkedboxes = $("input[type=checkbox]");
              var dlist = [];
              // Push the id onto the list only if the checkbox is checked
              checkedboxes.each( function(index, ele) { if (ele.checked) dlist.push($(ele).prop("id")); });
              $.ajax(
                "http://localhost:3000/delete",
                {
                  type: "POST",
                  processData: true,
                  data: { xlist:dlist },
                  dataType: "json",
                  success: function (result) {
                      displayList(result);
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error: " + jqXHR.responseText);
                    alert("Error: " + textStatus);
                    alert("Error: " + errorThrown);
                  }
                }
              );
            }
            
            function addTask() {
              var additional = "";

              if($("#detail").val() != "undefined"){
                additional = ": " + $("#detail").val();
              }

              $.ajax(
                "http://localhost:3000/add",
                {
                  type: "POST",
                  processData: true,
                  data: { task: $("#task").val(), date:$("#date").val(), type: ($("#type").val() + additional) },
                  dataType: "json",
                  success: function (result) {
                    displayList(result);
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error: " + jqXHR.responseText);
                    alert("Error: " + textStatus);
                    alert("Error: " + errorThrown);
                  }
                }
              );
              // Blank out the form fields
              $("#task").val("");
              $("#date").val("");
            }

            $(function() {
               $.ajax(
                 "http://localhost:3000/load",
                 {
                   type: "GET",
                   processData: false,
                   dataType: "json",
                   success: function (result) {
                     displayList(result);
                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                     alert("Error: " + jqXHR.responseText);
                     alert("Error: " + textStatus);
                     alert("Error: " + errorThrown);
                   }
                 }
               );
            });

            $( function() {
              $( "#date" ).datepicker();
            });