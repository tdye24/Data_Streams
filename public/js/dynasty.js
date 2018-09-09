let dyna_list = [
    {name: "夏", begin: "公元前1989年", end: "公元前1559年"},
    {name: "商", begin: "公元前1559年", end: "公元前1123年"},
    {name: "周", begin: "公元前1123年", end: "公元前256年"},
    {name: "西周", begin: "公元前1046年", end: "公元前771年"},
    {name: "春秋", begin: "公元前770年", end: "公元前477年"},
    {name: "东周", begin: "公元前770年", end: "公元前221年"},
    {name: "战国", begin: "公元前476年", end: "公元前221年"},
    {name: "秦", begin: "公元前221年", end: "公元前206年"},
    {name: "汉", begin: "公元前206年", end: "公元前188年"},
    {name: "西汉", begin: "公元前206年", end: "公元8年"},
    {name: "东汉", begin: "公元25年", end: "公元125年"},
    {name: "三国", begin: "公元220年", end: "公元280年"},
    {name: "西晋", begin: "公元281年", end: "公元316年"},
    {name: "晋", begin: "公元381年", end: "公元420年"},
    {name: "东晋", begin: "公元317年", end: "公元420年"},
    {name: "南北朝", begin: "公元420年", end: "公元589年"},
    {name: "隋", begin: "公元589年", end: "公元618年"},
    {name: "唐", begin: "公元618年", end: "公元907年"},
    {name: "五代", begin: "公元907年", end: "公元960年"},
    {name: "宋", begin: "公元960年", end: "公元1297年"},
    {name: "北宋", begin: "公元960年", end: "公元1126年"},
    {name: "南宋", begin: "公元1127年", end: "公元1279年"},
    {name: "元", begin: "公元1279年", end: "公元1368年"},
    {name: "明", begin: "公元1368年", end: "公元1644年"},
    {name: "清", begin: "公元1644年", end: "公元1911年"},
    {name: "南明", begin: "公元1644年", end: "公元1683年"},
    {name: "明国", begin: "公元1912年", end: "公元1949年"}
]


$(document).ready(function() {
    $("#dyna_list_t").html(function() {
        let thead = "<thead><tr><th>朝代名称</th><th>建立时间</th><th>灭亡时间</th></tr></thead>"
        let tbody = ""
        for(let  i = 0; i < dyna_list.length; i ++) {
            tbody += `<tr><td class="first">${dyna_list[i].name}</td><td>${dyna_list[i].begin}</td><td>${dyna_list[i].end}</td></tr>`
        }
        let html = `${thead}<tbody>${tbody}</tbody>`
        return html
    })

    $("#alert").css("height", "40px").prop("class", "text-danger")
    $("#dyna_input").val("")


    if(localStorage.getItem("ch_dyna")) {
        $("#dyna").val(3)
        $("#dyna_input").val(localStorage.getItem("ch_dyna"))
        search(localStorage.getItem("ch_dyna"))
        localStorage.removeItem("ch_dyna")
        $("#dyna_input").prop("placeholder", "")
    }else {
        $("#dyna_input").val("")
        $("#dyna_input").prop("placeholder", "明洪武2年")
    }

    $("#display").css("text-align", "center")
})

// $("option").click(function () {
//     if($(this).val() == 1) {
//         $("#dyna_input").val("")
//         $("#dyna_input").prop("placeholder", "明洪武2年")
//     }else if($(this).val() == 2) {
//         $("#dyna_input").val("")
//         $("#dyna_input").prop("placeholder", "1369")
//     }else if($(this).val() == 3) {
//         $("#dyna_input").val("")
//         $("#dyna_input").prop("placeholder", "秦")
//     }
// })

$("#dyna").change(function () {
    if($(this).val() == 1) {
        $("#dyna_input").val("")
        $("#dyna_input").prop("placeholder", "明洪武2年")
    }else if($(this).val() == 2) {
        $("#dyna_input").val("")
        $("#dyna_input").prop("placeholder", "1369")
    }else if($(this).val() == 3) {
        $("#dyna_input").val("")
        $("#dyna_input").prop("placeholder", "秦")
    }
})

