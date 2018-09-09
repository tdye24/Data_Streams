$(document).ready(function() {
    $("ul li").css({"width": "25%", "text-align": "center"})
    $("#top").css("height", "40px")
    $("#an_alert").css("height", "40px")
    $("#head_alert").css("height", "40px")
    $("#book_alert").css("height", "40px")
    $("#headstream_div").hide()
    $("#classification_div").hide()
    $("#books_collections_div").hide()
    $("#ancient_books_div").show()
    $("#classification_search").css("margin", "10px 0px")

    if(localStorage.getItem("work")) {
        //$("#dyna").val(3)
        $("#ancient_books_input").val(localStorage.getItem("work"))
        search(localStorage.getItem("work"))
        localStorage.removeItem("work")
        $("#ancient_books_input").prop("placeholder", "")
    }
})

$("#ancient_books").click(function() {
    $("li").prop("class", "")
    $(this).prop("class", "active")
    $("#headstream_div").hide()
    $("#classification_div").hide()
    $("#books_collections_div").hide()
    $("#ancient_books_div").show()
})

$("#headstream").click(function() {
    $("li").prop("class", "")
    $(this).prop("class", "active")
    $("#ancient_books_div").hide()
    $("#classification_div").hide()
    $("#books_collections_div").hide()
    $("#headstream_div").show()
})

$("#classification").click(function() {
    $("li").prop("class", "")
    $(this).prop("class", "active")
    $("#headstream_div").hide()
    $("#ancient_books_div").hide()
    $("#books_collections_div").hide()
    $("#classification_div").show()
})

$("#books_collections").click(function() {
    $("li").prop("class", "")
    $(this).prop("class", "active")
    $("#headstream_div").hide()
    $("#ancient_books_div").hide()
    $("#classification_div").hide()
    $("#books_collections_div").show()
})

$("input").click(function() {
    if($(this).prop("placeholder") != "") {
        let value = ($(this).prop("placeholder")).split('如')[1];
        $(this).val(value)
        $(this).prop("placeholder", "")
    }
})

//--------------------------------点击搜索按钮------------------------------------------------

$("#ancient_books_search").click(function() {
    search($('#ancient_books_input').val())
})

$("#headstream_search").click(function() {
    let option = $("#headstream_select").val()
    let value = $("#headstream_input").val()
    let reg = /\s/g
    value = value.replace(reg, "")
    if(value == "") {
        $("#head_alert").text("输入不能为空！")
    }else {
        $("#head_alert").text("")
        $.get(`http://www.datastreams.club:3000/work/3?wd=${value}&source=${option}`, function(data) {
            if(data.length === 0) {
                $("#head_info").show()
                $("#head_info").html(`<p>未找到与“<b>${value}</b>”相关的内容！</p>`)
                $("#head_info p").css("text-align", "center")
            }else {
                $("#head_info").hide()
                let html = ""
                for(let i = 0; i < data.length; i ++) {
                    html += `<div class="panel-heading">
                            <h4 class="panel-title" onclick="showHeadstream('${data[i].uri}', '${data[i].title}')"><a>${data[i].title}</a></h4>
                            </div>
                            <div class="panel-body">`
                    let str = "责任者："
              
                    for(let j = 0; j < data[i].creator.length; j ++) {
                        str += `(${data[i].creator[j].temporal}) ${data[i].creator[j].label} `
                    }
                    html += `<p>${str}</p>
                            <p onclick="showHeadstream('${data[i].uri}', '${data[i].title}')"><a>源流信息</a></p>
                            </div>`
                }
                $("#headstream_show_1").html(html)
                $(".panel-heading").css("text-align", "center")
            }
        })
    }
})

