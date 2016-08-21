$(document).ready(function() {

    //event listeners
    $('#submitTask').on("click", postData);
    $('#TasksTable').on("click", ".delete", deleteData);
    $('#TasksTable').on("click", ".update", updateData);

}); //end doc ready

// ********************************************** //
// CRUD STRUCTURE - Create Read Update and Delete //
// ********************************************** //

// AJAX DELETE request, .attr()
function deleteData() {

    var deletedData = $(this).attr("id");

    $.ajax({
        type: 'DELETE',
        url: '/newtask/' + deletedData, //dynamically created url

        success: function() {
            console.log('Success /DELETE! Deleted: ', deletedData);
            $('#tasksTable').empty();
            getData();
        },

        error: function() {
            console.log('AJAX Error using deleteData function in clientapp!');
        }
    });
}

// AJAX PUT request, .serializeArray(), $.each
function updateData() {
    var updateTask = {}; //initialize catch all object
    var inputs = $(this).parent().childern().serializeArray(); // ?? more reseach needed

    $.each(inputs, function(i, field) { // and what is this?
        updateTask[field.name] = field.value;
    });

    // get info in console
    console.log("clientapp.js function 'updateData' accessing:", updateTask);

    //finds submit button's appened id refrencing rowValue.id
    var updatedData = $(this).parent().attr('id');

    $.ajax({
        type: 'PUT',
        url: '/newtask/' + updatedData,
        data: updateTask,
        success: function() {
            console.log('Success /PUT! Updated: ', updatedData);
            $('#tasksTable').empty();
            getData();
        },
        error: function() {
            console.log('AJAX Error using updateData function in clientapp!');
        }
    });
}

// AJAX POST request, event.preventDefault, $.each on form, .serializeArray()
function postData() {
    event.preventDefault();

    var postNewData = {};
    // var taskID = $('#').val();
    // todolist.id = taskID;

    $.each($('#dataForm').serializeArray(), function(i, field) {
        postNewData[field.name] = field.value;
    });

    $.ajax({
        type: 'POST',
        url: '/newtask',
        data: postNewData,
        success: function() {
            console.log('Success /POST! Posted: ', postNewData);
            $('#tasksTable').empty();
            getData();
        },
        error: function() {
            console.log('AJAX Error using postData function in clientapp!', postData);
        }
    });
}

// AJAX GET request, .forEach(), .val(), append data
function getData() {
    $.ajax({
        type: 'GET',
        url: '/newtask',
        success: function(data) {
            console.log('Success /GET! Got: ', data);

            // data.forEach
            data.forEach(function(rowData, i) {
                var $el = $('<div id="' + rowData.id + '"></div>'); // append unique ids

                // array to hold database column names
                var dataTable = ['id', 'newItem', 'completedItem'];
                //forEach within forEach
                dataTable.forEach(function(property) {

                    var $input = $('<input type="text" id="' + property + '"name="' + property + '" />');
                    $input.val(rowData[property]);
                    $el.append($input);
                });

                //append the buttons to the DOM
                $el.append('<button id=' + rowData.id + ' class="update">Update</button>');
                $el.append('<button id=' + rowData.id + ' class="delete">Delete</button>');

                $('#tasksTable').append($el); // table on html to append to
            });
        },
        error: function() {
            console.log('AJAX Error using getData function in clientapp! No data could be retrieved!');
        }
    });
}
