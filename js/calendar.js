$(document).ready(function () {
    "use strict";
    // Log in with AJAX
    $('#login').click(function (event) {
        event.preventDefault();
        var usernameRegEx = /^[A-Za-z0-9_\-]{3,16}$/;
        var passwordRegEx = /^[A-Za-z0-9_\-]{6,18}$/;
        if (!usernameRegEx.test($('#username').val())) {
            alert('Your username is not valid. A valid username is between 3 to 16 characters. Only characters A-Z, a-z, 0-9, "-", and "_" are  acceptable.');
            $('#username').focus();
            return;
        }
        if (!passwordRegEx.test($('#password').val())) {
            alert('Your password is not valid. A valid last name is between 6 to 18 characters. Only characters A-Z, a-z, "_", and "-" are  acceptable.');
            $('#password').focus();
            return;
        }
        // Send login info via AJAX
        $.post("server/login.php", {
            username: $("#username").val(),
            password: $("#password").val()
        }).success(function (data) {
            if (data.error) {
                alert("Error:" + data.error);
                return;
            }
            // After successful login, hide login form and display user info
            $("#login_form").hide();
            $('#user_first_name').html(data.user_first_name);
            $('#user_last_name').html(data.user_last_name);
            $('#user_info').show();
            // Set CSRF token
            $('.token').val(data.token);
            // Display user events
            $('#calendar').fullCalendar('refetchEvents');
        }).fail(function (err) {
            alert("AJAX request failed: " + err.responseJSON.error);
        });
    });
    // Bring up sign up form
    $('#signup').click(function (event) {
        event.preventDefault();
        $('#signup_modal').modal('show');
    });
    // Sign up with AJAX
    $('#signup_form').submit(function (event) {
        event.preventDefault();
        // Validate user inputs
        var usernameRegEx = /^[A-Za-z0-9_\-]{3,16}$/;
        var nameRegEx = /^[A-Za-z\ \'\-]{1,50}$/;
        var passwordRegEx = /^[A-Za-z0-9_\-]{6,18}$/;
        if (!usernameRegEx.test($('#signup_username').val())) {
            alert('Your username is not valid. A valid username is between 3 to 16 characters. Only characters A-Z, a-z, 0-9, "-", and "_" are  acceptable.');
            $('#signup_username').focus();
            return;
        }
        if (!nameRegEx.test($('#signup_first_name').val())) {
            alert('Your first name is not valid. A valid first name is between 1 to 50 characters. Only characters A-Z, a-z, "\'", "-", and " " are  acceptable.');
            $('#signup_first_name').focus();
            return;
        }
        if (!nameRegEx.test($('#signup_last_name').val())) {
            alert('Your last name is not valid. A valid last name is between 1 to 50 characters. Only characters A-Z, a-z, and " " are  acceptable.');
            $('#signup_last_name').focus();
            return;
        }
        if (!passwordRegEx.test($('#signup_password').val())) {
            alert('Your password is not valid. A valid last name is between 6 to 18 characters. Only characters A-Z, a-z, "_", and "-" are  acceptable.');
            $('#signup_password').focus();
            return;
        }
        if ($('#signup_password').val() !== $('#confirm_password').val()) {
            alert('Passwords don\'t match. Please try again!');
            $('#signup_password').focus();
            return;
        }
        // Send signup info via AJAX
        $.post("server/signup.php", {
            username: $("#signup_username").val(),
            first_name: $("#signup_first_name").val(),
            last_name: $("#signup_last_name").val(),
            password: $("#signup_password").val()
        }).success(function (data) {
            if (data.error) {
                alert("Error:" + data.error);
                return;
            }
            $('#signup_modal').modal('hide');
            // After successful login, hide login form and display user info
            $('#login_form').hide();
            $('#user_first_name').html(data.user_first_name);
            $('#user_last_name').html(data.user_last_name);
            $('#user_info').show();
            // Set CSRF token
            $('.token').val(data.token);
            // Display user events
            $('#calendar').fullCalendar('refetchEvents');
        }).fail(function (err) {
            alert("AJAX request failed: " + err.responseJSON.error);
        });
    });
    // Logout
    $('#logout').click(function (event) {
        event.preventDefault();
        $.post('server/logout.php').done(function () {
            // Once logged out, hide and clear user info, and bring back login form
            $("#user_info").hide();
            $('#user_first_name').html('');
            $('#user_last_name').html('');
            $("#login_form").show();
            // Clear CSRF token
            $('.token').val('');
            // Clear all events
            $('#calendar').fullCalendar('refetchEvents');
        });
    });
    // Bring up add event form
    $('#add_event').click(function (event) {
        event.preventDefault();
        $('#add_event_modal').modal('show');
        // Activate date/time picker for event start and end times
        $('.add_event_datetime').datetimepicker({
            dateTimeFormat: 'yyyy-MM-dd hh:mm'
        });
    });
    // Add event
    $('#add_event_form').submit(function (event) {
        event.preventDefault();
        // Validate user inputs
        var titleRegEx = /^[A-Za-z.\ \'\-]{1,50}$/;
        if (!titleRegEx.test($('#add_event_title').val())) {
            alert('Your title is not valid. A valid title is between 1 to 50 characters. Only characters A-Z, a-z, ".", "\'", "-", and " " are  acceptable.');
            $('#add_event_title').focus();
            return;
        }
        // Send event info via AJAX
        $.post('server/add_event.php', {
            title: $("#add_event_title").val(),
            start_time: $("#add_event_start_time").val(),
            end_time: $("#add_event_end_time").val(),
            token: $("#add_event_token").val()
        }).success(function (data) {
            if (data.error) {
                alert("Error:" + data.error);
                return;
            }
            $('#add_event_modal').modal('hide');
            // Refetch user events from database
            $('#calendar').fullCalendar('refetchEvents');
        }).fail(function (err) {
            alert("AJAX request failed: " + err.responseJSON.error);
        });
    });
    // Edit event
    $('#edit_event_form').submit(function (event) {
        event.preventDefault();
        // Validate user inputs
        var titleRegEx = /^[A-Za-z.\ \'\-]{1,50}$/;
        if (!titleRegEx.test($('#edit_event_title').val())) {
            alert('Your title is not valid. A valid title is between 1 to 50 characters. Only characters A-Z, a-z, ".", "\'", "-", and " " are  acceptable.');
            $('#edit_event_title').focus();
            return;
        }
        // Send event info via AJAX
        $.post('server/edit_event.php', {
            id: $("#edit_event_id").val(),
            title: $("#edit_event_title").val(),
            start_time: $("#edit_event_start_time").val(),
            end_time: $("#edit_event_end_time").val(),
            token: $("#edit_event_token").val()
        }).success(function (data) {
            if (data.error) {
                alert("Error:" + data.error);
                return;
            }
            // Refetch user events from database
            $('#calendar').fullCalendar('refetchEvents');
        }).fail(function (err) {
            alert("AJAX request failed: " + err.responseJSON.error);
        });
        // Dismiss edit event form
        $('#edit_event_modal').modal('hide');
    });
    // Initialize calendar with options
    $('#calendar').fullCalendar({
        events: {
            url: 'server/event_feed.php',
            type: 'POST',
            error: function () {
                alert('There was an error while fetching events!');
            }
        },
        // When an event is clicked, bring up edit/delete options
        eventClick: function (calEvent, jsEvent, view) {
            jsEvent = jsEvent;
            view = view;
            var event_id = calEvent.id;
            var event_title = calEvent.title;
            var event_start_time = calEvent.start._i.substr(0, 16);
            var event_end_time = calEvent.end._i;
            $('#edit_delete_event_modal').modal('show');
            // Edit event
            $('#edit_event').click(function (event) {
                event.preventDefault();
                // Dismiss edit/delete options
                $('#edit_delete_event_modal').modal('hide');
                // Bring up edit event form
                $('#edit_event_modal').modal('show');
                // Activate date/time picker for event start and end times
                $('.edit_event_datetime').datetimepicker({
                    dateTimeFormat: 'yyyy-MM-dd hh:mm'
                });
                // Load current event info
                $("#edit_event_id").val(event_id);
                $("#edit_event_title").val(event_title);
                $("#edit_event_start_time").val(event_start_time.substr(4, 20));
                $("#edit_event_end_time").val(event_end_time.substr(4, 20));
            });
            // Delete event
            $('#delete_event').click(function (event) {
                event.preventDefault();
                $.post('server/delete_event.php', {
                    id: event_id,
                    token: $("#add_event_token").val()
                }).success(function (data) {
                    if (data.error) {
                        alert("Error:" + data.error);
                        return;
                    }
                    // Refetch user events from database
                    $('#calendar').fullCalendar('refetchEvents');
                }).fail(function (err) {
                    alert("AJAX request failed: " + err.responseJSON.error);
                });
                // Dismiss edit/delete options
                $('#edit_delete_event_modal').modal('hide');
            });
        },
        aspectRatio: 1.78,
        fixedWeekCount: false
    });
});