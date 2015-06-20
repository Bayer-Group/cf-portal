$(document).ready(function () {
    $.ajax({
        url: '/rest/apps/'+GetUrlValue('name')+'/events/',
        success: function (data) {
            var events = $("#events");
            var tablePanel = $('<div class="panel panel-default">');

            tablePanel.append($('<div class="panel-heading">Recent Events</div>'));

            var table = $('<table class="table table-striped table-bordered table-hover" id="eventTable">');
            addBody(table, data);

            tablePanel.append(table);
            events.html(tablePanel);
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
        var tableBody = $('<tbody>');
        table.append(tableBody);

        if (!data || data.length === 0)
        {
            var tr = $('<tr>');

            var td1 = $("<td/>");
            td1.text("No events in past 2 weeks");
            tr.append(td1);

            tableBody.append(tr);
            table.append(tr);
        }
        else {
            _.each(data,
                function (event) {
                    var tr = $('<tr>');
                    var p1 = $("<p/>");

                    p1.text(event.eventType);
                    tr.append(p1);

                    var p2 = $("<p/>");
                    p2.text(event.actorName);
                    tr.append(p2);

                    var p3 = $("<p/>");
                    p3.text(event.timeStamp);
                    tr.append(p3);

                    tableBody.append(tr);
                }
            );
        }

    }
});
