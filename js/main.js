let doc = new jsPDF();


class Payment {
    constructor(data) {
        this.data = data
    }

    default(key) {
        return this.data[key];
    }

    get kwota() {
        let value = this.data['kwota'];
        if(value != "")
            return value + " zł";
        else
            return "";
    }

    get tytul() {
        let value = doc.splitTextToSize(this.data['tytul'], 135);
        return value;
    }
}

class Receipt {
    constructor(data) {
        this.data = data;
    }

    default(key) {
        return this.data[key];
    }

    get nazwaOdbiorcyL1() {
        let value = this.data['nazwa_odbiorcy'];
        if(value.length > 26)
            return value.slice(0, 24) + "...";
        else
            return value;
    }

    get nazwaOdbiorcyL2() {
        let value = this.data['nazwa_odbiorcy_2'];
        let cut = value.indexOf(',');
        return value.slice(0, cut);
    }

    get nazwaOdbiorcyL3() {
        let value = this.data['nazwa_odbiorcy_2'];
        let cut = value.indexOf(',');
        return value.slice(cut + 2, value.length);
    }

    get nazwaZleceniodawcyL1() {
        return this.data['nazwa_zleceniodawcy']
    }

    get nazwaZleceniodawcyL2() {
        let value = this.data['nazwa_zleceniodawcy_2'];
        let cut = value.indexOf(',');
        return value.slice(0, cut);
    }

    get nazwaZleceniodawcyL3() {
        let value = this.data['nazwa_zleceniodawcy_2'];
        let cut = value.indexOf(',');
        return value.slice(cut + 2, value.length);
    }

    get tytul() {
        let value = doc.splitTextToSize(this.data['tytul'], 53);
        if(value.length > 3)
            value.splice(3, 10);
        return value;
    }

    get kwota() {
        let value = this.data['kwota'];
        if(value != "")
            return value + " zł";
        else
            return "";
    }
}

