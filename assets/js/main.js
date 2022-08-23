(portfolio = function () {
  // 2번 슬라이드 애니메이션
  var slide_02 = $(".slide2 .title span");
  var count = slide_02.length;

  function typing() {
    var addNum = 0;
    setInterval(function () {
      if (addNum <= count) {
        $(slide_02).eq(addNum).addClass("active");
      }
      addNum++;
    }, 90);
  }

  const autoplay_delay = 2000; //ms
  let elem = document.getElementById("bar");
  var time = autoplay_delay / 1000; //s로 변환
  var percent; // 진행률
  var repeat; // 진행 반복
  // 슬라이더 progress bar animation
  function frame() {
    if (percent >= 100) {
      // 가로값이 100%가 넘어가면
      clearInterval(repeat); // 반복 삭제
    } else {
      percent += 1 / time; // time초 동안 100% 만듦
      elem.style.width = percent + "%";
    }
  }

  function start() {
    reset();
    percent = 0;
    repeat = setInterval(frame, 10); // 0.01초 마다 반복
  }

  function reset() {
    elem.style.width = 0 + "%";
    clearInterval(repeat);
  }

  // main slider swiper
  const sec_slider = new Swiper(".sec-slider .swiper-container", {
    slidesPerView: 1,
    speed: 550,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    loop: true,
    on: {
      init: function (swiper) {
        // if (swiper.autoplay.running == true) {
        // start();
        // }

        // 메인슬라이드 1번 애니메이션
        $(".slide1").addClass("active");
      },
      slideChange: function (swiper) {
        // 1번 슬라이드 애니메이션
        if (swiper.realIndex == 0) {
          $(".slide1").addClass("active");
        } else {
          $(".slide1").removeClass("active");
        }

        // 2번 슬라이드 애니메이션
        if (swiper.realIndex == 1) {
          setTimeout(typing, 400);
        } else {
          $(".slide2 .title span").removeClass("active");
        }

        // 3번 슬라이드 애니메이션
        if (swiper.realIndex == 2) {
          $(".slide3").addClass("active");
          $("#bar").addClass("color");
        } else {
          $(".slide3").removeClass("active");
          $("#bar").removeClass("color");
        }

        // 슬라이드시 헤더 컬러 변경
        var activeSlide = swiper.slides[swiper.activeIndex];
        var color = activeSlide.getAttribute("data-header-color");
        $("#header").attr("data-header-color", color);
        $(".btns").attr("data-header-color", color);
      },
      touchEnd: function (swiper) {
        if (swiper.autoplay.running == false) {
          $(".btn_stop").hide();
          $(".btn_play").show();
          reset();
        }
      },
      progress: function (swiper, progress) {
        if (swiper.autoplay.running == true) {
          start();
        }
      },
    },
    autoplay: {
      delay: autoplay_delay,
    },
  });

  // 슬라이더 정지/재생 버튼
  $(".btns .btn").on("click", function () {
    if ($(this).hasClass("btn_stop")) {
      sec_slider.autoplay.stop();
      $(".btn_stop").hide();
      $(".btn_play").show();
      reset();
    } else {
      sec_slider.autoplay.start();
      $(".btn_stop").show();
      $(".btn_play").hide();
      start();
    }
  });

  // project js 시작
  var sec_project_action = function (swiper) {
    var zoom_in_layer = $(".zoom-in-layer");
    var active_slide = swiper.slides[swiper.activeIndex];

    var image_url = active_slide.style.backgroundImage;
    var title = active_slide.dataset.title;
    var desc = active_slide.dataset.desc;
    var url = active_slide.dataset.url;

    zoom_in_layer.css("background-image", image_url);
    zoom_in_layer.find(".box-title").text(title);
    zoom_in_layer.find(".desc").text(desc);
    zoom_in_layer.find(".url").attr("href", url);
  };

  const sec_project = new Swiper(".sec-project .swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 15,
    loop: "true",
    slideToClickedSlide: "true",
    navigation: {
      nextEl: ".arrow .next",
      prevEl: ".arrow .prev",
    },
    on: {
      slideChange: function (swiper) {
        sec_project_action(swiper);
      },
    },
  });
  // project js 끝

  // team js 시작
  // tab버튼 active
  $(".tabs .tab").on("click", function (e) {
    e.preventDefault();
    var t = $(this);
    var target = t.find("a").attr("href");
    target = target.replace("#", "");

    if (!t.hasClass("active")) {
      $(".tab").removeClass("active");
      t.addClass("active");

      $(".team").removeClass("active");
      $(".team-wrap")
        .find("[data-tab-index='" + target + "']")
        .addClass("active");
    }
  });

  // random person 불러오기
  var team = $(".team");
  $.each(team, function (index, elem) {
    var t = $(elem);
    var item = t.children("li");

    var info = t[0].dataset.user;
    var j = JSON.parse(info);

    var count = j.results;
    var type = j.gender;

    var part = t.data("team");

    $.ajax({
      url: "https://randomuser.me/api/",
      dataType: "Json",
      data: {
        results: count,
        gender: type,
      },
      success: function (data) {
        // console.log(data);
        var txts = "";

        for (var i = 0; i < data.results.length; i++) {
          var user = data.results[i];
          var user_email = user.email;
          var user_phone = user.phone;
          var user_name = user.name.first + " " + user.name.last;
          var user_img = user.picture.large;
          var user_gender = user.gender;

          txts += "<div class='item'>";
          txts += "<div class='img'>";
          txts += "<img class='face' src='" + user_img + "' alt=''>";
          txts += "</div>";
          txts += "<div class='info01'>";
          txts += "<div class='name'>" + user_name + "</div>";

          if (part == "design") {
            if (i == 0) {
              txts += "<div class='work'>Lead Designer</div>";
            } else if (i == 1) {
              txts += "<div class='work'>Senior Designer</div>";
            } else {
              txts += "<div class='work'>Junior Designer</div>";
            }
          } else if (part == "back") {
            if (i == 0) {
              txts += "<div class='work'>Senior developer</div>";
            } else {
              txts += "<div class='work'>Junior developer</div>";
            }
          } else {
            // front
            txts += "<div class='work'>Front-end Developer</div>";
          }

          txts += "</div>";
          txts += "<ul class='info02'>";
          txts +=
            "<li class='email'><a href='mailto:" +
            user_email +
            "'><i class='far fa-envelope'></i></a></li>";
          txts +=
            "<li class='tell'><a href='tel:" +
            user_phone +
            "'><i class='fas fa-phone'></i></a></li>";
          txts += "<li class='gender'>";
          txts += "<a href='javascript:void(0);'>";
          if (user_gender == "female") {
            txts += "<i class='fas fa-venus'></i>";
          } else {
            txts += "<i class='fas fa-mars'></i>";
          }
          txts += "</a>";
          txts += "</li>";
          txts += "</ul>";
          txts += "</div>";
        }

        item.html(txts);
      },
    });
  }); // each 끝
  // team js 끝

  // form 시작

  var uname = $("input[name=uname]");
  var email = $("input[name=email]");
  var content = $("textarea[name=content]");

  function form_submit() {
    // email 정규식
    var regEmail =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    if (uname.val() == "") {
      uname.siblings(".error-msg").text("Company or Your-name is required");
      uname.focus();

      return false;
    }

    if (email.val() == "") {
      email.siblings(".error-msg").text("Email is required");
      email.focus();

      return false;
    }

    if (!regEmail.test(email.val())) {
      email.siblings(".error-msg").text("Not a valid email");
      email.focus();

      return false;
    }

    if (content.val() == "") {
      content.siblings(".error-msg").text("Messages is required");
      content.focus();

      return false;
    }

    return true;
  }

  function form_check() {
    if (uname.val().length >= 1) {
      uname.siblings(".error-msg").text("");
    }

    if (email.val().length >= 1) {
      email.siblings(".error-msg").text("");
    }

    if (content.val().length >= 1) {
      content.siblings(".error-msg").text("");
    }
  }

  document.getElementById("send_btn").addEventListener("click", form_submit);

  $("input, textarea").on("keypress", function () {
    form_check();
  });

  // form 끝
})(); // 즉시실행함수 끝

$(function () {
  // 스크롤 시 헤더 색상 변경
  $(window).scroll(function () {
    if ($(window).scrollTop() > 0) {
      $("#header").addClass("fixed");
    } else {
      $("#header").removeClass("fixed");
    }
  });

  // 메뉴 클릭시 해당 섹션으로 이동
  $("#header .menu a").on("click", function (e) {
    e.preventDefault();

    var menu_index = $(this).attr("data-menu-index");

    var sec_offset = $("[data-sec-index='" + menu_index + "']").offset().top;

    $("html").animate(
      {
        scrollTop: sec_offset - 80,
      },
      300
    );
  });
});
