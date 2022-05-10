$(document).ready(function () {
    startTime();
    updateDate();
    var defaultItems = [
        {
            name: "Test",
            type: "folder"
        }];
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    newWorkspaceItem(defaultItems);
    $("#frame").click(function () {
        $(".active").removeClass("active");
    });
    $(window).resize(function () {
        placeItems();
    });
    $("body").contextmenu(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $("#submitForm").click(function () {
        login($(".loginForm input"));
    });
    $("#register").click(function () {
        $(this).parent().toggleClass("reg");
        $(".loginMail").toggleClass("show");
        $(".loginLogin").select();
    });
    $(".loginForm input").on('keyup', function (e) {
        if (e.keyCode == 13) {
            $("#submitForm").click()
        }
    });
    // checkLoggedIn();
});

function copyToClipboard(string) {
    var input = $("<input>").appendTo("body");
    input.val(string);
    input.select();
    document.execCommand("copy");
    input.remove();
}

function checkLoggedIn() {
    serverCall("checkLogin", {}, handleCheckLogin)
}

function handleCheckLogin(response) {
    (response == "1")? hideLogin() : showLogin();
}

function showLogin() {
    $(".loginBg").fadeIn(200);
}

function hideLogin() {
    $(".loginBg").fadeOut(200);
}

function logout() {
    serverCall("logout", {}, handleLogout)
}

function handleLogout() {
    showLogin();
}

function login(fields) {
    var data, action;
    if($(".reg").length == 0) {
        if($(fields[0]).val() && $(fields[1]).val()) {
            data = {
                login: $(fields[0]).val(),
                password: $(fields[1]).val()
            };
            action = "login";
            serverCall(action, data, handleLogin);
        }
    } else {
        if($(fields[0]).val() && $(fields[1]).val() && $(fields[2]).val()) {
            data = {
                login: $(fields[0]).val(),
                password: $(fields[1]).val(),
                mail: $(fields[2]).val()
            };
            action = "newUser";
            serverCall(action, data, handleRegister);
        }
    }
}

function handleLogin(data) {
    if(parseInt(data.response)) {
        $(".loginForm input").val("");
        $(".loginLogin").select();
        hideLogin();
        loadWorkspaceData();
    } else {
        switch(data.response) {
            case "failed":
                alert("Login failed");
                break;
            case "activate":
                alert("activate");
                break;
        }
    }
}

function handleRegister(data) {
    switch(data.response) {
        case "activate":
            alert("activate");
            break;
        case "format":
            alert("format");
            break;
        case "login":
            alert("Login already in use");
            break;
        case "mail":
            alert("Mail already in use");
            break;
        case "failed":
            alert("Failed");
            break;
    }
}