$("#classification_search").click(function() {
    let key1 = $("#classification_select1").val()
    let text = $("#classification_select1 option:selected").text()
    let key2 = $("#classification_select2").val()
    
    if(key2 == "false") {
        $.get(`http://www.datastreams.club:3000/work/5?source=${key1}&isLoop=${key2}`, function(data) {
            let html = `<div class="panel-heading">
                            <h4>${text}</h4>
                        </div>
                        <div class="panel-body">`
            for(let i = 0; i < data.length; i ++) {
                let data_keys = Object.keys(data[i])
                html += `<p>${data_keys[0]}</p>`
            }
            html += `</div>`
            $("#classification_show").html(html)
            $(".panel-heading").css("text-align", "center")
            $(".panel-body").css("padding-left", "25%")
        })
    }else {
        $.get(`http://www.datastreams.club:3000/work/5?source=${key1}&isLoop=${key2}`, function(data) {
            // console.log(data)
            let html = `<div class="panel-heading">
                            <h4>${text}</h4>
                        </div>
                        <div class="panel-body padding-left">`
            for(let i = 0; i < data.length; i ++) {
                let data_keys = Object.keys(data[i])
                html += `<div>
                            <label id="first_label"><span class="glyphicon glyphicon-minus"></span>${data_keys[0]}</label>
                            <div class="second_cl">`
                let second_item = data[i][data_keys[0]]
                for(let j = 0; j < second_item.length; j ++) {
                    let second_keys = Object.keys(second_item[j])
                    html += `<div class="second-item">
                                <p id="sec"><span class="glyphicon glyphicon-minus"></span>${second_keys[0]}</p>
                                <div class="third-items">`
                    let third_key = second_item[j][second_keys[0]]
                    for(let k = 0; k < third_key.length; k ++) {
                        html += `<p>${third_key[k]}</p>`
                    }
                    html += `</div></div>`
                }
                html += `</div></div>`
            }
            html += `</div>`
            $("#classification_show").html(html)
            $(".panel-heading").css("text-align", "center")
            $(".padding-left").css("padding-left", "25%")
            $(".second_cl").css("padding-left", "25%")
        })
    }
})

$("#classification_show").on("click", "#first_label", function(e) {
    if(e.target.nodeName = "label") {
        if($(this).next(".second_cl").css("display") != "block") {
            let reg = /glyphicon-plus/g
            let html = $(this).html()
            html = html.replace(reg, "glyphicon-minus")
            $(this).html(html)
            $(this).next(".second_cl").show()
        }else {
            let reg = /glyphicon-minus/g
            let html = $(this).html()
            html = html.replace(reg, "glyphicon-plus")
            $(this).html(html)
            $(this).next(".second_cl").hide()
        }
    }
})

$("#classification_show").on("click","#sec" ,function(e){
    if(e.target.nodeName = "p") {
        if($(this).next(".third-items").css("display") != "block") {
            let reg = /glyphicon-plus/g
            let html = $(this).html()
            html = html.replace(reg, "glyphicon-minus")
            $(this).html(html)
            $(this).next(".third-items").show()
        }else {
            let reg = /glyphicon-minus/g
            let html = $(this).html()
            html = html.replace(reg, "glyphicon-plus")
            $(this).html(html)
            $(this).next(".third-items").hide()
        }
    }
})

$("#books_collections_search").click(function() {
    let value = $("#books_collections_input").val()
    let reg = /\s/g
    value = value.replace(reg, "")
    if(value == "") {
        $("#book_alert").text("输入不能为空！")
    }else {
        $("#book_alert").text("")
        $.get(`http://www.datastreams.club:3000/work/6?wd=${value}`, function(data) {
            if(data.length === 0) {
                $("#col_info").show()
                $("#col_info").html(`<p>未找到与“<b>${value}</b>”相关的内容！</p>`)
                $("#col_info p").css("text-align", "center")
            }else {
                $("#col_info").hide()
                // console.log(data)
                html = ""
                for(let i = 0; i < data.length; i ++) {
                    html += `<div class="panel-heading">
                                <h4 class="panel-title">${data[i].sealCharacters}</h4>
                            </div>
                            <div class="panel-body">`
                    let owner = ""
                    let lib = ""
                    html += `<p>印文图：`
                    for(let j = 0; j < data[i].img.length; j ++) {
                        html += `<a href="` + data[i].img[j] + `">印文图` + j + `</a>&emsp;`
                    }
                    html += `</p>`
                    for(let j = 0; j < data[i].owner.length; j ++) {
                        owner += `${data[i].owner[j]} `
                    }
                    for(let j = 0; j < data[i].libliotheca.length; j ++) {
                        lib += `${data[i].libliotheca[j].name} `
                    }
                    html += `<p>藏书家：<a onclick="send_ch('${owner}')">${owner}</a></p>
                            <p>藏书楼：${lib}</p>
                            </div>`
                }
                $("#books_collections_show").html(html)
                $(".panel-heading").css("text-align", "center")
            }
        })
    }
})

