let recept = (callback) => {
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/recept');
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let message = document.getElementById("message").value;
    xhr.send('message='+ message);
    xhr.onload = () => {
        let status = xhr.status;
        if (status == 200) {
            document.getElementById("message").value = ""
            searchMessage();
        } 
    };
};

let searchMessage = (callback) => {
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/searchMessage');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        let status = xhr.status;

        if (status == 200) {
            //mostraMensagens(null, xhr.response);
            let data = JSON.parse(xhr.response);
            document.getElementById('chat-content').innerHTML = data;
            $('#chat-content').scrollTop($('#chat-content')[0].scrollHeight);

        } 
    };
    xhr.send();
};