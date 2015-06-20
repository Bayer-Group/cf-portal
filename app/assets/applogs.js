$(document).ready(function () {
    $.ajax({
        url: '/rest/apps/'+GetUrlValue('name')+'/logs',
        success: function (data) {
                var logs = $("#logs");
                var tablePanel = $('<div class="panel panel-default">');

              var table = $('<div class="panel-heading">Recent Logs</div>');
                addBody(table, data);

                tablePanel.append(table);
                logs.html(tablePanel);
        }
    });

    function GetUrlValue(VarSearch) {
        var SearchString = window.location.search.substring(1);
        var VariableArray = SearchString.split('&');
        for (var i = 0; i < VariableArray.length; i++) {
            var KeyValuePair = VariableArray[i].split('=');
            if (KeyValuePair[0] == VarSearch) {
                return KeyValuePair[1];
            }
        }
    }

    function addBody(table, data) {
        var tableBody = $('<ul class="list-group">');
        table.append(tableBody);

        if (!data || data.length === 0)
        {
            var li = $('<li class="list-group-item">');

            var li1 = $("<li/>");
            li1.text("No logs in past 1 hour");
            li.append(li1);

            tableBody.append(li);
        }
        else {
            _.each(data,
                function (log) {
                    var li = $('<li class="list-group-item">');

                    var li1 = $("<li/>");
                    li1.text(log.timestamp + " [" + log.sourcename + "/" + log.sourceid + "] " + log.messageType + " " + log.message);
                    li.append(li1);

                    tableBody.append(li);
                }
            );
        }

    }
});







