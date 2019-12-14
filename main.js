
//Klasy
class Receipt {
    constructor(info) {
        this.info = info;
    }

    get nazwaOdbiorcy1() {
        let value = this.info['nazwaOdbiorcy'];
        if(value.length > 26)
            return value.slice(0, 24) + "...";
        else
            return value;
    }

    get nazwaOdbiorcy2() {
        let value = this.info['nazwaOdbiorcy2'];
        let cut = value.indexOf(',');
        return value.slice(0, cut);
    }

    get nazwaOdbiorcy3() {
        let value = this.info['nazwaOdbiorcy2'];
        let cut = value.indexOf(',');
        return value.slice(cut + 2, value.length);
    }

    get rachunekOdbiorcy() {
        return this.info['rachunekOdbiorcy'];
    }

    get nazwaZleceniodawcy1() {
        return this.info['nazwaZleceniodawcy'];
    }

    get nazwaZleceniodawcy2() {
        let value = this.info['nazwaZleceniodawcy2'];
        let cut = value.indexOf(',');
        return value.slice(0, cut);
    }

    get nazwaZleceniodawcy3() {
        let value = this.info['nazwaZleceniodawcy2'];
        let cut = value.indexOf(',');
        return value.slice(cut + 2, value.length);
    }

    get tytul() {
        let value = doc.splitTextToSize(this.info['tytul'], 46);
        return value;
    }

    get kwota() {
        let value = this.info['kwota'];
        if(value != "")
            return value + " zł";
        else
            return "";
    }
}

class Payment {
    constructor(info) {
        this.info = info;
    }

    get nazwaOdbiorcy() {
        return this.info['nazwaOdbiorcy'];
    }

    get nazwaOdbiorcy2() {
        return this.info['nazwaOdbiorcy2'];
    }
    
    get rachunekOdbiorcy() {
        return this.info['rachunekOdbiorcy'];
    }

    get kwota() {
        let value = this.info['kwota'];
        if(value != "")
            return value + " zł";
        else
            return "";
    }

    get kwotaSlownie() {
        return this.info['kwotaSlownie'];
    }

    get nazwaZleceniodawcy() {
        return this.info['nazwaZleceniodawcy'];
    }

    get nazwaZleceniodawcy2() {
        return this.info['nazwaZleceniodawcy2'];
    }

    get tytul() {
        let value = doc.splitTextToSize(this.info['tytul'], 120);
        return value;
    }
}

const InputValidator = {
    checkAccountNum: () => {
        let ro = document.querySelector('#rachunekOdbiorcy');
        let value = ro.value;
        value = value.replace(/\s+/g, '');
        let valueArray = [];
        let start = 0;
        let end = 2;
        valueArray.push(value.slice(start,end));
        start = 2;
        end = 6;
        while(start < value.length) {
            if(valueArray.length > 6) {
                break;
            }
            valueArray.push(value.slice(start, end));
            start += 4;
            end += 4;
        }
        value = "";
        for(let i = 0; i < valueArray.length; i++) {
            value += " " + valueArray[i];
        }
        value = value.trim();
        ro.value = value;
    }
}

//Funkcje
const createPDF = () => {
    if(fileList.length == 0) {
        alert('Musisz dodać druki, aby stworzyć plik PDF!');
        return
    }

    let offset = 0;

    for(let i = 0; i < fileList.length; i++) {
        doc.addImage(pattern, 'PNG', 10, offset + 10, 190, 98); //Wygląd druku
        
        let payment = new Payment(fileList[i]);
        let receipt = new Receipt(fileList[i]);

        //Polecenie przelewu
        doc.text(payment.nazwaOdbiorcy, 71.2, offset + 18.8); //Nazwa odbiorcy
        doc.text(payment.nazwaOdbiorcy2, 71.2, offset + 27.2); //Nazwa odbiorcy cd.
        doc.text(payment.rachunekOdbiorcy, 71.2, offset + 35.5); //Rachunek odbiorcy
        doc.text(payment.kwota, 139, offset + 43.8); //Kwota
        doc.setFontSize(6.5);
        doc.text(payment.kwotaSlownie, 71.2, offset + 52.5); //Kwota słownie
        doc.setFontSize(8);
        doc.text(payment.nazwaZleceniodawcy, 71.2, offset + 62.1); //Nazwa zleceniodawcy
        doc.text(payment.nazwaZleceniodawcy2, 71.2, offset + 70.1); //Nazwa zleceniodawcy cd.
        doc.text(payment.tytul, 71.2, offset + 79); //Tytuł wpłaty

        //Pokwitowanie dla zleceniodawcy
        doc.setFontSize(8);
        doc.text(receipt.nazwaOdbiorcy1, 17, offset + 19);
        doc.text(receipt.nazwaOdbiorcy2, 17, offset + 24.4);
        doc.text(receipt.nazwaOdbiorcy3, 17, offset + 29.9);
        doc.setFontSize(6.5);
        doc.text(receipt.rachunekOdbiorcy, 17, offset + 38.8);
        doc.setFontSize(8);
        doc.text(receipt.nazwaZleceniodawcy1, 17, offset + 47);
        doc.text(receipt.nazwaZleceniodawcy2, 17, offset + 52.7);
        doc.text(receipt.nazwaZleceniodawcy3, 17, offset + 58.1);
        doc.setFontSize(7);
        doc.text(receipt.tytul, 17, offset + 65.6);
        doc.setFontSize(8);
        doc.text(receipt.kwota, 17, offset + 79.4);

        offset += 120;
    }
    doc.save('druk.pdf');
}