$("#dyna_input").click(function() {
    if($("#dyna_input").prop("placeholder") != "") {
        let placeholder = $("#dyna_input").prop("placeholder")
        $("#dyna_input").val(placeholder)
        $("#dyna_input").prop("placeholder", "")
    }
})

$("#submit").click(
    function() {
        // console.log("submit!")
        let dyna = $("#dyna").val()
        let dyna_input = $("#dyna_input").val()
        let reg = /\s/g
        dyna_input = dyna_input.replace(reg, "")
        
        if(dyna_input == "") {
            $("#alert").text("输入不能为空！")
        }else {
            $("#alert").text("")
            let url = `http://www.datastreams.club:3000/dynasty/${dyna}?wd=${dyna_input}`
            
            $.get(url, function(data) {
                if(dyna == 1) {
                    if(data.data == "") {
                        // console.log(data)
                        $("#display").html(`<p>未查询到关于<b>“${dyna_input}”</b>的信息！</p>`)
                    }else {
                        $("#display").html(function() {
                            let html = `<div class="panel-body big-title"><h4>${dyna_input}</h4>`
                            let year = data.data.split("~")
                            if(year.length === 1) {
                                if(data.data < 0) {
                                    html += `<h4>公元前${-data.data}年</h4>`
                                }else {
                                    html += `<h4>公元${data.data}年</h4>`
                                }
                            }else {
                                if(year[1] < 0) {
                                    html += `<h4>公元前${-year[0]}年~公元前${-year[1]}年</h4>`
                                }else if(year[0] > 0) {
                                    html += `<h4>公元${year[0]}年~公元${year[1]}年</h4>`
                                }else {
                                    html += `<h4>公元前${-year[0]}年~公元${year[1]}年</h4>`
                                }
                            }
                            html += `</div>
                                    <div class="panel-heading">
                                        <h4 class="panel-title">${data.label}</h4>
                                    </div>
                                    <div class="panel-body center">`
                            if(data.end < 0) {
                                html += `<p>起止时间：公元前${-data.begin}年~公元前${-data.end}年</p>`
                            }else if(data.begin > 0) {
                                html += `<p>起止时间：公元${data.begin}年~公元${data.end}年</p>`
                            }else {
                                html += `<p>起止时间：公元前${-data.begin}年~公元${data.end}年</p>`
                            }
                            html += `<p>朝&emsp;&emsp;代：${data.dynasty}</p>
                                        <p>皇帝名称：${data.monarchName}</p>
                                        <p>皇帝称号：${data.monarch}</p>
                                    </div>`
                            return html
                        })
                        $(".center").css("text-align", "left")
                    }
                }else if(dyna == 2) {
                    if(data.result.length === 0) {
                        // console.log(data)
                        $("#display").html(`<p>未查询到关于<b>“${dyna_input}”</b>的信息！</p>`)
                    }else {
                        $("#display").html(function() {
                            let html = `<div class="panel-body big-title"><h4>${dyna_input}</h4>
                                        <h4>${data.data}</h4></div>`
    
                            for(let i = 0; i < data.result.length; i ++) {
                                html += `<div class="panel-heading">
                                            <h4 class="panel-title">${data.result[i].label}</h4>
                                        </div>
                                        <div class="panel-body center">`
                                if(data.result[i].end < 0) {
                                    html += `<p>起止时间：公元前${-data.result[i].begin}年~公元前${-data.result[i].end}年</p>`
                                }else if(data.result[i].begin > 0) {
                                    html += `<p>起止时间：公元${data.result[i].begin}年~公元${data.result[i].end}年</p>`
                                }else {
                                    html += `<p>起止时间：公元前${-data.result[i].begin}年~公元${data.result[i].end}年</p>`
                                }
                                html += `<p>朝&emsp;&emsp;代：${data.result[i].dynasty}</p>
                                            <p>皇帝名称：${data.result[i].monarchName}</p>
                                            <p>皇帝称号：${data.result[i].monarch}</p>
                                        </div>`
                            }
                            // console.log(html)
                            return html
                        })
                        $(".center").css("text-align", "left")
                    }
                }else if(dyna == 3) {
                    if(data.result.length === 0) {
                        // console.log(data)
                        $("#display").html(`<p>未查询到关于<b>“${dyna_input}”</b>的信息！</p>`)
                    }else {
                        $("#display").html(function() {
                            let html = `<div class="panel-body big-title"><h4>${dyna_input}</h4></div>`
                            
                            // if(data.result[0].begin > 0) {
                            //     html += `<h4>公元${data.result[0].begin}年~公元${data.result[0].end}年</h4>`
                            // }else if(data.result[0].end < 0) {
                            //     html += `<h4>公元前${-data.result[0].begin}年~公元前${-data.result[0].end}年</h4>`
                            // }else {
                            //     html += `<h4>公元前${-data.result[0].begin}年~公元${data.result[0].end}年</h4>`
                            // }
    
                            for(let i = 0; i < data.result.length; i ++) {
                                html += `<div class="panel-heading">
                                            <h4 class="panel-title">${data.result[i].monarchName}</h4>
                                        </div>
                                        <div class="panel-body center">
                                            <p>皇帝称号：${data.result[i].monarch}</p>
                                            <p>朝&emsp;&emsp;代：${data.result[i].dynasty}</p>
                                            <p>年&emsp;&emsp;号：${data.result[i].reignTitle}</p>`
                                if(data.result[i].end < 0) {
                                    html += `<p>起止时间：公元前${-data.result[i].begin}年~公元前${-data.result[i].end}年</p>`
                                }else if(data.result[i].begin > 0) {
                                    html += `<p>起止时间：公元${data.result[i].begin}年~公元${data.result[i].end}年</p>`
                                }else {
                                    html += `<p>起止时间：公元前${-data.result[i].begin}年~公元${data.result[i].end}年</p>`
                                }
                                html += `</div>` 
                            }
                            // console.log(html)
                            return html
                        })
                        $(".center").css("text-align", "left")
                    }
                }
            },'json')
        }
    }
)

