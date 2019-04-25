export const searchContent = function (items, keyword) {
    if (keyword) {
        return items.filter(value => {
            var res = true;
            for (var key in keyword) {
                res = value[key].includes(keyword[key]);
                if (!res) break;
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