const checkInputData = () => {
    let data = {};
    let err = [];
    for(let i = 0; i < inputData.length; i++) {
        data[inputData[i].name] = inputData[i].value;
    }
    if(data.nazwaOdbiorcy == "")
        err.push("Nazwa odbiorcy");
    if(data.nazwaOdbiorcy2 == "")
        err.push("Nazwa odbiorcy cd.")
    if(data.rachunekOdbiorcy == "")
        err.push("Rachunek odbiorcy")
    if(data.kwota == "")
        err.push("Kwota")
    if(data.kwotaSlownie == "")
        err.push("Kwota słownie")
    if(data.nazwaZleceniodawcy == "")
        err.push("Nazwa zleceniodawcy")
    if(data.nazwaZleceniodawcy2 == "")
        err.push("Nazwa zleceniodawcy cd.")
    if(data.tytul == "")
        err.push("Tytułem")
    
    if(err.length == 8) {
        collectData(data);
    } else if(err.length > 0) {
        let alertString = "Błąd! Sprawdź pola:";
        for(let i = 0; i < err.length; i++) {
            alertString += `\n- ${err[i]}`;
        }
        alert(alertString);
    } else {
        collectData(data);
    }

}

const getInputData = () => {
    let data = {};
    for(let i = 0; i < inputData.length; i++) {
        data[inputData[i].name] = inputData[i].value;
        inputData[i].value = "";
    }
    return data;
}

const collectData = (data) => {
    fileList.push(data);
    console.table(fileList);
    for(let i = 0; i < inputData.length; i++) {
        inputData[i].value = "";
    }

    //Wyświetlanie danych druku
    if(data.nazwaOdbiorcy != "") {
        docList.innerHTML += `
        <li class="list-group-item">
            <h5> ${data.tytul}</h5>
            <span>${data.rachunekOdbiorcy}</span>
            <br /> <span>Kwota: ${data.kwota} zł</span>
            <h5 class="mt-2">-> ${data.nazwaOdbiorcy}</h5>
            <span>${data.nazwaOdbiorcy2}</span>
           
            <h5 class="mt-2"><- ${data.nazwaZleceniodawcy}</h5>
            <span>${data.nazwaZleceniodawcy2}</span>
            
        </li>
        `;
    } else {
        docList.innerHTML += `
        <li class="list-group-item">
            <h5>Pusty druk wpłaty</h5>
            <span>Pusty druk, który można wypełnić po wydrukowaniu</span>
        </li>
        `;
    }
}

const saveInputData = () => {
    let data = {};
    for(let i = 0; i < inputData.length; i++) {
        data[inputData[i].name] = inputData[i].value;
    }
    let blob = new Blob([JSON.stringify(data)], {type: "application/json;charset=utf-8"});
    saveAs(blob, data.nazwaOdbiorcy.slice(0, 5) + "_pattern");
}

const readFile = (e) => {
    let file = e.target.files[0];
    if(!file)
        return
    let reader = new FileReader();
    reader.onload = (e) => {
        let data = e.target.result;
        loadFileData(data);
    };
    reader.readAsText(file);
}

const loadFileData = (data) => {
    let file = JSON.parse(data);
    let err = [];
    let properties = [
        'nazwaOdbiorcy',
        'nazwaOdbiorcy2',
        'rachunekOdbiorcy',
        'kwota',
        'kwotaSlownie',
        'nazwaZleceniodawcy',
        'nazwaZleceniodawcy2',
        'tytul'
    ]
    for(let i = 0; i < properties.length; i++) {
        if(!file.hasOwnProperty(properties[i]))
            err.push(properties[i]);
    }
    if(err.length > 0) {
        let alertString = "Błąd wczytywania pliku! Nie odnaleziono wartości:";
        for(let i = 0; i < err.length; i++) {
            alertString += "\n - " + err[i];
        }
        alert(alertString);
        return
    }
    document.querySelector('#nazwaOdbiorcy').value = file.nazwaOdbiorcy;
    document.querySelector('#nazwaOdbiorcy2').value = file.nazwaOdbiorcy2;
    document.querySelector('#rachunekOdbiorcy').value = file.rachunekOdbiorcy;
    document.querySelector('#kwota').value = file.kwota;
    document.querySelector('#kwotaSlownie').value = file.kwotaSlownie;
    document.querySelector('#nazwaZleceniodawcy').value = file.nazwaZleceniodawcy;
    document.querySelector('#nazwaZleceniodawcy2').value = file.nazwaZleceniodawcy2;
    document.querySelector('#tytul').value = file.tytul;
    
}


//Listenery
document.querySelector('#generateFile').addEventListener('click', createPDF);
document.querySelector('#addInfo').addEventListener('click', checkInputData);
document.querySelector('#saveInfo').addEventListener('click', saveInputData);
document.querySelector('#fileInput').addEventListener('change', readFile);

document.querySelector('#rachunekOdbiorcy').addEventListener('blur', InputValidator.checkAccountNum);

//Tworzenie PDF
let doc = new jsPDF();
doc.setFontSize(10);
doc.setFont('RobotoMono');

let pattern = new Image();
pattern.src = 'pattern.png';

let docList = document.querySelector('#documentList');
let inputData = document.querySelectorAll('.inputData');

let fileList = [];


let test = false;

const debugData = () => {
    inputData[0].value = "Emultinet Sp. Z.O.O";
    inputData[1].value = "Rycerka Górna 283c, Rycerka Górna";
    inputData[2].value = "45 8125 0008 9040 0000 0000 0174";
    inputData[3].value = "50,00";
    inputData[4].value = "Pięćdziesiąt złotych zero groszy";
    inputData[5].value = "Wiercigroch Małgorzata";
    inputData[6].value = "Turystczna 72, 34-371 Ujsoły";
    inputData[7].value = "Zapłata za fakturę FS/3754/2019"
}

if(test) {
    debugData();
}