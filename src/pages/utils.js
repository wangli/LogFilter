const jsonPrintHtml = function (key, val) {
    var dom = document.createElement('div')
    dom.className='jsonContent'
    var tit = document.createElement('div')
    tit.className='title'
    tit.textContent = key
    var content = document.createElement('div')
    if (typeof val == 'object') {
        for (var k in val) {
            content = jsonPrintHtml(k, val[k], content)
        }
    } else {
        content.textContent = val
    }
    dom.appendChild(tit)
    dom.appendChild(content)
    return dom
}
const domToString = function (node) {
    let tmpNode = document.createElement('div')
    tmpNode.appendChild(node)
    let str = tmpNode.innerHTML
    tmpNode = node = null;

    return str;
}
export const searchContent = function (items, keyword) {
    if (keyword) {
        return items.filter(value => {
            var res = true;
            for (var key in keyword) {
                if (value[key]) {
                    if (typeof value[key] != 'string') value[key] = String(value[key])
                    res = value[key].includes(keyword[key]);
                    if (!res) break;
                } else {
                    break;
                }

            }
            return res;
        });
    }
    return items;
}
export const formatData = {
    time(value) {
        var time = new Date(parseInt(value));
        return (
            time.getFullYear() +
            "-" +
            time.getMonth() +
            "-" +
            time.getDate() +
            "  " +
            time.getHours() +
            ":" +
            time.getMinutes() +
            ":" +
            time.getSeconds()
        );
    },
    json(value) {
        try {
            var data=JSON.parse(value);
            var content = document.createElement('div')
            for(var key in data){
                content.appendChild(jsonPrintHtml(key,data[key]))
            }
            return domToString(content)
        } catch (error) {
            return value
        }
    }
}
export const selectFile = function () {
    return new Promise(function (resolve, reject) {
        var inputFile = document.querySelector("input[type=file]");
        if (inputFile) {
            document.body.removeChild(inputFile);
        }
        var inputFile = document.createElement("input");
        inputFile.type = "file";
        // inputFile.accept = "image/gif,image/jpeg,image/jpg,image/png;capture=camera";
        inputFile.addEventListener("change", (evt) => {
            var file = inputFile.files[0];
            var fileReader = new FileReader();
            fileReader.onloadend = function () {
                resolve({
                    data: fileReader.result,
                    file: file
                })
            };
            fileReader.readAsText(file);
        }, false);
        document.body.appendChild(inputFile);
        inputFile.click();
    });
}
export const ajax = function (option) {
    const op = Object.assign({ url: '', data: '', method: 'GET', async: true }, option)
    var formData = null
    if (typeof op.data != 'string') {
        formData = new FormData()
        for (var k in op.data) {
            formData[k] = op.data[k]
        }
    }
    return new Promise((resolve, reject) => {
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObect("Microsoft.XMLHTTP");
        xhr.responseType = 'json';
        xhr.addEventListener('load', (res) => {
            resolve(res.currentTarget.response)
        })
        xhr.addEventListener('error', (error) => {
            reject(error)
        })
        xhr.open(op.method, op.url, op.async);
        xhr.send(formData)
    })
}