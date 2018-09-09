let dyna = [
    {name: "(选择朝代)", value: 0},
    {name: "先秦", value: 1},
    {name: "秦", value: 2},
    {name: "汉", value: 3},
    {name: "魏晋", value: 4},
    {name: "南北朝", value: 5},
    {name: "隋", value: 6},
    {name: "唐", value: 7},
    {name: "宋", value: 8},
    {name: "辽", value: 9},
    {name: "金", value: 10},
    {name: "元", value: 11},
    {name: "明", value: 12},
    {name: "清", value: 13},
    {name: "近现代", value: 14},
    {name: "当代", value: 15}
]

$(document).ready(function() {
    $("#dyna_select").html(function() {
        let html = ""
        for(let i = 0; i < dyna.length; i ++) {
            html += `<option value="${dyna[i].value}">${dyna[i].name}</option>`
        }
        return html
    })
    $("#poem").show()
    $("#antithesis").hide()
    $("#alert").css("height", "30px")
    $("#anti_alert").css("height", "30px")
    $("li").css({"width": "50%", "text-align": "center"})
    $("#poem_search").val("")
})


$("input").click(function() {
    if($(this).prop("placeholder") != "") {
        let value = ($(this).prop("placeholder")).split('如')[1];
        $(this).val(value)
        $(this).prop("placeholder", "")
    }
});

$("#poem_search").click(function() {
    let key = $("#poem_search").prop("placeholder")
    $("#poem_search").val(key)
    $("#poem_search").prop("placeholder", "")
})

$("#poem_nav").click(function() {
    $("#poem").show()
    $("#antithesis").hide()
    $("#antithesis_nav").prop("class", "")
    $("#poem_nav").prop("class","active")
})

$("#antithesis_nav").click(function() {
    $("#poem").hide()
    $("#antithesis").show()
    $("#poem_nav").prop("class", "")
    $("#antithesis_nav").prop("class", "active")
})

$(":radio").click(function() {
    let option = $("input[name='poem_search_select']:checked").val()
    if(option == 1) {
        $("#poem_search").prop("placeholder", "王之涣")
        $("#poem_search").val("王之涣")
        $("#poem_search").prop("placeholder", "")
    }else if(option == 2){
        $("#poem_search").prop("placeholder", "登鹳雀楼")
        $("#poem_search").val("登鹳雀楼")
        $("#poem_search").prop("placeholder", "")
    }else {
        $("#poem_search").prop("placeholder", "白日依山盡")
        $("#poem_search").val("白日依山盡")
        $("#poem_search").prop("placeholder", "")
    }
})

$("#poem_submit").click(function() {
    let dyna = $("#dyna_select").val()
    let option = $("input[name='poem_search_select']:checked").val()
    let key = $("#poem_search").val()
    key = key.replace(/\s/g, "")
    if(key == "") {
        $("#alert").text("输入值不能为空！")
    }else if(option === undefined) {
        $("#alert").text("请选择检索方式！")
    }else {
        $("#alert").text("")
        // alert(dyna + "+" + option + "+" + key)
        $.get(`http://www.datastreams.club:3000/poem/${option}?key=${key}&dynasty=${dyna}`, function(data) {
            if(data === null) {
                $("#poem_show").html(`<p class="text-danger">未查询到关于<b>“${key}”</b>的信息！</p>`)
            }else {
                let html = ""
                for(let i = 0; i < data.ShiData.length; i ++) {
                    let reg = /(。|？|，|！|；)/g
                    let sentence = data.ShiData[i].Clauses.split(reg)
                    html += `<div class="panel-heading">
                                <h3 class="panel-title">${data.ShiData[i].Title}<a onclick="send('${data.ShiData[i].Author}')">（${data.ShiData[i].Dynasty}-${data.ShiData[i].Author}）</a></h3>
                            </div>
                            <div class="panel-body">
                                <p>${data.ShiData[i].Type}</p>`

                    for(let j = 1; j < sentence.length/4; j ++) {
                        sentence[4*j-1] = sentence[4*j-1] + "<br>"
                    }
                    //console.log(sentence)
                    sentence = sentence.join("")
                    html += `<p>${sentence}</p>`
                    html += `</div>`
                }
                $("#poem_show").html(html)
                $("#poem_show").css("text-align", "center")
            }
        })
    }
})

$("#antithesis_submit").click(function() {
    let key = $("#antithesis_search").val()
    key = key.replace(/\s/g, "")
    if(key == "") {
        $("#anti_alert").text("输入值不能为空！")
    }else if(key.length > 3) {
        $("#anti_alert").text("输入值不能超过三个字！")
    }else {
        $.get(`http://www.datastreams.club:3000/poem/4?key=${key}`, function(data) {
            if(data == "null") {
                $("#anti_display").html(`<p>未查询到关于<b>“${key}”</b>的信息！</p>`)
                $("#anti_display p").css({"text-align": "center"})
            }else {
                let reg = /"/g
                data = data.slice(1, data.length - 1).replace(reg, "").split(",")
                // console.log(data)
                let html = ""
                for(let i = 0; i < data.length; i ++) {
                    html += `<p>${data[i]}</p>` 
                }
                // console.log(html);
                $("#anti_display").html(html)
                $("#anti_display p").css({"float": "left", "width": "33%", "text-align": "center"})
            }
        })
    }
})

function send(data) {
    localStorage.setItem("poem_ch", data)
    $(window).prop("location", "character.html")
}