function search(key) {
    $.get(`http://www.datastreams.club:3000/dynasty/3?wd=${key}`, function(data) {
        if(data.result.length === 0) {
            // console.log(data)
            $("#display").html(`<p>未查询到关于<b>“${key}”</b>的信息！</p>`)
        }else {
            $("#display").html(function() {
                let html = `<div class="panel-body big-title"><h4>${key}</h4></div>`
                
                if(data.result[0].begin > 0) {
                    html += `<h4>公元${data.result[0].begin}年~公元${data.result[0].end}年</h4>`
                }else if(data.result[0].end < 0) {
                    html += `<h4>公元前${-data.result[0].begin}年~公元前${-data.result[0].end}年</h4>`
                }else {
                    html += `<h4>公元前${-data.result[0].begin}年~公元${data.result[0].end}年</h4>`
                }

                for(let i = 1; i < data.result.length; i ++) {
                    html += `<div class="panel-heading">
                                <h4 class="panel-title">${data.result[i].monarchName}</h4>
                            </div>
                            <div class="panel-body center">
                                <p>皇帝称号：${data.result[i].monarch}</p>
                                <p>朝&emsp;&emsp;代：${data.result[i].dynasty}</p>
                                <p>年&emsp;&emsp;号：${data.result[i].reignTitle}</p>`
                    if(data.result[i].end < 0) {
                        html += `<p>起止时间：公元前${-data.result[i].begin}年~公元前${-data.result[i].end}年</p>`
                    }else if(data.result[i].begin > 0) {
                        html += `<p>起止时间：公元${data.result[i].begin}年~公元${data.result[i].end}年</p>`
                    }else {
                        html += `<p>起止时间：公元前${-data.result[i].begin}年~公元${data.result[i].end}年</p>`
                    }
                    html += `</div>` 
                }
                // console.log(html)
                return html
            })
            $(".center").css("text-align", "left")
        }
    })
}
