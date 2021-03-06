window.ServerAPI = {
  version: '0.5.2',
  server: '',
  params: function() {
    var query = {},
        search = window.location.search.substring(1),
        parts = search.split('&'),
        pairs = [];

    for(var i = 0, len = parts.length; i < len; i++) {
      pairs = parts[i].split('=');
      query[pairs[0]] = (pairs.length > 1 ? decodeURIComponent(pairs[1]) : null);
    }

    return query;
  },
  redirect_to_with_timestamp: function(pathname) {
    var timestamp = (new Date()).valueOf(),
        split_str = pathname.indexOf('?') >= 0 ? '&' : '?';
        pathname_with_timestamp = pathname + split_str + 'timestamp=' + timestamp;

    window.location.href = pathname_with_timestamp;
  },
  resetPassword() {
    var username = window.localStorage.getItem("username"),
        cached_password = window.localStorage.getItem("password"),
        old_password = $("#oldPassword").val(),
        new_password = $("#newPassword").val(),
        re_password = $("#rePassword").val();

    if(!username || !cached_password || !cached_password.length) {
      layer.msg('登录信息不完整，请重新登录！', {
        time: 0,
        btn: ['确定'],
        yes: function(index) {
          window.localStorage.setItem("logined", "no");
          layer.close(index);

          window.ServerAPI.redirect_to_with_timestamp('login.html');
        }
      });
    }
    if(!old_password.length) {
      layer.tips('请输入旧密码', '#oldPassword', { tips: [2, '#faab20'] });
      return false;
    }
    if(cached_password !== old_password) {
      layer.tips('旧密码不正确', '#oldPassword', { tips: [2, '#faab20'] });
      return false;
    }
    if(!new_password.length) {
      layer.tips('请输入新密码', '#newPassword', { tips: [2, '#faab20'] });
      return false;
    }
    if(new_password !== re_password) {
      layer.tips('两次新密码不一致', '#rePassword', { tips: [2, '#faab20'] });
      return false;
    }

    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/reset_password",
      type: 'post',
      async: false,
      dataType: 'json',
      data: {"username": username, "password": old_password, "new_password": new_password},
      timeout: 5000,
      success: function(xhr) {
        layer.msg(xhr.info, {
          time: 0,
          btn: ['确定'],
          yes: function(index) {
            if(xhr.code === 201) {
              $('.xg').fadeOut(200)
              $("#oldPassword").val(''),
              $("#newPassword").val(''),
              $("#rePassword").val('');
              window.localStorage.setItem("password", new_password);
            }
            layer.close(index);
          }
        });
        $(".layui-layer-btn").css({"text-align": "center"});
      }
    });
  },
  forgetPassword() {
    var email = $("#xg_yj").val();
    if(!email.length) {
      layer.tips('请输入注册邮箱', '#xg_yj', { tips: [2, '#faab20'] });
      return false;
    }

    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/forget_password",
      type: 'post',
      async: false,
      dataType: 'json',
      data: {"email": email},
      timeout: 5000,
      success: function(xhr) {
        layer.msg(xhr.info, {
          time: 0,
          btn: ['确定'],
          yes: function(index) {
            if(xhr.code === 201) {
              window.ServerAPI.redirect_to_with_timestamp('login.html');
            }
            layer.close(index);
          }
        });
        $(".layui-layer-btn").css({"text-align": "center"});
      }
    });
  },
  logout: function() {
    layer.msg('确认退出登录?', {
      time: 0,
      btn: ['确定', '取消'],
      yes: function(index) {
        window.localStorage.setItem("logined", "no");
        layer.close(index);

        window.ServerAPI.redirect_to_with_timestamp('login.html');
      }
    });
  },
  http_action: function(http_method, api_path, data, message, callback) {
    console.time(message)
    console.log('-------->' + message + '<----------');
    console.log("params:");
    console.log(data);
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + api_path,
      type: http_method,
      async: true,
      dataType: 'json',
      data: data,
      timeout: 5000,
      success: function(xhr) {
        console.log(xhr);
        console.timeEnd(message);
        if(typeof(callback) === 'function')
        callback();
      }
    });
  },
  save_member: function(data) {
    window.ServerAPI.http_action('post', "/api/v1/member", data, 'save member', function(){});
  },
  save_consume: function(data, callback) {
    window.ServerAPI.http_action('post', "/api/v1/consume", data, 'save consume', callback);
  },
  save_consumes: function(data, callback) {
    window.ServerAPI.http_action('post', "/api/v1/consumes", data, 'save consumes', callback);
  },
  save_gift: function(data) {
    window.ServerAPI.http_action('post', "/api/v1/gift", data, 'save gift', function(){});
  },
  save_store: function(data) {
    window.ServerAPI.http_action('post', "/api/v1/store", data, 'save store', function(){});
  },
  save_questionnaire: function(data) {
    window.ServerAPI.http_action('post', "/api/v1/questionnaire", data, 'save questionnaire', function(){});
  },
  save_redeem: function(data, callback) {
    window.ServerAPI.http_action('post', "/api/v1/redeem", data, 'save redeem', callback);
  },
  save_answer: function(data) {
    window.ServerAPI.http_action('post', "/api/v1/answer", data, 'save answer', function(){});
  },
  save_signature: function(data) {
    window.ServerAPI.http_action('post', "/api/v1/signature", data, 'save signature', function(){});
  },
  truncate_table: function(table_name) {
    window.ServerAPI.http_action('post', "/api/v1/truncate/" + table_name, {}, 'truncate table' + table_name, function(){});
  },
  view_signature: function(ctl) {
    alert($(ctl).data("signature"));
  },
  ipad_selected_questionnaire: function() {
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/ipad/questionnaire",
      type: 'get',
      async: false,
      dataType: 'json',
      timeout: 5000,
      success: function(xhr) {
        console.log(xhr);
        window.localStorage.setItem("questionnaire_state", xhr.code);
        if(xhr.code === 200) {
          window.localStorage.setItem("questionnaire", xhr.data);
        } else {
          layer.msg(xhr.info + "，\n返回『客户信息』页面", {
            time: 0,
            btn: ['确定'],
            btnAlign: 'c',
            yes: function(index) {
              layer.close(index);
              window.ServerAPI.redirect_to_with_timestamp('search.html');
            }
          });
        }
      },
      error: function(xhr) {
      }
    });
  },
  generate_questionnaire_options: function() {
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/ipad/setting",
      type: 'get',
      async: true,
      dataType: 'json',
      timeout: 5000,
      success: function(xhr) {
        console.log(xhr);
        if(xhr.code === 200) {
          var $select = $("select[name=questionnaire_code]"),
              item,
              option;
          $select.children("option").remove();
          $select.append("<option value='404'>请选择问卷</option>");
          for(var i = 0, len = xhr.data.length; i < len; i ++) {
            item = xhr.data[i];
            option = "<option value='" + item[0] + "'";
            if(xhr.selected === item[0]) {
              option += " selected='selected' ";
            }
            option += " >" + item[1] + "</option>";
            $select.append(option);
          }
        } else {
          alert(xhr.info);
        }
      },
      error: function(xhr) {
        console.log(xhr);
      }
    });
  }
}

if(window.location.protocol === 'file:') {
  window.ServerAPI.server = 'http://localhost:4567';
}