function an_send(uri) {
    $("#ancient_books_show_2").show()
    $.get(`http://www.datastreams.club:3000/work/2?wd=${uri}`, function(data) {
        $("#ancient_books_show_1").hide()

        let html = `<div class="panel-heading" onclick="turn_back()">
                        <h4>${data.title}</h4>
                    </div>
                    <div class="panel-body">`

        for(let i = 0; i < data.creator.length; i ++) {
            html += `<p><b>著者：</b><a onclick="send_dyna('${data.creator[i].temporal}')">[${data.creator[i].temporal}]</a> <a onclick="send_ch('${data.creator[i].label}')">${data.creator[i].label}</a></p>`
        }
                    
        html += `<p><b>版本：</b>${data.version}</p>
                <p><b>分类名称：</b>${data.class}</p>
                <p><b>册数：</b>${data.extent}</p>`

        for(let i = 0; i < data.holding.length; i ++) {
            html += `<p><b>DOI：</b>${data.holding[i].doi}</p>`
            let str = ""
            for(let j = 0; j < data.holding[i].heldBy.length; j ++) {
                str += `${data.holding[i].heldBy[j].address} ${data.holding[i].heldBy[j].label}`
            }
            html += `<p><b>馆藏地址：</b>${str}</p>
                    <p><b>索书号：</b>${data.holding[i].shelfMark}</p>`
        }

        html += "</div>"

        $("#ancient_books_show_2").html(html)
        $(".panel-heading").css("text-align", "center")
    })
}

function turn_back() {
    $("#ancient_books_show_2").hide()
    $("#ancient_books_show_1").show()
}

function showHeadstream(uri, title) {
    $("#headstream_show_1").hide()
    $("#headstream_show_2").show()
    $.get(`http://www.datastreams.club:3000/work/4?wd=${uri}`, function(data) {
        let html = `<div class="panel-heading" onclick="head_back()">
                        <h4 class="panel-title">${title}源流信息</h4>
                    </div>`
        for(let i = 0; i < data.length; i ++) {
            html += `<div class="panel-body" id="head_show">
                        <p>源流作品：${data[i].title}</p>
                        <p>作品作者：<a onclick="send_ch('${data[i].creator}')">${data[i].creator}</a></p>
                        <p>作品朝代：<a onclick="send_dyna('${data[i].time}')">${data[i].time}</a></p>
                        <p>备注：${data[i].body}</p>
                    </div>`
        }
        $("#headstream_show_2").html(html)
        $(".panel-heading").css("text-align", "center")
    })
}


function search(value) {
    //let value = $("#ancient_books_input").val()
    let reg = /\s/g
    value = value.replace(reg, "")
    if(value == "") {
        $("#an_alert").text("输入不能为空！")
    }else {
        $("#an_alert").text("")
        $.get(`http://www.datastreams.club:3000/work/1?wd=${value}`, function(data) {
            if(data.length === 0) {
                $("#an_info").show()
                $("#an_info").html(`<p>未找到与“<b>${value}</b>”相关的内容！</p>`)
                $("#an_info p").css("text-align", "center")
            }else {
                $("#an_info").hide()
                let html = ""
                for(let i = 0; i < data.length; i ++) {
                    if(data[i].creator.length === 0) {
                        html += `<div class="panel-heading">
                                    <h4><a onclick="an_send('${data[i].uri}')">${data[i].title}</a></h4>
                                </div>
                                <div class="panel-body">
                                    <p><b>著者：</b>（不详）</p>
                                    <p><b>版本：</b>${data[i].version}</p>
                                    <p><b>分类：</b>${data[i].class}</p>
                                </div>`
                    }else {
                        html += `<div class="panel-heading">
                                    <h4><a onclick="an_send('${data[i].uri}')">${data[i].title}</a></h4>
                                </div>
                                <div class="panel-body">`
                        let book_str = ''
                        for(let j = 0; j < data[i].creator.length; j ++) {
                            if(data[i].creator[j].temporal == "") {
                                book_str += `[朝代不详] <a onclick="send_ch('${data[i].creator[j].label}')">${data[i].creator[j].label}</a>`
                            }else {
                                book_str += `<a onclick="send_dyna('${data[i].creator[j].temporal}')">[${data[i].creator[j].temporal}]</a> <a onclick="send_ch('${data[i].creator[j].label}')">${data[i].creator[j].label}</a>`
                            }
                        }
                        html += `<p><b>著者：</b>${book_str}</p>
                                    <p><b>版本：</b>${data[i].version}</p>
                                    <p><b>分类：</b>${data[i].class}</p>
                                </div>`
                    }
                }
                $("#ancient_books_show_1").html(html)
                $(".panel-heading").css("text-align", "center")
            }
        })
    }
}

function head_back() {
    $("#headstream_show_2").hide()
    $("#headstream_show_1").show()
}

function send_ch(data) {
    localStorage.setItem("character", data)
    $(window).prop("location", "character.html")
}

function send_dyna(data) {
    localStorage.setItem("ch_dyna", data)
    $(window).prop("location", "dynasty.html")
}