const app = {
    print_list: [],
    displayError(text , err = []) {
        let alertString = text;
        for(val of err) {
            alertString += `\n - ${val}`;
        }
        alert(alertString);
    },
    prepareInputs() {
        const inputs = $('.payment-input');
        let values = {};
        let err = [];

        $(inputs).each(function(index) {
            let name = $(this).attr('name');
            let value = $(this).val();
            values[name] = value;
            if(values[name] == "")
                err.push(name);
        });
        if(err.length == 0 || err.length == 8)
            this.addToList(values, err.length)
        else if(err.length > 0)
            this.displayError('Popraw następujące pola:',err);
    },
    addToList(values, error_num) {
        let is_empty = true;
        const props = Object.getOwnPropertyNames(values);

        for(let i = 0; i < props.length; i++) {
            if(values[props[i]] != "") {
                is_empty = false;
                break;
            }
        }
        values.is_empty = is_empty;
        this.print_list.push(values);
        this.refreshList();
        UIkit.modal(document.querySelector('#modal_add')).hide();
        // if(is_save && !is_empty) {
        //     StorageManager.saveData(values);
        // }
    },
    saveBookmark() {
        const inputs = $('.payment-input');
        let values = {};
        let err = [];

        $(inputs).each(function(index) {
            let name = $(this).attr('name');
            let value = $(this).val();
            values[name] = value;
            if(values[name] == "")
                err.push(name);
        });
        if(err.length > 0)
            this.displayError('Aby zapisać zakładkę, popraw następujące pola:',err);
        else {
            StorageManager.saveData(values);
            app.checkStorage();
        }
    },
    removeFromList(id) {
        const list = this.print_list;
        if(confirm('Czy na pewno chcesz usunąć druk: ' + list[id]['tytul'])) {
            list.splice(id, 1);
            this.refreshList();
        }
    },
    refreshList() {
        const list = this.print_list;
        $('#print-list').empty();
        for(let i = 0; i < list.length; i++) {
            if(list[i].is_empty == true) {
                this.fillEmptyPayment(i);
                continue;
            } else {
                this.fillValidPayment(list[i], i);
            }
        }
    },
    fillEmptyPayment(list_id) {
        const string = `
        <div name="${list_id}" class="uk-width-1-1">
            <div class="uk-card uk-card-default uk-card-body">
                <div uk-grid>
                    <div class="uk-width-expand uk-text-left flex-vertical-center">
                        <ul class="uk-list cursor-default ">
                            <li>
                                Pusty, czarno-białych druk wpłaty, który można wypełnić po wydrukowaniu
                            </li>
                        </ul>
                    </div>
                    <div class="uk-width-auto flex-vertical-center">
                        <hr class="uk-divider-vertical uk-padding-small uk-margin-remove">
                        <button name="${list_id}" onclick="app.removeFromList(this.attributes['name'].value)" class="uk-button uk-button-text">
                            <span uk-icon="trash"></span> Usuń
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
        $('#print-list').append(string);
    },
    fillValidPayment(obj, list_id) {
        const string = `
        <div name="${list_id}" class="uk-width-1-1">
            <div class="uk-card uk-card-default uk-card-body">
                <div uk-grid>
                    <div class="uk-width-expand uk-text-left">
                        <ul class="uk-list cursor-default">
                            <li>
                                <span class="uk-text-bold">- Tytułem: </span>
                                <br />
                                <span class="uk-margin-left">
                                    ${obj.tytul}
                                </span>
                            </li>
                            <li>
                                <span class="uk-text-bold">- Kwota: </span>
                                <br />
                                <span class="uk-margin-left">
                                    ${obj.kwota}zł
                                </span>
                            </li>
                            <li uk-tooltip="title: ${obj.nazwa_odbiorcy} <br> ${obj.nazwa_odbiorcy2} <br> ${obj.rachunek_odbiorcy}; pos: left">
                                <span class="uk-text-bold">- Odbiorca: </span>
                                <br />
                                <span class="uk-margin-left">
                                    ${obj.nazwa_odbiorcy}
                                </span>
                            </li>
                            <li uk-tooltip="title:  ${obj.nazwa_zleceniodawcy} <br> ${obj.nazwa_zleceniodawcy2}; pos: left">
                                <span class="uk-text-bold">- Zleceniodawca: </span>
                                <br />
                                <span class="uk-margin-left">
                                    ${obj.nazwa_zleceniodawcy}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="uk-width-auto flex-vertical-center">
                        <hr class="uk-divider-vertical uk-padding-small uk-margin-remove">
                        <button name="${list_id}" onclick="app.removeFromList(this.attributes['name'].value)" class="uk-button uk-button-text">
                            <span uk-icon="trash"></span> Usuń
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        $('#print-list').append(string);
    },
    generate() {
        let list = this.print_list;
        if(list.length == 0) {
            app.displayError('Musisz dodać druki, aby wygenerować PDF!');
            return;
        }

        doc = new jsPDF();

        doc.setFont('Tomorrow-jsPDF');
        doc.setFontSize(11);

        const pattern = new Image();
        pattern.src = './assets/pattern.png';

        let offset = 0;
        let counter = 0;
        let page = 1;

        for(item of list) {
            if(counter % 2 == 0 && counter != 0) {
                offset = 0;
                page++;
                doc.addPage();
                doc.setPage(page);
            }
            counter++;

            doc.addImage(pattern, 'PNG', 3, offset + 8, 204, 115);

            let payment = new Payment(item);
            let receipt = new Receipt(item);

            //Polecenie przelewu
            doc.text(payment.default('nazwa_odbiorcy'), 67, offset + 17.6); //Nazwa odbiorcy
            doc.text(payment.default('nazwa_odbiorcy_2'), 67, offset + 27.3); //Nazwa odbiorcy cd.
            doc.text(payment.default('rachunek_odbiorcy'), 67, offset + 37.1); //Rachunek odbiorcy
            doc.text(payment.kwota, 144, offset + 46.8); //Kwota
            doc.setFontSize(9);
            doc.text(payment.default('kwota_slownie'), 67, offset + 57.5); //Kwota słownie
            doc.setFontSize(11);
            doc.text(payment.default('nazwa_zleceniodawcy'), 67, offset + 68.6); //Nazwa zleceniodawcy
            doc.text(payment.default('nazwa_zleceniodawcy_2'), 67, offset + 78.5); //Nazwa zleceniodawcy cd.
            doc.text(payment.tytul, 67, offset + 88.4); //Tytuł wpłaty


            //Pokwitowanie dla zleceniodawcy
            doc.setFontSize(10);
            doc.text(receipt.nazwaOdbiorcyL1, 6, offset + 17.6); //Pierwsza linia nazwy odbiorcy
            doc.text(receipt.nazwaOdbiorcyL2, 6, offset + 24); //Druga linia nazwy odbiorcy
            doc.text(receipt.nazwaOdbiorcyL3, 6, offset + 30.4); //Trzecia linia nazwy odbiorcy
            doc.setFontSize(8.5);
            doc.text(receipt.default('rachunek_odbiorcy'), 6, offset + 41.1); //Rachunek odbiorcy
            doc.setFontSize(10);
            doc.text(receipt.nazwaZleceniodawcyL1, 6, offset + 50.8); //Pierwsza linia nazwy zleceniodawcy
            doc.text(receipt.nazwaZleceniodawcyL2, 6, offset + 57.8); //Druga linia nazwy zleceniodawcy
            doc.text(receipt.nazwaZleceniodawcyL3, 6, offset + 64.3); //Trzecia linia nazwy zleceniodawcy
            doc.setFontSize(8.5);
            doc.text(receipt.tytul, 6, offset + 73); //Skrócony tytuł przelewu
            doc.setFontSize(10);
            doc.text(receipt.kwota, 6, offset + 89.3); //Kwota przelewu

            offset += 165;
        }

        doc.save();
    },
    checkStorage(isDel = false) {
        let bookmark_list = $('#bookmark-list');
        bookmark_list.html('')

        let obj = StorageManager.readData();
        if(obj == null || Object.keys(obj).length == 0) {
            return;
        }
        
        
        let keys = Object.keys(obj);
        let i = 0;

        while(obj[keys[i]]) {
            bookmark_list.append(`
                <li name="${keys[i]}" class="flex-space-between flex-vertical-center">
                    <a onclick="app.deleteBookmark(this.parentElement.getAttribute('name'))" uk-icon="icon: trash; ratio: 0.8"></a>
                    <a onclick="app.fillWithBookmark(this.parentElement.getAttribute('name'))">${obj[keys[i]].nazwa_odbiorcy}</a>
                </li>
            `);
            i++;
        }
    },
    fillWithBookmark(id) {
        let obj = StorageManager.readData();
        obj = obj[id];
        $('#nazwa_odbiorcy').val(obj.nazwa_odbiorcy);
        $('#nazwa_odbiorcy_2').val(obj.nazwa_odbiorcy_2);
        $('#rachunek_odbiorcy').val(obj.rachunek_odbiorcy);
        $('#kwota').val(obj.kwota);
        $('#kwota_slownie').val(obj.kwota_slownie);
        $('#nazwa_zleceniodawcy').val(obj.nazwa_zleceniodawcy);
        $('#nazwa_zleceniodawcy_2').val(obj.nazwa_zleceniodawcy_2);
        $('#tytul').val(obj.tytul);
    },
    deleteBookmark(id) {
        let obj = StorageManager.readData();
        let conf = confirm('Czy na pewno chcesz usunąć zakładkę:  ' + obj[id].nazwa_odbiorcy);
        if(conf) {
            StorageManager.deleteData(obj, id);
            app.checkStorage(true);
        }
    },
    fixInput() {
        let kwota = $('#kwota').val();
        if(kwota == "") {
            return
        }
        if(!kwota.includes(',')) {
            kwota += ",00";
        }
        $('#kwota').val(kwota);
    },
    clearForm() {
        let conf = confirm('Czy na pewno chcesz wyczyścić formularz?');
        if(conf) {
            $('.payment-input').each(function() {
                $(this).val('');
            });
        }
    },
    triggerUpload() {
        $('#modal-upload').trigger('click');
    }
}

