
async function fetch_server_data() {
    console.log("load data")

    if ($srv_pwd.val() == '') {

    } else {

        fetch($srv_url.val(), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query($token: String!) {
                    serverInfo {
                        online
                        idle
                        version
                    }
                    trafficInfo(token: $token) {
                        upload
                        download
                        uploadPacket
                        downloadPacket
                    }
                    room {
                        hostPlayerName
                        contentId
                        nodeCount
                        nodeCountMax
                        nodes {
                            ip
                            playerName
                        }
                    }
                }`,
                variables: {
                    token: $srv_pwd.val(),
                },
            })
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } throw new Error('Something went wrong');
        }).then((result) => update_display(result))
    }
}

function update_display(result) {
    $srv_version.html(result.data.serverInfo.version);
    $srv_online.html(result.data.serverInfo.online);
    $srv_idle.html(result.data.serverInfo.idle);
    $srv_upload.html(result.data.trafficInfo.upload);
    $srv_download.html(result.data.trafficInfo.download);
    $srv_uploadpack.html(result.data.trafficInfo.uploadPacket);
    $srv_downloadpack.html(result.data.trafficInfo.downloadPacket);

    display_rooms(result.data.room)
}


async function display_rooms(rooms) {
    const response = await fetch("./ressources/titles.json");
    const titles = await response.json();

    for (const element of rooms) {
        $.get("./js/files/room.html", function(data) {
            data = data.replaceAll('{index}', room_index + 1)
            data = data.replace('{title}', titles[element.contentId.toUpperCase()].name)
            data = data.replace('{hostname}', element.hostPlayerName)
            data = data.replace('{playercount}', element.nodeCount)
            data = data.replace('{playercountmax}', element.nodeCountMax)
            data = data.replace('{image}', titles[element.contentId.toUpperCase()].iconUrl)

            var players = ""
            for (const player of element.nodes) {
                players = players + "<tr><td>" + player.playerName + "</td><td>" + player.ip + "</td></tr>"
            }
            data = data.replace('{playerlist}', players)

            $rooms.html(data)
        })
    }
}
