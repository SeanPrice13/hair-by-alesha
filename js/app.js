let sum = 0;

//Create/Load Local Storage Invoice Number
if (localStorage.getItem('lastInv') == null) {
    let invNo = '101';
    document.querySelector('#inv-no').innerHTML = 'HER' + invNo;
} else {
    document.querySelector('#inv-no').innerHTML = 'HER' + localStorage.getItem('newInv');
}

//Generate the Current Date
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0'),
    mm = String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
    yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
document.getElementById("date").children[0].innerHTML = today;

//Add Item to Invoice
const newItem = () => {
    document.querySelector('#add-item').removeEventListener('click', newItem);
    let row = document.createElement('tr'),
        desc = document.createElement('td'),
        total = document.createElement('td');
    desc.innerHTML = '<select name="desc" class="desc-list"><option value=" ">Select Description</option><option value="Women\'s Haircut">Women\'s Haircut</option><option value="Blowdry (Short)">Blowdry (Short)</option><option value="Blowdry (Medium)">Blowdry (Medium)</option><option value="Blowdry (Long)">Blowdry (Long)</option><option value="Protective Style">Protective Style</option><option value="Updo">Updo</option><option value="Men\'s Haircut">Men\'s Haircut</option><option value="Full Color">Full Color</option><option value="Balayage">Balayage</option><option value="Full Highlights">Full Highlights</option><option value="Partial Highlights">Partial Highlights</option><option value="Color + Highlights">Color + Highlights</option><option value="Ombre">Ombre</option><option value="VIP Discount">VIP Discount</option></select>';
    total.innerHTML = 'CAD $' + '<span>0.00</span>';
    row.appendChild(desc);
    row.appendChild(total);
    document.querySelector('table').appendChild(row);

    //Set Service Description
    const setDesc = (e) => {
        desc.innerHTML = e.target.value;
        total.innerHTML = 'CAD $' + '<input type="number" class="srvcPrice" min="0" />';
        document.querySelector('.srvcPrice').addEventListener('focusout', setPrice);
    }

    //Set Price for Selected Service
    const setPrice = () => {
        let amt = Number(document.querySelector('.srvcPrice').value);

        if (desc.innerHTML == 'VIP Discount') {
            total.innerHTML = 'CAD $' + amt.toFixed(2) + '-';
            sum = (Number(sum) - amt).toFixed(2);
            //Update Total Due
            document.querySelector('#grand-total').innerHTML = sum;
        } else {
            total.innerHTML = 'CAD $' + amt.toFixed(2);
            sum = (Number(sum) + amt).toFixed(2);
            //Update Total Due
            document.querySelector('#grand-total').innerHTML = sum;
        }
        document.querySelector('#add-item').addEventListener('click', newItem);
    }

    document.querySelector('.desc-list').addEventListener('change', setDesc);
}

const getImgData = () => {
    const files = document.querySelector('#cust-img').files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener('load', function () {
            document.querySelector('#img-cont').style.display = 'flex';
            document.querySelector('#img-cont').innerHTML = '<img src="' + this.result + '" />';
        });
    }
}

//Save As PDF & Update Invoice Number
const saveInv = () => {
    let element = document.querySelector('#full-document');
    html2pdf(element, {
        margin: 0,
        filename: document.querySelector('#inv-no').innerHTML + '.pdf',
        image: {
            type: 'png',
            quality: 1
        },
        html2canvas: {
            scale: 2,
            logging: true
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'p'
        }
    });

    setTimeout(() => {
        lastInv = parseInt(document.querySelector('#inv-no').innerHTML.substring(3));
        localStorage.setItem('lastInv', lastInv);
        newInv = (parseInt(document.querySelector('#inv-no').innerHTML.substring(3)) + 1);
        localStorage.setItem('newInv', newInv);
        document.querySelector('#inv-no').innerHTML = 'HER' + newInv;
        location.reload();
    }, 1000);
}

document.querySelector('#add-item').addEventListener('click', newItem);
document.querySelector('#cust-img').addEventListener('change', getImgData);
document.querySelector('#save-inv').addEventListener('click', saveInv);
document.querySelector('#redo').addEventListener('click', () => {
    location.reload();
});