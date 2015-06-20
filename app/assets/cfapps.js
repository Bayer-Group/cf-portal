$(document).ready(function () {
    //display the loading icon
    $(document).ajaxSend(function(event, request, settings) {
        $('#loading-indicator').show();
    });

    getApps();

    //hide the loading icon
    $(document).ajaxComplete(function(event, request, settings) {
        $('#loading-indicator').hide();
    });
});

function getApps() {
    $.ajax("/rest/apps/", {

            success: function (data) {
                var content = $("#content");
                var tablePanel = $('<div class="panel panel-default">');

                getTimestamp(tablePanel);

                var table = $('<table class="table table-striped table-bordered table-hover" id="appTable">');
                addHeaders(table);
                addBody(table, data);

                tablePanel.append(table);
                content.html(tablePanel);

                $('#appTable').dataTable({"iDisplayLength": 25});
            },
            error: function (xhr, status, err) {
                $("#content").text("Error loading application information: " + err);
            }
        }
    );
}

function getTimestamp() {
    $.ajax("/rest/refresh/", {
            success: function (resp) {
                var navbar = $("#navbar");
                var tstamp = resp[0].date;
                var tstampstring = tstamp.toString();
                var navhtml = $('<ul class="nav navbar-nav"><li class="active"><a href="/">Home</a></li></ul>'+'<ul class="nav navbar-nav navbar-right"><li><a href="#">Last Successful Refresh at '+tstampstring+'</a></li></ul>');

                console.log(resp[0].date);
                navbar.html(navhtml);
            },
            error: function (xhr, status, err) {
                var navbar = $("#navbar");
                var tstamp = resp[0].date;
                var tstampstring = tstamp.toString();
                var navhtml = $('<ul class="nav navbar-nav">');
                navhtml.append($('<li class="active"><a href="/">Home</a></li>'));
                navhtml.append($('</ul>'));
                navbar.html(navhtml);
            }
        }
    );
}

function addHeaders(table) {
    var tableHeader = $('<thead/>');
    var headerRow = $('<tr/>');

    headerRow.append($('<th style="width: 15%">Org</th>'));
    headerRow.append($('<th style="width: 20%">Space</th>'));
    headerRow.append($('<th style="width: 20%">Name</th>'));
    headerRow.append($('<th style="width: 35%">Uris</th>'));
    headerRow.append($('<th style="width: 10%">State</th>'));
    tableHeader.append(headerRow);
    table.append(tableHeader);
}

function addBody(table, data) {
    var tableBody = $('<tbody class="searchable">');
    table.append(tableBody);

    _.each(data,
        function (app) {
            //var appGuid = app.guid;
            var appGuid = app.name;
            var appGuidString = appGuid.toString();
            var tr = $('<tr class="clickableRow" id="'+appGuidString+'" onclick=fetchApp($(this).attr("id"));>');

            var td1 = $("<td/>");
            td1.text(app.org);
            tr.append(td1);

            var td2 = $("<td/>");
            td2.text(app.space);
            tr.append(td2);

            var td3 = $("<td/>");
            td3.text(app.name);
            tr.append(td3);

            var td4 = $("<td/>");
            if (app.uris[0] === "") {
                td4.text("");
            } else {

                td4.text(
                    _.reduce(
                        app.uris,
                        function (acc, e) {
                            return acc + e + ", ";
                        },
                        ""
                    )
                );
            }

            tr.append(td4);


            var td5 = $("<td/>");
            td5.text(app.state);
            tr.append(td5);

            tableBody.append(tr);
        }
    );
}

// function to take in app guid and send to app drill down controller for app specific details (logs/events/etc)
function fetchApp(rowId)
{
    var name=rowId.toString();
    window.location="/appview?name=" + name;
}