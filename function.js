
const form        = document.querySelector('form')
const inputFilter = document.querySelector('#input-filter')
let isEditMode    = null //controla se o form é de criar ou atualizar
let currentCarId  = null

// ----------- RENDERIZA TODOS OS DADOS DA MOCKAPI ------------------ //
async function loadCars () {

    const res  = await fetch('https://673502e05995834c8a91ab68.mockapi.io/autotrack/cars')
    const data = await res.json()

    if(data.length > 0) {

        const table = document.getElementById('table')
        // const main  = document.getElementById('main')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')

        //limpando a tabela para cada chamada da função.
        table.innerHTML = ''
        
        //thead é fixa.
        thead.innerHTML = `<tr>
                            <td>Marca</td>
                            <td>Modelo</td>
                            <td>Cor</td>
                            <td>Ano</td>
                            <td colspan="2">Opçoes</td>
                        </tr>`
        table.appendChild(thead)

        data.forEach(car => {

            const tr          = document.createElement('tr')

            const tdMark      = document.createElement('td')
            tdMark.innerText  = car.mark
            tdMark.setAttribute("data-name", 'mark')

            const tdModel     = document.createElement('td')
            tdModel.innerText = car.model
            tdModel.setAttribute("data-name", 'model')

            const tdColor     = document.createElement('td')
            tdColor.innerText = car.color
            tdColor.setAttribute("data-name", 'color')

            const tdYear     = document.createElement('td')
            tdYear.innerText = car.year
            tdYear.setAttribute("data-name", 'year')

            const tdEdit     = document.createElement('td')
            tdEdit.innerHTML = `<button class="option-btn" data-car-id="${car.id}" name="btn-edit">Editar</button>`

            const tdDelete   = document.createElement('td')
            tdDelete.innerHTML = `<button class="option-btn delete" data-car-id="${car.id}" name="btn-delete">Excluir</button>`

            tr.appendChild(tdMark);
            tr.appendChild(tdModel);
            tr.appendChild(tdColor);
            tr.appendChild(tdYear);
            tr.appendChild(tdEdit)
            tr.appendChild(tdDelete)

            tbody.appendChild(tr)
            
        });

        table.appendChild(tbody)

        loadBtnEditEvents()
        loadBtnDeleteEvents()
    }

    //não há dados??
    else {
        const div = document.createElement('div');
        div.classList.add('no-data');
        div.innerText = "Não há dados para exibir.";

        main.appendChild(div)
    }
}
loadCars()


// ------------ funções para abrir o form --------------------------- //
document.querySelector('#new-car-button').addEventListener('click', () => {
    resetForm()
    form.classList.toggle('show')
    isEditMode = false
})

function loadBtnEditEvents () {
    document.querySelectorAll('[name="btn-edit"]').forEach (btn => {

        btn.addEventListener('click', async (evt) => {

            resetForm()
            isEditMode   = true
            currentCarId = evt.target.getAttribute("data-car-id")

            //pega os dados do carro direto pela tabela em tela, sem a necessidade de fazer outra requisição.
            const mark  = evt.target.closest('tr').querySelector("[data-name='mark']").innerText
            const model = evt.target.closest('tr').querySelector("[data-name='model']").innerText
            const year  = evt.target.closest('tr').querySelector("[data-name='year']").innerText
            const color = evt.target.closest('tr').querySelector("[data-name='color']").innerText

            //abre o form já com os dados do carro.
            form.classList.add('show')
            form.querySelector('#mark').value  = mark
            form.querySelector('#model').value = model
            form.querySelector('#year').value  = year
            form.querySelector('#color').value = color
            
        })

    })
}
// ------------------------------------------------------------------ //

function resetForm() {
    form.querySelectorAll('input').forEach(input => input.value = '')
}


//começa processo para salvar os dados
form.addEventListener('submit', (evt) => {

    evt.preventDefault()

    const data = {
        mark:  form.querySelector('#mark').value  || null,
        model: form.querySelector('#model').value || null,
        year:  form.querySelector('#year').value  || null,
        color: form.querySelector('#color').value || null
    }


    if(isEditMode) {
        update(data)
    }
    else {
        create(data)
    }
})

async function update (data) {
    
    if(currentCarId) {
        
        data.id = currentCarId

        try {
            const req = await fetch(`https://673502e05995834c8a91ab68.mockapi.io/autotrack/cars/${currentCarId}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (req.ok) {
                const res = await req.json();
                resetForm();
                loadCars();
                form.classList.toggle('show')
            } 
            else {
                alert('erro:', await req.text());
            }
    
        } catch (error) {
            alert('erro:', error);
        }

    }

}

async function create (data) {
   
    try {
        const req = await fetch('https://673502e05995834c8a91ab68.mockapi.io/autotrack/cars', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (req.ok) {
            const res = await req.json();
            resetForm();
            loadCars();
            form.classList.toggle('show')
        } 
        else {
            alert('erro:', await req.text());
        }

    } catch (error) {
        alert('erro:', error);
    }

}


//exclusão de dados
function loadBtnDeleteEvents () {
    document.querySelectorAll('[name="btn-delete"]').forEach (btn => {

        btn.addEventListener('click', async (evt) => {
            const id = evt.target.getAttribute("data-car-id")

            if (id) {deleteItem(id)}
        })

    })
}   

async function deleteItem (id) {

    try {
        const req = await fetch(`https://673502e05995834c8a91ab68.mockapi.io/autotrack/cars/${id}`, {
            method: 'DELETE',
        });

        if (req.ok) {
            const res = await req.json();
            loadCars();
        } 
        else {
            alert('erro:', await req.text());
        }

    } catch (error) {
        alert('erro:', error);
    }

}

// ------------ filtro -------------------- //
inputFilter.addEventListener('input', filterTable)

function filterTable () {
    const rows        = document.querySelectorAll('table tr')
    const filterValue = inputFilter.value.toLowerCase();

    rows.forEach (row => {
        let hasMatch = false

        row.querySelectorAll('td').forEach (td => {
            if (td.textContent.toLowerCase().includes(filterValue)) {
                hasMatch = true;
              }
        })

        row.style.display = hasMatch ? 'table-row' : 'none';
    })
}

document.querySelector('#close-form-btn').addEventListener('click', () => form.classList.remove('show'))