const StorageManager = {
    readData() {
        let obj = localStorage.getItem('saved_data');

        if(obj == null)
            return false;
        
        obj = JSON.parse(obj);
        return obj;
    },
    saveData(data) {
        let obj = this.readData();
        let arr = Object.values(obj);
        let exists = false;
        $('#cbx').prop('checked', false);
        
        for(let i = 0; i < arr.length; i++) {
            if(arr[i].nazwa_odbiorcy == data.nazwa_odbiorcy 
                && arr[i].nazwa_odbiorcy_2 == data.nazwa_odbiorcy_2 
                && arr[i].rachunek_odbiorcy == data.rachunek_odbiorcy) {
                    exists = true;
                    break;
                }
        }

        if(exists) {
            alert('Podobna zakładka już istnieje!');
            return;
        }

        arr.push(data);
        obj = Object.assign({}, arr);
        
        obj = JSON.stringify(obj);
        localStorage.setItem('saved_data', obj);
        alert('Zapisano zakładkę: ' + data.nazwa_odbiorcy);

    },
    deleteData(obj, index) {
        if(obj == null)
            return;
        delete obj[index];
        obj = JSON.stringify(obj);
        localStorage.setItem('saved_data', obj);
    },
    saveBackup() {
        let obj = this.readData();
        if(obj == null || Object.keys(obj).length == 0) {
            alert("Błąd: Nie masz zapisanych zakładek.")
            return;
        }
        obj = JSON.stringify(obj);
        let blob = new Blob([obj], {type: "application/json; charset=utf-8"});
        saveAs(blob, 'drukointator-backup');
    },
    readBackup(e) {
        let file = e.target.files[0];
        if(!file)
            return
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = e.target.result;
            StorageManager.loadBackup(data);
        };
        reader.readAsText(file);
    },
    loadBackup(data) {
        $('#modal-upload').val(null);

        data = JSON.parse(data);
        let data_arr = Object.values(data);

        obj = this.readData();
        let obj_arr = Object.values(obj);

        let exists = [];

        for(let i = 0; i < obj_arr.length; i++) {
            for(let j = 0; j < data_arr.length; j++) {
                if(obj_arr[i].nazwa_odbiorcy == data_arr[j].nazwa_odbiorcy
                    && obj_arr[i].nazwa_odbiorcy_2 == data_arr[j].nazwa_odbiorcy_2
                    && obj_arr[i].rachunek_odbiorcy == data_arr[j].rachunek_odbiorcy) {
                        exists.push(j)
                    }
            }
        }

        console.log(exists);

        for(let i = exists.length - 1; i >= 0; i--) {
            data_arr.splice(exists[i], 1);
        }

        if(data_arr.length == 0) {
            alert('Podane zakładki już istnieją!');
            return;
        }

        let alertString = "Dodane zostaną następujące zakładki: ";
        for(val of data_arr) {
            alertString += `\n - ${val.nazwa_odbiorcy},`;
        }
        let conf = confirm(alertString);
        if(conf) {
            obj_arr = [...obj_arr, ...data_arr];
            let obj = Object.assign({}, obj_arr);
            obj = JSON.stringify(obj);
            localStorage.setItem('saved_data', obj);
            alert("Pomyślnie wczytano zakładki!");
            app.checkStorage();
        }
    }
}

$(document).ready(() => {
    app.checkStorage();
});

$('#add').click(() => {
    app.prepareInputs();
    console.log(app.print_list)
});

$('#save').click(() => {
    app.saveBookmark();
});

$('#modal-upload').change(
    StorageManager.readBackup
);

$('#kwota').blur(() => {
    app.fixInput();
});

$('#form-clear').click(() => {
    app.clearForm();
});

$('#generate').click(() => {
    app.generate();
});

//Input mask
$(document).ready(() => {
    $('#rachunek_odbiorcy').mask('00 0000 0000 0000 0000 0000 0000');
});
