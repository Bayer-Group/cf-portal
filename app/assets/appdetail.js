
$(document).ready(function () {
    $.ajax({
     //   url: '/app',
      //  data: 'name='+GetUrlValue('name'),
        url: '/rest/apps/'+GetUrlValue('name')+'/',
        //data: 'name='+GetUrlValue('name'),
        //data: 'where={"name":'+GetUrlValue('name')+'}',

        success: function (data) {
            var content = $("#content");
            var tablePanel = $('<div class="panel panel-default">');
                tablePanel.append($('<div class="panel-heading"><p>Instances of '+ GetUrlValue('name') + '</p>' +
                '<p>Buildpack: ' + data[0].buildpack + '</p></div>'));
                var table = $('<table class="table table-striped table-bordered table-hover" id="instanceTable">');
                addHeaders(table);
                addBody(table, data);

                tablePanel.append(table);
                content.html(tablePanel);

                $('#instanceTable').dataTable();
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

    function addHeaders(table) {
        var tableHeader = $('<thead/>');
        var headerRow = $('<tr/>');

        headerRow.append($('<th style="width: 15%">ID</th>'));
        headerRow.append($('<th style="width: 15%">Status</th>'));
        headerRow.append($('<th style="width: 15%">CPU Usage</th>'));
        headerRow.append($('<th style="width: 15%">Memory Usage</th>'));
        headerRow.append($('<th style="width: 20%">Uptime</th>'));
        headerRow.append($('<th style="width: 20%">Host</th>'));
        tableHeader.append(headerRow);
        table.append(tableHeader);
    }

    function addBody(table, data) {
        var tableBody = $('<tbody>');
        table.append(tableBody);

        _.each(data,
            function (app) {
                var tr = $('<tr>');

                var td1 = $("<td/>");
                td1.text(app.instanceid);
                tr.append(td1);

                var td2 = $("<td/>");
                td2.text(app.state);
                tr.append(td2);

                var td3 = $("<td/>");
                td3.text(Math.floor(app.cpu) + "%");
                tr.append(td3);

                var td4 = $("<td/>");
                //td4.text(app.mem + "MB");
                td4.text(formatMemory(app.mem));
                tr.append(td4);

                var td5 = $("<td/>");
                td5.text(formatSecondsAsTime(app.uptime));
                tr.append(td5);

                var td6 = $("<td/>");
                td6.text(app.host);
                tr.append(td6);

                tableBody.append(tr);
            }
        );
    }

    function formatSecondsAsTime(secs) {
        var day = Math.floor(secs / 86400);
        var hr  = Math.floor((secs % 86400) / 3600);
        var min = Math.floor(((secs %86400) % 3600) / 60);
        var sec = Math.floor((secs %86400) % 3600) % 60;

        if (hr < 10)   { hr    = "0" + hr; }
        if (min < 10)  { min = "0" + min; }
        if (sec < 10)  { sec  = "0" + sec; }

            return day +" d " + hr + " hr " + min + " min";
    }

    function formatMemory(mem) {
        if (mem > 100000000) {
            var mb = Math.floor(mem / 1000000);
            return mb + " MB";
        } else {
            var gb = mem / 1000000000;
            return gb + " GB";
        }
    }
});

