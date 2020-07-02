const mounted = () => {
    $('.ui.dropdown').dropdown();
    $('.menu .item').tab()
    loadDataFromAjax();
    ;
    let fieldType = document.getElementById('field-type');
    let data = document.getElementById('data');

    let button = document.getElementById('validate'); button.addEventListener('click', () => {
        if (data.value == '') {
            button.classList.add('on-error');
        }
        validate(fieldType.value, data.value);
    });
}

const validateRegex = (field, exp, data) => {
    let result = exp.test(data);
    let container = document.getElementById('result-container');
    let ribbon = document.getElementById('ribbon');
    let alertType = document.getElementById('alert-type');
    let expectedText = document.getElementById('expected-text');
    let outputText = document.getElementById('output-text');
    console.log(result, exp, data)
    if (result == true) {
        alertType.innerText = 'Éxito'
        ribbon.classList.remove('red');
        ribbon.classList.add('teal');
        container.classList.remove('hide-result-container');
        container.classList.add('show-result-container');
        container.classList.remove('on-error');
        expectedText.innerText = getFormatType(field) + '✅';
        outputText.innerText = data + '✅';
    } else {
        alertType.innerText = 'Error'
        ribbon.classList.remove('teal');
        ribbon.classList.add('red');
        container.classList.remove('hide-result-container');
        container.classList.add('show-result-container');
        container.classList.add('on-error');
        expectedText.innerText = getFormatType(field) + '❌';
        outputText.innerText = data + '❌';
        setTimeout(() => {
            container.classList.remove('on-error')
        }, 500)
    }
}

const getFormatType = (type) => {
    switch (type) {
        case 'text':
            return 'Sólo texto'
            break;
        case 'numbers':
            return 'Sólo números'
            break;
        case 'dui':
            return '########-#'
            break;
        case 'nit':
            return '####-######-###-#'
            break;
        case 'carnet':
            return '[A-Z]######'
            break;
    }
}


const validate = (field, data) => {
    if (field == 'text') {
        validateRegex(field, /^\D+$/, data);
    }
    else if (field == 'numbers') {
        validateRegex(field, /^\d+$/, parseInt(data) ? parseInt(data) : data);
    }
    else if (field == "dui") {
        validateRegex(field, /^\d{8}-\d{1}$/, data);
    } else if (field == "nit") {
        validateRegex(field, /^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$/, data);
    } else if (field == "carnet") {
        validateRegex(field, /^[A-Z]{2}\d{6}$/, data);
    }
}


const loadDataFromAjax = () => {
    let searchable = document.getElementById('search-dropdown');
    var xhttp = new XMLHttpRequest();
    let optionsList = [];
    const selected = document.querySelector(".selected"); //Label
    const optionsContainer = document.querySelector(".options-container"); //Options container
    const searchBox = document.querySelector(".search-box input"); //Search bar


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            JSON.parse(this.responseText).forEach(country => {
                //Creating elements and setting attributes
                let docNode = document.createElement('div');
                docNode.classList.add('option');
                let inputNode = document.createElement('input');
                inputNode.classList.add('radio')
                inputNode.setAttribute('type', 'radio');
                inputNode.setAttribute('id', 'search');
                inputNode.setAttribute('name', 'category');
                let labelNode = document.createElement('label');
                let textNode = document.createTextNode(country.name);
                docNode.appendChild(inputNode); //Adding input to options
                labelNode.appendChild(textNode) //Adding country name to label
                docNode.appendChild(labelNode)  //Adding label to options
                searchable.appendChild(docNode); //Adding options to select
                optionsList.push(docNode);
            })

            selected.addEventListener("click", () => {
                optionsContainer.classList.toggle("active");

                searchBox.value = "";
                filterList("");

                if (optionsContainer.classList.contains("active")) {
                    searchBox.focus();
                }
            });

            searchBox.addEventListener("keyup", function (e) {
                filterList(e.target.value);
            });

            const filterList = searchTerm => {
                searchTerm = searchTerm.toLowerCase();
                if( validateRegexSearchBarInput(searchTerm) ) {
                optionsList.map((opt) => {
                    let searchResult = opt.firstElementChild.nextElementSibling.innerText.toLowerCase();
                    if (searchResult.includes(searchTerm)) {
                        opt.style.display = 'block'
                    } else {
                        opt.style.display = 'none'
                    }
                })
            } else {
                let error = document.getElementById('dropdown-container');
                error.classList.add('on-error');
                setTimeout(() => {
                    error.classList.remove('on-error')
                }, 300)
            }
            };

            optionsList.forEach(opt => {
                opt.addEventListener("click", () => {
                    selected.innerHTML = opt.querySelector("label").innerHTML;
                    optionsContainer.classList.remove("active");
                });
            });
        }
    };
    xhttp.open("GET", "https://restcountries.eu/rest/v2/all", true);
    xhttp.send();
}

const validateRegexSearchBarInput = term => {
    let regex = /^[a-zA-Z ]*$/;
    if(regex.test(term)) {
        return true
    } else {
        return false
    }
}

window.onload = mounted;
