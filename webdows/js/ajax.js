function serverCall(action, data, fallback) {
    data.action = action;
    $.ajax({
        url: "php/handleAjax.php",
        type: 'POST',
        data: data,
        success: function (response) {
            try {
                fallback(JSON.parse(response));
            } catch (e) {
                return false
            }
        },
        error: function () {
            console.log(arguments);
        }
    });
}