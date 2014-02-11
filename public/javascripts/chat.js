jQuery.fn.autolink = function (target) {
  if (target == null) target = '_parent';
  return this.each( function(){
    var re = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
    $(this).html( $(this).html().replace(re, '<a href="$1" target="'+ target +'">$1</a> ') );
  });
}

$(document).ready(function() {
  var messages = [];
  var socket = io.connect('/');
  var field = document.getElementById("field");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("content");
  var usersDiv = document.getElementById("users");
  var name = document.getElementById("name");

  function toInt(str) {
    str = str || '';
    var int = 0;
    for (var i = 0; i < str.length; i++) {
      int += str.charCodeAt(i);
    }
    return int;
  };

  function nameColor(name) {
    var colors = ["red", "green", "blue", "pink", "purple", "brown", "DarkGreen", "DarkOrange", "Fuchsia", "Orange"];
    var l = colors.length;
    return colors[(toInt(name) % l)]
  }

  socket.on('message', function(data) {
    if (data.message) {
      messages.push(data);
      var html = '';
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].username) {
          html += '<b style="color: ' + nameColor(messages[i].username) + ' ;">' + messages[i].username + ': </b>';
        }
        html += messages[i].message + '<br />';
      }
      content.innerHTML = html;
      $(content).autolink();
      content.scrollTop = content.scrollHeight;
    } else {
      console.log("There is a problem:", data);
    }
  });

  socket.on("users_updated", function(data) {
    if (data.users) {
      var users = []
      data.users.forEach(function(user) {
        if (user.username) {
          users.push("<span style='color: "+nameColor(user.username)+"'>"+user.username+"</span>");
        } else {
          users.push("Guest")
        }
      })
      var html = users.join(", ")
      usersDiv.innerHTML = html;
    }
  })

  sendButton.onclick = sendMessage = function() {
    if (name.value == "") {
      alert("Please type your name!");
    } else {
      var text = field.value;
      socket.emit('send', { message: text, username: name.value });
      field.value = "";
    }
  };

  updateName = function() {
    if (name.value != "") {
     socket.emit('name_updated', {username: name.value});
    }
  }

  $("#field").keyup(function(e) {
    if (e.keyCode == 13) {
      sendMessage();
    }
  });
  $("#name").on("change", function(e) {
    updateName();
  })

});
